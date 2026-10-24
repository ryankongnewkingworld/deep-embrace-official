import { errorResponse, jsonResponse, readJsonBody, submitLead } from "@/lib/leads";
export const dynamic = "force-dynamic";
export async function POST(request: Request) {
  try { return jsonResponse(await submitLead(await readJsonBody(request), request)); }
  catch (error) { return errorResponse(error); }
}
