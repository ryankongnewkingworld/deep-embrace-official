import { ArrowUpRight, ArrowDown } from 'lucide-react';
import type { ReactElement } from 'react';
import './case-overview.css';

function BrandDiagram() {
  return <svg className="cs2-diagram" viewBox="0 0 300 112" role="img" aria-label="业务能力示意：内容与经验进入系统，再复制给不同门店与团队。">
    <defs><linearGradient id="cs2-brand-glow" x1="0" x2="1"><stop stopColor="#4485ff" stopOpacity=".24"/><stop offset="1" stopColor="#4485ff" stopOpacity=".03"/></linearGradient></defs>
    <path d="M61 34H91Q102 34 102 47V56H118M61 78H91Q102 78 102 65V56" fill="none" stroke="#4778c9" strokeWidth="1"/>
    <path d="M176 56H195M195 28V84M195 28H217M195 56H217M195 84H217" fill="none" stroke="#4778c9" strokeWidth="1"/>
    <g fill="#0b2046" stroke="#335a96"><rect x="10" y="19" width="58" height="29" rx="4"/><rect x="10" y="64" width="58" height="29" rx="4"/></g>
    <g fill="#c2d8fa" fontSize="11" textAnchor="middle"><text x="39" y="38">内容模板</text><text x="39" y="83">业务经验</text></g>
    <circle cx="148" cy="56" r="32" fill="url(#cs2-brand-glow)" stroke="#4485ff" strokeOpacity=".35"/>
    <rect x="125" y="33" width="46" height="46" rx="10" fill="#102a56" stroke="#80adfa" strokeWidth="1"/>
    <path d="M138 46H158M138 52H151M138 58H158M138 64H147" stroke="#9bc5ff" strokeWidth="1.4"/>
    <g fill="#98bded" fontSize="10" textAnchor="middle"><text x="148" y="106">系统沉淀</text><text x="253" y="106">组织复制</text></g>
    {[16,44,72].map((y,i)=><g key={y} transform={`translate(220 ${y})`}><path d="M0 8L4 0H24L28 8V11H0Z" fill={i===1?'#234e92':'#112b55'} stroke="#6596e7"/><path d="M3 11V23H25V11M11 23V15H18V23" fill="none" stroke="#6596e7"/><path d="M0 8H28M7 1L6 8M14 1V8M21 1L22 8" stroke="#6596e7"/><circle cx="46" cy="12" r="3" fill={i===1?'#9bc5ff':'#376ab7'}/></g>)}
  </svg>;
}
function LegalDiagram() {
  return <svg className="cs2-diagram" viewBox="0 0 300 112" role="img" aria-label="拟议业务能力示意：案件材料形成事实与时间轴，再辅助类案研究、文书起草与律师复核。">
    <g fill="#0c2144" stroke="#446ca8"><rect x="15" y="25" width="43" height="53" rx="3" transform="rotate(-8 36 51)"/><rect x="22" y="22" width="43" height="53" rx="3"/><rect x="28" y="27" width="43" height="53" rx="3" fill="#132f59"/></g>
    <path d="M38 39H60M38 46H60M38 53H54M38 60H58M38 67H50" stroke="#8ab3ee" strokeWidth="1.1"/>
    <path d="M77 54H100M96 50L100 54L96 58M157 54H181M177 50L181 54L177 58" fill="none" stroke="#4778c9"/>
    <rect x="107" y="15" width="44" height="79" rx="5" fill="#102a54" stroke="#4485ff" strokeOpacity=".65"/>
    <path d="M121 33V77" stroke="#6ba3ff"/><g fill="#a9cfff"><circle cx="121" cy="33" r="3"/><circle cx="121" cy="54" r="3"/><circle cx="121" cy="77" r="3"/></g>
    <path d="M130 31H141M130 36H137M130 52H141M130 57H137M130 75H141M130 80H137" stroke="#6794d4"/>
    <g fill="#10284d" stroke="#335a96"><rect x="190" y="13" width="98" height="25" rx="4"/><rect x="190" y="43" width="98" height="25" rx="4"/><rect x="190" y="73" width="98" height="25" rx="4"/></g>
    <g fill="#b6d3fb" fontSize="11"><text x="204" y="30">类案研究</text><text x="204" y="60">文书初稿</text><text x="204" y="90">律师复核</text></g>
    <path d="M265 24H276M273 21L276 24L273 27M265 54H276M273 51L276 54L273 57M265 85L269 89L277 81" stroke="#8abaff" fill="none"/>
    <g fill="#98bded" fontSize="10" textAnchor="middle"><text x="47" y="105">案件材料</text><text x="129" y="108">事实 / 时间轴</text></g>
  </svg>;
}
function GlobalDiagram() {
  return <svg className="cs2-diagram" viewBox="0 0 300 112" role="img" aria-label="业务能力示意：面向多国家创建 AI 达人，连接内容运营并形成标准化产品。">
    <circle cx="47" cy="52" r="31" fill="#102950" stroke="#5088db"/><ellipse cx="47" cy="52" rx="12" ry="31" fill="none" stroke="#37639f"/><path d="M16 52H78M21 36H73M21 68H73" stroke="#37639f"/>
    <circle cx="27" cy="36" r="3" fill="#a2caff"/><circle cx="59" cy="67" r="3" fill="#a2caff"/><circle cx="63" cy="34" r="3" fill="#a2caff"/>
    <path d="M85 52H106M102 48L106 52L102 56M169 52H191M187 48L191 52L187 56" fill="none" stroke="#4778c9"/>
    <g stroke="#3b6eb5" fill="#102a54"><rect x="112" y="22" width="40" height="58" rx="5" transform="rotate(-9 132 51)"/><rect x="125" y="21" width="40" height="61" rx="5" fill="#173665" stroke="#75a9fa"/></g>
    <circle cx="145" cy="38" r="6" fill="#6e9de5"/><path d="M134 57V53C134 43 156 43 156 53V57" fill="#6e9de5"/><path d="M135 66H155M139 72H151" stroke="#93bdff" strokeWidth="1.2"/>
    <rect x="198" y="23" width="90" height="59" rx="5" fill="#102a54" stroke="#4475bc"/><path d="M198 36H288" stroke="#4475bc"/><circle cx="205" cy="30" r="1.5" fill="#9bc5ff"/><circle cx="211" cy="30" r="1.5" fill="#548cdb"/>
    <rect x="207" y="44" width="20" height="28" rx="2" fill="#1b427a"/><path d="M213 51L221 56L213 61Z" fill="#a7cfff"/><path d="M237 47H278M237 55H269M237 63H278M237 71H260" stroke="#6598e0"/>
    <g fill="#98bded" fontSize="10" textAnchor="middle"><text x="47" y="105">多国家市场</text><text x="143" y="105">AI 达人</text><text x="243" y="105">内容运营 / 产品化</text></g>
  </svg>;
}

