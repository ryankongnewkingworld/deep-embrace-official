import type { Metadata } from 'next';
import { ArrowLeft, ArrowUpRight, Clock3 } from 'lucide-react';
import CaseLibrary from './CaseLibrary';
import { flagshipCases } from '@/data/cases';
import '@/components/cases.css';

export const metadata: Metadata = { title: 'AI 应用案例', description: '按业务场景探索 AI 应用：为谁解决什么问题、用什么方法、取得什么变化。' };
export default function CasesPage() {
  return <main className="case-page library-page">
    <header className="case-nav"><a className="case-brand" href="/" aria-label="深拥智能首页"><svg className="brand-symbol" viewBox="228 225 480 350" aria-hidden="true"><image href="/media/logo.png" width="2048" height="814" /></svg><span>深拥智能<small>DEEP EMBRACE INTELLIGENCE</small></span></a><a href="/#cases" className="case-back"><ArrowLeft size={15} />返回官网</a><a href="/#contact" className="case-nav-book">预约业务诊断 <ArrowUpRight size={16} /></a></header>
    <div className="case-detail-wrap"><section className="library-hero"><p className="case-eyebrow">AI IN REAL BUSINESS</p><h1>从别人的改变，<br /><em>看见自己的机会。</em></h1><p>为谁解决了什么问题，用了什么方法，带来了什么变化。<br className="library-desktop-break" />从与您相似的场景开始，找到 AI 的业务切入点。</p></section>
      <section className="library-featured"><div className="library-section-label"><span>重点业务场景</span><span>SELECTED STORIES</span></div><div className="case-related-grid">{flagshipCases.map(item => <a key={item.slug} href={`/cases/${item.slug}`}><span>{item.sector}<ArrowUpRight size={18} /></span><h3>{item.title}</h3><p>{item.status}</p></a>)}</div></section>
      <div className="case-layout library-layout"><section className="case-main-column"><div className="library-section-label"><span>AI 应用案例</span><span>EXPLORE BY CHALLENGE</span></div><CaseLibrary /></section><aside className="case-consult" aria-label="预约业务咨询"><div className="case-consult-inner"><div className="case-consult-orbit" aria-hidden="true"><span /><span /><span /></div><p className="case-eyebrow">FROM CASE TO YOUR BUSINESS</p><h2>类似的问题，<br />需要适合您的答案。</h2><p>更详细的应用条件与业务方案，欢迎预约沟通。</p><a className="case-button" href="/#contact">预约业务诊断 <ArrowUpRight size={17} /></a><span className="case-consult-time"><Clock3 size={13} />30 分钟 · 聚焦实际业务</span></div></aside></div>
    </div><footer className="case-footer"><a href="/">深拥智能 · DEEP EMBRACE INTELLIGENCE</a><span>让 AI 真正成为企业生产力</span><a href="/#contact">联系我们 <ArrowUpRight size={14} /></a></footer><div className="case-mobile-book"><span>找到适合您业务的 AI 机会</span><a href="/#contact">预约业务诊断 <ArrowUpRight size={15} /></a></div>
  </main>;
}
