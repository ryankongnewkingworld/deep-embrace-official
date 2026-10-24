import { env } from "cloudflare:workers";
import { createSupabaseLeadDatabase } from "./supabase-lead-store";

type LeadEnv = { SUPABASE_URL?: string; SUPABASE_SERVICE_ROLE_KEY?: string; DB?: D1Database; LEAD_ENCRYPTION_KEY?: string; LEAD_HASH_SECRET?: string; ADMIN_TOKEN?: string; FEISHU_WEBHOOK_URL?: string; FEISHU_WEBHOOK_SECRET?: string };
const config = () => env as unknown as LeadEnv;
const encoder = new TextEncoder();
const decoder = new TextDecoder();
const RETENTION_MS = 90 * 24 * 60 * 60 * 1000;
const MAX_BODY = 64 * 1024;

export type LeadInput = {
  name: string; company: string; phone: string; industry: string;
  problem: string; preferredTime: string; consent: true; source: string;
  assessment?: Record<string, unknown>;
};
type LeadPayload = LeadInput & { reportToken?: string; consentVersion: string };
type LeadRow = {
  id: string; created_at: number; source: string; payload: string;
  request_hash: string; submitter_hash: string; report_token_hash: string | null;
  notification_status: string; notification_attempts: number;
  notification_error: string | null; next_attempt_at: number | null; notified_at: number | null;
};

