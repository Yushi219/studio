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
      title: 'Design Technologist · Experience Designer&nbsp;&nbsp;—&nbsp;&nbsp;AEC · AIGC · Full-Stack',
      contact: 'yushiw620@gmail.com&nbsp;&nbsp;·&nbsp;&nbsp;Boston, MA <b>(+1) 213-706-9087</b>&nbsp;&nbsp;·&nbsp;&nbsp;Shanghai <b>(+86) 139-1616-4162</b>',
      photo: false,
      sums_h: 'Profile',
      sums: [
        { b: 'Background', t: 'Cross-disciplinary background in Building Science + Computer Science, with 4+ years at a global AEC design firm owning the full lifecycle of AI tools and web platforms — turning AIGC, multimodal interaction and complex AEC / BIM workflows into high-experience digital products.' },
        { b: 'Experience Design', t: 'Lead end-to-end UX — user research, interaction design, interactive prototyping and usability iteration — for technical tools used by 100+ architects, engineers and BIM teams; data-driven design refined through Google Analytics behavioral data and qualitative user feedback.' },
        { b: 'Impact', t: 'Incubated multiple 0→1 products; a sustainability platform won the AIA TAP Innovation Award and reached users in 85+ countries; an AI generation platform lifted design efficiency ~70% and saved $50,000+ in outsourcing cost.' },
        { b: 'Collaboration', t: 'As lead of the AI research group and the digital-technology community, drive cross-functional, globally distributed collaboration — building training systems and technical documentation that systematically raise an organization’s digital and AI capability.' },
        { b: 'Profile', t: 'Goal-oriented; quick to read the critical node of a problem, spot workflow bottlenecks and user pain points, and drive a technical breakthrough; strong product sense, communication and fast-learning ability.' }
      ],
      prj_h: 'Selected Projects',
      prj: [
        { name: 'Floorcast', sub: 'Experience Design · AI Spatial Simulation', date: '2025', li: [
          { b: 'Role', t: 'Designed an agent-based spatial-simulation platform that evaluates how people actually experience and use a building over time — translating role schedules, behavior and spatial memory into qualitative, human-level UX insight for early-stage design decisions.' },
          { b: 'Core', t: 'Per-agent behavioral parameters (focus, sociability, exploration, route variation) and a spatial-memory layer; AI agent interviews surface routines, frictions and perceived experience.' },
          { b: 'Impact', t: 'Turns raw simulation into qualitative feedback for scenario comparison and data-driven layout decisions.' } ] },
        { name: 'Promptitect', sub: 'Product & Experience Design · AI Prompt Engine', date: '2025', li: [
          { b: 'Role', t: 'Designed a closed-loop prompt-intelligence system that turns scattered, one-off AI experiments into a searchable, reusable, self-improving firm knowledge base.' },
          { b: 'Core', t: 'Knowledge Gallery, RAG case retrieval with match scores, an AI prompt builder, and a node-based generation board for model comparison.' },
          { b: 'Impact', t: 'Converts individual trial-and-error into shared, accumulating institutional knowledge.' } ] },
        { name: 'AI Video Generator', sub: 'Full-Stack & System Architecture · AIGC', date: '2025 — Present', li: [
          { b: 'Role', t: 'Led 0→1 design and development of an AI video platform, integrating Sora / Kling-class multimodal APIs into one end-to-end workflow.' },
          { b: 'Core', t: 'Internal storyboard tool with keyframe parsing, shot-intent recognition and cinematic-language optimization; customizable style and pacing per shot.' },
          { b: 'Impact', t: 'Cut architectural scheme-video production time ~60%; deployed on 3 university-lab projects for one-click presentation.' } ] },
        { name: 'Ask Tom', sub: 'Data & Front-End · Enterprise RAG', date: '2024 — Present', li: [
          { b: 'Role', t: 'Built an enterprise Retrieval-Augmented Generation platform with hybrid retrieval (semantic vectors + keyword + category filters) for the marketing and proposal teams.' },
          { b: 'Core', t: 'Source-grounded answers with page-level citations and in-app PDF preview; SQL Agent integration, feedback loop and regeneration.' },
          { b: 'Impact', t: 'Core infrastructure for the firm’s RFP / proposal intelligence transformation — verifiable, proposal-ready answers in the firm voice.' } ] },
        { name: 'PAYETTE Places', sub: 'UI/UX & Full-Stack · Digital Brand Portal', date: '2024 — 2025', li: [
          { b: 'Role', t: 'Designed and built the firm’s public digital brand portal and interactive project tour for the 2025 AIA Conference — the company’s digital business card.' },
          { b: 'Core', t: 'React / Node.js; interactive map, AR display and dynamic data visualization; responsive web & mobile; QR business-card lead-in with Google Maps wayfinding.' },
          { b: 'Impact', t: '~300 visitors in a single open-day; amplified via official blog & Instagram; became the firm’s technical brand benchmark.' } ] }
      ],
      exp_h: 'Professional Experience',
      exp: [
        { name: 'PAYETTE', at: 'Boston, MA', sub: 'Design Technologist · cross-team tools, AI research & digital enablement', date: 'June 2022 — Present', li: [
          { b: 'Scope', t: 'Embedded with three groups — Building Science, Space Strategy and Design Visualization — owning research → UX → interaction design → full-stack development → Azure deployment for 10+ tools (web apps, Rhino / Grasshopper & Dynamo plugins, AR/VR); 50–80% workflow efficiency gains.' },
          { b: 'Building Science', t: 'Parametric façade & massing, sun-path / daylight and performance-informed tools; reusable Rhino.Inside & Grasshopper-SDK components, plus Solar Comfort (JS + Python, global weather data, real-time comfort heatmaps).' },
          { b: 'Space Strategy', t: 'DWG→web space-programming platforms (Floorish, Sectioneer, MassIt) and Speckle → Power BI / Tableau / D3 dashboards (occupancy heatmaps, chord diagrams) with an interactive client-feedback tool — data-driven planning & client engagement.' },
          { b: 'Design Viz & Immersive', t: 'Kaleidoscope embodied-carbon platform (React; AIA TAP Innovation Award, 85+ countries), the PAYETTE Places digital brand portal (React / Node, interactive map, AR, responsive) for AIA 2025, plus multi-user healthcare VR mockups (Unity / C# / Meta Quest / Normcore) and iPad on-site / on-model AR (iOS ARKit).' },
          { b: 'AI Research Lead', t: 'Founded & led the firm’s AI research group: from the early Stable Diffusion era (17 ComfyUI image-to-image scripts, 25+ company-style LoRA models trained via Kohya) to the GPT-Image / Nano-Banana era (prompt-engineering playbooks, cross-project testing), building the Promptitect closed-loop prompt-intelligence ecosystem; AI pipeline lifted design efficiency ~70% and saved $50,000+ outsourcing across 5 projects incl. Yale lab.' },
          { b: 'Digital Enablement', t: 'Founded & led the Computational Design Community (100+ designers): a searchable, version-controlled script library, Grasshopper online courses, a continuous video-tutorial series, monthly leadership reports and the annual AI showcase.' } ] },
        { name: 'Dowbuilt', at: 'Seattle, WA', sub: 'Digital Construction Project Engineer', date: 'Dec 2021 — June 2022', li: [
          { b: 'BIM Automation', t: 'Built a Python / Revit BIM-modeling & automated quantity-take-off system; parametric modules turn a model into a one-click material list & cost estimate — take-off efficiency +90% (days → minutes), reduced human error and real-time cost data for 10+ high-end residential projects.' },
          { b: 'Pre-construction & Field', t: 'Grasshopper / Dynamo / Python for excavation modeling, 4D schedule visualization, clash detection and CNC-ready fabrication; maintained shared GitHub script libraries; weekly coordination with PMs, superintendents and fabricators.' } ] }
      ],
      int_h: 'Internship',
      int: [
        { name: 'NBBJ', at: 'Seattle, WA', sub: 'Digital Design Specialist Intern', date: 'July — Sept 2021', li: [
          { b: 'UI/UX', t: 'Led a full UI/UX redesign of the firm’s digital-technology platform — an enterprise resource portal unifying tool search and technical-asset management — improving usability and cross-office collaboration.' },
          { b: 'Parametric R&D', t: 'Built parametric tools in Grasshopper / Dynamo (customizable brick-porosity script, solar-tracking façade generator, automated daylight-simulation tool); supported pilot projects and QA/QC adoption.' } ] }
      ],
      edu_h: 'Education',
      edu: [
        { l: 'University of Southern California', m: 'M.S. Building Science · GPA 4.0 / 4.0', r: 'Los Angeles · 2019 — 2021' },
        { l: 'Shanghai University of Engineering Science', m: 'B.S. Construction Management · GPA 4.0 / 4.0', r: 'Shanghai · 2016 — 2018' }
      ],
      sk_h: 'Skills & Certificate',
      sk: [
        { b: 'Experience & Research', t: 'User research (quantitative + qualitative) · Interaction design · Interactive prototyping · Usability testing · Data-driven design (Google Analytics) · Workflow analysis' },
        { b: 'Design', t: 'Figma · Adobe Creative Cloud · InDesign' },
        { b: 'Computational Design', t: 'Rhino · Grasshopper · Revit · Dynamo · Rhino.Inside · Power BI · Tableau · D3' },
        { b: 'Development', t: 'JavaScript · React · Node.js · Python · HTML/CSS · GitHub · Azure · Unity · C# · iOS ARKit' },
        { b: 'AI', t: 'Stable Diffusion (ComfyUI · Fooocus · Forge) · Kohya / LoRA · Runway · Krea · Rhino MCP w/ Claude · RAG' },
        { b: 'Certificate', t: 'LEED AP (USGBC, 2021)' },
        { b: 'Awards', t: '2022 ARCHITECT R+D Award & AIA TAP Innovation Award (Kaleidoscope) · IESLA Russell Cole Memorial Design Competition — Special Recognition, Advanced (2020)' }
      ]
    },
    zh: {
      name: '王雨施 <span style="opacity:.45;font-size:.62em;letter-spacing:.04em">Yushi Wang</span>',
      title: '设计技术专家 · 体验设计师&nbsp;&nbsp;—&nbsp;&nbsp;建筑科技 · AIGC · 全栈',
      contact: 'yushiw620@gmail.com&nbsp;&nbsp;·&nbsp;&nbsp;上海&nbsp;·&nbsp;<b>(+86) 139-1616-4162</b>',
      photo: true,
      sums_h: '个人优势',
      sums: [
        { b: '工作背景', t: '具备建筑科学与计算机科学的交叉学科背景，及 4 年海外设计公司负责 AI 工具与 Web 平台全流程开发的经验，专注于将 AIGC、多模态交互与复杂建筑 / BIM 工作流转化为高用户体验的数字产品。' },
        { b: '体验设计', t: '主导工具型产品的端到端 UX——用户研究、交互设计、交互原型与可用性迭代，服务 100+ 建筑师、工程师与 BIM 团队；以 Google Analytics 行为数据与定性用户反馈驱动数据化设计。' },
        { b: '以往成就', t: '主导多个从 0 到 1 的 Web 应用孵化，其中可持续设计平台荣获 AIA TAP 创新奖并服务全球超 85 国用户；构建的 AI 生成平台提升设计效率约 70% 并节约外包成本超 5 万美元。' },
        { b: '团队赋能', t: '作为 AI 研究小组与数字技术社团总负责人，推动跨职能、全球分布式协作，建立培训体系、沉淀技术文档，系统性提升组织的数字化与 AI 能力。' },
        { b: '综合素养', t: '目标导向型，善于把握事物关键节点，洞察流程瓶颈与用户痛点并驱动技术破局；具备出色的产品思维、沟通协调与快速学习能力。' }
      ],
      prj_h: '项目经历',
      prj: [
        { name: 'Floorcast', sub: '体验设计 · AI 空间仿真', date: '2025', li: [
          { b: '项目职责', t: '设计基于智能体的空间仿真平台，评估人们在长时间内如何真实地体验与使用建筑——将角色日程、行为与空间记忆转化为贴近真人、可指导早期设计决策的定性体验洞察。' },
          { b: '核心技术', t: '每个智能体含个性参数（专注度、社交性、探索倾向、路径变化）与空间记忆层；AI 智能体访谈呈现其日常、痛点与主观体验。' },
          { b: '量化成果', t: '将原始仿真转化为可用于方案对比与数据化布局决策的定性反馈。' } ] },
        { name: 'Promptitect', sub: '产品与体验设计 · AI 提示词引擎', date: '2025', li: [
          { b: '项目职责', t: '设计闭环式提示词智能系统，把零散、一次性的 AI 实验沉淀为可检索、可复用、能自我进化的公司知识库。' },
          { b: '核心技术', t: '知识画廊、带匹配度的 RAG 案例检索、AI 提示词构建器与节点式生成板（多模型对比）。' },
          { b: '量化成果', t: '把提示词工程从个人试错，变为可累积、可共享的组织知识。' } ] },
        { name: 'AI 视频生成器', sub: '全栈开发与系统架构 · AIGC', date: '2025 — 至今', li: [
          { b: '项目职责', t: '主导从 0 到 1 设计与开发 AI 视频生成平台，集成 Sora、Kling 等多模态大模型 API，构建端到端工作流。' },
          { b: '核心技术', t: '内部叙事画板工具，含关键帧智能解析、分镜意图识别与镜头语言优化，支持风格与节奏参数自定义。' },
          { b: '量化成果', t: '将建筑方案视频制作周期缩短约 60%；应用于 3 个大学实验室项目，实现一键生成。' } ] },
        { name: 'Ask Tom', sub: '数据与前端开发 · 企业级 RAG', date: '2024 — 至今', li: [
          { b: '项目职责', t: '构建企业级检索增强生成（RAG）平台，采用语义向量 + 关键词 + 类别筛选的混合检索，服务市场与提案团队。' },
          { b: '核心技术', t: '可溯源回答，含页级引用与应用内 PDF 预览；SQL Agent 集成、反馈闭环与重生成。' },
          { b: '量化成果', t: '已成为公司 RFP / 提案智能化转型的核心基础设施——可核验、可直接写进提案、符合公司语气。' } ] },
        { name: 'PAYETTE Places', sub: 'UI/UX 与全栈 · 数字品牌门户', date: '2024 — 2025', li: [
          { b: '项目职责', t: '为 2025 全美 AIA 大会设计并开发公司数字品牌门户与交互式项目导览，作为公司的数字名片。' },
          { b: '核心技术', t: 'React / Node.js；交互式地图、AR 展示与动态数据可视化；Web / 移动端自适应；二维码名片引流与 Google Maps 寻路。' },
          { b: '量化成果', t: '开放日单日约 300 名访客；通过官方 Blog / Ins 传播，成为公司技术品牌标杆。' } ] }
      ],
      exp_h: '工作经历',
      exp: [
        { name: 'PAYETTE', at: '波士顿', sub: '设计技术专家 · 跨组工具、AI 研究与数字化赋能', date: '2022 年 5 月 — 至今', li: [
          { b: '业务范围', t: '同时服务建筑科学、空间策略、设计可视化三个组，主导从需求 / 用户研究 → 交互设计 → 全栈开发 → Azure 部署的全流程，交付 Web、Rhino / Grasshopper 与 Dynamo 插件、AR/VR 等 10+ 工具，效能提升 50%–80%。' },
          { b: '建筑科学', t: '参数化立面与体量、日照 / 采光与性能分析工具；基于 Rhino.Inside 与 Grasshopper SDK 的可复用组件，以及 Solar Comfort（JS + Python，全球气象数据，实时舒适度热力图）。' },
          { b: '空间策略', t: 'DWG→网页的空间功能配置平台（Floorish、Sectioneer、MassIt），Speckle → Power BI / Tableau / D3 仪表盘（占用热力图、弦图）及交互式客户反馈工具——数据驱动的规划与客户沟通。' },
          { b: '可视化与沉浸式', t: 'Kaleidoscope 隐含碳平台（React；获 AIA TAP 创新奖，覆盖 85+ 国），2025 AIA 大会的 PAYETTE Places 数字品牌门户（React / Node、交互地图、AR、自适应），以及多人医疗 VR 样板间（Unity / C# / Meta Quest / Normcore）与 iPad 现场 / 实体模型 AR（iOS ARKit）。' },
          { b: 'AI 研究负责人', t: '创建并带领公司 AI 研究小组：从早期 Stable Diffusion 时代（17 个 ComfyUI 图生图脚本、用 Kohya 训练 25+ 个公司风格 LoRA 模型）到 GPT-Image / Nano-Banana 时代（提示词工程方法、跨项目测试），构建 Promptitect 闭环提示词智能生态；AI 管线提升设计效率约 70%，在含耶鲁实验室的 5 个项目中节省外包成本超 5 万美元。' },
          { b: '数字化赋能', t: '创建并主导 Computational Design Community（100+ 设计师）：可检索、版本化的脚本库，Grasshopper 在线课程，持续更新的视频教程系列，月度领导汇报与年度 AI 成果展。' } ] },
        { name: 'Dowbuilt', at: '西雅图', sub: '数字建筑项目工程师', date: '2021 年 12 月 — 2022 年 6 月', li: [
          { b: 'BIM 自动化', t: '主导基于 Python / Revit 的 BIM 建模与工料自动测算系统；参数化模块将模型一键转化为材料清单与成本预估——测算效率提升超 90%（数日→分钟级），降低人为误差，为 10+ 高端住宅项目提供即时成本数据。' },
          { b: '施工前期与现场', t: '用 Grasshopper / Dynamo / Python 实现挖掘建模、4D 进度可视化、碰撞检测与 CNC 可交付件；维护共享 GitHub 脚本库；每周与项目经理、现场主管、加工方协调。' } ] }
      ],
      int_h: '实习经历',
      int: [
        { name: 'NBBJ', at: '西雅图', sub: '数字设计专家（实习）', date: '2021 年 7 月 — 9 月', li: [
          { b: 'UI/UX', t: '主导公司数字技术平台的 UI/UX 全流程重构——打造集工具检索与技术资产管理于一体的企业级资源门户，提升可用性与跨办公室协作。' },
          { b: '参数化研发', t: '用 Grasshopper / Dynamo 开发参数化工具（砖墙孔隙率定制脚本、太阳追踪幕墙生成器、日光分析自动化工具）；支持试点项目与 QA/QC 推广。' } ] }
      ],
      edu_h: '教育经历',
      edu: [
        { l: '南加州大学 (USC)', m: '建筑科学 硕士 · GPA 4.0 / 4.0', r: '洛杉矶 · 2019 — 2021' },
        { l: '上海工程技术大学', m: '工程管理 学士 · GPA 4.0 / 4.0', r: '上海 · 2016 — 2018' }
      ],
      sk_h: '技能与证书',
      sk: [
        { b: '体验与研究', t: '用户研究（定量 + 定性）· 交互设计 · 交互原型 · 可用性测试 · 数据驱动设计（Google Analytics）· 工作流分析' },
        { b: '设计', t: 'Figma · Adobe Creative Cloud · InDesign' },
        { b: '计算性设计', t: 'Rhino · Grasshopper · Revit · Dynamo · Rhino.Inside · Power BI · Tableau · D3' },
        { b: '开发', t: 'JavaScript · React · Node.js · Python · HTML/CSS · GitHub · Azure · Unity · C# · iOS ARKit' },
        { b: 'AI', t: 'Stable Diffusion (ComfyUI · Fooocus · Forge) · Kohya / LoRA · Runway · Krea · Rhino MCP with Claude · RAG' },
        { b: '证书', t: 'LEED AP（USGBC，2021）' },
        { b: '获奖', t: '2022 ARCHITECT R+D 大奖 与 AIA TAP 创新奖（Kaleidoscope）· IESLA Russell Cole 纪念设计竞赛 — 高级组特别表彰（2020）' }
      ]
    }
  };

  const TPL = [
    { id: 'slate', en: 'Slate', zh: '岩蓝' },
    { id: 'mono',  en: 'Editorial', zh: '极简' },
    { id: 'serif', en: 'Classic', zh: '经典' },
    { id: 'ink',   en: 'Modern', zh: '现代' }
  ];

  /* ----------  STATE  ---------- */
  const defState = () => ({ tpl: 'slate', lang: (window.__lang === 'zh' ? 'zh' : 'en'),
                            ov: {}, off: {}, fs: {}, savedAt: 0 });
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
  let ov, page, stage, hist, fmt, toastEl, built = false;
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
    const d = D[state.lang];
    page.setAttribute('data-tpl', state.tpl);
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
    const lp = state.lang + '::';
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
    const bExp = mkBtn('Export PDF');
    const bSave = mkBtn('Save', 'rz-primary');
    const bHist = mkBtn('History');
    const bX = mkBtn('✕', 'rz-x');

    const div = () => el('span', 'rz-divider');
    [bEdit, div(), sel, div(), bLang, div(), bExp, bSave, bHist, div(), bX]
      .forEach(n => bar.appendChild(n));

    stage = el('div', 'rz-stage');
    page = el('div', 'rz-page');
    stage.appendChild(page);

    hist = el('div', 'rz-hist');
    fmt = el('div', 'rz-fmt');
    fmt.innerHTML = '<button data-fz="-1">A−</button><span class="fs-val">·</span>' +
      '<button data-fz="1">A+</button><button data-b="1"><b>B</b></button>';
    toastEl = el('div', 'rz-toast');

    ov.appendChild(bar);
    ov.appendChild(stage);
    ov.appendChild(hist);
    ov.appendChild(fmt);
    ov.appendChild(toastEl);
    document.body.appendChild(ov);

    /* --- wiring --- */
    bX.addEventListener('click', close);
    bEdit.addEventListener('click', () => setEdit(!editing));
    sel.addEventListener('change', () => { state.tpl = sel.value; render(); persist(); });
    bLang.addEventListener('click', () => {
      state.lang = state.lang === 'zh' ? 'en' : 'zh';
      bLang.textContent = state.lang === 'zh' ? 'EN' : '中文';
      TPL.forEach((t, i) => { sel.options[i].textContent = t[state.lang] || t.en; });
      render(); persist();
    });
    bExp.addEventListener('click', exportPDF);
    bSave.addEventListener('click', saveSnapshot);
    bHist.addEventListener('click', () => { hist.classList.contains('on') ? hist.classList.remove('on') : openHist(); });

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
      const t = e.target.closest('[data-rid]'); if (t) { saveOverride(t); autoSave(); }
    });

    document.addEventListener('keydown', e => {
      if (!ov.classList.contains('on')) return;
      if (e.key === 'Escape') { if (editing) setEdit(false); else close(); }
    });
    document.addEventListener('langchange', () => {
      if (!ov || !ov.classList.contains('on')) return;
      state.lang = window.__lang === 'zh' ? 'zh' : 'en';
      bLang.textContent = state.lang === 'zh' ? 'EN' : '中文';
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
    state.ov[state.lang + '::' + rid] = node.innerHTML;
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
  }

  /* ----------  EXPORT  ---------- */
  function exportPDF() {
    if (editing) setEdit(false);
    hist.classList.remove('on'); fmt.classList.remove('on');
    document.documentElement.classList.add('rz-printing');
    setTimeout(() => {
      window.print();
      setTimeout(() => document.documentElement.classList.remove('rz-printing'), 400);
    }, 60);
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
  }
  if (document.readyState === 'loading')
    document.addEventListener('DOMContentLoaded', init);
  else init();
})();
