import { jsonResponse, leadReadiness } from "@/lib/leads";
export const dynamic = "force-dynamic";
export async function GET() { return jsonResponse(leadReadiness()); }
