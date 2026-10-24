'use client';

import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { experts, type Expert, type ExpertSection } from '../data/experts';
import './experts.css';

function SoundIcon({ enabled }: { enabled: boolean }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4V5Z"/>{enabled ? <><path d="M15 8a6 6 0 0 1 0 8M18 5a10 10 0 0 1 0 14"/></> : <path d="m16 9 6 6m0-6-6 6"/>}</svg>;
}

function ExpertSectionContent({ section, expert }: { section: ExpertSection; expert: Expert }) {
  return <section className={`ex-detail-section ex-kind-${section.kind || 'practice'}`}>
    <h4><span aria-hidden="true"/>{section.label}</h4>
    {section.kind === 'clients' && <p className="ex-section-context">曾服务以下集团企业，项目涉及战略规划、组织变革、人力资源管理、数字化转型与业务流程优化。</p>}
    <div className="ex-section-items">
      {section.items.map((item, i) => <div className={`ex-item ${section.kind === 'results' && i < 3 ? 'ex-result-primary' : ''}`} key={item.headline}>
        <strong>{item.headline}</strong>
        {item.title && <h5>{item.title}</h5>}
        {item.description && <p>{item.description}</p>}
      </div>)}
    </div>
    {expert.id === 'ryan' && section.kind === 'results' && <p className="ex-note">以上为不同项目中的实践成果，与上方集团客户名单不作逐项对应。</p>}
  </section>;
}

