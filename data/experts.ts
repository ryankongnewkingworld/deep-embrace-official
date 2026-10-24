export type ExpertItem = { headline: string; title?: string; description?: string };
export type ExpertSection = { label: string; kind?: 'results' | 'clients' | 'credentials'; items: ExpertItem[] };
export type Expert = {
  id: string; name: string; englishName?: string; navRole: string; title: string;
  group: 'business' | 'technology'; stage: number; width: 'full' | 'half'; side?: 'left' | 'right';
  portrait: string; aiProcessed?: boolean; facts: ExpertItem[]; introduction?: string;
  sections: ExpertSection[]; directions: string[];
};

export const experts: Expert[] = [
  {
    id: 'neil', name: '蓝祖聪', englishName: 'Neil', navRole: 'AI解决方案', title: '企业AI转型与解决方案专家',
    group: 'business', stage: 1, width: 'half', side: 'left', portrait: '/media/experts/neil.jpg',
    facts: [
      { headline: '前飞书生态大客户解决方案售前负责人' },
      { headline: '百万元级项目', title: '500强客户服务经验', description: '主导多个百万元级企业数字化项目，服务多家500强及大型企业客户。' },
    ],
    sections: [{ label: '实践与行业交流', items: [
      { headline: '8年ToB数字化解决方案经验', description: '曾任工业数字化转型PMO、增长运营负责人。' },
      { headline: '大模型与Agent应用实践', description: '拥有2.5年相关研究经验，覆盖业务场景诊断、技术方案设计及应用实践。' },
      { headline: 'WAIC分享嘉宾 · 百度飞桨技术讲师' },
    ] }],
    directions: ['企业AI场景诊断', '解决方案设计', '数字化项目推进', '大模型与Agent应用'],
  },
  {
    id: 'zhangpeiming', name: '张培铭', navRole: 'AI产品化', title: '企业AI产品化与应用落地专家',
    group: 'business', stage: 1, width: 'half', side: 'right', portrait: '/media/experts/zhangpeiming.jpg',
    facts: [
      { headline: '12年企业级软件产品经验', description: '曾任浪潮平台开发部经理、云生集团易搭云产品负责人。' },
      { headline: '低代码、零代码平台从0到1', description: '主导平台建设，推动人力资源、财务、供应链等企业业务场景应用。' },
    ],
    sections: [{ label: '代表实践与认证', items: [
      { headline: '“AI小伙伴”产品规划与上线', description: '主导产品规划与上线，探索AI智能体与企业业务数据融合。' },
      { headline: 'PMP项目管理专业人士认证' },
    ] }],
    directions: ['AI产品规划', '业务需求拆解', '低代码平台', '项目协同与产品迭代'],
  },
  {
    id: 'clarence', name: 'Clarence', navRole: '企业战略', title: '企业战略与数字化转型顾问',
    group: 'business', stage: 2, width: 'half', side: 'left', portrait: '/media/experts/clarence.jpg',
    facts: [
      { headline: '前字节跳动飞书商业化战略负责人', description: '飞书香港区团队一号员工。' },
      { headline: 'Morgan Stanley / 中信里昂 / 中信证券', description: '曾任职上述金融机构，具备金融与企业科技服务背景。' },
      { headline: '纽约大学MBA＋计算机硕士', description: '拥有信息工程学士、计算机硕士及纽约大学MBA背景。' },
    ],
    sections: [{ label: '专业积累', items: [
      { headline: '20余年企业服务经验', description: '横跨金融、科技及企业SaaS行业。' },
      { headline: '10余年跨境科技市场研究', description: '关注前沿科技商业化与企业数字化转型。' },
    ] }],
    directions: ['企业战略', '数字化转型', '企业SaaS商业策略', '科技市场研究'],
  },
  {
    id: 'zhangrenzheng', name: '张仁政', navRole: 'AI组织变革', title: '企业AI转型与组织变革专家',
    group: 'business', stage: 2, width: 'half', side: 'right', portrait: '/media/experts/zhangrenzheng.jpg',
    facts: [
      { headline: '英伟达、Google认证人工智能专家' },
      { headline: 'Datawhale FDE100先锋人物' },
      { headline: '前资深职业投资人' },
    ],
    sections: [{ label: '创新生态', items: [
      { headline: 'OPCStudio主理人' },
      { headline: 'VibeCoders社区联合创始人' },
      { headline: 'Elequant.AI合伙人' },
    ] }],
    directions: ['企业AI转型', '组织变革', 'AI原生工作方式', '创新生态'],
  },
  {
    id: 'daiming', name: '戴铭', navRole: '组织与流程变革', title: '前华为变革经理｜组织与流程变革专家',
    group: 'business', stage: 3, width: 'full', portrait: '/media/experts/daiming.jpg', aiProcessed: true,
    facts: [
      { headline: '13年华为管理变革实践', description: '2005—2018年任华为变革经理。' },
      { headline: '清华大学教育背景', description: '具备PMP、MCSD专业认证。' },
      { headline: '30余年跨领域经历', description: '覆盖工程管理、软件技术、企业CTO、管理咨询与组织变革。' },
    ],
    sections: [{ label: '代表实践', items: [
      { headline: '华为流程架构V1.0', description: '参与流程架构建设与交付，推动业务流程及管理体系建设。' },
      { headline: 'MBTIT 3.0端到端变革', description: '参与流程、IT、数据与组织机制协同，推进端到端业务变革。' },
      { headline: '大型ERP、IFS与海外组织调整', description: '作为PMO参与重大变革项目，开展项目推进与变革管理。' },
      { headline: '流程评价与绩效机制', description: '参与流程Metrics方法、成熟度评估、平衡计分卡，以及绩效、激励和职业发展机制建设。' },
      { headline: '价值驱动与变革可视化', description: '参与推动以业务价值为导向的管理变革，将变革目标、具体变化与业务成效联系起来。' },
    ] }],
    directions: ['组织变革', '端到端流程', '管理机制设计', '业务与IT协同'],
  },
  {
    id: 'ryan', name: '瑞恩', englishName: 'Ryan KONG', navRole: 'AI经营改善', title: '企业AI转型与经营改善专家',
    group: 'business', stage: 4, width: 'full', portrait: '/media/experts/ryan.jpg',
    facts: [
      { headline: '11年企业变革管理经验' },
      { headline: '3年企业AI落地实战' },
      { headline: '国内前三管理咨询公司任职经历' },
    ],
    introduction: '曾负责战略规划、组织变革、人力资源、数字化转型、流程优化等模块项目，具备从企业管理变革到AI应用落地的实践经验。',
    sections: [
      { label: '大型企业咨询与变革经验', kind: 'clients', items: [
        { headline: '中国平安' }, { headline: '越秀集团' }, { headline: '广汽集团' },
        { headline: '长隆集团' }, { headline: '达能集团' }, { headline: '省交通集团' },
      ] },
      { label: '代表项目与业务成果', kind: 'results', items: [
        { headline: '扭亏为盈 · +21%', title: '企业经营改善', description: '曾帮助某新三板企业扭转连续负增长，实现扭亏为盈及正向增长21%。' },
        { headline: '300人 → 60人', title: '组织与人员配置优化', description: '相关项目中，人员配置由300人调整至60人。' },
        { headline: 'AI提效60倍', title: 'AI自动化流程应用', description: '通过AI自动化流程，在一个月内将内容生产效率提升60倍。' },
        { headline: '流程周期缩短50%', title: '业务流程改善', description: '开展修正单流程改善，相关流程周期（PLT）缩短50%。' },
        { headline: '交付周期缩短40%—50%', title: 'RFID标签生产流程改善', description: '通过RFID标签生产线流程改善，缩短相关产品交付周期。' },
      ] },
      { label: 'AI专业认证与行业交流', kind: 'credentials', items: [
        { headline: 'Datawhale认证FDE100', description: '国内前100位获认证的企业AI落地专家。' },
        { headline: '微软／领英／星火／Datawhale', description: '四平台人工智能专业认证。' },
        { headline: '腾讯数字生态大会／火山引擎', description: '受邀讲师及分享嘉宾。' },
      ] },
      { label: '管理类专业认证', kind: 'credentials', items: [
        { headline: 'NPDP国际产品经理认证' }, { headline: 'CLMP精益管理专业人士认证' },
        { headline: '人力资源管理师' }, { headline: '人社局认证HRBP' }, { headline: '国家中级经济师' },
      ] },
    ],
    directions: ['战略规划', '组织变革', '人力资源管理', '数字化转型', '业务流程优化'],
  },
  {
    id: 'heyi', name: '何奕', navRole: '企业Agent系统', title: 'AI Native产品架构专家｜企业级Agent系统研发专家',
    group: 'technology', stage: 5, width: 'full', portrait: '/media/experts/heyi.jpg',
    facts: [
      { headline: 'NVIDIA Inception 2026', description: '所创项目入选NVIDIA初创企业支持计划。' },
      { headline: '北美DayAI核心产品共建者', description: '参与AI Native CRM核心产品研发。' },
      { headline: '云崽Bot开源社区核心贡献者', description: '自2022年起参与开源开发与社区运营。' },
    ],
    sections: [
      { label: '代表项目', items: [
        { headline: '云梦引擎｜企业级Agent系统架构', description: '主导系统架构与产品研发，整合飞书、微信及研发记录等多源信息，构建企业知识库、组织画像、任务拆解、执行跟踪与管理协同能力。' },
        { headline: 'DayAI｜AI原生CRM', description: '参与北美核心产品共建，探索大模型与客户关系管理系统的融合。' },
        { headline: '工业Agent｜仿真、烧录、自动化测试', description: '参与相关智能体应用研发，探索AI工作流与工业生产、测试流程集成。' },
        { headline: '企业数据管理与研发协作', description: '参与企业数据资产管理中台建设；建设覆盖需求拆解、开发Skill、动态SOP和智能答疑的开发者协作工具。' },
      ] },
      { label: '行业关注', items: [
        { headline: '企业AI产品受到央视新闻专题关注', description: '参与研发的云梦智联企业AI协同产品受到央视新闻OPC创业专题关注。' },
      ] },
    ],
    directions: ['Agent系统架构', 'AI原生CRM/ERP', '企业知识管理', '工业Agent', '多智能体协同'],
  },
  {
    id: 'anthony', name: '范昊迪', englishName: 'Anthony', navRole: 'AI架构与数据', title: '企业AI架构与数据智能技术专家',
    group: 'technology', stage: 6, width: 'half', side: 'left', portrait: '/media/experts/anthony.jpg',
    facts: [
      { headline: '前NVIDIA硬件架构师', description: '2019—2021年任职。' },
      { headline: '前奇绩创坛F24被投企业联合创始人、CTO' },
      { headline: '30余家企业合作', title: '欧莱雅 · Nike · 中诚信', description: '曾负责企业AI与数据治理相关技术业务，合作企业包括上述机构。' },
    ],
    sections: [{ label: '技术实践', items: [
      { headline: '7年AI产业经验', description: '覆盖硬件、数据与算法应用。' },
      { headline: '高质量数据平台与GUI Agent', description: '曾任高质量数据集交易平台联合创始人、CTO，开展GUI Agent数据服务，相关合作涉及智谱、阶跃星辰等企业。' },
    ] }],
    directions: ['AI系统架构', '数据治理', '数据基础设施', 'GUI Agent', '企业系统集成'],
  },
  {
    id: 'hehaizhao', name: '何海钊', navRole: 'AI全栈开发', title: 'AI Agent与全栈开发实战专家',
    group: 'technology', stage: 6, width: 'half', side: 'right', portrait: '/media/experts/hehaizhao.jpg',
    facts: [
      { headline: '211高校人工智能专业硕士' },
      { headline: 'ACM算法竞赛区域赛铜牌' },
      { headline: '100+场AI技术活动组织与实战培训', description: '长期参与黑客松、技术赛事组织及现场指导。' },
    ],
    sections: [{ label: '技术实践', items: [
      { headline: 'Agent / Skill / MCP / 自动化工作流', description: '具备AI全栈开发、系统集成与技术问题排查实践。' },
      { headline: 'Lawyer Buddy律师AI助手', description: '参与技术方案设计，探索案件材料整理、时间轴生成与类案检索等应用。' },
    ] }],
    directions: ['Agent开发', 'AI全栈工程', '工作流与系统集成', '现场技术指导'],
  },
  {
    id: 'xuheng', name: '许恒', navRole: 'Agent工程', title: 'AI Agent工程专家｜AI应用研发与交付专家',
    group: 'technology', stage: 7, width: 'half', side: 'left', portrait: '/media/experts/xuheng.jpg',
    facts: [
      { headline: '科大讯飞1024 Astron黑客松冠军' },
      { headline: '30+场AI黑客松 · 21场获奖', description: '累计赛事奖金近10万元。' },
      { headline: '讯飞与百度专业认证', description: '科大讯飞AI大学堂认证荣誉讲师、布道师；2024、2025连续两年百度文心一言认证导师。' },
    ],
    sections: [
      { label: '其他代表荣誉', kind: 'credentials', items: [
        { headline: '讯飞星辰智能体开发大赛二等奖' },
        { headline: 'Google DevFest科大讯飞赛道前三' },
        { headline: 'AIGC开发者大赛“AI创作力奖”' },
        { headline: 'Soul AI Agent大赛百强' },
      ] },
      { label: '技术交流', items: [
        { headline: '2026 WAIC AI开发者圆桌嘉宾', description: '同时担任科大讯飞开发者TALK分享嘉宾，分享Agent工作流调试、Token成本控制、结构化输出及AI Skill等实践。' },
      ] },
      { label: '代表应用', items: [
        { headline: '企业场景AI应用', description: 'IPO材料审核助手、群组超级活动助手、云梦引擎相关Agent研发。' },
        { headline: 'AI SaaS与智能体产品', description: '校园心理陪伴AI SaaS、健康顾问智能体、智行助手。' },
        { headline: '自然增长1万+粉丝 · 累计播放800万+', description: '曾运营AI短视频账号，两个多月自然增长超过1万粉丝，相关账号单平台累计播放超过800万。' },
      ] },
    ],
    directions: ['Agent研发', '工作流工程', '大模型API集成', '应用前端', '工程调试与快速原型'],
  },
  {
    id: 'arnold', name: '萧逸云', englishName: 'Arnold', navRole: '智能硬件与机器人', title: '智能硬件与机器人专家',
    group: 'technology', stage: 7, width: 'half', side: 'right', portrait: '/media/experts/arnold.jpg',
    facts: [
      { headline: '前优必选早期员工', description: '曾任高级产品设计师、产品经理。' },
      { headline: '机器人产品从0到1量产', description: '曾主导机器人产品设计与量产推进。' },
      { headline: '两届央视春晚机器人项目统筹', description: '参与大型演出场景下的机器人项目协调与交付。' },
    ],
    sections: [{ label: '专业积累与荣誉', items: [
      { headline: '8年硬科技产品化经验' },
      { headline: 'CES产品创新奖', description: '同时获得省长杯交互金奖、UXPA行业金奖。' },
    ] }],
    directions: ['机器人产品设计', '智能硬件产品化', '人机交互', '量产协同', '复杂项目交付'],
  },
];
