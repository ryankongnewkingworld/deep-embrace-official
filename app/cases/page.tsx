import BrandLogo from '@/components/BrandLogo';
import type { Metadata } from 'next';
import { ArrowLeft, ArrowUpRight, Clock3 } from 'lucide-react';
import CaseLibrary from './CaseLibrary';
import { flagshipCases } from '@/data/cases';
import '@/components/cases.css';

export const metadata: Metadata = { title: '更多案例', description: '查看品牌连锁、专业服务、跨境出海等业务案例，了解业务问题、解决方案与成效。' };
export default function CasesPage() {
  return <main className="case-page library-page">
    <header className="case-nav"><a className="case-brand" href="/" aria-label="深拥智能首页"><BrandLogo id="case-header-brand"/></a><a href="/#cases" className="case-back"><ArrowLeft size={15} />返回官网</a><a href="/#contact" className="case-nav-book">预约业务诊断 <ArrowUpRight size={16} /></a></header>
    <div className="case-detail-wrap"><section className="library-hero"><p className="case-eyebrow">BUSINESS CASES</p><h1>更多案例</h1><p>业务问题如何解决，AI 方案如何落地，带来了哪些成效。<br className="library-desktop-break" />按行业与业务场景查看案例，了解相关方案的应用条件。</p></section>
      <section className="library-featured"><div className="library-section-label"><span>三大业务案例</span><span>FEATURED CASES</span></div><div className="case-related-grid">{flagshipCases.map(item => <a key={item.slug} href={`/cases/${item.slug}`}><span>{item.sector}<ArrowUpRight size={18} /></span><h3>{item.title}</h3><p>{item.status}</p></a>)}</div></section>
      <div className="case-layout library-layout"><section className="case-main-column"><div className="library-section-label"><span>按业务场景查看案例</span><span>CASES BY SCENARIO</span></div><CaseLibrary /></section><aside className="case-consult" aria-label="预约业务咨询"><div className="case-consult-inner"><div className="case-consult-orbit" aria-hidden="true"><span /><span /><span /></div><p className="case-eyebrow">LET’S TALK BUSINESS</p><h2>进一步了解方案，<br />欢迎预约沟通。</h2><p>了解案例详情与应用条件，或讨论您的业务需求。</p><a className="case-button" href="/#contact">预约业务诊断 <ArrowUpRight size={17} /></a><span className="case-consult-time"><Clock3 size={13} />30 分钟 · 聚焦实际业务</span></div></aside></div>
    </div><footer className="case-footer"><a href="/" className="case-footer-brand" aria-label="深拥智能首页"><BrandLogo id="case-footer-brand"/></a><span>让 AI 真正成为企业生产力</span><a href="/#contact">联系我们 <ArrowUpRight size={14} /></a></footer><div className="case-mobile-book"><span>了解方案与业务合作</span><a href="/#contact">预约业务诊断 <ArrowUpRight size={15} /></a></div>
  </main>;
}