type CaseCard = {
  slug: string;
  sector: string;
  status: string;
  headline: string;
  challenge: string;
  changes: { lead: string; text: string }[];
  resultLabel: string;
  results: [string, string][];
  note: string;
  button: string;
  modules?: { name: string; desc: string; tags: string[]; button: string; href: string }[];
  Diagram: () => ReactElement;
};

const cases: CaseCard[] = [
  { slug: 'brand-chain', sector: '品牌连锁', status: '业务实践', headline: '让内容生产摆脱人海战术，实现规模化复制', challenge: '内容生产慢、人力成本高、优秀经验难复制。', changes: [{ lead: '内容自动化', text: 'AI批量生产短视频内容' }, { lead: '经验系统化', text: '沉淀模板、方法与业务知识' }, { lead: '组织重构', text: '重塑策略、运营、研发分工' }], resultLabel: '方案价值', results: [['300人 → 60人', '运营团队规模调整'], ['10–15倍', '单条内容制作效率提升']], note: '团队规模与内容生产效率为客户经营表现，不等同于单一 AI 项目的贡献。', button: '查看完整案例', Diagram: BrandDiagram },
  { slug: 'professional-services', sector: '专业服务', status: '模拟方案', headline: '让专业经验成为可复用的组织生产力', challenge: '材料繁杂、检索费时、专业经验难传承。', changes: [{ lead: '案件整理', text: 'AI整理证据、生成事实时间轴' }, { lead: '法律研究', text: '智能类案检索与文书辅助' }, { lead: '经验沉淀', text: '复用专业方法，分级保护隐私' }], resultLabel: '方案价值', results: [['办案全流程AI协同', '减少重复劳动'], ['专业经验可复用', '提升团队协作能力']], note: '基于律政 AI 先锋计划的拟议方案，非已完成客户交付。', button: '了解AI办案方案', modules: [{ name: '律师办案工作台', desc: '从案卷整理到文书初稿', tags: ['材料整理', '类案研究', '文书起草'], button: '查看法律方案', href: '/cases/professional-services' }, { name: 'VC 投研工作台', desc: '从项目初筛到多维研究', tags: ['项目梳理', '研究分析', '方法复用'], button: '查看投研方案', href: '/cases/vc-research' }], Diagram: LegalDiagram },
  { slug: 'cross-border', sector: '跨境出海', status: '产品实践', headline: '用AI达人，规模化开拓海外内容市场', challenge: '达人招募难、视频成本高、多市场扩张慢。', changes: [{ lead: 'AI达人', text: '批量创建多样化虚拟达人' }, { lead: '本土运营', text: '多语言、多市场内容适配' }, { lead: '自动化增长', text: '短视频批量生产与运营流程化' }], resultLabel: '方案价值', results: [['降低达人依赖', '减少真人拍摄需求'], ['多市场规模复制', '拓展内容运营能力']], note: '成本与自动化效果为对应产品工作流口径，非销售承诺。', button: '探索AI达人方案', Diagram: GlobalDiagram },
];

