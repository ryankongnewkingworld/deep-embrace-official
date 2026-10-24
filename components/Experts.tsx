'use client';

import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight, BadgeCheck } from 'lucide-react';
import { experts, type Expert, type ExpertSection } from '../data/experts';
import './experts.css';

type Snapshot = {
  context: string;
  facts: { value: string; label: string }[];
  practiceLabel?: string;
  practices: { headline: string; description: string }[];
};

// Editorial summaries only. The full, unabridged source remains in data/experts.ts.
const snapshots: Record<string, Snapshot> = {
  ryan: {
    context: '11年企业变革管理 · 3年AI落地实战',
    facts: [
      { value: '扭亏为盈 · +21%', label: '某新三板企业经营改善成果' },
      { value: '300人 → 60人', label: '相关项目的人员配置优化' },
      { value: 'AI内容提效60倍', label: 'AI自动化流程应用成果' },
    ],
    practices: [
      { headline: '大型企业咨询与变革', description: '曾服务中国平安、越秀、广汽、长隆、达能及省交通集团。' },
      { headline: '流程周期缩短50%', description: '开展修正单流程改善，缩短相关流程周期（PLT）。' },
      { headline: '交付周期缩短40%—50%', description: '通过RFID标签生产线流程改善，缩短相关产品交付周期。' },
    ],
  },
  daiming: {
    context: '13年华为管理变革实践 · 清华大学教育背景',
    facts: [
      { value: '前华为变革经理', label: '2005—2018年任职' },
      { value: '华为流程架构V1.0', label: '参与架构建设与交付' },
      { value: '端到端业务变革', label: '参与MBTIT 3.0变革项目' },
    ],
    practices: [
      { headline: '大型ERP、IFS与海外组织调整', description: '作为PMO参与重大变革项目，开展项目推进与变革管理。' },
      { headline: '流程评价与绩效机制', description: '参与成熟度评估、平衡计分卡及激励、职业发展机制建设。' },
      { headline: '价值驱动的变革管理', description: '将变革目标、具体变化与业务成效联系起来。' },
    ],
  },
  clarence: {
    context: '20余年企业服务经验 · 金融、科技与企业SaaS',
    facts: [
      { value: '前飞书商业化战略负责人', label: '飞书香港区团队一号员工' },
      { value: 'Morgan Stanley', label: '曾任职摩根士丹利、中信里昂及中信证券' },
      { value: '纽约大学MBA', label: '同时拥有计算机硕士背景' },
    ],
    practiceLabel: '专业积累',
    practices: [
      { headline: '企业战略与数字化转型', description: '具备金融与企业科技服务背景。' },
      { headline: '跨境科技市场研究', description: '10余年研究积累，关注前沿科技商业化。' },
      { headline: '企业SaaS商业策略', description: '结合企业服务经验，关注企业数字化转型。' },
    ],
  },
  zhangrenzheng: {
    context: 'AI认证 · 投资经历 · 创新生态',
    facts: [
      { value: '英伟达、Google认证', label: '人工智能专家认证' },
      { value: 'Datawhale FDE100', label: 'FDE100先锋人物' },
      { value: '前资深职业投资人', label: '关注企业AI转型与组织变革' },
    ],
    practiceLabel: '创新生态',
    practices: [
      { headline: 'OPCStudio', description: '主理人。' },
      { headline: 'VibeCoders社区', description: '联合创始人。' },
      { headline: 'Elequant.AI', description: '合伙人。' },
    ],
  },
  neil: {
    context: '8年ToB数字化解决方案经验',
    facts: [
      { value: '前飞书生态大客户售前负责人', label: '企业级解决方案与业务场景诊断' },
      { value: '百万元级项目', label: '主导多个企业数字化项目' },
      { value: '500强客户服务经验', label: '服务多家500强及大型企业' },
    ],
    practices: [
      { headline: '工业数字化转型', description: '曾任工业数字化转型PMO、增长运营负责人。' },
      { headline: '大模型与Agent应用', description: '覆盖业务场景诊断、技术方案设计及应用实践。' },
      { headline: 'WAIC · 百度飞桨', description: 'WAIC分享嘉宾、百度飞桨技术讲师。' },
    ],
  },
  zhangpeiming: {
    context: '12年企业级软件产品经验',
    facts: [
      { value: '企业级产品负责人', label: '浪潮平台开发部经理 / 易搭云产品负责人' },
      { value: '低代码平台从0到1', label: '主导低代码、零代码平台建设' },
      { value: '“AI小伙伴”上线', label: '主导产品规划与上线' },
    ],
    practices: [
      { headline: '企业业务场景应用', description: '推动人力资源、财务、供应链等业务场景应用。' },
      { headline: 'AI与业务数据融合', description: '探索AI智能体与企业业务数据融合。' },
      { headline: 'PMP专业认证', description: '具备项目管理专业人士认证。' },
    ],
  },
  heyi: {
    context: 'AI原生产品架构 · 企业级Agent系统研发',
    facts: [
      { value: 'NVIDIA Inception', label: '所创项目入选2026初创企业支持计划' },
      { value: '北美DayAI核心共建', label: '参与AI Native CRM核心研发' },
      { value: '云梦引擎架构研发', label: '主导企业级Agent系统架构与产品研发' },
    ],
    practices: [
      { headline: '企业知识与管理协同', description: '整合多源信息，构建知识库、任务拆解与执行跟踪能力。' },
      { headline: '工业Agent应用', description: '参与仿真、烧录、自动化测试场景的智能体应用研发。' },
      { headline: '开源与企业AI产品', description: '云崽Bot核心贡献者；参与研发产品受到央视新闻专题关注。' },
    ],
  },
  anthony: {
    context: '7年AI产业经验 · 硬件、数据与算法应用',
    facts: [
      { value: '前NVIDIA硬件架构师', label: '2019—2021年任职' },
      { value: '联合创始人、CTO', label: '前奇绩创坛F24被投企业' },
      { value: '30余家企业合作', label: '合作包括欧莱雅、Nike、中诚信' },
    ],
    practices: [
      { headline: '企业AI与数据治理', description: '曾负责企业AI与数据治理相关技术业务。' },
      { headline: '高质量数据平台', description: '曾任高质量数据集交易平台联合创始人、CTO。' },
      { headline: 'GUI Agent数据服务', description: '相关合作涉及智谱、阶跃星辰等企业。' },
    ],
  },
  hehaizhao: {
    context: 'AI全栈工程 · 工作流与系统集成',
    facts: [
      { value: '211高校AI硕士', label: '人工智能专业硕士' },
      { value: 'ACM区域赛铜牌', label: '算法竞赛区域赛获奖' },
      { value: '100+场AI技术活动', label: '组织与实战培训相关经历' },
    ],
    practices: [
      { headline: 'Lawyer Buddy律师AI助手', description: '参与材料整理、时间轴生成与类案检索的技术方案设计。' },
      { headline: 'Agent / Skill / MCP', description: '具备全栈开发、系统集成及技术问题排查实践。' },
      { headline: '现场技术指导', description: '长期参与黑客松、技术赛事组织及现场指导。' },
    ],
  },
  xuheng: {
    context: 'Agent工程 · AI应用研发与交付',
    facts: [
      { value: '讯飞Astron黑客松冠军', label: '科大讯飞1024赛事冠军' },
      { value: '30+场参赛 · 21场获奖', label: 'AI黑客松实战经历' },
      { value: '讯飞与百度专业认证', label: '荣誉讲师、布道师及双年度认证导师' },
    ],
    practices: [
      { headline: '企业场景AI应用', description: 'IPO材料审核助手、群组活动助手、云梦引擎相关Agent研发。' },
      { headline: 'AI SaaS与智能体', description: '校园心理陪伴AI SaaS、健康顾问智能体、智行助手。' },
      { headline: '自然增长1万+粉丝', description: '运营AI短视频账号，单平台累计播放超过800万。' },
    ],
  },
  arnold: {
    context: '8年硬科技产品化经验',
    facts: [
      { value: '前优必选早期员工', label: '曾任高级产品设计师、产品经理' },
      { value: '机器人从0到1量产', label: '曾主导产品设计与量产推进' },
      { value: '两届央视春晚项目统筹', label: '机器人项目协调与交付' },
    ],
    practiceLabel: '产品与设计荣誉',
    practices: [
      { headline: 'CES产品创新奖', description: '机器人与智能硬件产品实践。' },
      { headline: '省长杯交互金奖', description: '人机交互与产品设计实践。' },
      { headline: 'UXPA行业金奖', description: '智能硬件产品化与复杂项目交付方向。' },
    ],
  },
};

