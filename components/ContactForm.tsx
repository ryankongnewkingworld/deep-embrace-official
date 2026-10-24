"use client";
import { FormEvent, useId, useState } from "react";
import "./contact.css";

export type LeadReceipt = { id: string; notificationStatus: string; reportToken?: string };
type Props = {
  source?: string;
  assessment?: object;
  onSuccess?: (result: LeadReceipt) => void;
  submitLabel?: string;
};
export default function ContactForm({ source = "homepage", assessment, onSuccess, submitLabel = "预约30分钟业务咨询" }: Props) {
  const prefix = useId();
  const [state, setState] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [receipt, setReceipt] = useState<LeadReceipt | null>(null);
  const fieldId = (name: string) => `${prefix}-${name}`;
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state === "submitting") return;
    const values = new FormData(event.currentTarget);
    setState("submitting");
    setMessage("");
    try {
      const response = await fetch("/api/leads", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.get("name"), company: values.get("company"), phone: values.get("phone"),
          industry: values.get("industry"), problem: values.get("problem"), preferredTime: values.get("preferredTime"),
          consent: values.get("consent") === "on", website: values.get("website"), source, ...(assessment ? { assessment } : {}),
        }),
      });
      const result = await response.json() as LeadReceipt & { ok?: boolean; error?: string };
      if (!response.ok || !result.ok || !result.id) throw new Error(result.error || "暂时无法确认提交，请稍后重试。");
      setReceipt(result);
      setState("success");
      onSuccess?.(result);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "网络连接暂时中断，尚未确认提交成功，请重试。");
      setState("error");
    }
  }
  if (state === "success") return <div className="contact-receipt" role="status">
    <span className="contact-receipt-icon" aria-hidden="true">✓</span>
    <p className="contact-eyebrow">YOUR NEXT CHAPTER</p>
    <h3>已收到您的业务咨询</h3>
    <p>我们将在48小时内与您联系，<br/>一起找到值得优先改变的业务环节。</p>
    <span className="contact-receipt-id">预约编号 {receipt?.id.slice(0, 8).toUpperCase()}</span>
    <button type="button" className="contact-text-button" onClick={() => { setState("idle"); setReceipt(null); }}>提交另一条咨询 <span aria-hidden="true">↗</span></button>
  </div>;
  return <form className="contact-form" onSubmit={submit} aria-label="预约业务咨询">
    <div className="contact-field-row">
      <label htmlFor={fieldId("name")}>姓名 <span aria-hidden="true">*</span><input id={fieldId("name")} name="name" required maxLength={60} autoComplete="name" placeholder="如何称呼您" /></label>
      <label htmlFor={fieldId("company")}>企业名称 <span aria-hidden="true">*</span><input id={fieldId("company")} name="company" required maxLength={160} autoComplete="organization" placeholder="您所在的企业" /></label>
    </div>
    <div className="contact-field-row">
      <label htmlFor={fieldId("phone")}>联系电话 <span aria-hidden="true">*</span><input id={fieldId("phone")} name="phone" type="tel" required minLength={6} maxLength={30} autoComplete="tel" placeholder="便于我们与您联系" /></label>
      <label htmlFor={fieldId("industry")}>所属行业 <span aria-hidden="true">*</span><select id={fieldId("industry")} name="industry" required defaultValue="">
        <option value="" disabled>请选择您的行业</option>
        <option>品牌连锁</option><option>专业服务</option><option>跨境电商与出海</option><option>制造与工业</option><option>零售与消费</option><option>科技与互联网</option><option>其他行业</option>
      </select></label>
    </div>
    <label htmlFor={fieldId("problem")}>希望解决的问题 <span aria-hidden="true">*</span><textarea id={fieldId("problem")} name="problem" required minLength={5} maxLength={2000} rows={3} placeholder="例如：内容生产耗时、客户跟进效率低，或团队经验难以复制……" /></label>
    <label htmlFor={fieldId("time")}>方便沟通的时间 <span aria-hidden="true">*</span><input id={fieldId("time")} name="preferredTime" required minLength={2} maxLength={160} placeholder="例如：工作日下午 14:00–17:00（北京时间）" /></label>
    <div className="contact-trap" aria-hidden="true"><label htmlFor={fieldId("website")}>网站<input id={fieldId("website")} name="website" tabIndex={-1} autoComplete="off" /></label></div>
    <label className="contact-consent" htmlFor={fieldId("consent")}><input id={fieldId("consent")} name="consent" type="checkbox" required/><span>我已阅读<a href="/privacy" target="_blank" rel="noopener noreferrer">隐私说明</a>，同意深拥智能使用以上信息与我联系。</span></label>
    {state === "error" && <p className="contact-error" role="alert">{message}</p>}
    <button type="submit" className="contact-submit" disabled={state === "submitting"}><span>{state === "submitting" ? "正在安全提交…" : submitLabel}</span><span aria-hidden="true">{state === "submitting" ? "◌" : "↗"}</span></button>
    <p className="contact-note">从一个真实业务问题开始。提交后由团队确认沟通时间。</p>
  </form>;
}
