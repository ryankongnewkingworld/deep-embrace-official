import BrandLogo from '@/components/BrandLogo';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArrowUpRight, ArrowLeft, ArrowRight, Check, ChevronRight, Clock3 } from 'lucide-react';
import CaseVideo, { CaseImage } from '@/components/CaseVideo';
import { flagshipCases, type CaseMedia } from '@/data/cases';
import '@/components/cases.css';

type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = flagshipCases.find(item => item.slug === slug);
  return { title: item ? `${item.sector}案例 · ${item.title}` : '客户案例', description: item?.summary };
}
function Media({ item }: { item: CaseMedia }) {
  return <figure className={`case-media${item.portrait ? ' is-portrait' : ''}`}>
    {item.type === 'video' ? <CaseVideo src={item.src} title={item.title} portrait={item.portrait} /> : <CaseImage src={item.src} title={item.title} />}
    <figcaption><strong>{item.title}</strong><span>{item.caption}</span></figcaption>
  </figure>;
}
export default async function CasePage({ params }: Props) {
  const { slug } = await params;
  const item = flagshipCases.find(item => item.slug === slug);
  if (!item) notFound();
  const index = flagshipCases.indexOf(item) + 1;
  return <main className="case-page">
    <header className="case-nav">
      <a className="case-brand" href="/" aria-label="深拥智能首页"><BrandLogo id="case-header-brand"/></a>
      <a href="/#cases" className="case-back"><ArrowLeft size={15} /> 返回客户案例</a>
      <a href="/#contact" className="case-nav-book">预约业务诊断 <ArrowUpRight size={16} /></a>
    </header>
    <div className="case-detail-wrap">
      <nav className="case-story-nav" aria-label="探索三类业务案例">{flagshipCases.map(story => <a key={story.slug} href={`/cases/${story.slug}`} aria-current={story.slug === slug ? 'page' : undefined}><span>{story.sector}</span><ArrowUpRight size={16} /></a>)}</nav>
      <div className="case-breadcrumb"><a href="/">首页</a><ChevronRight size={12} /><a href="/#cases">客户案例</a><ChevronRight size={12} /><span>{item.sector}</span></div>
      <div className="case-layout">
        <div className="case-main-column">
          <section className="case-hero">
            <div className="case-eyebrow"><span>CASE 0{index} / {item.sector}</span><span className={`case-status${slug === 'professional-services' ? ' case-status-simulation' : ''}`}>{item.status}</span></div>
            <p className="case-english">{item.eyebrow}</p>
            <h1>{item.title}</h1>
            <p className="case-lead">{item.summary}</p>
            <div className="case-customer"><span>客户背景</span><p>{item.customer}</p></div>
            <div className="case-scope">{item.scope.map(scope => <span key={scope}>{scope}</span>)}</div>
            {slug === 'professional-services' && <p className="case-simulation-note">{item.note}</p>}
          </section>
          <section className="case-metrics" aria-label={slug === 'professional-services' ? '方案价值' : '业务变化'}>
            {item.metrics.map(metric => <div key={metric.label}><strong>{metric.value}</strong><h2>{metric.label}</h2><p>{metric.detail}</p></div>)}
          </section>
          <div className="case-section-intro"><p className="case-eyebrow">BUSINESS TRANSFORMATION</p><h2>从业务问题，到可执行的改变。</h2></div>
          {item.steps.map((step, stepIndex) => <section className="case-step" key={step.question} id={`step-${stepIndex + 1}`}>
            <div className="case-step-heading"><span className="case-step-number">0{stepIndex + 1}</span><div><p className="case-question">{step.question}</p><h2>{step.title}</h2></div></div>
            <div className="case-delivery"><span>方案交付</span><div>{step.delivery.map(delivery => <span key={delivery}><Check size={13} />{delivery}</span>)}</div></div>
            <div className="case-comparison"><div><span>BEFORE</span><h3>原有工作方式</h3><p>{step.before}</p></div><div><span>AFTER</span><h3>AI 进入业务流程</h3><p>{step.after}</p></div></div>
            <div className="case-transformation"><span>业务改变</span><strong>{step.transformation}</strong><p>{step.outcome}</p></div>
            {step.media && <div className={`case-media-grid${step.media.length > 1 ? ' case-media-pair' : ''}`}>{step.media.map(media => <Media key={media.src} item={media} />)}</div>}
          </section>)}
          <section className="case-results">
            <p className="case-eyebrow">{slug === 'professional-services' ? 'METHOD & QUALITY' : 'OUTCOME & CONTINUITY'}</p>
            <h2>{slug === 'professional-services' ? '专业工作方式与质量机制' : '让业务改变持续发生'}</h2>
            {item.flow && <ol className="case-flow">{item.flow.map((step, i) => <li key={step}><span>0{i + 1}</span>{step}{i < item.flow!.length - 1 && <ArrowRight size={14} />}</li>)}</ol>}
            <div className="case-result-list">{item.results.map(result => <div key={result.title}><Check size={20} /><div><h3>{result.title}</h3><p>{result.text}</p></div></div>)}</div>
          </section>
          <section className="case-evidence">
            <p className="case-eyebrow">EVIDENCE & MATERIALS</p><h2>{slug === 'professional-services' ? '场景研究与应用材料' : '更多业务现场与产品材料'}</h2>
            <div className="case-evidence-grid">{item.evidence.map(media => <Media item={media} key={media.src} />)}</div>
            <p className="case-footnote">{item.note}</p>
          </section>
          <section className="case-closing"><span className="case-eyebrow">YOUR NEXT STEP</span><h2>{item.cta}</h2><p>{item.ctaText}</p><a className="case-button" href={`/#contact`}>预约 30 分钟业务咨询 <ArrowUpRight size={18} /></a><span className="case-response">我们将在 48 小时内与您联系</span></section>
        </div>
        <aside className="case-consult" aria-label="预约业务咨询">
          <div className="case-consult-inner"><div className="case-consult-orbit" aria-hidden="true"><span /><span /><span /></div><p className="case-eyebrow">LET’S TALK BUSINESS</p><h2>您的业务，<br />下一步怎么变？</h2><p>带着一个真实问题开始，<br />找到值得优先投入的 AI 机会。</p><a className="case-button" href="/#contact">预约业务诊断 <ArrowUpRight size={17} /></a><span className="case-consult-time"><Clock3 size={13} />30 分钟 · 聚焦实际业务</span><p className="case-consult-hotline">咨询热线：<a href="tel:+8618926478315">（+86）18926478315</a> 深拥智能</p><div className="case-consult-toc"><span>本页内容</span>{item.steps.map((step, i) => <a key={step.title} href={`#step-${i + 1}`}><span>0{i + 1}</span>{item.scope[i]}<ArrowRight size={12} /></a>)}</div></div>
        </aside>
      </div>
      <section className="case-related"><div><p className="case-eyebrow">MORE POSSIBILITIES</p><h2>看看其他行业，如何开始改变。</h2></div><div className="case-related-grid">{flagshipCases.filter(other => other.slug !== slug).map(other => <a key={other.slug} href={`/cases/${other.slug}`}><span>查看{other.sector}案例<ArrowUpRight size={20} /></span><h3>{other.title}</h3><p>{other.status}</p></a>)}<a href="/cases"><span>探索更多应用场景<ArrowUpRight size={20} /></span><h3>找到与您手上问题相似的 AI 应用案例。</h3><p>按行业、业务问题与方法检索</p></a></div></section>
    </div>
    <footer className="case-footer"><a href="/" className="case-footer-brand" aria-label="深拥智能首页"><BrandLogo id="case-footer-brand"/></a><span>让 AI 真正成为企业生产力</span><a href="/#contact">联系我们 <ArrowUpRight size={14} /></a></footer>
    <div className="case-mobile-book"><span>从一个真实业务问题开始</span><a href="/#contact">预约业务诊断 <ArrowUpRight size={15} /></a></div>
  </main>;
}