export default function Experts() {
  const [selectedId, setSelectedId] = useState('ryan');
  const [sound, setSound] = useState(false);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const audioContext = useRef<AudioContext | null>(null);
  const navRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const selectorRef = useRef<HTMLDivElement | null>(null);
  const groupsRef = useRef<HTMLDivElement | null>(null);
  const selectionOrigin = useRef<'initial' | 'hover' | 'click' | 'keyboard'>('initial');
  const profileRef = useRef<HTMLElement | null>(null);
  const expert = experts.find(item => item.id === selectedId)!;

  useEffect(() => () => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    audioContext.current?.close();
  }, []);

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const groups = groupsRef.current;
    const activeTab = navRefs.current[selectedId];
    // Move only the mobile portrait strip, including the initial Ryan selection.
    if (window.matchMedia('(max-width: 800px)').matches && groups && activeTab) {
      const containerBounds = groups.getBoundingClientRect();
      const tabBounds = activeTab.getBoundingClientRect();
      groups.scrollTo({
        left: groups.scrollLeft + tabBounds.left - containerBounds.left - (containerBounds.width - tabBounds.width) / 2,
        behavior: selectionOrigin.current === 'initial' || reduceMotion ? 'auto' : 'smooth',
      });
    }
    // Hover previews never move the page. A deliberate selection may bring a
    // profile read halfway down back beneath its persistent portrait navigation.
    if (selectionOrigin.current === 'initial' || selectionOrigin.current === 'hover') return;
    const selector = selectorRef.current;
    const profile = profileRef.current;
    if (!selector || !profile) return;
    const profileTop = profile.getBoundingClientRect().top;
    const selectorBottom = selector.getBoundingClientRect().bottom;
    if (profileTop < selectorBottom - 8) {
      window.scrollBy({ top: profileTop - selectorBottom - 18, behavior: reduceMotion ? 'auto' : 'smooth' });
    }
  }, [selectedId]);

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
      gain.gain.setValueAtTime(0.0001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(.035, ctx.currentTime + .008);
      gain.gain.exponentialRampToValueAtTime(.0001, ctx.currentTime + .1);
      oscillator.start(); oscillator.stop(ctx.currentTime + .11);
    } catch { /* Audio is optional; switching remains fully usable. */ }
  }
  function select(id: string, click = false) {
    cancelHover();
    selectionOrigin.current = click ? 'click' : 'keyboard';
    if (click) playClick();
    setSelectedId(id);
  }
  function handleKeyboard(event: KeyboardEvent<HTMLButtonElement>, current: Expert) {
    if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const currentIndex = experts.findIndex(item => item.id === current.id);
    const index = event.key === 'Home' ? 0 : event.key === 'End' ? experts.length - 1 : (currentIndex + (event.key === 'ArrowRight' ? 1 : -1) + experts.length) % experts.length;
    select(experts[index].id);
    navRefs.current[experts[index].id]?.focus({ preventScroll: true });
  }

  return <div className="experts-showcase" id="experts">
    <div className="ex-section-heading">
      <div><p className="ex-eyebrow">THE PEOPLE BEHIND THE CHANGE</p><h3>把商业理解，带进技术现场。</h3><p>AI业务变革与技术研发专家，共同走进真实业务。</p></div>
      <button type="button" className="ex-sound-toggle" onClick={() => setSound(!sound)} aria-pressed={sound} aria-label={`切换音效，当前${sound ? '开启' : '静音'}`}><SoundIcon enabled={sound}/><span>音效{sound ? '开启' : '关闭'}</span></button>
    </div>

    <div className="ex-selector" ref={selectorRef}>
      <div className="ex-selector-groups" ref={groupsRef}>
        {([{ id: 'business', label: 'AI业务变革专家' }, { id: 'technology', label: 'AI技术研发专家' }] as const).map(group => <div className={`ex-nav-group ex-nav-${group.id}`} key={group.id}>
          <p className="ex-group-label"><span aria-hidden="true"/>{group.label}</p>
          <div className="ex-avatar-list" role="tablist" aria-label={group.label}>
            {experts.filter(item => item.group === group.id).map(item => <button
              type="button" key={item.id} ref={node => { navRefs.current[item.id] = node; }}
              id={`expert-tab-${item.id}`} className={`ex-avatar-tab ex-person-${item.id} ${selectedId === item.id ? 'is-selected' : ''}`}
              role="tab" aria-selected={selectedId === item.id} aria-controls="expert-profile"
              onClick={() => select(item.id, true)} onKeyDown={event => handleKeyboard(event, item)}
              onPointerEnter={event => { if (event.pointerType === 'mouse') { cancelHover(); hoverTimer.current = setTimeout(() => { selectionOrigin.current = 'hover'; setSelectedId(item.id); }, 150); } }}
              onPointerLeave={cancelHover}>
              <span className="ex-avatar-frame"><img src={item.portrait} alt="" loading="lazy" draggable={false} /></span>
              <span className="ex-nav-name">{item.name}</span><span className="ex-nav-role">{item.navRole}</span>
            </button>)}
          </div>
        </div>)}
      </div>
      <div className="ex-selector-footer"><span>选择专家，了解其代表实践</span><span className="ex-stage-indicators" aria-label={`第${expert.stage}组，共7组`}>{Array.from({ length: 7 }, (_, index) => <i className={expert.stage === index + 1 ? 'active' : ''} key={index}/>)}</span><span>{String(experts.findIndex(item => item.id === selectedId) + 1).padStart(2, '0')} / 11</span></div>
    </div>

    <div className={`ex-content-stage ex-width-${expert.width} ex-side-${expert.side || 'full'}`}>
      {expert.width === 'half' && <div className="ex-stage-atmosphere" aria-hidden="true"><div className="ex-orbit ex-orbit-one"/><div className="ex-orbit ex-orbit-two"/><span className="ex-stage-number">0{expert.stage}</span><span className="ex-stage-caption">DEEP EMBRACE<br/>{expert.group === 'business' ? 'BUSINESS TRANSFORMATION' : 'AI ENGINEERING'}</span></div>}
      <article className="ex-profile" ref={profileRef} id="expert-profile" role="tabpanel" aria-labelledby={`expert-tab-${expert.id}`} key={expert.id}>
        <header className="ex-profile-header">
          <div className="ex-identity"><p className="ex-profile-category">{expert.group === 'business' ? 'AI业务变革专家' : 'AI技术研发专家'}</p><h3>{expert.name}{expert.englishName && <span>{expert.englishName}</span>}</h3><p className="ex-profile-title">{expert.title}</p></div>
          <figure className={`ex-profile-photo ex-person-${expert.id} ${['daiming','clarence','zhangrenzheng'].includes(expert.id) ? 'ex-photo-compact' : ''}`}><span className="ex-profile-image"><img src={expert.portrait} alt={`${expert.name}肖像`} loading="lazy" draggable={false}/></span>{expert.aiProcessed && <figcaption>AI处理</figcaption>}</figure>
        </header>
        <div className="ex-leading-facts">{expert.facts.map(fact => <div key={fact.headline}><strong>{fact.headline}</strong>{fact.title && <h5>{fact.title}</h5>}{fact.description && <p>{fact.description}</p>}</div>)}</div>
        {expert.introduction && <p className="ex-introduction">{expert.introduction}</p>}
        <div className="ex-profile-sections">{expert.sections.map(section => <ExpertSectionContent key={section.label} expert={expert} section={section}/>)}</div>
        <footer className="ex-directions"><h4>专业方向</h4><div>{expert.directions.map(direction => <span key={direction}>{direction}</span>)}</div></footer>
      </article>
    </div>
  </div>;
}
