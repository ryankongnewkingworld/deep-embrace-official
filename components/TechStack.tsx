'use client';

import {useId, useState} from 'react';
import {ArrowRight, AudioLines, Bot, ChartNoAxesCombined, Database, Layers, MessagesSquare, Network, Plug, ScanLine, Users, Workflow} from 'lucide-react';
import './tech-architecture.css';

const groups = [
  {name:'客户触达', en:'REACH', desc:'更高效地获取潜在客户与市场关注', icon:Users, items:[
    ['AI内容生产','内容生产','快速生成图文、短视频、脚本与营销素材'],
    ['多渠道内容分发','渠道分发','支持不同平台内容适配与分发协同'],
    ['数字人 / IP表达','数字人 / IP','提升品牌表达效率与持续输出能力'],
    ['线索采集与初筛','线索初筛','自动收集、识别并初步筛选潜在客户'],
  ]},
  {name:'客户服务', en:'SERVE', desc:'更高质量地完成咨询、沟通与服务支持', icon:MessagesSquare, items:[
    ['智能问答与知识助手','知识问答','提升标准问题响应效率与一致性'],
    ['资料识别与整理','资料整理','自动处理文档、表单、票据与资料信息'],
    ['标准流程辅助执行','流程执行','让高频服务流程更稳定、更可复用'],
    ['专业服务支持','专业支持','辅助知识密集型场景的信息处理与交付'],
  ]},
  {name:'客户运营', en:'GROW', desc:'更持续地促进转化、复购与客户长期价值提升', icon:ChartNoAxesCombined, items:[
    ['客户画像与标签','画像标签','形成更清晰的客户认知与分类基础'],
    ['跟进提醒与自动化运营','自动跟进','减少遗漏，提升客户跟进效率'],
    ['客户分层与策略推荐','分层策略','支持差异化触达与精细化运营'],
    ['经营分析与复盘洞察','经营洞察','帮助团队持续优化策略与转化效果'],
  ]},
];

const engines = [
  ['Agent','智能体','围绕目标调用工具，完成多步任务协作',Bot],
  ['Workflow','工作流','将复杂业务组织为稳定、可复用的流程',Workflow],
  ['Knowledge / RAG','企业知识','连接企业知识、资料与案例',Database],
  ['Digital Human','数字人','内容表达、接待讲解与服务交互',AudioLines],
  ['OCR','文档识别','识别图片、扫描件、票据与表单',ScanLine],
  ['RPA','自动化执行','完成跨系统重复操作与流程动作',Layers],
  ['MCP','系统连接','调用外部工具与企业系统能力',Plug],
  ['LLM / 多模态','模型基础','文本、图像与语音的理解及生成',Network],
] as const;

type Selection = {name:string; description:string};

export default function TechStack() {
  const descriptionId = useId();
  const [selection, setSelection] = useState<Selection | null>(null);
  const choose = (name:string, description:string) => setSelection({name, description});

  return <figure className="ta2-diagram" aria-label="客户经营全链路 AI 技术架构">
    <div className="ta2-layer ta2-business-layer">
      <div className="ta2-layer-label"><span>01</span><strong>经营链路</strong><small>BUSINESS</small></div>
      <div className="ta2-business-row">
        {groups.map((group, index) => <div className="ta2-business-cell" key={group.name}>
          <button type="button" className="ta2-business-node" aria-pressed={selection?.name === group.name} aria-describedby={descriptionId}
            onClick={() => choose(group.name, group.desc)} onFocus={() => choose(group.name, group.desc)}>
            <group.icon size={21} strokeWidth={1.3}/><span><small>{group.en}</small><strong>{group.name}</strong></span>
          </button>
          {index < 2 && <ArrowRight size={20} className="ta2-chain-arrow" aria-hidden="true"/>}
        </div>)}
      </div>
    </div>

    <div className="ta2-layer ta2-capability-layer">
      <div className="ta2-layer-label"><span>02</span><strong>场景能力</strong><small>APPLICATION</small></div>
      <div className="ta2-capability-row">
        {groups.map(group => <div className="ta2-capability-group" key={group.name} aria-label={`${group.name}场景能力`}>
          {group.items.map(([name, short, description]) => <button type="button" key={name} aria-label={name} title={name} aria-pressed={selection?.name === name} aria-describedby={descriptionId}
            onClick={() => choose(name, description)} onFocus={() => choose(name, description)}>
            <span className="ta2-full-label">{name}</span><span className="ta2-short-label" aria-hidden="true">{short}</span>
          </button>)}
        </div>)}
      </div>
    </div>

    <div className="ta2-shared-bus" aria-hidden="true"><div><i/><i/><i/></div><span>统一编排 · 按业务场景组合</span></div>

    <div className="ta2-layer ta2-engine-layer">
      <div className="ta2-layer-label"><span>03</span><strong>AI 能力引擎</strong><small>INTELLIGENCE</small></div>
      <div className="ta2-engine-row">
        {engines.map(([name, label, description, Icon]) => <button type="button" key={name} aria-label={`${name} ${label}`} aria-pressed={selection?.name === `${name} · ${label}`} aria-describedby={descriptionId}
          onClick={() => choose(`${name} · ${label}`, description)} onFocus={() => choose(`${name} · ${label}`, description)}>
          <Icon size={20} strokeWidth={1.25}/><strong>{name}</strong><span>{label}</span>
        </button>)}
      </div>
    </div>

    <div className="ta2-layer ta2-foundation-layer">
      <div className="ta2-layer-label"><span>04</span><strong>数据与系统</strong><small>FOUNDATION</small></div>
      <div className="ta2-foundation">
        <p><span>CRM</span><span>ERP</span><span>门店系统</span><span>电商平台</span><span>企业微信</span><span>飞书</span><span>邮件 / 表单 / 内容平台</span></p>
        <div><Database size={13} aria-hidden="true"/><span>系统集成与治理</span><i/><span>业务系统重塑</span><i/><span>企业数据与知识资产</span></div>
      </div>
    </div>

    <figcaption className="ta2-caption" id={descriptionId} aria-live="polite" aria-atomic="true">
      {selection ? <><strong>{selection.name}</strong><span>{selection.description}</span></> : <><strong>从单点智能，到经营系统。</strong><span>点击图中节点，了解每项能力如何进入业务。</span></>}
    </figcaption>
  </figure>;
}
