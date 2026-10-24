import { deleteLead, errorResponse, jsonResponse, listLeads, readJsonBody, requireAdmin } from "@/lib/leads";
export const dynamic = "force-dynamic";
export async function GET(request: Request) {
  try { await requireAdmin(request); return jsonResponse({ ok: true, leads: await listLeads() }); }
  catch (error) { return errorResponse(error); }
}
export async function DELETE(request: Request) {
  try { await requireAdmin(request); const body = await readJsonBody(request); await deleteLead(String(body.id || "")); return jsonResponse({ ok: true }); }
  catch (error) { return errorResponse(error); }
}
