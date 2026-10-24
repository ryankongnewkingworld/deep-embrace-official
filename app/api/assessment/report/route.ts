import { readAssessmentForReport, readJsonBody } from '@/lib/leads';
import { assessmentInputSchema } from '@/lib/assessment/validation';
import { demoEvaluation } from '@/lib/assessment/rules.js';
import { buildReport } from '@/lib/assessment/report';
import { verifyAssessment } from '@/lib/assessment/signature';
import { narrativeSchema } from '@/lib/assessment/validation';
import type { Assessment } from '@/lib/assessment/types';

export async function POST(request:Request) {
  const headers = {'Cache-Control':'no-store, private'};
  const origin=request.headers.get('origin');
  if(origin&&origin!==new URL(request.url).origin)return Response.json({error:'请求来源无效。'},{status:403,headers});
  try {
    const body=await readJsonBody(request) as {leadId?:string;reportToken?:string};
    if(typeof body.leadId!=='string'||typeof body.reportToken!=='string'||body.leadId.length>80||body.reportToken.length>200)throw new Error('invalid');
    const stored=await readAssessmentForReport(body.leadId,body.reportToken);
    if(!stored)return Response.json({error:'报告凭证无效，或资料尚未提交。'},{status:403,headers});
    const checked=assessmentInputSchema.parse({scope:stored.scope,answers:stored.answers,opportunities:stored.opportunities,analysisConsent:true});
    // Never trust client-supplied scores or interpretation in a formal report.
    const result=demoEvaluation(checked.answers,checked.opportunities);
    // Preserve optional AI interpretation only with the API's HMAC proof.
    const original=stored as unknown as Assessment;
    if(original.result?.provider==='deepseek' && await verifyAssessment(original)) {
      const narrative=narrativeSchema.safeParse(original.result.narrative);
      if(narrative.success){result.narrative=narrative.data;result.provider='deepseek';result.model=original.result.model;result.notice=original.result.notice;}
    }
    const assessment:Assessment={id:String(stored.id||body.leadId),scope:checked.scope,answers:checked.answers,opportunities:checked.opportunities,result,createdAt:new Date().toISOString()};
    const html=buildReport(assessment,body.leadId);
    return new Response(html,{headers:{...headers,'Content-Type':'text/html;charset=utf-8','X-Content-Type-Options':'nosniff','Content-Security-Policy':"default-src 'none'; style-src 'unsafe-inline'; base-uri 'none'; form-action 'none'"}});
  }catch{return Response.json({error:'暂时无法生成报告，请稍后重试。'},{status:400,headers});}
}
