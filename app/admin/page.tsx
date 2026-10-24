"use client";
import { apiEndpoint } from "@/lib/api-endpoint";
import { FormEvent, useState } from "react";
import "./style.css";
type Lead = { id:string; createdAt:number; name:string; company:string; phone:string; industry:string; problem:string; preferredTime:string; source:string; assessment?:Record<string,unknown>; notificationStatus:string; notificationAttempts:number; notificationError?:string };
export default function LeadAdmin() {
  const [token,setToken] = useState("");
  const [leads,setLeads] = useState<Lead[] | null>(null);
  const [busy,setBusy] = useState(false);
  const [error,setError] = useState("");
  const [detail,setDetail] = useState<Lead | null>(null);
  async function call(path:string,method="GET",body?:unknown) {
    const res = await fetch(apiEndpoint(path),{method,headers:{Authorization:`Bearer ${token}`,"Content-Type":"application/json"},...(body ? {body:JSON.stringify(body)} : {})});
    const data = await res.json() as {ok:boolean;error?:string;leads?:Lead[]};
    if(!res.ok || !data.ok) throw new Error(data.error || "操作未完成");
    return data;
  }
  async function refresh(event?:FormEvent) {
    event?.preventDefault(); setBusy(true);setError("");
    try { const data=await call("/api/admin/leads");setLeads(data.leads || []); }
    catch(e){setError(e instanceof Error?e.message:"加载失败");}
    finally{setBusy(false);}
  }
  async function retry(id?:string) {
    setBusy(true);setError("");
    try{await call("/api/admin/retry","POST",id?{id}:{});await refresh();}
    catch(e){setError(e instanceof Error?e.message:"重试失败");}
    finally{setBusy(false);}
  }
  async function remove(lead:Lead) {
    if(!confirm(`永久删除 ${lead.name} 的预约及关联评估？此操作不可撤销。`))return;
    setBusy(true);setError("");
    try{await call("/api/admin/leads","DELETE",{id:lead.id});if(detail?.id===lead.id)setDetail(null);await refresh();}
    catch(e){setError(e instanceof Error?e.message:"删除失败");}
    finally{setBusy(false);}
  }
  function csv() {
    if(!leads)return;
    const escape=(s:unknown)=>'"'+String(s??"").replace(/^[=+@-]/,"'$&").replaceAll('"','""')+'"';
    const rows=[["预约编号","提交时间","姓名","企业","联系电话","行业","问题","方便沟通","来源","通知状态"],...leads.map(l=>[l.id,new Date(l.createdAt).toISOString(),l.name,l.company,l.phone,l.industry,l.problem,l.preferredTime,l.source,l.notificationStatus])];
    const url=URL.createObjectURL(new Blob(["\uFEFF"+rows.map(r=>r.map(escape).join(",")).join("\r\n")],{type:"text/csv;charset=utf-8"}));
    const a=document.createElement("a");a.href=url;a.download="深拥智能-预约记录.csv";a.click();URL.revokeObjectURL(url);
  }
  const status=(v:string)=>({sent:"已通知飞书",pending:"通知待重试",unconfigured:"飞书未配置",sending:"正在通知"}[v]||v);
  return <main className="admin-page">
    <a href="/" className="admin-back">← 返回深拥智能</a>
    <div className="admin-heading"><span>DEEP EMBRACE · PRIVATE DESK</span><h1>业务预约管理</h1><p>查看预约与评估资料，管理飞书通知。</p></div>
    {!leads?<form className="admin-login" onSubmit={refresh}><label htmlFor="admin-token">管理员访问密钥</label><input id="admin-token" type="password" required value={token} onChange={e=>setToken(e.target.value)} autoComplete="off"/><button disabled={busy}>{busy?"正在验证…":"进入管理"}</button><small>密钥仅保留在当前页面内存，刷新页面后需重新输入。</small></form>:<>
      <div className="admin-actions"><span>最近 {leads.length} 条预约</span><button onClick={()=>refresh()} disabled={busy}>刷新</button><button onClick={()=>retry()} disabled={busy}>重试待发送通知</button><button onClick={csv}>导出 CSV</button><button onClick={()=>{setLeads(null);setToken("");setDetail(null);}}>退出</button></div>
      {leads.length===0?<p className="admin-empty">还没有收到预约。</p>:<div className="admin-records">{leads.map(lead=><article className="admin-record" key={lead.id}>
        <div><span className="admin-date">{new Date(lead.createdAt).toLocaleString("zh-CN",{timeZone:"Asia/Shanghai"})} · 北京时间</span><h2>{lead.company}<small>{lead.name} · {lead.industry}</small></h2><p>{lead.problem}</p><dl><dt>电话</dt><dd>{lead.phone}</dd><dt>方便沟通</dt><dd>{lead.preferredTime}</dd></dl></div>
        <div className="admin-record-actions"><span className={lead.notificationStatus==="sent"?"admin-good":"admin-pending"}>{status(lead.notificationStatus)}</span><small>来源：{lead.source}</small>{lead.assessment&&<button onClick={()=>setDetail(lead)}>查看评估资料</button>}{lead.notificationStatus!=="sent"&&<button onClick={()=>retry(lead.id)} disabled={busy}>重试飞书通知</button>}<button className="admin-delete" onClick={()=>remove(lead)} disabled={busy}>删除预约</button></div>
      </article>)}</div>}
      {detail&&<section className="admin-detail"><button className="admin-close" onClick={()=>setDetail(null)}>关闭资料 ×</button><h2>{detail.company} · AI 评估资料</h2><pre>{JSON.stringify(detail.assessment,null,2)}</pre></section>}
    </>}
    {error&&<p className="admin-error" role="alert">{error}</p>}
  </main>;
}
