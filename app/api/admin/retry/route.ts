import { errorResponse, jsonResponse, readJsonBody, requireAdmin, retryNotifications } from "@/lib/leads";
export const dynamic = "force-dynamic";
export async function POST(request: Request) {
  try { await requireAdmin(request); const body = await readJsonBody(request); return jsonResponse({ ok: true, statuses: await retryNotifications(typeof body.id === "string" ? body.id : undefined) }); }
  catch (error) { return errorResponse(error); }
}
