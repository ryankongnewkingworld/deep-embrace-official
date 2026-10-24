import * as leads from '../app/api/leads/route';
import * as config from '../app/api/leads/config/route';
import * as assessment from '../app/api/assessment/route';
import * as report from '../app/api/assessment/report/route';
import * as admin from '../app/api/admin/leads/route';
import * as retry from '../app/api/admin/retry/route';

declare const Deno: { env: { get(name: string): string | undefined }; serve(handler: (request: Request) => Promise<Response>): void };
const routes: Record<string, Record<string, (request: Request) => Promise<Response>>> = {
  '/leads': { POST: leads.POST }, '/leads/config': { GET: config.GET },
  '/assessment': { GET: assessment.GET, POST: assessment.POST },
  '/assessment/report': { POST: report.POST },
  '/admin/leads': { GET: admin.GET, DELETE: admin.DELETE },
  '/admin/retry': { POST: retry.POST },
};
export async function handler(request: Request) {
  const origin = request.headers.get('Origin');
  const allowed = (Deno.env.get('ALLOWED_ORIGINS') || '').split(',').map(s => s.trim()).filter(Boolean);
  if (!origin || !allowed.includes(origin)) return Response.json({error:'请求来源未授权。'}, {status:403});
  const cors = { 'Access-Control-Allow-Origin': origin, 'Access-Control-Allow-Methods':'GET,POST,DELETE,OPTIONS',
    'Access-Control-Allow-Headers':'authorization,content-type', 'Vary':'Origin', 'Cache-Control':'no-store' };
  if (request.method === 'OPTIONS') return new Response(null,{status:204,headers:cors});
  const url = new URL(request.url);
  // The explicit query route also supports the provider's built-in API tester.
  const route = url.searchParams.get('route') || url.pathname.replace(/^.*\/website-api/, '') || '/';
  const endpoint = routes[route]?.[request.method];
  if (!endpoint) return Response.json({error:'接口不存在。'},{status:404,headers:cors});
  // The exact external origin was checked above. Adapt shared same-origin handlers
  // without trusting a browser-supplied Cloudflare IP header on the Supabase runtime.
  const headers = new Headers(request.headers);
  headers.set('Origin',url.origin);
  headers.delete('cf-connecting-ip');
  headers.delete('x-forwarded-for');
  try {
    const adapted = new Request(request,{headers});
    const response = await endpoint(adapted);
    const outputHeaders = new Headers(response.headers);
    for (const [key,value] of Object.entries(cors)) outputHeaders.set(key,value);
    return new Response(response.body,{status:response.status,headers:outputHeaders});
  } catch { return Response.json({error:'服务暂时不可用，请稍后再试。'},{status:503,headers:cors}); }
}
Deno.serve(handler);
