export type CaseMetric = { value: string; label: string; detail?: string };
export type CaseMedia = { src: string; title: string; caption: string; type: 'video' | 'image'; portrait?: boolean };
export type CaseStep = {
  question: string; title: string; delivery: string[]; before: string; after: string;
  transformation: string; outcome: string; media?: CaseMedia[];
};
export type FlagshipCase = {
  slug: string; sector: string; eyebrow: string; title: string; summary: string; customer: string;
  scope: string[]; status: string; metrics: CaseMetric[]; steps: CaseStep[];
  results: { title: string; text: string }[]; evidence: CaseMedia[];
  note: string; cta: string; ctaText: string; flow?: string[];
};
const video = (name: string, title: string, caption: string, portrait = false): CaseMedia => ({ src: `/media/cases/${name}.mp4`, title, caption, type: 'video', portrait });
const picture = (name: string, title: string, caption: string): CaseMedia => ({ src: `/media/cases/${name}.jpg`, title, caption, type: 'image' });

export const flagshipCases: FlagshipCase[] = [
  {
    slug: 'brand-chain', sector: '品牌连锁', eyebrow: 'CONTENT × PEOPLE × ORGANIZATION',
    title: '把获客经验，变成企业可复制的 AI 增长能力',
    summary: '从内容生产、员工 IP 到组织落地，把个人会做的事，变成团队可以持续运转的能力。',
    customer: '某全国连锁服务集团', scope: ['内容生产', '员工 IP', '组织落地'], status: '业务实践',
    metrics: [
      { value: '10–15×', label: '图文音乐视频生产效率', detail: '对应工作流：20–30 分钟 → 2 分钟／条' },
      { value: '< ¥10', label: '口播视频单条制作成本', detail: '由约 2,400 元降至 10 元以下' },
      { value: '38 → 88', label: '客户门店一年内规模变化', detail: '客户经营表现，不等同于单一 AI 项目的贡献' },
    ],
    steps: [
      {
        question: '流量不足，内容制作慢，人力成本高？',
        title: '搭建 AI 内容生产线，让内容批量生产。',
        delivery: ['内容模板库', '素材文案库', '自动视频制作系统'],
        before: '人工找图、处理素材、写文案、配音乐、做剪辑。',
        after: '选择模板、填写信息，系统自动组合并生成视频。',
        transformation: '20–30 分钟 → 2 分钟／条',
        outcome: '图文音乐视频生产效率达到原来的约 10–15 倍。',
        media: [video('brand-production', '内容自动生产演示', '视频展示“2 秒一条”的批量生成环节；完整单条工作流的优化口径为约 2 分钟，二者统计范围不同。')],
      },
      {
        question: '员工不会做账号、不会做 IP、不敢出镜？',
        title: '搭建 AI 员工 IP 孵化流程，把业务专长变成获客内容。',
        delivery: ['个人定位', '选题文案', '授权数字分身', '剪辑模板'],
        before: '自己摸索定位，反复拍摄，协调摄影与剪辑。',
        after: '按员工特点匹配内容，数字人口播，模板自动成片。',
        transformation: '半天至一天 → 5 分钟／条',
        outcome: '口播视频制作成本：约 2,400 元 → 10 元以下／条。',
        media: [
          video('brand-ip-1', '红娘 IP · 数字人表达 01', '授权数字分身与业务内容结合，让员工的专业经验持续表达。', true),
          video('brand-ip-2', '红娘 IP · 数字人表达 02', '从个人定位、选题文案到模板成片，形成可复用的内容流程。', true),
        ],
      },
      {
        question: '少数人会做，其他人学不会，公司怎么复制？',
        title: '把高手经验做进系统，让团队有方法、有工具、有分工。',
        delivery: ['经验模板化', '操作系统化', '岗位分工', '实战培训'],
        before: '方法在个人脑中，执行靠经验，新人靠人带。',
        after: '策略团队研究方法，系统固化步骤，运营团队照流程执行。',
        transformation: '6 人试点 → 客户团队与创客全员使用',
        outcome: '从个人会做，走向组织持续运转。',
        media: [picture('brand-system', '把经验沉淀为系统，把系统赋能给组织', '方法、工具与岗位协同，让能力在组织中留下来。')],
      },
    ],
    results: [
      { title: '门店一年内从 38 家增至 88 家', text: '客户通过珍心、拍拖、红娘驾到等多品牌服务不同客群。门店规模是客户整体经营表现。' },
      { title: '关联公司再次签约', text: '持续合作进一步扩展至 AI 门店督导与销售辅助。' },
    ],
    evidence: [
      picture('brand-results-1', '创客业务反馈 01', '来自项目提供的创客业绩材料，具体结果对应各自经营场景。'),
      picture('brand-results-2', '创客业务反馈 02', '查看业务应用后的反馈与经营记录。'),
      picture('brand-stores', '多品牌服务不同客群', '珍心 ／ 拍拖 ／ 红娘驾到 · 客户门店规模从 38 家发展至 88 家。'),
      picture('brand-templates', '把爆款内容沉淀为模板', '将被验证的内容方法转化为团队可复用的模板资产。'),
    ],
    note: '门店规模为客户经营表现；制作时间与成本为对应工作流的优化成果，不构成对其他项目的效果承诺。',
    cta: '带着一个最影响业绩的问题，和我们聊聊。', ctaText: '从一个获客或运营场景开始，找到值得优先改造的 AI 应用机会。',
  },
  {
    slug: 'professional-services', sector: '专业服务', eyebrow: 'KNOWLEDGE × WORKFLOW × QUALITY',
    title: '把律师办案全流程做成 AI 工作台，让专业团队接得住更多业务',
    summary: '贯通材料整理、事实与争点分析、类案研究和文书起草，让专业经验成为可以复用的工作方式。',
    customer: '某专业法律服务团队｜诉讼与争议解决业务',
    scope: ['案件资料智能整理', '类案检索与研判', '法律文书自动化'], status: '模拟 FDE 方案',
    metrics: [
      { value: '材料 → 事实库', label: '从零散案卷到结构化底稿', detail: '拟议工作方式变化' },
      { value: '有出处 · 可核验', label: '类案研究与法律依据', detail: '关键结果由律师核验' },
      { value: '经验 → 工作流', label: '可复用的专业交付方式', detail: '专业判断与责任保留在人' },
    ],
    steps: [
      {
        question: '案件材料越来越多，律师的时间都花在整理资料上？',
        title: '搭建 AI 案件工作台，让零散材料自动形成结构清晰、证据可追溯的案件底稿。',
        delivery: ['智能材料识别', '证据目录与时间轴', '案件事实库'],
        before: '人工阅读案卷、提取事实、整理证据，反复翻找文件核对信息。',
        after: '上传材料，AI 识别、分类并建立证据关联，自动生成案件时间轴、事实摘要与争议焦点，律师集中核验。',
        transformation: '零散案卷 → 结构化案件事实库', outcome: '把重复的信息整理，转化为可追溯、可核验的案件基础。',
        media: [video('legal-materials', '002 · 案件材料整理演示', '查看材料上传、识别与结构化整理的工作方式。')],
      },
      {
        question: '类案检索依赖个人经验，专业研究如何做得又快又准？',
        title: '建立 AI 法律检索工作流，让律师从海量判决中快速找到值得研究的相似案例。',
        delivery: ['争议焦点分析', '法律数据库检索工作流', '类案对比报告'],
        before: '手动输入关键词，逐篇阅读判决，整理法律依据与裁判观点。',
        after: '确认争议焦点，AI 通过授权数据库检索，或批量分析已取得的判决，筛选相似案例、提炼裁判逻辑，律师核验原文。',
        transformation: '逐篇查找 → 有出处、可核验的类案研究报告', outcome: '检索结果需要对应真实判例来源，并由律师核验其适用性。',
        media: [video('legal-research', '005 · 类案检索演示', '从争议焦点出发，查看检索与研究辅助流程。')],
      },
      {
        question: '文书靠资深律师反复修改，团队扩大后如何保证交付质量？',
        title: '把优秀律师的办案方法固化进 AI 工作流，让专业经验成为团队可以复用的能力。',
        delivery: ['法律文书模板库', '专属 AI Skill', '审校与安全工作流'],
        before: '从头起草文书、重复核对材料，质量依赖个人经验，新人需要资深律师反复指导。',
        after: 'AI 调用已核验的案件事实与法律依据生成初稿，按规则检查遗漏和矛盾，律师审核定稿；敏感信息按权限脱敏处理。',
        transformation: '个人经验 → 标准化、可复用的专业交付流程', outcome: 'AI 辅助专业判断，律师保留审核、定稿和责任。',
        media: [video('legal-drafting', '003 · 法律文书起草演示', '查看基于案件材料的文书初稿生成与后续审校流程。')],
      },
    ],
    flow: ['案件材料整理', '事实与争点分析', '类案检索', '文书初稿', '律师审核'],
    results: [
      { title: '一条贯穿办案过程的 AI 工作流', text: '从三个独立工具，走向一套可持续复用的专业工作方式。' },
      { title: '律政 AI 先锋计划的场景积累', text: '围绕律师资料整理、法律检索、文书处理、AI 保密与专业工作流开展场景研究及应用方案设计。' },
      { title: '安全与质量机制', text: '方案设计包含敏感信息本地脱敏、检索来源可核验、关键结果人工复核，确保 AI 辅助专业判断，而非替代责任主体。' },
    ],
    evidence: [
      picture('legal-evidence-2', '律政 AI 先锋计划 · 场景分享', '围绕法律服务的真实业务问题，开展 AI 应用研究与交流。'),
      picture('legal-evidence-3', '业务场景研讨', '工作坊讨论与场景共创，梳理专业团队的重复劳动与工作流。'),
      picture('legal-evidence-4', '专业工作流与 AI 保密', '技术讲解与实操交流，关注专业应用中的信息处理与保密流程。'),
      picture('legal-evidence-5', '小组实战与应用探索', '律政 AI 先锋计划工作坊现场；场景活动不等同于客户项目交付成果。'),
    ],
    note: '本页为基于「深拥智能·律政 AI 先锋计划」设计的模拟 FDE 项目，展示拟议解决方案及预期工作方式变化，不代表已经完成的客户交付或经验证的经营成果。',
    cta: '您的专业团队，是否也被重复劳动困住了？',
    ctaText: '律师事务所、财税机构、咨询公司及其他专业服务企业，都可以从一条最耗人力、最影响交付的真实业务流程开始。',
  },
  {
    slug: 'cross-border', sector: '跨境出海', eyebrow: 'AI CREATORS × OPERATIONS × PRODUCT',
    title: '从人工运营 TikTok，到打造可规模复制的 AI 达人业务',
    summary: '从达人创建、选品、视频制作到账号运营，把内部效率工具升级为可对外销售的标准化业务。',
    customer: '某跨境电商科技服务企业｜TikTok 内容营销与带货运营',
    scope: ['AI 达人矩阵', '自动化带货运营', '商业产品化'], status: '产品工作流实践',
    metrics: [
      { value: '5–10 分钟', label: '演示视频单条生成用时', detail: '对应产品演示工作流' },
      { value: '多国家 · 多账号', label: 'AI 达人矩阵与运营管理', detail: '降低对人工招募与制作的依赖' },
      { value: '服务 → 产品', label: '标准化业务能力对外提供', detail: '从内部效率工具走向产品化' },
    ],
    steps: [
      {
        question: '做海外市场，必须招募当地达人、组建本土团队？',
        title: '搭建 AI 达人系统，让企业能够批量创建具有本土特色的虚拟带货达人。',
        delivery: ['AI 人设生成引擎', '本土化知识体系', '多国家达人账号管理'],
        before: '寻找本土达人、沟通合作、协调内容制作，依赖外部人员执行。',
        after: '选择国家、年龄、品类等条件，AI 自动建立达人形象、人设背景和本土化内容能力。',
        transformation: '人工招募与管理 → 批量创建 AI 达人', outcome: '让企业以更低的人力依赖，拓展不同国家的内容营销。',
        media: [
          video('cross-influencer-1', 'AI 达人视频案例 01', '纯 AI 制作，无需真人参与拍摄。', true),
          video('cross-influencer-2', '产品场景短视频 · 纯 AI 制作', 'AI 生成的产品展示场景，无需真人参与拍摄。', true),
        ],
      },
      {
        question: '选品、拍视频、发内容都靠人，规模怎么扩大？',
        title: '打造 AI 带货运营工作流，让选品、视频制作与账号运营自动协同。',
        delivery: ['商品数据分析', '爆款视频生成', '自动发布与效果复盘'],
        before: '人工查数据、找爆款、写脚本、做视频、安排发布、整理数据。',
        after: 'AI 辅助筛选商品、拆解爆款，结合达人身份生成视频，定时发布并分析表现。',
        transformation: '多岗位、多工具协作 → 一套系统集中执行', outcome: '演示视频生成约 5–10 分钟／条。',
        media: [video('cross-system', 'AI 达人运营系统 · 产品演示', '了解选品、视频制作与运营管理如何在一套系统内协同。')],
      },
      {
        question: 'AI 帮自己省钱之后，能不能变成一门新生意？',
        title: '将 AI 达人运营能力封装成标准化产品，让经营经验可以对外销售。',
        delivery: ['标准化业务流程', '多 Agent 运营系统', '商业化产品方案'],
        before: '提供内容制作或代运营服务，新增客户通常需要投入更多人员。',
        after: '将 AI 达人创建、选品、内容生产和运营管理整合到系统，客户可以按流程使用。',
        transformation: '交付人工服务 → 交付可复制的 AI 产品', outcome: '从内部效率工具，升级为对外销售的标准化业务。',
      },
    ],
    flow: ['AI 达人创建', '智能选品', '视频生成', '自动发布', '数据分析'],
    results: [
      { title: '经营模式改变', text: '建立集 AI 达人创建、智能选品、视频生成、自动发布与数据分析于一体的运营系统，降低多账号、多国家运营对人工的依赖。' },
      { title: '商业价值升级', text: '将内部 AI 运营能力进一步产品化，形成能够向跨境卖家、品牌方和服务商提供的商业产品。' },
    ],
    evidence: [
      picture('cross-platform', '平台使用情况', '项目提供的平台使用材料；平台整体数据与本案例客户业绩分别理解。'),
      picture('cross-sales', '平台用户销售记录', '达人账号 28 天 GMV 展示：$36,508.75。GMV 是商品交易总额，不是净利润；对应特定账号与时段，不代表所有用户的经营结果。'),
      picture('cross-pricing', '产品账户与商业化方案', '项目提供的产品价格资料，仅用于说明产品化形态；具体服务以实际约定为准。'),
    ],
    note: '以上为产品工作流与产品化成果描述；具体节省人力、客户销售额及 GMV 增长，需以项目实际运营与销售数据为准。',
    cta: '您的企业，是否也有一套值得被 AI 重构的业务？',
    ctaText: '让 AI 不只是替员工完成任务，更成为企业可以持续运营、规模复制的新生产力。把经验变成系统，把系统变成商业竞争力。',
  },
];
