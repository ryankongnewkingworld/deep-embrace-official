'use client';
import { apiEndpoint } from "@/lib/api-endpoint";

import BrandLogo from '@/components/BrandLogo';
import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, ArrowLeft, ArrowRight, Check, CheckCheck, Clock3, Download, FileText, RotateCcw, ShieldCheck, Sparkles, Printer, ChevronDown, LoaderCircle } from 'lucide-react';
import ContactForm from '@/components/ContactForm';
import { DATA } from '@/lib/assessment/data.js';
import { demoEvaluation } from '@/lib/assessment/rules.js';
import type { Answers, Opportunities, Scope, Assessment, Evaluation, Insight } from '@/lib/assessment/types';
import '@/components/assessment.css';

const EMPTY_OPS: Opportunities = {P01:'',P02:'',P03:'',P04:''};
const SESSION_KEY = 'de-assessment-v2.1';
const scopes: Scope[] = ['企业客户经营','部门／团队','门店／业务单元'];
const round = (n:number|null) => n == null ? '—' : Math.round(n);
function Evidence({ids,answers}:{ids:string[];answers:Answers}) {
  return <details className="as-evidence"><summary>查看判断依据 <ChevronDown size={12}/></summary><div>{ids.map(id => <p key={id}><b>{id}</b> {DATA.questions.find(q=>q.id===id)?.options.find(o=>o.value===answers[id])?.label || DATA.opportunities.find(q=>q.id===id)?.title || '场景补充'}</p>)}</div></details>;
}
function InsightCard({item,answers}:{item:Insight;answers:Answers}) {
  return <article className="as-insight"><h4>{item.title}</h4><p>{item.text}</p><Evidence ids={item.evidence} answers={answers}/></article>;
}