// Short credentials complement the project facts above; all come from the supplied biographies.
const credentials: Record<string, string[]> = {
  ryan: ['Datawhale认证FDE100', '微软／领英／星火／Datawhale四平台AI认证'],
  daiming: ['清华大学教育背景', 'PMP · MCSD专业认证'],
  clarence: ['信息工程学士 · 计算机硕士', '纽约大学MBA'],
  zhangrenzheng: ['英伟达、Google人工智能专家认证', 'Datawhale FDE100先锋人物'],
  neil: ['2.5年大模型与Agent应用研究', 'WAIC分享嘉宾 · 百度飞桨技术讲师'],
  zhangpeiming: ['浪潮平台开发部经理经历', 'PMP项目管理专业人士认证'],
  heyi: ['2022年起参与云崽Bot开源开发', '企业数据资产管理中台建设'],
  anthony: ['前奇绩创坛F24被投企业CTO', 'GUI Agent数据服务实践'],
  hehaizhao: ['211高校人工智能专业硕士', 'ACM算法竞赛区域赛铜牌'],
  xuheng: ['2026 WAIC AI开发者圆桌嘉宾', '百度文心一言2024、2025双年度认证导师'],
  arnold: ['高级产品设计师、产品经理经历', '智能硬件产品化与复杂项目交付'],
};

