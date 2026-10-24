import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { DATA } from '../lib/assessment/data.js';
const rows = [];
const secrets = { SUPABASE_URL:'https://example.supabase.co', SUPABASE_SERVICE_ROLE_KEY:'test-server-key', LEAD_ENCRYPTION_KEY:Buffer.alloc(32,7).toString('base64'), ADMIN_TOKEN:'test-admin-token-with-more-than-24-characters', ALLOWED_ORIGINS:'https://website.example' };
let handler;
globalThis.Deno={env:{get:key=>secrets[key],toObject:()=>secrets},serve:fn=>{handler=fn;}};
const originalFetch=globalThis.fetch;
globalThis.fetch=async(url,options)=>{
 assert.equal(new URL(url).pathname,'/rest/v1/rpc/deep_embrace_store');
 assert.equal(options.headers.apikey,secrets.SUPABASE_SERVICE_ROLE_KEY);
 const {operation,args:a}=JSON.parse(options.body);let found=[],changes=0;
 if(operation==='duplicate')found=rows.filter(r=>r.request_hash===a[0]);
 else if(operation==='count')found=[{count:rows.filter(r=>r.submitter_hash===a[0]&&r.created_at>a[1]).length}];
 else if(operation==='insert'){rows.push(Object.fromEntries(['id','created_at','source','payload','request_hash','submitter_hash','report_token_hash','notification_status','next_attempt_at'].map((k,i)=>[k,a[i]])));changes=1;}
 else if(operation==='get'||operation==='report')found=rows.filter(r=>r.id===a[0]&&(!a[1]||r.created_at>=a[1]));
 else if(operation==='list')found=rows;
 else if(operation==='purge'){}
 else throw new Error('Unexpected operation '+operation);
 return Response.json({rows:found,changes});
};
await import('data:text/javascript;base64,'+Buffer.from(await readFile('supabase/functions/website-api/index.ts','utf8')).toString('base64'));
const request=(path,body,extra={})=>handler(new Request('https://example.supabase.co/functions/v1/website-api'+path,{method:body?'POST':'GET',headers:{Origin:'https://website.example','Content-Type':'application/json',...extra},...(body?{body:JSON.stringify(body)}:{})}));
assert.equal((await request('/leads/config',null,{Origin:'https://evil.example'})).status,403);
assert.equal((await request('/admin/leads')).status,401);
const input={scope:'企业客户经营',answers:Object.fromEntries(DATA.questions.map(q=>[q.id,q.options[0].value])),opportunities:{P01:'',P02:'',P03:'',P04:''},analysisConsent:true,website:''};
const assessment=await (await request('/assessment',input)).json();assert.equal(assessment.ok,true);
const lead={name:'测试用户',company:'测试企业',phone:'13800000000',industry:'测试',problem:'仅用于本地自动验证',preferredTime:'明天上午',consent:true,source:'test',assessment};
const result=await (await request('/leads',lead)).json();assert.equal(result.ok,true);assert.equal(result.notificationStatus,'unconfigured');assert.ok(result.reportToken);
assert.ok(!rows[0].payload.includes('测试用户'));assert.ok(!rows[0].payload.includes('13800000000'));
const duplicate=await (await request('/leads',lead)).json();assert.equal(duplicate.id,result.id);assert.equal(rows.length,1);
assert.equal((await request('/assessment/report',{leadId:result.id,reportToken:'bad-token'})).status,403);
const report=await request('/assessment/report',{leadId:result.id,reportToken:result.reportToken});assert.equal(report.status,200);const html=await report.text();assert.ok(html.includes('<html'));assert.ok(!html.includes('13800000000'));
const listed=await (await request('/admin/leads',null,{Authorization:'Bearer '+secrets.ADMIN_TOKEN})).json();assert.equal(listed.leads[0].name,'测试用户');assert.equal(listed.leads[0].reportToken,undefined);
globalThis.fetch=originalFetch;
console.log('PASS: origin allowlist, admin auth, encrypted storage, deduplication, assessment, report-token rejection, authorized report and contact isolation. Database transport mocked; remote SQL and Feishu require live verification.');