export default function AssessmentClient() {
  const [step,setStep] = useState(0);
  const [answers,setAnswers] = useState<Answers>({});
  const [opportunities,setOpportunities] = useState<Opportunities>(EMPTY_OPS);
  const [scope,setScope] = useState<Scope>('企业客户经营');
  const [consent,setConsent] = useState(false);
  const [modelEnabled,setModelEnabled] = useState(false);
  const [ready,setReady] = useState(false);
  const [busy,setBusy] = useState(false);
  const [error,setError] = useState('');
  const [assessment,setAssessment] = useState<Assessment|null>(null);
  const [report,setReport] = useState('');
  const [reportStatus,setReportStatus] = useState('');
  const [reportUrl,setReportUrl] = useState('');
  const [reportOpen,setReportOpen] = useState(false);
  const [reportReceipt,setReportReceipt] = useState<{id:string;notificationStatus:string;reportToken?:string}|null>(null);
  const reportFrame = useRef<HTMLIFrameElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);

  useEffect(()=>{
    try {
      const saved = JSON.parse(sessionStorage.getItem(SESSION_KEY)||'null');
      if(saved?.version===DATA.version && Date.now()-saved.savedAt<86400000) {
        setAnswers(saved.answers||{}); setOpportunities({...EMPTY_OPS,...saved.opportunities});
        if(scopes.includes(saved.scope))setScope(saved.scope);
        setStep(Math.min(saved.assessment?.result?5:4,Math.max(0,saved.step||0)));
        if(saved.assessment?.result)setAssessment(saved.assessment);
      }
    } catch { /* Storage can be disabled; assessment remains usable. */ }
    setReady(true);
    fetch(apiEndpoint('/api/assessment'),{cache:'no-store'}).then(r=>r.json() as Promise<{modelEnabled:boolean}>).then(d=>setModelEnabled(Boolean(d.modelEnabled))).catch(()=>{});
  },[]);
  useEffect(()=>{
    if(!ready)return;
    try{sessionStorage.setItem(SESSION_KEY,JSON.stringify({version:DATA.version,answers,opportunities,scope,step,assessment,savedAt:Date.now()}));}catch{}
  },[ready,answers,opportunities,scope,step,assessment]);
  useEffect(()=>{
    if(!report)return;
    const url = URL.createObjectURL(new Blob([report],{type:'text/html;charset=utf-8'}));
    setReportUrl(url);
    return ()=>URL.revokeObjectURL(url);
  },[report]);
  const group = DATA.groups[Math.min(step,3)];
  const questions = DATA.questions.filter(q=>q.group===group.id);
  const completed = questions.filter(q=>answers[q.id]!==undefined).length;
  const totalAnswered = DATA.questions.filter(q=>answers[q.id]!==undefined).length;
  function go(next:number) {setStep(next);setError('');requestAnimationFrame(()=>{window.scrollTo({top:0,behavior:'instant'});heading.current?.focus({preventScroll:true});});}
  function edit(){setAssessment(null);setReport('');go(0);}
  function reset(){if(!window.confirm('清除本次答案并重新开始评估？'))return;setAnswers({});setOpportunities(EMPTY_OPS);setAssessment(null);setReport('');setConsent(false);setScope('企业客户经营');go(0);}
  async function evaluate() {
    if(!consent||busy)return;
    setBusy(true);setError('');
    try {
      const response = await fetch(apiEndpoint('/api/assessment'),{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({scope,answers,opportunities,analysisConsent:true,website:''}),signal:AbortSignal.timeout(60000)});
      const data = await response.json() as {ok:boolean;error?:string;id:string;result:Evaluation;createdAt:string;signature?:string};
      if(!response.ok || !data.ok)throw new Error(data.error || '暂时无法完成评估，请重试。');
      setAssessment({id:data.id,scope,answers,opportunities,result:data.result,createdAt:data.createdAt,signature:data.signature});go(5);
    } catch(err) {setError(err instanceof Error?err.message:'网络连接暂时异常，请重试。');}
    finally{setBusy(false);}
  }
  function localResult(){
    const result = demoEvaluation(answers,opportunities);
    result.notice = '当前网络未完成服务端评估，以下为浏览器规则初评。正式报告与预约需要网络连接后提交。';
    setAssessment({id:crypto.randomUUID(),scope,answers,opportunities,result,createdAt:new Date().toISOString()});go(5);
  }
  async function receiveLead(value:{id:string;notificationStatus:string;reportToken?:string}) {
    setReportReceipt(value);
    if(!value.reportToken){setReportStatus('咨询申请已收到。正式报告暂未生成，请稍后联系团队。');return;}
    setReportStatus('资料已收到，正在生成正式报告…');
    try {
      const response = await fetch(apiEndpoint('/api/assessment/report'),{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({leadId:value.id,reportToken:value.reportToken})});
      if(!response.ok)throw new Error('报告生成暂未完成，您的咨询资料已成功提交。');
      setReport(await response.text());setReportStatus('正式报告已生成，可预览、下载或打印。沟通时间仍待团队确认。');
    } catch(err){setReportStatus(err instanceof Error?err.message:'报告生成暂未完成。');}
  }
  const result = assessment?.result;

  return <div className="as-page">
    <header className="as-header"><a href="/" className="as-brand" aria-label="返回深拥智能官网"><BrandLogo id="assessment-header-brand"/></a><nav className="as-header-actions" aria-label="评估页导航"><a href="/" className="as-home">返回官网 <ArrowUpRight size={15}/></a><a className="as-header-book" href="/#contact">预约沟通 <ArrowUpRight size={17}/></a></nav></header>
    <div className="as-layout">
      <aside className="as-sidebar"><p className="as-eyebrow">AI MATURITY ASSESSMENT</p><h1>先看清现状，<br/>再决定下一步。</h1><p className="as-side-intro">找到值得投入的业务场景，<br/>让每一步 AI 转型更有依据。</p><div className="as-side-facts"><span><Clock3 size={17}/> <b>13 道核心题</b> · 约 5–6 分钟</span><span><ShieldCheck size={17}/> 文字评估无需留下联系方式</span></div>
      {step===5&&result ? <nav className="as-result-nav" aria-label="评估报告章节"><a href="#as-dimensions">01 现状与验证依据</a><a href="#as-opportunity">02 优先候选机会</a><a href="#as-action">03 四周验证安排</a><a href="#as-consult">04 报告与专家咨询</a></nav> : <div className="as-side-note"><span>评估关注三个维度</span><ol className="as-dimension-guide"><li><span>01</span>应用与流程改造</li><li><span>02</span>价值验证方法</li><li><span>03</span>持续落地准备</li></ol><small>依据您的真实业务作答，不了解的情况可以选择“我不清楚”。</small></div>}
      <div className="as-side-bottom">从单点智能，到经营系统。<span>DEEP EMBRACE · 2026</span></div></aside>
      <main className="as-main">
        <div className="as-topline"><span>{step===5?'您的评估结果':'企业 AI 转型成熟度与机会评估'}</span>{totalAnswered>0&&<button type="button" onClick={reset} className="as-reset" aria-label="重新开始评估"><RotateCcw size={13}/> 重新开始</button>}</div>
        {step<5&&<>
          <div className="as-progress" aria-label="四组核心问题">{DATA.groups.map((g,i)=><button key={g.id} type="button" disabled={i>step} onClick={()=>go(i)} className={i===step?'active':i<step?'done':''} aria-current={i===step?'step':undefined}><span>{i<step?<Check size={13}/>:g.id}</span>{g.label}<i/></button>)}</div>
          {step===0&&<div className="as-intro">{DATA.intro.map(t=><p key={t}>{t}</p>)}<label className="as-scope">本次评估范围<select value={scope} onChange={e=>setScope(e.target.value as Scope)}>{scopes.map(s=><option key={s}>{s}</option>)}</select></label></div>}
        </>}
        {step<4&&<>
          <div className="as-group-head"><span className="as-kicker">0{step+1} / 04 · {group.label}</span><h2 tabIndex={-1} ref={heading}>{group.title}</h2><p>{group.description}</p></div>
          <div className="as-questions">{questions.map(q=><fieldset className="as-question" key={q.id}><legend><span>{q.id.replace('Q','')}</span><b>{q.title}</b></legend><div className="as-options">{q.options.map(o=><label className={'as-option '+(answers[q.id]===o.value?'selected ':'')+(['unknown','na'].includes(o.value)?'as-uncertain':'')} key={o.value}><input type="radio" name={q.id} value={o.value} checked={answers[q.id]===o.value} onChange={()=>setAnswers(a=>({...a,[q.id]:o.value}))}/><i>{answers[q.id]===o.value&&<Check size={12}/>}</i><span>{o.label}</span></label>)}</div></fieldset>)}</div>
          <div className="as-actions"><button type="button" onClick={()=>go(step-1)} disabled={step===0} className="as-btn as-btn-quiet"><ArrowLeft size={16}/> 上一组</button><span>{completed} / {questions.length} 题已完成</span><button type="button" disabled={completed!==questions.length} className="as-btn as-btn-primary" onClick={()=>go(step+1)}>{step===3?'补充业务场景':'下一组'}<ArrowRight size={16}/></button></div>
          <p className="as-save-note">进度保存在当前浏览器会话中，可返回修改。请勿在补充内容中填写客户隐私或商业秘密。</p>
        </>}
        {step===4&&<>
          <div className="as-group-head"><span className="as-kicker"><CheckCheck size={16}/> 13 道核心题已完成</span><h2 tabIndex={-1} ref={heading}>再告诉我们，<br/>最想改变哪一件事。</h2><p>以下 4 项为选填，不计入成熟度评分。具体场景帮助我们找到更贴近业务的候选机会。</p></div>
          <div className="as-op-questions">{DATA.opportunities.map((q,i)=><div className="as-question as-open-question" key={q.id}><label htmlFor={q.id}><span>P0{i+1}</span><b>{q.title}</b></label><textarea id={q.id} rows={4} maxLength={1500} placeholder={q.placeholder} value={opportunities[q.id]} onChange={e=>setOpportunities(o=>({...o,[q.id]:e.target.value}))}/><div className="as-open-bottom"><div>{q.examples.map(ex=><button type="button" key={ex} onClick={()=>setOpportunities(o=>({...o,[q.id]:((o[q.id]?o[q.id]+'；':'')+ex).slice(0,1500)}))}>{ex}</button>)}</div><small>{opportunities[q.id].length} / 1500</small></div></div>)}</div>
          <label className="as-consent"><input type="checkbox" checked={consent} onChange={e=>setConsent(e.target.checked)}/><span>我同意使用本次答案生成评估。{modelEnabled?'AI 解读仅接收问卷选项与场景描述，不接收联系方式。':'本次使用固定规则生成初评。'}请勿填写个人敏感信息或未经授权的资料。</span></label>
          {error&&<div className="as-error" role="alert">{error}<button type="button" onClick={localResult}>先查看浏览器规则初评 <ArrowRight size={14}/></button></div>}
          <div className="as-actions"><button type="button" disabled={busy} onClick={()=>go(3)} className="as-btn as-btn-quiet"><ArrowLeft size={16}/> 返回核心题</button><button type="button" onClick={evaluate} disabled={!consent||busy} className="as-btn as-btn-primary">{busy?<><LoaderCircle size={17} className="as-spin"/> 正在分析您的答案</>:<>查看我的评估<Sparkles size={16}/></>}</button></div>
          {busy&&<p className="as-save-note" role="status">{modelEnabled?'正在梳理业务机会，通常需要片刻。请保留此页面。':'正在核对答案与评估规则。'}</p>}
        </>}
        {step===5&&result&&assessment&&<>
          <div className="as-group-head as-result-hero"><span className="as-kicker">{result.provider==='deepseek'?'AI 辅助初评':'规则初评'} · {assessment.scope}</span><h2 tabIndex={-1} ref={heading}>{result.scoring.title}</h2><p>{result.narrative.summary}</p><small>{result.notice}</small><button type="button" onClick={edit} className="as-edit">返回修改答案 <ArrowUpRight size={14}/></button></div>
          <section id="as-dimensions" className="as-result-section"><div className="as-section-title"><span>01</span><h3>现状与验证依据</h3></div><div className="as-dimensions">{result.scoring.dimensions.map((d,i)=><article key={d.key}><span>DIMENSION 0{i+1}</span><h4>{d.label}</h4><div className="as-score">{d.min==null?'—':d.complete?round(d.min):`${round(d.min)}–${round(d.max)}`}<small>/ 100</small></div><div className="as-score-track"><i style={{width:`${d.min||0}%`}}/>{!d.complete&&<b style={{left:`${d.min||0}%`,width:`${(d.max||0)-(d.min||0)}%`}}/>}</div><p>{d.min==null?'本次范围不涉及':d.complete?'已知答案对应的规则结果':`${d.total-d.answered} 项待确认，显示可能范围`}{d.limited_scope?' · 限定范围':''}</p></article>)}</div><p className="as-boundary">这是基于自述的客户经营初评，分数不代表行业排名或正式认证。{result.scoring.excluded.length>0?'部分环节不在本次范围内，因此不计算总体指数。':'应用与流程、验证方法、准备度的规则权重分别为 45%、30%、25%。'}</p><div className="as-net"><span>独立观察 · 净收益状态</span><h4>{result.scoring.net_state}</h4><p>此项不计入成熟度评分。工时释放不等于现金节约，业务变化仍需核验。</p></div>
          {result.scoring.warnings.length>0&&<div className="as-caution"><b>先对齐这些事实</b>{result.scoring.warnings.map(w=><p key={w}>{w}</p>)}</div>}
          {result.narrative.strengths.length>0&&<><h4 className="as-subheading">可以继续建设的基础</h4><div className="as-insight-grid">{result.narrative.strengths.map(s=><InsightCard key={s.title} item={s} answers={assessment.answers}/>)}</div></>}
          <h4 className="as-subheading">下一步值得补齐的环节</h4><div className="as-insight-grid">{result.narrative.gaps.map(s=><InsightCard key={s.title} item={s} answers={assessment.answers}/>)}</div></section>
          <section id="as-opportunity" className="as-result-section"><div className="as-section-title"><span>02</span><h3>优先候选机会</h3></div><article className="as-opportunity"><span className="as-kicker">从一条真实业务流程开始</span><h4>{result.narrative.opportunity.title}</h4><p>{result.narrative.opportunity.rationale}</p><Evidence ids={result.narrative.opportunity.evidence} answers={assessment.answers}/><div className="as-work-split">{[['AI 可以辅助',result.narrative.opportunity.ai_steps],['人需要负责',result.narrative.opportunity.human_steps],['验证什么结果',result.narrative.opportunity.metrics]].map(([title,items])=><div key={title as string}><h5>{title}</h5><ul>{(items as string[]).map(s=><li key={s}>{s}</li>)}</ul></div>)}</div></article>
          {result.scoring.guardrails.length>0&&<div className="as-guardrails"><h4><ShieldCheck size={17}/> 试点前的必要准备</h4>{result.scoring.guardrails.map(g=><p key={g.text}>{g.text}</p>)}</div>}<p className="as-boundary">{result.narrative.urgency}</p></section>
          <section id="as-action" className="as-result-section"><div className="as-section-title"><span>03</span><h3>四周验证安排</h3></div><div className="as-plan">{result.narrative.action_plan.map((a,i)=><article key={a.week}><div className="as-plan-number">0{i+1}</div><div><span>{a.week}</span><h4>{a.action}</h4><p>交付物：{a.deliverable}</p></div></article>)}</div><p className="as-boundary">以上为验证安排建议，不是上线或收益承诺；具体节奏以真实业务条件为准。</p><div className="as-expert-questions"><h4>与专家沟通时，优先核实</h4><ol>{result.narrative.expert_questions.map(q=><li key={q}>{q}</li>)}</ol></div></section>
          <section id="as-consult" className="as-result-section as-consult"><div className="as-section-title"><span>04</span><h3>把初评，变成下一步行动。</h3></div><p>提交以下资料，获取可保存的正式报告，并申请一次 30 分钟业务咨询。我们会带着您的答案沟通，48 小时内与您联系，具体时间另行确认。</p><ContactForm source="assessment" assessment={assessment} onSuccess={receiveLead}/>{reportStatus&&<p className="as-report-status" role="status">{reportStatus}</p>}{!report&&reportReceipt&&reportStatus&&!reportStatus.includes("正在")&&<button className="as-btn as-btn-outline" onClick={()=>receiveLead(reportReceipt)}>重试生成正式报告</button>}{report&&<div className="as-report-actions"><button className="as-btn as-btn-primary" onClick={()=>setReportOpen(!reportOpen)}><FileText size={17}/>{reportOpen?'收起预览':'预览正式报告'}</button><a className="as-btn as-btn-outline" href={reportUrl} download="深拥智能_AI转型评估报告.html"><Download size={17}/>下载报告</a><button className="as-btn as-btn-outline" onClick={()=>{setReportOpen(true);setTimeout(()=>reportFrame.current?.contentWindow?.print(),300);}}><Printer size={17}/>打印 / 存为 PDF</button></div>}{report&&<iframe title="正式评估报告" className={'as-report-frame '+(reportOpen?'visible':'')} ref={reportFrame} srcDoc={report}/>}</section>
        </>}
        <footer className="as-footer"><span>深拥智能 · 企业 AI 转型与价值落地伙伴</span><span>规则版本 {DATA.version}</span></footer>
      </main>
    </div>
  </div>;
}