export class LeadError extends Error {
  constructor(message: string, public status: number) { super(message); }
}
const base64 = (bytes: Uint8Array) => btoa(String.fromCharCode(...bytes));
function fromBase64(value: string) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  return Uint8Array.from(atob(normalized), char => char.charCodeAt(0));
}
function randomToken() { return base64(crypto.getRandomValues(new Uint8Array(32))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, ""); }
async function digest(value: string) { return base64(new Uint8Array(await crypto.subtle.digest("SHA-256", encoder.encode(value)))); }
async function constantEqual(left: string, right: string) {
  const [a, b] = await Promise.all([digest(left), digest(right)]);
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return mismatch === 0;
}
function db() {
  const current = config();
  if (current.SUPABASE_URL && current.SUPABASE_SERVICE_ROLE_KEY) return createSupabaseLeadDatabase(current.SUPABASE_URL, current.SUPABASE_SERVICE_ROLE_KEY);
  const binding = current.DB;
  if (!binding) throw new LeadError("预约服务暂未就绪，请稍后再试。", 503);
  return binding;
}
async function aesKey() {
  let bytes: Uint8Array<ArrayBuffer>;
  try { bytes = fromBase64(config().LEAD_ENCRYPTION_KEY || ""); } catch { throw new LeadError("预约服务暂未就绪，请稍后再试。", 503); }
  if (bytes.length !== 32) throw new LeadError("预约服务暂未就绪，请稍后再试。", 503);
  return crypto.subtle.importKey("raw", bytes, "AES-GCM", false, ["encrypt", "decrypt"]);
}
async function keyedHash(value: string) {
  const secret = config().LEAD_HASH_SECRET || config().LEAD_ENCRYPTION_KEY;
  if (!secret) throw new LeadError("预约服务暂未就绪，请稍后再试。", 503);
  const key = await crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return base64(new Uint8Array(await crypto.subtle.sign("HMAC", key, encoder.encode(value))));
}
async function encrypt(payload: LeadPayload, id: string) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ciphertext = await crypto.subtle.encrypt({ name: "AES-GCM", iv, additionalData: encoder.encode(id) }, await aesKey(), encoder.encode(JSON.stringify(payload)));
  return `v1.${base64(iv)}.${base64(new Uint8Array(ciphertext))}`;
}
async function decrypt(row: LeadRow): Promise<LeadPayload> {
  const [version, iv, ciphertext] = row.payload.split(".");
  if (version !== "v1" || !iv || !ciphertext) throw new Error("Invalid encrypted record");
  const plaintext = await crypto.subtle.decrypt({ name: "AES-GCM", iv: fromBase64(iv), additionalData: encoder.encode(row.id) }, await aesKey(), fromBase64(ciphertext));
  return JSON.parse(decoder.decode(plaintext));
}
export function leadReadiness() {
  const current = config();
  return { available: !!((current.DB || (current.SUPABASE_URL && current.SUPABASE_SERVICE_ROLE_KEY)) && current.LEAD_ENCRYPTION_KEY), notificationConfigured: !!current.FEISHU_WEBHOOK_URL };
}
export async function readJsonBody(request: Request): Promise<Record<string, unknown>> {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) throw new LeadError("请求来源不匹配，请刷新页面后重试。", 403);
  if (!request.headers.get("content-type")?.includes("application/json")) throw new LeadError("请使用网页表单提交。", 415);
  if (Number(request.headers.get("content-length") || 0) > MAX_BODY) throw new LeadError("提交内容过长，请精简后重试。", 413);
  const reader = request.body?.getReader();
  if (!reader) throw new LeadError("请填写预约信息。", 400);
  const chunks: Uint8Array[] = [];
  let length = 0;
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    length += value.byteLength;
    if (length > MAX_BODY) { await reader.cancel(); throw new LeadError("提交内容过长，请精简后重试。", 413); }
    chunks.push(value);
  }
  const bytes = new Uint8Array(length);
  let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
  try {
    const parsed = JSON.parse(decoder.decode(bytes));
    if (!parsed || Array.isArray(parsed) || typeof parsed !== "object") throw new Error();
    return parsed;
  } catch { throw new LeadError("信息格式不正确，请重新提交。", 400); }
}
export function validateLead(body: Record<string, unknown>): LeadInput {
  if (body.website) throw new LeadError("请通过正常表单提交。", 400);
  const field = (key: string, label: string, min: number, max: number) => {
    const raw = body[key];
    if (typeof raw !== "string") throw new LeadError(`请填写${label}。`, 400);
    const value = raw.trim().replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, "");
    if (value.length < min || value.length > max) throw new LeadError(`${label}请填写 ${min}–${max} 个字符。`, 400);
    return value;
  };
  if (body.consent !== true) throw new LeadError("请阅读并同意隐私说明。", 400);
  const phone = field("phone", "联系电话", 6, 30);
  if (!/^\+?[0-9\s()\-]{6,30}$/.test(phone) || phone.replace(/\D/g, "").length < 6) throw new LeadError("请填写有效的联系电话。", 400);
  const assessment = body.assessment;
  if (assessment !== undefined && (!assessment || typeof assessment !== "object" || Array.isArray(assessment) || JSON.stringify(assessment).length > 32768)) throw new LeadError("评估内容格式不正确或过长。", 400);
  return {
    name: field("name", "姓名", 1, 60), company: field("company", "企业名称", 1, 160), phone,
    industry: field("industry", "所属行业", 1, 100), problem: field("problem", "希望解决的问题", 5, 2000),
    preferredTime: field("preferredTime", "方便沟通的时间", 2, 160), consent: true,
    source: typeof body.source === "string" && /^[a-z0-9_/-]{1,64}$/.test(body.source) ? body.source : "homepage",
    ...(assessment ? { assessment: assessment as Record<string, unknown> } : {}),
  };
}
export const jsonResponse = (body: unknown, status = 200) => Response.json(body, { status, headers: { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" } });
export function errorResponse(error: unknown) {
  if (error instanceof LeadError) return jsonResponse({ ok: false, error: error.message }, error.status);
  // Never log request data, provider responses, credentials, or encrypted payloads.
  return jsonResponse({ ok: false, error: "暂时无法完成提交，您的信息尚未确认收到。请稍后重试。" }, 503);
}

export async function submitLead(body: Record<string, unknown>, request: Request) {
  const input = validateLead(body);
  await aesKey();
  const database = db();
  const now = Date.now();
  // Expired rows are purged on service activity; no unconfigured scheduler is claimed.
  await database.prepare("DELETE FROM consultation_leads WHERE created_at < ?").bind(now - RETENTION_MS).run();
  const requestHash = await keyedHash("dedupe:" + Math.floor(now / 86400000) + ":" + JSON.stringify(input));
  const duplicate = await database.prepare("SELECT * FROM consultation_leads WHERE request_hash = ? LIMIT 1").bind(requestHash).first<LeadRow>();
  if (duplicate) {
    const stored = await decrypt(duplicate);
    return { ok: true, id: duplicate.id, notificationStatus: duplicate.notification_status, ...(stored.reportToken ? { reportToken: stored.reportToken } : {}) };
  }
  const address = request.headers.get("cf-connecting-ip");
  const submitterHash = await keyedHash("submitter:" + (address || input.phone.replace(/\D/g, "")));
  const recent = await database.prepare("SELECT COUNT(*) AS count FROM consultation_leads WHERE submitter_hash = ? AND created_at > ?").bind(submitterHash, now - 10 * 60 * 1000).first<{ count: number }>();
  if (recent && recent.count >= 5) throw new LeadError("提交较为频繁，请 10 分钟后再试。", 429);
  const id = crypto.randomUUID();
  const reportToken = input.assessment ? randomToken() : undefined;
  const payload = await encrypt({ ...input, consentVersion: "2026-10-24", ...(reportToken ? { reportToken } : {}) }, id);
  const status = config().FEISHU_WEBHOOK_URL ? "pending" : "unconfigured";
  const result = await database.prepare("INSERT INTO consultation_leads (id, created_at, source, payload, request_hash, submitter_hash, report_token_hash, notification_status, notification_attempts, next_attempt_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, ?) ON CONFLICT(request_hash) DO NOTHING").bind(id, now, input.source, payload, requestHash, submitterHash, reportToken ? await digest(reportToken) : null, status, now).run();
  if (result.meta.changes === 0) {
    const existing = await database.prepare("SELECT * FROM consultation_leads WHERE request_hash = ? LIMIT 1").bind(requestHash).first<LeadRow>();
    if (!existing) throw new Error("Unable to confirm duplicate");
    const stored = await decrypt(existing);
    return { ok: true, id: existing.id, notificationStatus: existing.notification_status, ...(stored.reportToken ? { reportToken: stored.reportToken } : {}) };
  }
  // Storage is authoritative. A notification failure must not discard the lead.
  const notificationStatus = await deliverNotification(id).catch(() => "pending");
  return { ok: true, id, notificationStatus, ...(reportToken ? { reportToken } : {}) };
}

export async function deliverNotification(id: string) {
  const database = db();
  const current = config();
  const row = await database.prepare("SELECT * FROM consultation_leads WHERE id = ?").bind(id).first<LeadRow>();
  if (!row) throw new LeadError("未找到这条预约。", 404);
  if (row.notification_status === "sent") return "sent";
  if (!current.FEISHU_WEBHOOK_URL) return "unconfigured";
  let webhook: URL;
  try { webhook = new URL(current.FEISHU_WEBHOOK_URL); } catch { return "pending"; }
  if (webhook.protocol !== "https:" || !["open.feishu.cn", "open.larksuite.com"].includes(webhook.hostname) || !webhook.pathname.startsWith("/open-apis/bot/v2/hook/")) {
    await database.prepare("UPDATE consultation_leads SET notification_status = 'pending', notification_error = 'invalid_webhook_configuration' WHERE id = ?").bind(id).run();
    return "pending";
  }
  // A short lease prevents simultaneous manual retries from sending twice.
  const now = Date.now();
  const claimed = await database.prepare("UPDATE consultation_leads SET notification_status = 'sending', next_attempt_at = ?, notification_attempts = notification_attempts + 1 WHERE id = ? AND notification_status != 'sent' AND (notification_status != 'sending' OR next_attempt_at < ?)").bind(now + 30000, id, now).run();
  if (!claimed.meta.changes) return "pending";
  let errorCode = "delivery_failed";
  try {
    const data = await decrypt(row);
    const text = ["深拥智能｜新的业务咨询", `姓名：${data.name}`, `企业：${data.company}`, `电话：${data.phone}`, `行业：${data.industry}`, `问题：${data.problem}`, `方便沟通：${data.preferredTime}`, `来源：${data.source}`, data.assessment ? "附有 AI 成熟度评估，请在预约管理页查看。" : "", `预约编号：${id}`, "请在48小时内联系客户。"].filter(Boolean).join("\n");
    const message: Record<string, unknown> = { msg_type: "text", content: { text } };
    if (current.FEISHU_WEBHOOK_SECRET) {
      const timestamp = Math.floor(Date.now() / 1000).toString();
      const key = await crypto.subtle.importKey("raw", encoder.encode(`${timestamp}\n${current.FEISHU_WEBHOOK_SECRET}`), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
      message.timestamp = timestamp;
      message.sign = base64(new Uint8Array(await crypto.subtle.sign("HMAC", key, new Uint8Array())));
    }
    const response = await fetch(webhook.toString(), { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(message), signal: AbortSignal.timeout(6500), redirect: "error" });
    const provider = await response.json() as { code?: number; StatusCode?: number };
    if (response.ok && (provider.code === 0 || provider.StatusCode === 0)) {
      await database.prepare("UPDATE consultation_leads SET notification_status = 'sent', notified_at = ?, next_attempt_at = NULL, notification_error = NULL WHERE id = ?").bind(Date.now(), id).run();
      return "sent";
    }
    errorCode = response.ok ? "provider_rejected" : `provider_http_${response.status}`;
  } catch { errorCode = "network_or_timeout"; }
  await database.prepare("UPDATE consultation_leads SET notification_status = 'pending', notification_error = ?, next_attempt_at = ? WHERE id = ?").bind(errorCode, Date.now() + Math.min(3600000, 60000 * 2 ** Math.min(row.notification_attempts, 6)), id).run();
  return "pending";
}

export async function requireAdmin(request: Request) {
  const expected = config().ADMIN_TOKEN;
  const authorization = request.headers.get("authorization") || "";
  if (!expected || expected.length < 24 || !authorization.startsWith("Bearer ") || !await constantEqual(authorization.slice(7), expected)) throw new LeadError("需要有效的管理员访问密钥。", 401);
}
export async function listLeads() {
  const now = Date.now();
  const database = db();
  await database.prepare("DELETE FROM consultation_leads WHERE created_at < ?").bind(now - RETENTION_MS).run();
  const { results } = await database.prepare("SELECT * FROM consultation_leads ORDER BY created_at DESC LIMIT 100").all<LeadRow>();
  return Promise.all(results.map(async row => {
    const payload = await decrypt(row);
    const { reportToken: _token, ...details } = payload;
    return { id: row.id, createdAt: row.created_at, notificationStatus: row.notification_status, notificationAttempts: row.notification_attempts, notificationError: row.notification_error, ...details };
  }));
}
export async function deleteLead(id: string) {
  if (!/^[a-z0-9-]{36}$/.test(id)) throw new LeadError("预约编号无效。", 400);
  return db().prepare("DELETE FROM consultation_leads WHERE id = ?").bind(id).run();
}
export async function retryNotifications(id?: string) {
  if (!config().FEISHU_WEBHOOK_URL) throw new LeadError("尚未配置飞书机器人通知。", 503);
  if (id) return { [id]: await deliverNotification(id) };
  const { results } = await db().prepare("SELECT id FROM consultation_leads WHERE notification_status != 'sent' ORDER BY created_at ASC LIMIT 10").all<{ id: string }>();
  const statuses: Record<string, string> = {};
  for (const row of results) statuses[row.id] = await deliverNotification(row.id);
  return statuses;
}
export async function readAssessmentForReport(leadId: string, token: string): Promise<Record<string, unknown> | null> {
  if (!/^[a-z0-9-]{36}$/.test(leadId) || typeof token !== "string" || token.length > 128) return null;
  const row = await db().prepare("SELECT * FROM consultation_leads WHERE id = ? AND created_at >= ?").bind(leadId, Date.now() - RETENTION_MS).first<LeadRow>();
  if (!row?.report_token_hash || !await constantEqual(await digest(token), row.report_token_hash)) return null;
  const payload = await decrypt(row);
  return payload.assessment || null;
}
