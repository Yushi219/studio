/* ============================================================
   RÉSUMÉ  —  bilingual preview · live editor · templates
   Self-contained. Opens from the nav "Résumé" button.
   Persists locally (localStorage); History keeps snapshots.
   ============================================================ */
(() => {
  'use strict';
  const LS_DOC  = 'yw_resume_v1';
  const LS_HIST = 'yw_resume_hist_v1';
  const HIST_MAX = 25;

  /* ----------  CONTENT MODEL (bilingual)  ---------- */
  const D = {
    en: {
      name: 'YUSHI WANG',
      title: 'Principal Experience Designer · Design Technologist&nbsp;&nbsp;—&nbsp;&nbsp;AEC · BIM · AI · Full-Stack',
      contact: 'yushiw620@gmail.com&nbsp;&nbsp;·&nbsp;&nbsp;Boston, MA <b>(+1) 213-706-9087</b>&nbsp;&nbsp;·&nbsp;&nbsp;Shanghai <b>(+86) 139-1616-4162</b>',
      photo: false,
      sums_h: 'Profile',
      sums: [
        { b: 'Background', t: 'Sole design technologist at a 200-person global AEC firm, turning workflow bottlenecks and pain points into solutions that advance design clarity, performance and collaboration.' },
        { b: 'Experience Design', t: 'Runs the full design arc for technical AEC and BIM tools: research into product improvements, low-to-high-fidelity prototypes, and validation with the designers, Senior Associates and PMs who use them.' },
        { b: 'Impact', t: 'Over a decade in the Autodesk AEC stack (Revit, AutoCAD, Dynamo) and real BIM workflows. Built an AIA TAP Award-winning sustainability platform used in 85+ countries and an AI rendering pipeline that cut output ~70% and $50K+ outsourcing.' },
        { b: 'Enablement', t: 'Founded and led an internal AI research group and a 100+ member Computational Design Community, turning scripts into structured teaching and knowledge-capturing AI tools across AIGC, parametric design and marketing.' },
        { b: 'Profile', t: 'Goal-oriented and detail-minded. Cuts to the core of a messy problem, names the real bottleneck, and pushes the fix to release. Uses vibe coding to turn ideas into validated prototypes within days. Communicates clearly in writing, in person and in visuals; fluent English; fast to learn.' }
      ],
      prj_h: 'Selected Projects',
      prj: [
        { name: 'Interactive Virtual Mockup (IVM)', sub: 'Experience Design · Immersive VR / AR', date: '2024 — 2025', li: [
          { b: 'Role', t: 'Physical healthcare mockups cost $12,000–$18,000 per room and cannot show movement or workflow. Built a multi-user VR tool where surgeons, nurses, infection-control staff and architects walk a clinical room before construction, operate equipment, switch options and give structured feedback in context.' },
          { b: 'Build', t: 'Pipeline from Revit into Unity and onto Meta Quest, with Normcore multiplayer sync and follow, custom scripts driving complex medical-equipment workflows, switch-and-save design options with in-context feedback, and AI material and component swaps, so stakeholders give feedback and decide fast.' },
          { b: 'Impact', t: 'Saved $112,000 across seven Dana-Farber mockup rooms and cut medical-gas change orders 60% by catching clearance and workflow conflicts before ground-breaking. Adopted at White Plains Hospital and Dana-Farber, where the Chief of Surgery called it a major advancement in surgical facility design.' } ] },
        { name: 'Floorcast', sub: 'Experience Design · AI Building-Use Simulation', date: 'Feb 2026 — Present', li: [
          { b: 'Role', t: 'Predicts how a building will really be used before it is built: AI agents play each clinical role to reproduce real routes and workflows and expose how a layout performs.' },
          { b: 'Build', t: 'Movement, comfort and acoustic heatmaps with live data give the quantitative picture; an AI interview system adds the qualitative why. Extending from one-click 2D-to-3D to a collaborative Revit/Rhino plugin that runs simulation inside the design workflow.' },
          { b: 'Impact', t: 'Analyzed nurse call-response and rounding routes to test nurse-station placement, then re-strategized the equipment and medication room doors to shorten clinical circulation.' } ] },
        { name: 'PAYETTE Places', sub: 'Experience Design · Interactive Web', date: 'Mar — Jun 2025', li: [
          { b: 'Role', t: 'Designed the navigation and wayfinding experience for the firm public project tour at the 2025 AIA Conference, serving architects, clients and press across eight built Boston projects.' },
          { b: 'Build', t: 'Information architecture spanning an interactive city map with one-tap Google Maps routing, building hotspots that open project pages, a navigable gallery, and animated facade diagrams with walking figures; fully responsive, with the site QR on company business cards.' },
          { b: 'Impact', t: 'Became the public-facing showcase for AIA 2025 and a benchmark for how the office presents its work, with roughly 300 visitors on a single open day.' } ] },
        { name: 'Promptitect', sub: 'Product & Experience Design · AI Prompt Intelligence', date: 'Sep 2025 — Present', li: [
          { b: 'Role', t: 'An AI prompt-intelligence layer that turns scattered, one-off AI experiments into a shared, continuously improving capability.' },
          { b: 'Build', t: 'A searchable knowledge gallery, RAG case retrieval with match scores, a guided prompt builder, and a node-based board for comparing model outputs. Tuned so someone with no AI background gets reliable results in fewer steps, with copyright and IP compliance built in.' },
          { b: 'Impact', t: 'Standardized prompt quality across AIGC, parametric design and marketing while protecting copyright and lowering the barrier for everyday designers.' } ] }
      ],
      exp_h: 'Professional Experience',
      exp: [
        { name: 'PAYETTE', at: 'Boston, MA', sub: 'Design Technologist', date: 'June 2022 — Present', li: [
          { b: 'Validation & Feedback', t: 'Built the client-feedback loop before construction: Pulse, a web tool for structured feedback on 2D plans and digital design options, plus immersive AR/VR review in Unity, C# and iOS ARKit for clinical, engineering and architecture teams to validate space and equipment on site.' },
          { b: 'User Research & Experience', t: 'Own user research and interaction design for internal tools serving 200+ architects, engineers and BIM staff: space-strategy (Floorish, Sectioneer, Floorcast), sustainability (Kaleidoscope, an embodied-carbon platform that won the AIA TAP Award across 85+ countries) and the IVM healthcare VR tool. Run interviews, workflow analysis and usability testing.' },
          { b: 'Computational Design', t: 'Build professional AEC tooling hands-on: 30+ Grasshopper and Dynamo scripts, a .NET Revit add-in installing a company plugin ribbon across the office, plus Python Rhino plugins; consolidated into the firm script library, training and AI lectures.' },
          { b: 'Applied AI', t: 'Drove applied AI end to end: led the AI group that tuned image-to-image generation into a ~70%-faster rendering pipeline ($50K+ outsourcing saved), built a prompt-intelligence tool and an AI video tool for project-bid storytelling, and use vibe coding, AI agents and RAG to ship internal web tools.' },
          { b: 'Full-Stack Delivery', t: 'Take 10+ tools from concept to production largely single-handed: meet with the three practice Principals and project-group PMs to surface needs, build front and back end, deploy on Azure with versioned releases, and land specs with engineering, lifting workflows 50–80%. Also built the Ask Tom RAG agent and Payette Lens (AI financial-data visualization).' },
          { b: 'Leadership & Management', t: 'Founded and lead the firm AI research group and a 100+ member design-tech community: set multi-year tooling and AI strategy, build training, onboarding and version-controlled knowledge systems, govern design and IP standards, mentor designers across offices, and report monthly to firm Principals and leadership.' } ] },
        { name: 'Dowbuilt', at: 'Seattle, WA', sub: 'Digital Construction Project Engineer', date: 'Dec 2021 — June 2022', li: [
          { b: 'BIM Automation', t: 'Built a Python/Revit BIM modeling and automated quantity-take-off system; one-click material lists and cost estimates cut take-off from days to minutes (about 90% faster), with real-time cost data across 10+ high-end residential projects.' },
          { b: 'Pre-construction & Field', t: 'Delivered Grasshopper/Dynamo/Python tooling for excavation modeling, 4D scheduling, clash detection and CNC-ready fabrication; coordinated weekly with PMs, superintendents and fabricators.' } ] }
      ],
      int_h: 'Internship',
      int: [
        { name: 'NBBJ', at: 'Seattle, WA', sub: 'Digital Design Specialist Intern', date: 'July — Sept 2021', li: [
          { b: 'UI/UX', t: 'Led a full UI/UX redesign of the firm enterprise digital-technology platform (unified tool search and technical-asset management), improving usability and cross-office collaboration.' },
          { b: 'Parametric R&D', t: 'Built parametric Grasshopper/Dynamo tools (brick-porosity, solar-tracking façade, automated daylight simulation) adopted in pilot projects and QA/QC.' } ] }
      ],
      edu_h: 'Education',
      edu: [
        { l: 'University of Southern California', m: 'M.S. Building Science · GPA 4.0 / 4.0', r: 'Los Angeles · 2019 — 2021' },
        { l: 'Shanghai University of Engineering Science', m: 'B.S. Construction Management · GPA 4.0 / 4.0', r: 'Shanghai · 2016 — 2018' }
      ],
      sk_h: 'Skills & Certificate',
      sk: [
        { b: 'Skills', t: 'User Research (qual + quant) · Usability Testing · Interaction Design · Prototyping · Workflow Analysis · Data-Driven Design · Cross-functional Influence' },
        { b: 'Design', t: 'Figma · Adobe Creative Cloud · InDesign · Claude Design' },
        { b: 'Computational Design', t: 'Rhino · Grasshopper · Revit · Dynamo · Rhino.Inside' },
        { b: 'Development', t: 'JavaScript · HTML/CSS · React · Node.js · Python · C# · Azure · Unity · iOS ARKit · MySQL · Power BI · Tableau · D3' },
        { b: 'AI', t: 'Claude Code · Codex · Gemini · ComfyUI · xfigura · Krea · Runway · Kohya · RAG' },
        { b: 'Awards & Certificate', t: 'LEED AP (USGBC, 2021) · 2022 ARCHITECT R+D & AIA TAP Innovation Award (Kaleidoscope) · IESLA Russell Cole Design Competition, Advanced (2020)' }
      ]
    },
    zh: {
      name: '王雨施 <span style="opacity:.45;font-size:.62em;letter-spacing:.04em">Yushi Wang</span>',
      title: '首席体验设计师 · 设计技术专家&nbsp;&nbsp;—&nbsp;&nbsp;建筑科技 · BIM · AI · 全栈',
      contact: 'yushiw620@gmail.com&nbsp;&nbsp;·&nbsp;&nbsp;上海&nbsp;·&nbsp;<b>(+86) 139-1616-4162</b>',
      photo: true,
      sums_h: '个人优势',
      sums: [
        { b: '工作背景', t: '约 200 人规模的全球 AEC 设计公司里唯一的设计技术专家。与建筑科学、空间策略、设计可视化三大业务线的 Principal 负责人深度协作，把工作流瓶颈与痛点端到端转化为优雅的技术方案：构建提升设计清晰度、性能与协作的工具、脚本与系统。' },
        { b: '体验设计', t: '完整把控技术型 AEC / BIM 工具的体验设计链路。把用户研究与工作流分析转化为明确的产品改进方向，做低保真到高保真原型，并联合设计师、Senior Associate 与 PM 等一线使用者反复验证。最终由可用性测试与行为数据决定上线，一路跟到软件落地。' },
        { b: '以往成就', t: '深耕 Autodesk 的 AEC 工具十余年，Revit、AutoCAD、Dynamo 信手拈来，熟知行业真正赖以运转的各类 BIM 工作流。这份领域积淀沉淀为实打实的产品：可持续设计平台斩获 AIA TAP 创新奖、覆盖全球 85+ 个国家用户；AI 渲染管线将出图效率提升约 70%，节省外包成本 5 万美元以上。' },
        { b: '团队赋能', t: '创立并带领公司内部 AI 研究小组与 100+ 人的 Computational Design Community。从脚本与工具，到体系化教学，再到用 AI 工具沉淀内化知识，覆盖 AIGC、参数化设计与 Marketing。以产品思维拆解每个需求：用最精简的功能惠及最多的人，稳步抬升全公司数字化水平。' },
        { b: '综合素养', t: '目标导向，极重细节。能快速切中复杂问题的要害，点破真正的瓶颈与用户痛点，并把方案一路推到上线。善用 vibe coding，数日内即可将新需求与想法转化为可验证的原型，大幅压缩从构想到落地的周期。书面、口头、视觉表达俱清晰，英语流利，新工具新领域上手极快。' }
      ],
      prj_h: '项目经历',
      prj: [
        { name: '交互式虚拟样板间 IVM', sub: '体验设计 · 沉浸式 VR / AR', date: '2024 — 2025', li: [
          { b: '项目职责', t: '实体医疗样板间每间造价 1.2 万至 1.8 万美元，且无法呈现动线、流程与快速迭代。为此打造多人 VR 工具，让外科医生、护士、感控人员与建筑师在建造前就走进临床房间，亲手操作设备、切换方案，并在观察其真实工作流的同时给出结构化反馈。' },
          { b: '核心技术', t: '从 Revit 到 Unity 再到 Meta Quest 的完整管线；用 Normcore 搭建多人同步与跟随系统；自定义脚本操作复杂医疗器械，真实还原现实操作流程；支持切换与保存设计方案、记录反馈；并由 AI 切换材质、添加构件，高效让利益相关者做出设计反馈与决策。' },
          { b: '量化成果', t: '在 Dana-Farber 七间样板间累计节省 11.2 万美元，提前发现净距与流程冲突使医疗气体管线变更单减少 60%，跨专业反馈周期从数周压缩到数天。已应用于 White Plains Hospital 与 Dana-Farber；White Plains 外科主任称其为他所见过手术空间设计领域最重大的进步，并在全国医疗设计大会上引发热烈反响。' } ] },
        { name: 'Floorcast', sub: '体验设计 · AI 建筑使用仿真', date: '2026 年 2 月 — 至今', li: [
          { b: '项目职责', t: '在建造前就预测人如何真实使用建筑的仿真系统。以角色画像驱动 AI 智能体，高度还原不同临床与职业用户的动线与工作流，提前暴露布局的真实表现。' },
          { b: '核心技术', t: '定量侧输出动线、舒适度与声学等热力图并附实时数据，定性侧由 AI 访谈系统补足原因。当前从一键 2D 转 3D，进一步开发可直接在 Revit / Rhino 内运行的协同插件，让仿真融入设计流程；目标是打造 AI 智能体与数据驱动、能在建成前预测建筑表现的仿真平台。' },
          { b: '量化成果', t: '结合护士完成病人呼叫与巡访的时间和路线，评估护士站位置的便利性；并通过优化医疗器械房与药品房的墙体及双门位置策略，成功缩短临床工作动线。' } ] },
        { name: 'PAYETTE Places', sub: '体验设计 · 交互式网页', date: '2025 年 3 — 6 月', li: [
          { b: '项目职责', t: '为 2025 年 AIA 大会设计公司对外项目导览的导航与寻路体验，面向建筑师、客户与媒体等广泛外部受众的设计传达制品，串联波士顿八个建成项目。' },
          { b: '核心技术', t: '信息架构从交互式城市地图一键唤起 Google Maps 导航，到建筑热点详情页、可翻阅画廊配信息面板，以及含行走人物与可交互围护构造的动态立面图解；全端响应式，网站二维码印于公司名片。' },
          { b: '量化成果', t: '成为公司在 AIA 2025 的对外门面与作品呈现标杆，开放日单日约 300 人访问。' } ] },
        { name: 'Promptitect', sub: '产品与体验设计 · AI 提示词智能', date: '2025 年 9 月 — 至今', li: [
          { b: '项目职责', t: '嵌入设计流程的 AI 提示词智能层，把零散、一次性的 AI 试验沉淀为可共享、持续进化的能力。' },
          { b: '核心技术', t: '可检索的知识画廊、带匹配度的 RAG 案例检索、引导式提示词构建器，以及对比多模型输出的节点式画板；基于设计师真实使用方式打磨，让零 AI 基础的人也能用更少步骤稳定出图，并在流程中内建设计版权与合规。' },
          { b: '量化成果', t: '在 AIGC、参数化设计与 Marketing 多线统一提示词质量、提升输出一致性，在降低设计师使用门槛的同时守住公司设计版权。' } ] }
      ],
      exp_h: '工作经历',
      exp: [
        { name: 'PAYETTE', at: '波士顿', sub: '设计技术专家', date: '2022 年 5 月 — 至今', li: [
          { b: '验证与反馈', t: '在施工前就用客户反馈优化设计流程：Pulse，收集 2D 平面图与数字空间设计效果结构化反馈的网页工具；以及用 Unity、C# 与 iOS ARKit 打造的沉浸式 AR/VR 评审，让临床、工程与建筑团队现场验证空间与设备决策。' },
          { b: '用户研究与体验', t: '为服务 200+ 建筑师、工程师与 BIM 人员的公司内部工具负责用户研究与交互设计：空间策略类（Floorish、Sectioneer、Floorcast）、可持续类（Kaleidoscope，隐含碳平台，获 AIA TAP 创新奖、覆盖 85+ 国；Solar Comfort）与医疗 VR 评审工具 IVM（样板间省 11.2 万美元、变更单减少 60%）。开展访谈、工作流分析与情境观察，制作低到高保真原型，主导可用性测试验证现有与未来功能。' },
          { b: '计算性设计', t: '亲手打造专业 AEC 工具：编写 30+ 个 Grasshopper 与 Dynamo 脚本，基于 .NET 开发可全公司安装的公司级 Revit 插件（在 Revit 中提供公司插件面板与多项功能），并用 Python 开发 Rhino 插件、做生成式设计；沉淀为公司参数化脚本库与数字化培训体系，定期开设数字化与 AI 讲座，带动 100+ 设计师掌握前沿。' },
          { b: 'AI 应用', t: '端到端推动 AI 落地：带 AI 研究组把图生图调成更快的渲染管线（效率约 +70%、省外包 5 万美元以上），做出让任何设计师都能稳定出图的提示词智能工具，以及把项目投标讲故事从静态翻页变为动态视觉叙事的 AI 视频工具；如今用 vibe coding 数日产出 MVP demo，并用 AI Agent、LLM 与 RAG 做内部 web 工具优化设计流程。' },
          { b: '全栈交付', t: '10+ 工具基本由我一人从概念做到上线：定期与三个组 Principal 及各设计项目组 PM 开会，挖掘需求与痛点并转化为解决方案；前后端开发、Azure 部署与版本化发布，与开发协作落地设计规范、解决影响设计的实现问题，目标工作流提效 50% 到 80%。并与市场与金融团队协作，开发 Ask Tom RAG 智能体与 Payette Lens（AI 金融数据可视化）。' },
          { b: '领导与管理', t: '创立并带领公司 AI 研究小组与 100+ 人设计技术社区：制定多年工具与 AI 战略，搭建培训、新人 onboarding 与版本化知识体系，管控设计与版权规范，跨办公室带教设计师，每月向公司 Principal 与管理层汇报，并推动跨职能、全球分布式协作，影响各层级决策。' } ] },
        { name: 'Dowbuilt', at: '西雅图', sub: '数字建筑项目工程师', date: '2021 年 12 月 — 2022 年 6 月', li: [
          { b: 'BIM 自动化', t: '主导 Python / Revit 的 BIM 建模与工料自动测算系统；一键生成材料清单与成本预估，测算从数日缩短到分钟级（约提速 90%），为 10+ 高端住宅项目提供实时成本数据。' },
          { b: '施工前期与现场', t: '用 Grasshopper / Dynamo / Python 实现挖掘建模、4D 进度可视化、碰撞检测与 CNC 可交付件；每周与项目经理、现场主管与加工方协调。' } ] }
      ],
      int_h: '实习经历',
      int: [
        { name: 'NBBJ', at: '西雅图', sub: '数字设计专家（实习）', date: '2021 年 7 月 — 9 月', li: [
          { b: 'UI/UX', t: '主导公司数字技术平台的 UI/UX 全流程重构（统一工具检索与技术资产管理），提升可用性与跨办公室协作。' },
          { b: '参数化研发', t: '用 Grasshopper / Dynamo 开发参数化工具（砖墙孔隙率、太阳追踪幕墙、日光分析自动化），在试点项目与 QA/QC 中落地。' } ] }
      ],
      edu_h: '教育经历',
      edu: [
        { l: '南加州大学 (USC)', m: '建筑科学 硕士 · GPA 4.0 / 4.0', r: '洛杉矶 · 2019 — 2021' },
        { l: '上海工程技术大学', m: '工程管理 学士 · GPA 4.0 / 4.0', r: '上海 · 2016 — 2018' }
      ],
      sk_h: '技能与证书',
      sk: [
        { b: '技能', t: '用户研究（定性 + 定量）· 可用性测试 · 交互设计 · 交互原型 · 工作流分析 · 数据驱动设计 · 设计沟通 · 跨职能影响力' },
        { b: '设计', t: 'Figma · Adobe Creative Cloud · InDesign · Claude Design' },
        { b: '计算性设计', t: 'Rhino · Grasshopper · Revit · Dynamo · Rhino.Inside' },
        { b: '开发', t: 'JavaScript · HTML/CSS · Node.js · React · Python · GitHub · Azure · Unity · C# · iOS ARKit · Normcore · MySQL · Power BI · Tableau · D3 · Power Automate' },
        { b: 'AI', t: 'Claude Code · Codex · Gemini · ComfyUI · xfigura · Krea · Runway · Kohya · RAG' },
        { b: '证书', t: 'LEED AP（USGBC，2021）' },
        { b: '获奖', t: '2022 ARCHITECT R+D 大奖 与 AIA TAP 创新奖（Kaleidoscope）· IESLA Russell Cole 纪念设计竞赛 — 高级组特别表彰（2020）' }
      ]
    }
  };

  /* Detailed variant = the full pre-trim content (before the 9pt resize).
     Only EN differs from the lean version; ZH reuses D.zh. */
  const DFULL = {
    en: {
      name: 'YUSHI WANG',
      title: 'Principal Experience Designer · Design Technologist&nbsp;&nbsp;—&nbsp;&nbsp;AEC · BIM · AI · Full-Stack',
      contact: 'yushiw620@gmail.com&nbsp;&nbsp;·&nbsp;&nbsp;Boston, MA <b>(+1) 213-706-9087</b>&nbsp;&nbsp;·&nbsp;&nbsp;Shanghai <b>(+86) 139-1616-4162</b>',
      photo: false,
      sums_h: 'Profile',
      sums: [
        { b: 'Background', t: 'Sole design technologist at a 200-person global AEC firm. Embeds with the Principals across Building Science, Space Strategy and Design Visualization, then owns each fix end to end, turning workflow bottlenecks and pain points into elegant technical solutions, tools and systems that advance design clarity, performance and collaboration.' },
        { b: 'Experience Design', t: 'Runs the full design arc for technical AEC and BIM tools. Turns user research and workflow analysis into concrete product improvements. Prototypes from low to high fidelity and validates with users of the designers, Senior Associates and PMs. Usability testing and behavioral data decide what ships, carried through to working software.' },
        { b: 'Impact', t: 'More than a decade in the Autodesk AEC stack with a working knowledge of the design and BIM workflow. That fluency turned into products: a sustainability platform that won the AIA TAP Innovation Award and reached users in 85+ countries, and an AI rendering pipeline that sped up image output ~70% and cut $50,000+ of outsourcing.' },
        { b: 'Enablement', t: 'Founded and led an internal AI research group and a 100+ member Computational Design Community. Grew it from one-off scripts into structured teaching and AI tools that capture institutional knowledge across AIGC, parametric design and marketing. Treats every request as a product question and lifting firm-wide digital maturity.' },
        { b: 'Profile', t: 'Goal-oriented and detail-minded. Cuts quickly to the core of a messy problem, names the real bottleneck and user pain, and pushes the fix to a shipped release. Leverages vibe coding to turn new requirements and ideas into validated prototypes within days, sharply compressing the concept-to-build cycle. Communicates clearly in writing, in person and in visuals, works in fluent English, and picks up new tools and domains fast.' }
      ],
      prj_h: 'Selected Projects',
      prj: [
        { name: 'Interactive Virtual Mockup (IVM)', sub: 'Experience Design · Immersive VR / AR', date: '2024 — 2025', li: [
          { b: 'Role', t: 'Physical healthcare mockups cost $12,000–$18,000 per room and cannot show movement, workflow or fast iteration. Built a multi-user VR tool where surgeons, nurses and architects walk a clinical room before construction, operate real equipment, switch design options, and give structured feedback while their real workflows are observed in context.' },
          { b: 'Build', t: 'Pipeline from Revit into Unity and onto Meta Quest. Built multiplayer synchronization and a follow system with Normcore; custom scripts operate complex medical equipment to faithfully reproduce real operating workflows; users switch and save design options and capture feedback in context; and AI swaps materials and adds components, so stakeholders give design feedback and make decisions efficiently.' },
          { b: 'Impact', t: 'Saved $112,000 across 7 mockup rooms at Cancer Institute and Hospitals and cut medical-gas change orders 60% by catching clearance conflicts before ground-breaking, compressing the cross-disciplinary feedback cycle from weeks to days. The Chief of Surgery called it the most significant advancement in facility design, and it drew a strong response at a national healthcare design conference.' } ] },
        { name: 'Floorcast', sub: 'Experience Design · AI Building-Use Simulation', date: 'Feb 2026 — Present', li: [
          { b: 'Role', t: 'Predicts how a building will really be used before it is built: AI agents play each clinical role to reproduce real routes and workflows and expose how a layout performs.' },
          { b: 'Build', t: 'Movement, comfort and acoustic heatmaps with live data give the quantitative picture; an AI interview system adds the qualitative why. Extending from one-click 2D-to-3D to a collaborative Revit and Rhino plugin that runs simulation inside the design workflow, toward an AI-agent, data-driven platform that predicts how a building will perform before it is built.' },
          { b: 'Impact', t: 'Analyzed nurse call-response and rounding times and routes to test nurse-station placement, then re-strategized the wall and double-door positions of the equipment and medication rooms to shorten clinical circulation paths.' } ] },
        { name: 'PAYETTE Places', sub: 'Experience Design · Interactive Web', date: 'Mar — Jun 2025', li: [
          { b: 'Role', t: 'Designed the navigation and wayfinding experience for the firm public project tour at the 2025 AIA Conference, a design-communication artifact serving a broad external audience of architects, clients and press across eight built Boston projects.' },
          { b: 'Build', t: 'Information architecture spanning an interactive city map with one-tap Google Maps routing, building hotspots that open detailed project pages, a navigable gallery with info panels, and animated facade diagrams with walking figures and interactive envelope details; fully responsive, with the site QR printed on company business cards.' },
          { b: 'Impact', t: 'Became the public-facing showcase for AIA 2025 and a benchmark for how the office presents its work, with roughly 300 visitors/day.' } ] },
        { name: 'Promptitect', sub: 'Product & Experience Design · AI Prompt Intelligence', date: 'Sep 2025 — Present', li: [
          { b: 'Role', t: 'An AI prompt-intelligence layer that turns scattered, one-off AI experiments into a shared, continuously improving capability, using AI tools to take early design from idea to rendered result fast and fundamentally reshape the traditional rendering workflow.' },
          { b: 'Build', t: 'A searchable knowledge gallery, RAG case retrieval with match scores, a guided prompt builder, and a node-based board for comparing model outputs. Shaped by how designers actually work, it is tuned so someone with no AI background gets reliable results in fewer steps, with design copyright and IP compliance built into the workflow.' },
          { b: 'Impact', t: 'Sped up the traditional rendering workflow ~70%, kept materials and architectural detail consistent, iterated hundreds of options fast, and protected company design copyright while lowering the barrier for everyday designers.' } ] }
      ],
      exp_h: 'Professional Experience',
      exp: [
        { name: 'PAYETTE', at: 'Boston, MA', sub: 'Design Technologist', date: 'June 2022 — Present', li: [
          { b: 'Validation & Feedback', t: 'Built the client-feedback loop that optimizes the design process before construction: Pulse, a web tool that collects structured feedback on 2D plans and digital spatial-design options, and immersive AR/VR review in Unity, C# and iOS ARKit that lets clinical, engineering and architecture teams validate space and equipment decisions on site.' },
          { b: 'User Research & Experience', t: 'Own user research and interaction design for the firm internal tools serving 200+ architects, engineers and BIM staff: space-strategy tools (Floorish, Sectioneer, Floorcast), sustainability tools (Kaleidoscope, an embodied-carbon platform that won the AIA TAP Award and reached 85+ countries; Solar Comfort) and the IVM healthcare VR review tool ($112K mockup savings, change orders down 60%). Conduct interviews, workflow analysis and contextual observation, build low- to high-fidelity prototypes, and lead usability testing to validate current and future features.' },
          { b: 'Computational Design', t: 'Build professional AEC tooling hands-on: 30+ Grasshopper and Dynamo scripts, a .NET Revit add-in that installs a company plugin ribbon of in-house tools across the office, plus Python Rhino plugins and generative design; consolidated into the firm parametric script library and digital training system, with regular digital and AI lectures that brought 100+ designers to frontier practice.' },
          { b: 'Applied AI', t: 'Drove applied AI end to end: led the AI research group that tuned image-to-image generation into a faster rendering pipeline (~70% efficiency, $50K+ outsourcing saved), built a prompt-intelligence tool that makes reliable image generation easy for any designer and an AI video tool that turned competitive project-bid pitches from static decks into dynamic visual storytelling, and now use vibe coding to stand up MVP demos in days plus AI agents, LLMs and RAG to ship internal web tools that streamline the design workflow.' },
          { b: 'Full-Stack Delivery', t: 'Take 10+ tools from concept to production largely single-handed: meet regularly with the three practice Principals and each project-group PM to surface needs and pain points and turn them into solutions, build front and back end, deploy on Azure with versioned releases, and partner with engineering to land design specs and resolve implementation issues, lifting target workflows 50 to 80 percent. Partnering with the marketing and finance teams, also built the Ask Tom RAG agent and Payette Lens, an AI financial-data visualization tool.' },
          { b: 'Leadership & Management', t: 'Founded and lead the firm AI research group and a 100+ member design-tech community: set multi-year tooling and AI strategy, build training, onboarding and version-controlled knowledge systems, govern design and IP standards, mentor designers across offices, report monthly to firm Principals and leadership, and drive cross-functional, globally distributed collaboration that influences decisions at every level.' } ] },
        { name: 'Dowbuilt', at: 'Seattle, WA', sub: 'Digital Construction Project Engineer', date: 'Dec 2021 — June 2022', li: [
          { b: 'BIM Automation', t: 'Built a Python/Revit BIM modeling and automated quantity-take-off system; one-click material lists and cost estimates cut take-off from days to minutes (about 90% faster), with real-time cost data across 10+ high-end residential projects.' },
          { b: 'Pre-construction & Field', t: 'Delivered Grasshopper/Dynamo/Python tooling for excavation modeling, 4D scheduling, clash detection and CNC-ready fabrication; coordinated weekly with PMs, superintendents and fabricators.' } ] }
      ],
      int_h: 'Internship',
      int: [
        { name: 'NBBJ', at: 'Seattle, WA', sub: 'Digital Design Specialist Intern', date: 'July — Sept 2021', li: [
          { b: 'UI/UX', t: 'Led a full UI/UX redesign of the firm enterprise digital-technology platform (unified tool search and technical-asset management), improving usability and cross-office collaboration.' },
          { b: 'Parametric R&D', t: 'Built parametric Grasshopper/Dynamo tools (brick-porosity, solar-tracking façade, automated daylight simulation) adopted in pilot projects and QA/QC.' } ] }
      ],
      edu_h: 'Education',
      edu: [
        { l: 'University of Southern California', m: 'M.S. Building Science · GPA 4.0 / 4.0', r: 'Los Angeles · 2019 — 2021' },
        { l: 'Shanghai University of Engineering Science', m: 'B.S. Construction Management · GPA 4.0 / 4.0', r: 'Shanghai · 2016 — 2018' }
      ],
      sk_h: 'Skills & Certificate',
      sk: [
        { b: 'Skills', t: 'User Research (qual + quant) · Usability Testing · Interaction Design · Interactive Prototyping · Workflow Analysis · Data-Driven Design · Design Communication · Cross-functional Influence' },
        { b: 'Design', t: 'Figma · Adobe Creative Cloud · InDesign · Claude Design' },
        { b: 'Computational Design', t: 'Rhino · Grasshopper · Revit · Dynamo · Rhino.Inside' },
        { b: 'Development', t: 'JavaScript · HTML/CSS · Node.js · React · Python · GitHub · Azure · Unity · C# · iOS ARKit · Normcore · MySQL · Power BI · Tableau · D3 · Power Automate' },
        { b: 'AI', t: 'Claude Code · Codex · Gemini · ComfyUI · xfigura · Krea · Runway · Kohya · RAG' },
        { b: 'Certificate', t: 'LEED AP (USGBC, 2021)' },
        { b: 'Awards', t: '2022 ARCHITECT R+D Award & AIA TAP Innovation Award (Kaleidoscope) · IESLA Russell Cole Memorial Design Competition — Special Recognition, Advanced (2020)' }
      ]
    },
    zh: D.zh
  };

  const VARIANTS = ['lean', 'full'];
  function varLabel() {
    return state.lang === 'zh'
      ? (state.variant === 'full' ? '精简版' : '详细版')
      : (state.variant === 'full' ? 'Lean' : 'Detailed');
  }

  const TPL = [
    { id: 'slate', en: 'Slate', zh: '岩蓝' },
    { id: 'mono',  en: 'Editorial', zh: '极简' },
    { id: 'serif', en: 'Classic', zh: '经典' },
    { id: 'ink',   en: 'Modern', zh: '现代' }
  ];

  /* ----------  STATE  ---------- */
  const defState = () => ({ tpl: 'slate', lang: (window.__lang === 'zh' ? 'zh' : 'en'),
                            variant: 'lean', ov: {}, off: {}, fs: {}, zoom: 1, savedAt: 0 });
  let state = defState();
  function loadState() {
    let r = null;
    try { r = JSON.parse(localStorage.getItem(LS_DOC) || 'null'); } catch (e) {}
    state = (r && typeof r === 'object') ? Object.assign(defState(), r) : defState();
  }
  let saveT = 0;
  function persist() {
    state.savedAt = Date.now();
    try { localStorage.setItem(LS_DOC, JSON.stringify(state)); } catch (e) {}
  }
  function autoSave() { clearTimeout(saveT); saveT = setTimeout(persist, 550); }
  function getHist() { try { return JSON.parse(localStorage.getItem(LS_HIST) || '[]') || []; } catch (e) { return []; } }
  function setHist(a) { try { localStorage.setItem(LS_HIST, JSON.stringify(a.slice(0, HIST_MAX))); } catch (e) {} }

  /* ----------  DOM REFS  ---------- */
  let ov, page, stage, hist, fmt, toastEl, zoomEl, built = false;
  let previewMode = false, pagT = 0;
  const esc = s => String(s);

  /* ----------  RENDER  ---------- */
  function el(tag, cls, html) {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }
  // editable text node
  function ed(tag, cls, rid, html) {
    const n = el(tag, cls, html);
    n.setAttribute('data-rid', rid);
    return n;
  }
  function block(blk, cls) {
    const b = el('div', 'rz-block ' + (cls || ''));
    b.setAttribute('data-blk', blk);
    const g = el('span', 'rz-grip', '✛');
    g.setAttribute('data-grip', '1');
    b.appendChild(g);
    return b;
  }
  function secHead(rid, txt) {
    const h = el('div'); // wrapper keeps clip-path tab sized to text
    const s = ed('span', 'rz-sec-h', rid, txt);
    h.appendChild(s);
    return h;
  }

  function render() {
    const d = (state.variant === 'full' ? DFULL : D)[state.lang];
    page.setAttribute('data-tpl', previewMode ? 'mono' : state.tpl);
    page.innerHTML = '';

    /* HEADER */
    const bh = block('head', 'rz-head');
    const main = el('div', 'rz-head-main');
    main.appendChild(ed('div', 'rz-name', 'name', d.name));
    main.appendChild(ed('div', 'rz-title', 'title', d.title));
    main.appendChild(ed('div', 'rz-contact', 'contact', d.contact));
    bh.appendChild(main);
    if (d.photo) {
      const im = el('img', 'rz-photo');
      im.src = 'assets/portrait.jpg';
      im.alt = '王雨施';
      im.onerror = () => im.classList.add('hide');
      bh.appendChild(im);
    }
    page.appendChild(bh);

    /* SUMMARY */
    const bs = block('summary', 'rz-sec rz-sum');
    bs.appendChild(secHead('sec-sum-h', d.sums_h));
    d.sums.forEach((p, i) => {
      bs.appendChild(ed('p', '', 'sum-' + i, '<b>' + esc(p.b) + '</b>' + esc(p.t)));
    });
    page.appendChild(bs);

    /* PROJECTS */
    page.appendChild(itemSection('projects', 'sec-prj-h', d.prj_h, d.prj, 'prj'));

    /* EXPERIENCE */
    page.appendChild(itemSection('experience', 'sec-exp-h', d.exp_h, d.exp, 'exp', true));

    /* INTERNSHIP */
    page.appendChild(itemSection('internship', 'sec-int-h', d.int_h, d.int, 'int', true));

    /* EDUCATION */
    const be = block('education', 'rz-sec');
    be.appendChild(secHead('sec-edu-h', d.edu_h));
    d.edu.forEach((r, i) => {
      const row = el('div', 'rz-line2');
      row.appendChild(ed('span', 'l', 'edu-' + i + '-l', esc(r.l)));
      row.appendChild(ed('span', 'm', 'edu-' + i + '-m', esc(r.m)));
      row.appendChild(ed('span', 'r', 'edu-' + i + '-r', esc(r.r)));
      be.appendChild(row);
    });
    page.appendChild(be);

    /* SKILLS */
    const bk = block('skills', 'rz-sec');
    bk.appendChild(secHead('sec-sk-h', d.sk_h));
    d.sk.forEach((s, i) => {
      bk.appendChild(ed('div', 'rz-skill', 'sk-' + i, '<b>' + esc(s.b) + '</b>' + esc(s.t)));
    });
    page.appendChild(bk);

    applyOverrides();
    applyOffsets();
    applyZoom();
    if (previewMode) requestAnimationFrame(paginate);
  }

  /* ----------  PRINT-PREVIEW PAGINATION (matches the 9pt PDF)  ---------- */
  function clearPaginate() {
    if (!page) return;
    page.querySelectorAll('.rz-pagebreak, .rz-pagespacer').forEach(n => n.remove());
  }
  function paginate() {
    clearPaginate();
    if (!previewMode || !page) return;
    const pageH = Math.round(794 * 287 / 210); // A4 content height @96dpi, 5mm v-margins
    const pageTop = page.getBoundingClientRect().top;
    let limit = pageH;
    // Atomic units cannot split across pages (same as break-inside:avoid in the PDF).
    page.querySelectorAll('.rz-item, .rz-line2').forEach(u => {
      const r = u.getBoundingClientRect();
      const top = r.top - pageTop, h = r.height;
      if (h >= pageH) return;
      if (top + h > limit) {
        const gap = limit - top;
        if (gap > 4) {
          const sp = el('div', 'rz-pagespacer');
          sp.style.height = gap + 'px';
          u.parentNode.insertBefore(sp, u);
        }
        limit += pageH;
      }
    });
    const pages = Math.max(1, Math.ceil(page.scrollHeight / pageH));
    for (let i = 1; i < pages; i++) {
      const ln = el('div', 'rz-pagebreak');
      ln.setAttribute('data-label', 'Page ' + (i + 1));
      ln.style.top = (i * pageH) + 'px';
      page.appendChild(ln);
    }
  }

  function itemSection(blk, hRid, hTxt, items, pfx, showAt) {
    const b = block(blk, 'rz-sec rz-flush');
    b.appendChild(secHead(hRid, hTxt));
    items.forEach((it, i) => {
      const wrap = el('div', 'rz-item');
      const top = el('div', 'rz-item-top');
      const nm = ed('div', 'rz-it-name', pfx + '-' + i + '-n',
        esc(it.name) + (showAt && it.at ? ' <span class="at">— ' + esc(it.at) + '</span>' : ''));
      const dt = ed('div', 'rz-it-date', pfx + '-' + i + '-d', esc(it.date));
      top.appendChild(nm); top.appendChild(dt);
      wrap.appendChild(top);
      wrap.appendChild(ed('div', 'rz-it-sub', pfx + '-' + i + '-s', esc(it.sub)));
      const ul = el('ul', 'rz-it-body');
      it.li.forEach((l, j) => {
        ul.appendChild(ed('li', '', pfx + '-' + i + '-l' + j,
          '<b>' + esc(l.b) + '</b>' + esc(l.t)));
      });
      wrap.appendChild(ul);
      b.appendChild(wrap);
    });
    return b;
  }

  function applyOverrides() {
    const lp = (state.variant || 'lean') + '::' + state.lang + '::';
    page.querySelectorAll('[data-rid]').forEach(n => {
      const rid = n.getAttribute('data-rid');
      const o = state.ov[lp + rid];
      if (o != null) n.innerHTML = o;
      const f = state.fs[rid];
      if (f) n.style.fontSize = f + 'px';
    });
  }
  function applyOffsets() {
    page.querySelectorAll('.rz-block').forEach(b => {
      const o = state.off[b.getAttribute('data-blk')];
      if (o) { b.style.setProperty('--dx', o[0] + 'px'); b.style.setProperty('--dy', o[1] + 'px'); }
      else { b.style.removeProperty('--dx'); b.style.removeProperty('--dy'); }
    });
  }

  /* ----------  ZOOM (Ctrl + wheel)  ---------- */
  let zoomT = 0;
  function clampZoom(z) { return Math.max(0.5, Math.min(2, Math.round(z * 100) / 100)); }
  function applyZoom() {
    if (!page) return;
    const z = previewMode ? 1 : (state.zoom || 1);
    page.style.zoom = (z !== 1) ? z : '';
  }
  function showZoomBadge() {
    if (!zoomEl) return;
    zoomEl.textContent = Math.round((state.zoom || 1) * 100) + '%';
    zoomEl.classList.add('on');
    clearTimeout(zoomT);
    zoomT = setTimeout(() => zoomEl.classList.remove('on'), 1100);
  }
  function bumpZoom(dir) {
    state.zoom = clampZoom((state.zoom || 1) + dir * 0.1);
    applyZoom(); showZoomBadge(); autoSave();
  }
  function resetZoom() {
    state.zoom = 1; applyZoom(); showZoomBadge(); autoSave();
  }

  /* ----------  BUILD SHELL  ---------- */
  function buildShell() {
    ov = el('div'); ov.id = 'rz-overlay';

    const bar = el('div', 'rz-bar');
    bar.innerHTML = '<div class="rz-brand">Résumé <em>· Yushi Wang</em></div>';

    const mkBtn = (label, cls) => { const b = el('button', 'rz-btn ' + (cls || ''), label); return b; };

    const bEdit = mkBtn('Edit', 'rz-edit');
    const sel = el('select', 'rz-sel');
    TPL.forEach(t => { const o = el('option'); o.value = t.id; o.textContent = t[state.lang] || t.en; sel.appendChild(o); });
    sel.value = state.tpl;
    const bLang = mkBtn(state.lang === 'zh' ? 'EN' : '中文', 'rz-lang');
    const bPrev = mkBtn(state.lang === 'zh' ? '预览' : 'Preview', 'rz-prev');
    const bVar = mkBtn(varLabel(), 'rz-var');
    const bExp = mkBtn('Export PDF');
    const bDump = mkBtn(state.lang === 'zh' ? '导出内容' : 'Export Text', 'rz-dump');
    const bSave = mkBtn('Save', 'rz-primary');
    const bHist = mkBtn('History');
    const bReset = mkBtn(state.lang === 'zh' ? '重置' : 'Reset', 'rz-reset');
    const bX = mkBtn('✕', 'rz-x');

    const div = () => el('span', 'rz-divider');
    [bEdit, bPrev, div(), sel, bVar, div(), bLang, div(), bExp, bDump, bSave, bHist, bReset, div(), bX]
      .forEach(n => bar.appendChild(n));

    stage = el('div', 'rz-stage');
    page = el('div', 'rz-page');
    stage.appendChild(page);

    hist = el('div', 'rz-hist');
    fmt = el('div', 'rz-fmt');
    fmt.innerHTML = '<button data-fz="-1">A−</button><span class="fs-val">·</span>' +
      '<button data-fz="1">A+</button><button data-b="1"><b>B</b></button>';
    toastEl = el('div', 'rz-toast');
    zoomEl = el('div', 'rz-zoom');
    zoomEl.title = 'Ctrl + scroll to zoom · click to reset 100%';

    ov.appendChild(bar);
    ov.appendChild(stage);
    ov.appendChild(hist);
    ov.appendChild(fmt);
    ov.appendChild(toastEl);
    ov.appendChild(zoomEl);
    document.body.appendChild(ov);

    /* --- wiring --- */
    bX.addEventListener('click', close);
    bEdit.addEventListener('click', () => setEdit(!editing));
    bPrev.addEventListener('click', () => {
      previewMode = !previewMode;
      ov.classList.toggle('rz-preview', previewMode);
      bPrev.classList.toggle('is-on', previewMode);
      render();
      toast(state.lang === 'zh'
        ? (previewMode ? '打印预览：版式 / 分页 / 每行字数与导出 PDF 一致' : '已退出打印预览')
        : (previewMode ? 'Print preview — matches the exported PDF' : 'Exited print preview'));
    });
    sel.addEventListener('change', () => { state.tpl = sel.value; render(); persist(); });
    bLang.addEventListener('click', () => {
      state.lang = state.lang === 'zh' ? 'en' : 'zh';
      bLang.textContent = state.lang === 'zh' ? 'EN' : '中文';
      bPrev.textContent = state.lang === 'zh' ? '预览' : 'Preview';
      bVar.textContent = varLabel();
      bDump.textContent = state.lang === 'zh' ? '导出内容' : 'Export Text';
      bReset.textContent = state.lang === 'zh' ? '重置' : 'Reset';
      TPL.forEach((t, i) => { sel.options[i].textContent = t[state.lang] || t.en; });
      render(); persist();
    });
    bExp.addEventListener('click', exportPDF);
    bDump.addEventListener('click', dumpContent);
    bVar.addEventListener('click', () => {
      state.variant = (state.variant === 'full') ? 'lean' : 'full';
      bVar.textContent = varLabel();
      render(); persist();
      toast(state.lang === 'zh'
        ? (state.variant === 'full' ? '已切到详细版（删减后点"导出内容"发我）' : '已切到精简版')
        : (state.variant === 'full' ? 'Detailed version — trim it, then Export Text' : 'Lean version'));
    });
    bSave.addEventListener('click', saveSnapshot);
    bHist.addEventListener('click', () => { hist.classList.contains('on') ? hist.classList.remove('on') : openHist(); });
    bReset.addEventListener('click', () => {
      const msg = state.lang === 'zh'
        ? '清除本浏览器里所有手动修改，恢复到代码里保存的版本？\n（已保存进代码的 Profile 和核心技术 Build 都会回来；本地未保存的临时改动会丢失）'
        : 'Clear all manual edits in this browser and reload the saved code version?';
      if (!window.confirm(msg)) return;
      state.ov = {}; state.off = {}; state.fs = {};
      render(); persist();
      toast(state.lang === 'zh' ? '已重置为代码保存版 ✓' : 'Reset to saved version ✓');
    });

    // format toolbar
    fmt.addEventListener('mousedown', e => e.preventDefault());
    fmt.addEventListener('click', e => {
      const t = e.target.closest('button'); if (!t || !fmtTarget) return;
      if (t.dataset.b) { document.execCommand('bold'); }
      else {
        const rid = fmtTarget.getAttribute('data-rid');
        const cur = state.fs[rid] || parseFloat(getComputedStyle(fmtTarget).fontSize) || 12;
        const nv = Math.max(7, Math.min(40, Math.round(cur) + (t.dataset.fz === '1' ? 1 : -1)));
        state.fs[rid] = nv; fmtTarget.style.fontSize = nv + 'px';
        fmt.querySelector('.fs-val').textContent = nv;
      }
      saveOverride(fmtTarget); autoSave();
    });

    // drag (grip) + text editing capture
    page.addEventListener('pointerdown', onPointerDown);
    page.addEventListener('focusin', onEditFocus, true);
    page.addEventListener('focusout', onEditBlur, true);
    page.addEventListener('input', e => {
      const t = e.target.closest('[data-rid]');
      if (t) {
        saveOverride(t); autoSave();
        if (previewMode) { clearTimeout(pagT); pagT = setTimeout(paginate, 350); }
      }
    });

    // Ctrl + wheel zoom
    stage.addEventListener('wheel', e => {
      if (!e.ctrlKey) return;
      e.preventDefault();
      bumpZoom(e.deltaY < 0 ? 1 : -1);
    }, { passive: false });
    zoomEl.addEventListener('click', resetZoom);

    document.addEventListener('keydown', e => {
      if (!ov.classList.contains('on')) return;
      if (e.key === 'Escape') { if (editing) setEdit(false); else close(); }
      if (e.ctrlKey && (e.key === '0' || e.code === 'Digit0' || e.code === 'Numpad0')) {
        e.preventDefault(); resetZoom();
      }
    });
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => { if (previewMode) paginate(); });
    }
    document.addEventListener('langchange', () => {
      if (!ov || !ov.classList.contains('on')) return;
      state.lang = window.__lang === 'zh' ? 'zh' : 'en';
      bLang.textContent = state.lang === 'zh' ? 'EN' : '中文';
      bPrev.textContent = state.lang === 'zh' ? '预览' : 'Preview';
      bVar.textContent = varLabel();
      bDump.textContent = state.lang === 'zh' ? '导出内容' : 'Export Text';
      bReset.textContent = state.lang === 'zh' ? '重置' : 'Reset';
      TPL.forEach((t, i) => { sel.options[i].textContent = t[state.lang] || t.en; });
      render(); persist();
    });

    built = true;
  }

  /* ----------  EDIT MODE  ---------- */
  let editing = false;
  function setEdit(on) {
    editing = on;
    ov.classList.toggle('editing', on);
    ov.querySelector('.rz-edit').classList.toggle('is-on', on);
    ov.querySelector('.rz-edit').textContent = on ? (state.lang === 'zh' ? 'Done' : 'Done') : 'Edit';
    page.querySelectorAll('[data-rid]').forEach(n => {
      n.contentEditable = on ? 'true' : 'false';
      if (!on) n.removeAttribute('contenteditable');
    });
    if (!on) { fmt.classList.remove('on'); fmtTarget = null; persist(); }
  }

  function saveOverride(node) {
    const rid = node.getAttribute('data-rid');
    state.ov[(state.variant || 'lean') + '::' + state.lang + '::' + rid] = node.innerHTML;
  }

  /* --- font toolbar follow focus --- */
  let fmtTarget = null;
  function onEditFocus(e) {
    if (!editing) return;
    const t = e.target.closest('[data-rid]'); if (!t) return;
    fmtTarget = t;
    const r = t.getBoundingClientRect();
    fmt.classList.add('on');
    const fx = Math.min(window.innerWidth - 150, Math.max(8, r.left));
    const fy = Math.max(54, r.top - 40);
    fmt.style.left = fx + 'px';
    fmt.style.top = fy + 'px';
    const cur = state.fs[t.getAttribute('data-rid')] || Math.round(parseFloat(getComputedStyle(t).fontSize)) || 12;
    fmt.querySelector('.fs-val').textContent = cur;
  }
  function onEditBlur(e) {
    setTimeout(() => {
      if (!document.activeElement || !document.activeElement.closest) { fmt.classList.remove('on'); return; }
      if (!document.activeElement.closest('[data-rid]') && !document.activeElement.closest('.rz-fmt'))
        fmt.classList.remove('on');
    }, 120);
  }

  /* --- drag with snap grid --- */
  const GRID = 16, SNAP = 6;
  let drag = null;
  function onPointerDown(e) {
    if (!editing) return;
    const grip = e.target.closest('[data-grip]');
    if (!grip) return;
    e.preventDefault();
    const blkEl = grip.parentElement;
    const blk = blkEl.getAttribute('data-blk');
    const cur = state.off[blk] || [0, 0];
    drag = { blkEl, blk, sx: e.clientX, sy: e.clientY, bx: cur[0], by: cur[1], cx: cur[0], cy: cur[1] };
    blkEl.classList.add('dragging');
    // precompute other blocks' left/centre/right (page-relative) for alignment snap
    const pr = page.getBoundingClientRect();
    const br0 = blkEl.getBoundingClientRect();
    drag.natLeft = br0.left - pr.left - cur[0];   // untransformed page-relative left
    drag.width = br0.width;
    drag.edges = [];
    page.querySelectorAll('.rz-block').forEach(o => {
      if (o === blkEl) return;
      const r = o.getBoundingClientRect();
      drag.edges.push(r.left - pr.left, (r.left + r.right) / 2 - pr.left, r.right - pr.left);
    });
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  }
  function clearGuides() { page.querySelectorAll('.rz-guide').forEach(g => g.remove()); }
  function addGuide(cls, pos) {
    const g = el('div', 'rz-guide ' + cls);
    if (cls === 'v') g.style.left = pos + 'px'; else g.style.top = pos + 'px';
    page.appendChild(g);
  }
  function onPointerMove(e) {
    if (!drag) return;
    let dx = drag.bx + (e.clientX - drag.sx);
    let dy = drag.by + (e.clientY - drag.sy);
    // grid snap
    dx = Math.round(dx / GRID) * GRID;
    dy = Math.round(dy / GRID) * GRID;
    clearGuides();
    // alignment snap to other blocks' vertical edges
    const cands = [drag.natLeft + dx, drag.natLeft + dx + drag.width / 2, drag.natLeft + dx + drag.width];
    for (let k = 0; k < cands.length; k++) {
      for (let m = 0; m < drag.edges.length; m++) {
        if (Math.abs(cands[k] - drag.edges[m]) <= SNAP) {
          dx += drag.edges[m] - cands[k];
          addGuide('v', drag.natLeft + dx + (k === 1 ? drag.width / 2 : k === 2 ? drag.width : 0));
          k = cands.length; break;
        }
      }
    }
    // clamp so the block can't be dragged completely off the page
    dx = Math.max(-page.clientWidth * 0.5, Math.min(page.clientWidth * 0.5, dx));
    dy = Math.max(-page.clientHeight, Math.min(page.clientHeight, dy));
    drag.blkEl.style.setProperty('--dx', dx + 'px');
    drag.blkEl.style.setProperty('--dy', dy + 'px');
    drag.cx = dx; drag.cy = dy;
  }
  function onPointerUp() {
    if (!drag) return;
    if (drag.cx === 0 && drag.cy === 0) delete state.off[drag.blk];
    else state.off[drag.blk] = [drag.cx | 0, drag.cy | 0];
    drag.blkEl.classList.remove('dragging');
    clearGuides();
    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('pointerup', onPointerUp);
    drag = null;
    autoSave();
  }

  /* ----------  HISTORY  ---------- */
  function clone(o) { return JSON.parse(JSON.stringify(o)); }
  function saveSnapshot() {
    persist();
    const list = getHist();
    const label = (state.lang === 'zh' ? '版本' : 'Version');
    list.unshift({ ts: Date.now(), label, state: clone(state) });
    setHist(list);
    toast(state.lang === 'zh' ? '已保存 ✓ 版本已存入历史记录' : 'Saved ✓ snapshot added to History');
  }
  function fmtTime(ts) {
    const d = new Date(ts);
    const p = n => String(n).padStart(2, '0');
    return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate()) +
      ' ' + p(d.getHours()) + ':' + p(d.getMinutes());
  }
  function openHist() {
    const list = getHist();
    const zh = state.lang === 'zh';
    hist.innerHTML = '<h4>' + (zh ? '历史记录' : 'History') + '</h4>';
    if (!list.length) {
      hist.appendChild(el('div', 'rz-hist-empty', zh ? '暂无保存的版本。点击 Save 创建第一个。' : 'No saved versions yet — press Save to create one.'));
    } else {
      list.forEach((h, i) => {
        const row = el('div', 'rz-hist-row');
        row.innerHTML = '<div class="t">' + (zh ? '版本 ' : 'Version ') + (list.length - i) +
          '<span>' + fmtTime(h.ts) + ' · ' + (h.state.lang.toUpperCase()) + ' · ' + h.state.tpl + '</span></div>';
        const rb = el('button', '', zh ? '恢复' : 'Restore');
        const db = el('button', 'del', zh ? '删除' : 'Del');
        rb.addEventListener('click', () => {
          state = Object.assign(defState(), clone(h.state));
          syncBar(); render(); persist();
          hist.classList.remove('on');
          toast(zh ? '已恢复该版本 ✓' : 'Version restored ✓');
        });
        db.addEventListener('click', () => {
          const l = getHist(); l.splice(i, 1); setHist(l); openHist();
        });
        row.appendChild(rb); row.appendChild(db);
        hist.appendChild(row);
      });
    }
    hist.classList.add('on');
  }
  function syncBar() {
    const sel = ov.querySelector('.rz-sel');
    const bLang = ov.querySelector('.rz-lang');
    sel.value = state.tpl;
    bLang.textContent = state.lang === 'zh' ? 'EN' : '中文';
    TPL.forEach((t, i) => { sel.options[i].textContent = t[state.lang] || t.en; });
    const bVar = ov.querySelector('.rz-var');
    if (bVar) bVar.textContent = varLabel();
    const bDump = ov.querySelector('.rz-dump');
    if (bDump) bDump.textContent = state.lang === 'zh' ? '导出内容' : 'Export Text';
    const bReset = ov.querySelector('.rz-reset');
    if (bReset) bReset.textContent = state.lang === 'zh' ? '重置' : 'Reset';
    const bPrev = ov.querySelector('.rz-prev');
    if (bPrev) bPrev.textContent = state.lang === 'zh' ? '预览' : 'Preview';
  }

  /* ----------  EXPORT  ---------- */
  function exportPDF() {
    // Detailed variant has no prebuilt PDF — it's meant to be trimmed, then
    // sent to me via "Export Text" to generate the final PDF.
    if (state.variant === 'full') {
      toast(state.lang === 'zh'
        ? '详细版没有现成 PDF：删减后点"导出内容"发我生成 ✓'
        : 'Detailed has no prebuilt PDF — trim it, then use Export Text');
      return;
    }
    // Download the pre-rendered, print-formatted PDF (built by the export pipeline)
    // instead of invoking the browser print dialog.
    const lang = (state.lang === 'zh') ? 'ZH' : 'EN';
    const file = 'YushiWang-Resume-' + lang + '.pdf';
    const a = document.createElement('a');
    a.href = 'resume/' + file;
    a.download = file;
    document.body.appendChild(a);
    a.click();
    a.remove();
    toast(state.lang === 'zh' ? '已下载排版版 PDF ✓' : 'Downloaded formatted PDF ✓');
  }

  // Dump the current (edited) content as JSON so it can be turned into a PDF.
  function dumpContent() {
    const fields = {};
    page.querySelectorAll('[data-rid]').forEach(n => {
      fields[n.getAttribute('data-rid')] = n.innerHTML.trim();
    });
    const payload = { variant: state.variant, lang: state.lang, tpl: state.tpl,
                      savedAt: Date.now(), fields: fields };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'resume-content-' + state.variant + '-' + state.lang + '.json';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast(state.lang === 'zh' ? '已导出内容 JSON，发我即可生成 PDF ✓' : 'Exported content JSON ✓');
  }

  /* ----------  TOAST  ---------- */
  let toastT = 0;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add('on');
    clearTimeout(toastT);
    toastT = setTimeout(() => toastEl.classList.remove('on'), 2400);
  }

  /* ----------  OPEN / CLOSE  ---------- */
  function open() {
    loadState();
    if (window.__lang === 'zh' && state.lang !== 'zh') state.lang = 'zh';
    if (window.__lang !== 'zh' && state.lang === 'zh' && !Object.keys(state.ov).length) state.lang = 'en';
    if (!built) buildShell();
    syncBar();
    render();
    document.body.classList.add('rz-open');
    ov.classList.add('on');
  }
  function close() {
    if (editing) setEdit(false);
    persist();
    ov.classList.remove('on');
    document.body.classList.remove('rz-open');
    if (hist) hist.classList.remove('on');
    if (fmt) fmt.classList.remove('on');
  }

  /* ----------  HOOK NAV BUTTON  ---------- */
  function init() {
    const btn = document.getElementById('resume-btn');
    if (btn) btn.addEventListener('click', e => { e.preventDefault(); open(); });
    const h = (location.hash || '').toLowerCase();
    if (h.indexOf('resume') >= 0) {
      if (h.indexOf('zh') >= 0) window.__lang = 'zh';
      else if (h.indexOf('en') >= 0) window.__lang = 'en';
      open();
    }
  }
  if (document.readyState === 'loading')
    document.addEventListener('DOMContentLoaded', init);
  else init();
})();