function SoundIcon({ enabled }: { enabled: boolean }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4V5Z"/>{enabled ? <path d="M15 8a6 6 0 0 1 0 8M18 5a10 10 0 0 1 0 14"/> : <path d="m16 9 6 6m0-6-6 6"/>}</svg>;
}

function Portrait({ expert, navigation = false }: { expert: Expert; navigation?: boolean }) {
  return <figure className={`ex2-portrait ex2-person-${expert.id} ${navigation ? 'ex2-portrait-nav' : ''}`}>
    <span><img src={expert.portrait} alt={navigation ? '' : `${expert.name}肖像`} loading="lazy" draggable={false}/></span>
    {expert.aiProcessed && !navigation && <figcaption>AI处理</figcaption>}
  </figure>;
}

function FullSection({ section, expert }: { section: ExpertSection; expert: Expert }) {
  return <section className={`ex2-full-section ex2-full-${section.kind || 'practice'}`}>
    <h3>{section.label}</h3>
    {section.kind === 'clients' && <p className="ex2-full-context">曾服务以下集团企业，项目涉及战略规划、组织变革、人力资源管理、数字化转型与业务流程优化。</p>}
    <div className="ex2-full-items">{section.items.map(item => <div key={item.headline}><strong>{item.headline}</strong>{item.title && <h4>{item.title}</h4>}{item.description && <p>{item.description}</p>}</div>)}</div>
    {expert.id === 'ryan' && section.kind === 'results' && <p className="ex2-full-note">以上为不同项目中的实践成果，与集团客户名单不作逐项对应。</p>}
  </section>;
}

