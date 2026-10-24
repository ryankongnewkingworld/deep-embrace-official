// Behavioral checks with a real in-memory SQLite database and mocked provider I/O.
// Never loads production/local secrets or sends any message.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { DatabaseSync } from "node:sqlite";
import { createHmac, randomBytes } from "node:crypto";
import ts from "typescript";

const sqlite = new DatabaseSync(":memory:");
sqlite.exec(readFileSync(new URL("../drizzle/0000_overjoyed_bedlam.sql", import.meta.url), "utf8"));
const DB = {
  prepare(sql) {
    return { bind(...values) {
      const statement = sqlite.prepare(sql);
      return {
        async run() { const result = statement.run(...values); return { success: true, meta: { changes: Number(result.changes) } }; },
        async first() { return statement.get(...values) || null; },
        async all() { return { results: statement.all(...values) }; },
      };
    }, async all() { return { results: sqlite.prepare(sql).all() }; } };
  },
};
const fixtureEnv = { DB, LEAD_ENCRYPTION_KEY: randomBytes(32).toString("base64"), LEAD_HASH_SECRET: randomBytes(32).toString("base64"), ADMIN_TOKEN: randomBytes(32).toString("base64url") };
globalThis.__leadFixtureEnv = fixtureEnv;
const source = readFileSync(new URL("../lib/leads.ts", import.meta.url), "utf8").replace('import { env } from "cloudflare:workers";', "const env = globalThis.__leadFixtureEnv;");
const js = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext } }).outputText;
const api = await import("data:text/javascript;base64," + Buffer.from(js).toString("base64"));
const request = () => new Request("https://example.test/api/leads", { method: "POST", headers: { "Content-Type": "application/json", origin: "https://example.test", "cf-connecting-ip": "192.0.2.1" }, body: "{}" });
const input = { name: "接口测试用户", company: "验证企业", phone: "+86 13800000000", industry: "专业服务", problem: "测试案件资料自动整理业务", preferredTime: "工作日下午", consent: true, source: "assessment", website: "", assessment: { id: "test-assessment", answers: { Q01: 1 }, scope: { industry: "专业服务" } } };
let checks = 0;
const check = condition => { assert.ok(condition); checks++; };

assert.throws(() => api.validateLead({ ...input, consent: false }), e => e.status === 400); checks++;
assert.throws(() => api.validateLead({ ...input, website: "bot.example" }), e => e.status === 400); checks++;
assert.throws(() => api.validateLead({ ...input, problem: "短" }), e => e.status === 400); checks++;
assert.throws(() => api.validateLead({ ...input, phone: "not-a-phone" }), e => e.status === 400); checks++;
await assert.rejects(() => api.readJsonBody(new Request("https://example.test/api/leads", { method: "POST", headers: { "Content-Type": "application/json", origin: "https://other.test" }, body: "{}" })), e => e.status === 403); checks++;
await assert.rejects(() => api.readJsonBody(new Request("https://example.test/api/leads", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text: "x".repeat(70000) }) })), e => e.status === 413); checks++;

const result = await api.submitLead(input, request());
check(result.ok && result.id && result.reportToken && result.notificationStatus === "unconfigured");
const stored = sqlite.prepare("SELECT * FROM consultation_leads WHERE id=?").get(result.id);
check(stored.payload.startsWith("v1.") && !stored.payload.includes(input.name) && !stored.payload.includes(input.phone));
check(!stored.submitter_hash.includes("192.0.2.1"));
const duplicate = await api.submitLead(input, request());
check(duplicate.id === result.id && duplicate.reportToken === result.reportToken);
check(sqlite.prepare("SELECT count(*) AS n FROM consultation_leads").get().n === 1);
check(await api.readAssessmentForReport(result.id, "wrong") === null);
const report = await api.readAssessmentForReport(result.id, result.reportToken);
check(report.id === "test-assessment" && !Object.hasOwn(report, "name") && !Object.hasOwn(report, "phone"));

await assert.rejects(() => api.requireAdmin(new Request("https://example.test/api/admin/leads", { headers: { Authorization: "Bearer wrong" } })), e => e.status === 401); checks++;
await api.requireAdmin(new Request("https://example.test/api/admin/leads", { headers: { Authorization: `Bearer ${fixtureEnv.ADMIN_TOKEN}` } })); checks++;
const adminLeads = await api.listLeads();
check(adminLeads[0].name === input.name && !Object.hasOwn(adminLeads[0], "reportToken"));

fixtureEnv.FEISHU_WEBHOOK_URL = "https://open.feishu.cn/open-apis/bot/v2/hook/fixture-only";
fixtureEnv.FEISHU_WEBHOOK_SECRET = "fixture-signing-secret";
const originalFetch = globalThis.fetch;
let deliveries = 0;
globalThis.fetch = async (_url, options) => {
  deliveries++;
  const message = JSON.parse(options.body);
  check(message.content.text.includes(input.company));
  check(message.sign === createHmac("sha256", `${message.timestamp}\n${fixtureEnv.FEISHU_WEBHOOK_SECRET}`).update("").digest("base64"));
  return Response.json({ code: 0, msg: "success" });
};
check(await api.deliverNotification(result.id) === "sent");
check(await api.deliverNotification(result.id) === "sent" && deliveries === 1);
globalThis.fetch = async () => Response.json({ code: 19021, msg: "fixture rejection" });
const failedNotification = await api.submitLead({ ...input, problem: "这是另一条需要测试的业务问题" }, request());
check(failedNotification.ok && failedNotification.notificationStatus === "pending");
check(sqlite.prepare("SELECT notification_error FROM consultation_leads WHERE id=?").get(failedNotification.id).notification_error === "provider_rejected");
delete fixtureEnv.FEISHU_WEBHOOK_URL;
globalThis.fetch = originalFetch;

for (let i = 0; i < 3; i++) await api.submitLead({ ...input, problem: `连续提交验证的不同问题 ${i}` }, request());
await assert.rejects(() => api.submitLead({ ...input, problem: "第六次独立预约应该受到限流保护" }, request()), e => e.status === 429); checks++;
const savedKey = fixtureEnv.LEAD_ENCRYPTION_KEY;
delete fixtureEnv.LEAD_ENCRYPTION_KEY;
await assert.rejects(() => api.submitLead({ ...input, problem: "加密未配置时不可接收预约" }, request()), e => e.status === 503); checks++;
fixtureEnv.LEAD_ENCRYPTION_KEY = savedKey;
await api.deleteLead(result.id);
check(await api.readAssessmentForReport(result.id, result.reportToken) === null);
check(sqlite.prepare("SELECT count(*) AS n FROM consultation_leads WHERE id=?").get(result.id).n === 0);
sqlite.close();
delete globalThis.__leadFixtureEnv;
console.log(`PASS: ${checks} consultation checks (SQLite storage, encryption, deduplication, rate limits, consent, admin access, report gate, Feishu success/failure/signature, deletion).`);