export default function CaseShowcase() {
  return <div className="cs2-grid" aria-label="三大行业业务案例">
    {cases.map(({ Diagram, ...item }, i) => <article className={`cs2-card cs2-card-${i}`} key={item.slug}>
      <div className="cs2-header"><h3>{item.sector}</h3><span className="cs2-status">{item.status}</span></div>
      {item.modules ? <div className="cs2-hub">
        <h4 className="cs2-value">{item.headline}</h4>
        <div className="cs2-modules">{item.modules.map(m => <div className="cs2-module" key={m.href}><div className="cs2-module-head"><h5>{m.name}</h5><p>{m.desc}</p><div className="cs2-module-tags">{m.tags.map(tag => <span key={tag}>{tag}</span>)}</div></div><a className="cs2-link cs2-module-link" href={m.href}><span>{m.button}</span><ArrowDown size={20} strokeWidth={1.8} /></a></div>)}</div>
      </div> : <>
        <div className="cs2-body">
          <div className="cs2-story">
            <h4 className="cs2-value">{item.headline}</h4>
            <div className="cs2-challenge">
              <p className="cs2-section-label">业务挑战</p>
              <p className="cs2-challenge-text">{item.challenge}</p>
            </div>
            <div className="cs2-changes">
              <p className="cs2-section-label">我们的改造</p>
              {item.changes.map(c => <p className="cs2-change" key={c.lead}><strong>{c.lead}：</strong>{c.text}</p>)}
            </div>
          </div>
          <div className="cs2-side">
            <div className="cs2-results">
              <p className="cs2-section-label">{item.resultLabel}</p>
              <div className="cs2-metrics">{item.results.map(([value, label]) => <div key={label}><strong>{value}</strong><span>{label}</span></div>)}</div>
            </div>
            <div className="cs2-visual"><Diagram /></div>
            <p className="cs2-note">{item.note}</p>
          </div>
        </div>
        <a className="cs2-link" href={`/cases/${item.slug}`}><span>{item.button}</span><ArrowUpRight size={23} strokeWidth={1.7} /></a>
      </>}
    </article>)}
  </div>;
}