export default function Experts() {
  const [selectedId, setSelectedId] = useState('ryan');
  const [collapsed, setCollapsed] = useState(false);
  const [sound, setSound] = useState(false);
  const [modalExpert, setModalExpert] = useState<Expert | null>(null);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const audioContext = useRef<AudioContext | null>(null);
  const navRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const groupsRef = useRef<HTMLDivElement | null>(null);
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const openerRef = useRef<HTMLButtonElement | null>(null);
  const expert = experts.find(item => item.id === selectedId)!;
  const snapshot = snapshots[selectedId];
  const expertIndex = experts.findIndex(item => item.id === selectedId);
  const nextExpert = experts[(expertIndex + 1) % experts.length];
  const previousExpert = experts[(expertIndex - 1 + experts.length) % experts.length];

  useEffect(() => () => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    void audioContext.current?.close();
  }, []);

  useEffect(() => {
    const groups = groupsRef.current;
    const activeTab = navRefs.current[selectedId];
    if (!groups || !activeTab || !window.matchMedia('(max-width: 1150px)').matches) return;
    const containerBounds = groups.getBoundingClientRect();
    const tabBounds = activeTab.getBoundingClientRect();
    groups.scrollTo({ left: groups.scrollLeft + tabBounds.left - containerBounds.left - (containerBounds.width - tabBounds.width) / 2, behavior: 'auto' });
  }, [selectedId, collapsed]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!modalExpert || !dialog) return;
    const body = document.body;
    const html = document.documentElement;
    const x = window.scrollX;
    const y = window.scrollY;
    const saved = { bodyOverflow: body.style.overflow, position: body.style.position, top: body.style.top, left: body.style.left, width: body.style.width, paddingRight: body.style.paddingRight, htmlOverflow: html.style.overflow, scrollBehavior: html.style.scrollBehavior };
    const gutter = window.innerWidth - html.clientWidth;
    if (gutter > 0) body.style.paddingRight = `${parseFloat(getComputedStyle(body).paddingRight) + gutter}px`;
    body.style.position = 'fixed';
    body.style.top = `-${y}px`;
    body.style.left = `-${x}px`;
    body.style.width = '100%';
    body.style.overflow = 'hidden';
    html.style.overflow = 'hidden';
    dialog.showModal();
    closeRef.current?.focus({ preventScroll: true });
    return () => {
      if (dialog.open) dialog.close();
      body.style.overflow = saved.bodyOverflow;
      body.style.position = saved.position;
      body.style.top = saved.top;
      body.style.left = saved.left;
      body.style.width = saved.width;
      body.style.paddingRight = saved.paddingRight;
      html.style.overflow = saved.htmlOverflow;
      html.style.scrollBehavior = 'auto';
      window.scrollTo({ left: x, top: y, behavior: 'instant' });
      html.style.scrollBehavior = saved.scrollBehavior;
      openerRef.current?.focus({ preventScroll: true });
    };
  }, [modalExpert]);

  function cancelHover() {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    hoverTimer.current = null;
  }
  function playClick() {
    if (!sound) return;
    try {
      const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = audioContext.current || new AudioContextClass();
      audioContext.current = ctx;
      if (ctx.state === 'suspended') void ctx.resume();
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      oscillator.connect(gain); gain.connect(ctx.destination);
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(660, ctx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + .06);
      gain.gain.setValueAtTime(.0001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(.025, ctx.currentTime + .008);
      gain.gain.exponentialRampToValueAtTime(.0001, ctx.currentTime + .1);
      oscillator.start(); oscillator.stop(ctx.currentTime + .11);
    } catch { /* Optional audio never blocks profile selection. */ }
  }
  function select(id: string, clicked = false) {
    cancelHover();
    setSelectedId(id);
    if (clicked) { playClick(); setCollapsed(true); }
  }
  function handleKeyboard(event: KeyboardEvent<HTMLButtonElement>, current: Expert) {
    if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const currentIndex = experts.findIndex(item => item.id === current.id);
    const index = event.key === 'Home' ? 0 : event.key === 'End' ? experts.length - 1 : (currentIndex + (event.key === 'ArrowRight' ? 1 : -1) + experts.length) % experts.length;
    select(experts[index].id);
    navRefs.current[experts[index].id]?.focus({ preventScroll: true });
  }

  return <div className="ex2-showcase" id="experts">
    <div className={`ex2-selector ${collapsed ? 'is-collapsed' : ''}`}>
      <div className="ex2-selector-groups" ref={groupsRef}>
        {([{ id: 'business', label: 'AI业务变革专家' }, { id: 'technology', label: 'AI技术研发专家' }] as const).map(group => <div className={`ex2-group ex2-group-${group.id}`} key={group.id}>
          <p className="ex2-group-label">{group.label}<span>{experts.filter(item => item.group === group.id).length} 位</span></p>
          <div className="ex2-tabs" role="tablist" aria-label={group.label}>
            {experts.filter(item => item.group === group.id).map(item => <button
              type="button" key={item.id} ref={node => { navRefs.current[item.id] = node; }}
              id={`ex2-tab-${item.id}`} className={`ex2-tab ${selectedId === item.id ? 'is-selected' : ''}`}
              role="tab" aria-selected={selectedId === item.id} aria-controls="ex2-profile" tabIndex={selectedId === item.id ? 0 : -1}
              onClick={() => select(item.id, true)} onKeyDown={event => handleKeyboard(event, item)}
              onPointerEnter={event => { if (event.pointerType === 'mouse') { cancelHover(); hoverTimer.current = setTimeout(() => setSelectedId(item.id), 150); } }}
              onPointerLeave={cancelHover}>
              <Portrait expert={item} navigation/>
              <span className="ex2-tab-name">{item.name}</span><span className="ex2-tab-role">{item.navRole}</span>
            </button>)}
          </div>
        </div>)}
      </div>
      <div className="ex2-selector-controls">
        <button type="button" className="ex2-toggle" onClick={() => { cancelHover(); setCollapsed(!collapsed); }} aria-expanded={!collapsed} aria-label={collapsed ? '展开专家头像导航' : '收起专家头像导航'}>{collapsed ? '展开专家' : '收起头像'}<span aria-hidden="true">{collapsed ? '+' : '−'}</span></button>
        <button type="button" className="ex2-sound" onClick={() => setSound(!sound)} aria-pressed={sound} aria-label={`切换音效，当前${sound ? '开启' : '静音'}`} title={sound ? '关闭切换音效' : '开启切换音效'}><SoundIcon enabled={sound}/></button>
      </div>
    </div>

    <article className="ex2-profile" id="ex2-profile" role="tabpanel" aria-labelledby={`ex2-tab-${expert.id}`} key={expert.id}>
      <header className="ex2-profile-header">
        <div className="ex2-identity"><Portrait expert={expert}/><div><h3>{expert.name}{expert.englishName && <span>{expert.englishName}</span>}</h3><p className="ex2-title">{expert.title}</p><p className="ex2-context">{snapshot.context}</p></div></div>
        <button type="button" className="ex2-resume-button" onClick={event => { cancelHover(); openerRef.current = event.currentTarget; setModalExpert(expert); }} aria-haspopup="dialog">查看完整履历<ArrowUpRight size={19}/></button>
      </header>
      <div className="ex2-key-facts">{snapshot.facts.map(fact => <div key={fact.value}><strong>{fact.value}</strong><p>{fact.label}</p></div>)}</div>
      <section className="ex2-practices"><h4>{snapshot.practiceLabel || '代表实践'}</h4><div>{snapshot.practices.map(practice => <div key={practice.headline}><h5>{practice.headline}</h5><p>{practice.description}</p></div>)}</div></section>
      <div className="ex2-credentials"><BadgeCheck size={17} aria-hidden="true"/><span className="ex2-credentials-label">专业资历</span><div>{credentials[expert.id].map(item => <span key={item}>{item}</span>)}</div></div>
      <footer className="ex2-profile-footer"><div className="ex2-directions"><span>专业方向</span>{expert.directions.map(direction => <span key={direction}>{direction}</span>)}</div>{expert.id === 'ryan' && <span>项目成果与集团名单不作逐项对应</span>}</footer>
    </article>
    <nav className="ex2-browse" aria-label="浏览更多专家">
      <p><span>{String(expertIndex + 1).padStart(2, '0')} <small>/ {experts.length}</small></span>继续认识我们的专家</p>
      <div><button type="button" className="ex2-previous" onClick={() => select(previousExpert.id, true)} aria-label={`上一位专家：${previousExpert.name}`}><ArrowLeft size={17}/><span>上一位</span></button><button type="button" className="ex2-next" onClick={() => select(nextExpert.id, true)} aria-label={`下一位专家：${nextExpert.name}，${nextExpert.navRole}`}><span>下一位 <strong>{nextExpert.name}</strong><small>{nextExpert.navRole}</small></span><ArrowRight size={18}/></button></div>
    </nav>

    <dialog className="ex2-dialog" ref={dialogRef} aria-labelledby="ex2-dialog-title" onClose={() => setModalExpert(null)} onClick={event => {
      if (event.target !== event.currentTarget) return;
      const rect = event.currentTarget.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) event.currentTarget.close();
    }}>
      {modalExpert && <>
        <header className="ex2-dialog-header"><div><p>EXPERT PROFILE</p><h2 id="ex2-dialog-title">{modalExpert.name}<span>完整履历</span></h2></div><button type="button" ref={closeRef} className="ex2-dialog-close" onClick={() => dialogRef.current?.close()} aria-label="关闭完整履历"><span aria-hidden="true">×</span></button></header>
        <div className="ex2-dialog-body">
          <div className="ex2-full-identity"><div><p className="ex2-full-category">{modalExpert.group === 'business' ? 'AI业务变革专家' : 'AI技术研发专家'}</p><h3>{modalExpert.title}</h3>{modalExpert.englishName && <p className="ex2-full-english">{modalExpert.englishName}</p>}</div><Portrait expert={modalExpert}/></div>
          <div className="ex2-full-facts">{modalExpert.facts.map(fact => <div key={fact.headline}><strong>{fact.headline}</strong>{fact.title && <h4>{fact.title}</h4>}{fact.description && <p>{fact.description}</p>}</div>)}</div>
          {modalExpert.introduction && <p className="ex2-full-introduction">{modalExpert.introduction}</p>}
          {modalExpert.sections.map(section => <FullSection key={section.label} expert={modalExpert} section={section}/>)}
          <footer className="ex2-full-directions"><h3>专业方向</h3><div>{modalExpert.directions.map(direction => <span key={direction}>{direction}</span>)}</div></footer>
        </div>
      </>}
    </dialog>
  </div>;
}
