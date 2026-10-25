import type { Metadata } from 'next';
import BrandLogo from '@/components/BrandLogo';
import { ArrowUpRight, ArrowLeft, ArrowRight, Check, ChevronRight, Clock3 } from 'lucide-react';
import CaseVideo from '@/components/CaseVideo';
import { flagshipCases } from '@/data/cases';
import '@/components/cases.css';

export const metadata: Metadata = {
  title: 'VC 投研工作台 · 深拥智能',
  description: '把项目初筛、研究分析与专业方法放进一个 AI 工作台，让投研团队把时间集中在关键问题上。',
};

const vcSteps = [
  { n: '01', title: '项目初筛：让材料先形成清晰底稿', bullets: ['上传 BP，或粘贴项目简介', '提取项目标签与关键事实', '按投资赛道整理初筛信息'], change: '零散项目材料 → 结构化研究起点' },
  { n: '02', title: '多维研究：把分析方法做进工作流程', bullets: ['按赛道与研究深度开展行业研究', '从产品、技术、客户等维度对比竞品', '三层市场规模测算，双路径交叉校验', '结合发展历程与同行对比，分析企业位置'], change: '各自组织研究 → 按共同框架展开分析' },
  { n: '03', title: '方法复用：让成熟经验成为团队能力', bullets: ['将专业方法配置为可调用的 AI 技能', '按任务设置研究参数与重点', '在同一工作台组织多个研究环节'], change: '个人研究方法 → 团队可复用的工作流程' },
];

export default function VCResearchPage() {
  return <main className="case-page">
    <header className="case-nav">
      <a className="case-brand" href="/" aria-label="深拥智能首页"><BrandLogo id="case-header-brand"/></a>
      <a href="/#cases" className="case-back"><ArrowLeft size={15} /> 返回客户案例</a>
      <a href="/#contact" className="case-nav-book">预约业务诊断 <ArrowUpRight size={16} /></a>
    </header>
    <div className="case-detail-wrap">
      <nav className="case-story-nav" aria-label="探索三类业务案例">{flagshipCases.map(story => <a key={story.slug} href={`/cases/${story.slug}`} aria-current={story.slug === 'professional-services' ? 'page' : undefined}><span>{story.sector}</span><ArrowUpRight size={16} /></a>)}</nav>
      <div className="case-breadcrumb"><a href="/">首页</a><ChevronRight size={12} /><a href="/#cases">客户案例</a><ChevronRight size={12} /><a href="/cases/professional-services">专业服务</a><ChevronRight size={12} /><span>VC 投研工作台</span></div>
      <div className="case-layout">
        <div className="case-main-column">
          <section className="case-hero">
            <div className="case-eyebrow"><span>CASE 02 / 专业服务 · VC 投研工作台</span><span className="case-status">AI 投研工作流</span></div>
            <p className="case-english">INVESTMENT RESEARCH × AI WORKFLOW</p>
            <h1>VC 投研工作台</h1>
            <p className="case-lead">从项目初筛到多维研究，把投资研究的专业方法做进工作流。</p>
            <div className="case-scope"><span>项目梳理</span><span>研究分析</span><span>方法复用</span></div>
          </section>
          <div className="vc-intro"><h3>项目越看越多，研究总要从头做？</h3><p>把项目初筛、研究分析与专业方法放进一个 AI 工作台，让投研团队把时间集中在关键问题上。</p><p className="vc-team">适用团队：股权投资机构、产业投资团队、企业战略研究部门</p></div>
          <figure className="case-media vc-demo"><CaseVideo src="/media/cases/vc-workbench.mp4" title="VC 投研工作台演示" /><figcaption><strong>VC 投研工作台演示</strong><span>视频 2 分 34 秒，AI 如何赋能项目初筛、行业研究、竞品分析、市场测算与专业方法复用。</span></figcaption></figure>
          {vcSteps.map((step, i) => <section className="case-step vc-step" key={step.n} id={`vc-step-${i + 1}`}>
            <div className="case-step-heading"><span className="case-step-number">0{i + 1}</span><div><h2 className="vc-step-title">{step.title}</h2></div></div>
            <ul className="vc-bullets">{step.bullets.map(bullet => <li key={bullet}><Check size={15} /><span>{bullet}</span></li>)}</ul>
            <div className="case-transformation"><span>工作方式变化</span><strong>{step.change}</strong></div>
          </section>)}
          <div className="case-closing vc-closing"><span className="case-eyebrow">YOUR NEXT STEP</span><h2>让投研有清晰起点、有共同方法、有复用基础</h2><p>AI 辅助整理材料与组织分析，投研人员核查事实、修正假设、形成判断。</p><a className="case-button" href="/#contact">预约业务诊断 <ArrowUpRight size={17} /></a></div>
        </div>
        <aside className="case-consult" aria-label="预约业务咨询">
          <div className="case-consult-inner"><div className="case-consult-orbit" aria-hidden="true"><span /><span /><span /></div><p className="case-eyebrow">LET'S TALK BUSINESS</p><h2>您的业务，<br />下一步怎么变？</h2><p>带着一个真实问题开始，<br />找到值得优先投入的 AI 机会。</p><a className="case-button" href="/#contact">预约业务诊断 <ArrowUpRight size={17} /></a><span className="case-consult-time"><Clock3 size={13} />30 分钟 · 聚焦实际业务</span><p className="case-consult-hotline">咨询热线：<a href="tel:+8618926478315">（+86）18926478315</a> 深拥智能</p><div className="case-consult-toc"><span>本页内容</span><a href="#vc-step-1"><span>01</span>项目初筛<ArrowRight size={12} /></a><a href="#vc-step-2"><span>02</span>多维研究<ArrowRight size={12} /></a><a href="#vc-step-3"><span>03</span>方法复用<ArrowRight size={12} /></a></div></div>
        </aside>
      </div>
      <section className="case-related"><div><p className="case-eyebrow">MORE POSSIBILITIES</p><h2>看看其他行业，如何开始改变。</h2></div><div className="case-related-grid">{flagshipCases.filter(other => other.slug !== 'professional-services').map(other => <a key={other.slug} href={`/cases/${other.slug}`}><span>查看{other.sector}案例<ArrowUpRight size={20} /></span><h3>{other.title}</h3><p>{other.status}</p></a>)}<a href="/cases"><span>探索更多应用场景<ArrowUpRight size={20} /></span><h3>找到与您手上问题相似的 AI 应用案例。</h3><p>按行业、业务问题与方法检索</p></a></div></section>
    </div>
    <footer className="case-footer"><a href="/" className="case-footer-brand" aria-label="深拥智能首页"><BrandLogo id="case-footer-brand"/></a><span>让 AI 真正成为企业生产力</span><a href="/#contact">联系我们 <ArrowUpRight size={14} /></a></footer>
    <div className="case-mobile-book"><span>从一个真实业务问题开始</span><a href="/#contact">预约业务诊断 <ArrowUpRight size={15} /></a></div>
  </main>;
}
