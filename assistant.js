// ---------- AI Assistant — "digital twin" (offline KB + optional LLM) ----------
(() => {
  const root = document.getElementById('asst');
  if (!root) return;
  const btn = document.getElementById('ask-ai-btn');
  const bg = root.querySelector('.asst-bg');
  const closeB = document.getElementById('asst-close');
  const ansEl = document.getElementById('asst-answer');
  const resEl = document.getElementById('asst-res');
  const tagsEl = document.getElementById('asst-tags');
  const qEl = document.getElementById('asst-q');
  const sendB = document.getElementById('asst-send');
  const CFG = window.ASSISTANT_CONFIG || {};

  // Chat history persists per browser (survives refresh / reopen)
  const LSKEY = 'yw_chat_v1';
  let THREAD = [];
  try { THREAD = JSON.parse(localStorage.getItem(LSKEY) || '[]') || []; } catch (e) { THREAD = []; }
  function saveThread() {
    try { localStorage.setItem(LSKEY, JSON.stringify(THREAD.slice(-40))); } catch (e) {}
  }

  // ---- Digital-twin reaction video (panel corner) + homepage backdrop ----
  const twinEl = document.getElementById('asst-twin');
  const TWIN = { typing: 'dm-think', thinking: 'dm-search', yes: 'dm-yes', sleep: 'dm-sleep' };
  const NONSLEEP = ['dm-good', 'dm-read', 'dm-search', 'dm-think', 'dm-yes'];
  const rnd = a => a[Math.floor(Math.random() * a.length)];
  let twinState = '', idleTimer = null, idleSeq = [], idlePos = 0, rotTimer = null;
  function shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = (Math.random() * (i + 1)) | 0; [a[i], a[j]] = [a[j], a[i]]; } return a; }

  function playFile(name, loop) {
    if (!twinEl) return;
    twinEl.loop = !!loop;
    twinEl.src = 'assets/dm/' + name + '.mp4';
    twinEl.load();
    twinEl.play().catch(() => {});
  }
  function idleNext() {
    if (twinState !== 'idle' || !twinEl) return;
    idlePos = (idlePos + 1) % idleSeq.length;
    if (idlePos === 0) idleSeq = shuffle(NONSLEEP);   // reshuffle each full cycle
    playFile(idleSeq[idlePos], false);
    clearTimeout(rotTimer);
    rotTimer = setTimeout(idleNext, 7000);            // watchdog: always keep switching
  }
  function setTwin(state) {
    if (!twinEl || state === twinState) return;
    twinState = state;
    clearTimeout(rotTimer);
    if (state === 'idle') {
      idleSeq = shuffle(NONSLEEP); idlePos = 0;
      playFile(idleSeq[0], false);
      rotTimer = setTimeout(idleNext, 7000);
    } else {
      playFile(TWIN[state] || NONSLEEP[0], true);     // reaction clips loop while in that state
    }
  }
  twinEl && twinEl.addEventListener('ended', () => {
    if (twinState === 'idle') idleNext();             // advance as soon as a clip finishes
  });
  function twinYesThenIdle() {
    setTwin('yes');
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => { if (twinState === 'yes') setTwin('idle'); }, 5000);
  }
  if (twinEl) twinEl.preload = 'auto';

  // Pre-warm every clip into the media cache so state switches don't re-buffer (= no stutter)
  const DM_ALL = ['dm-good', 'dm-read', 'dm-search', 'dm-think', 'dm-yes', 'dm-sleep'];
  const _warm = [];
  DM_ALL.forEach(n => {
    const w = document.createElement('video');
    w.src = 'assets/dm/' + n + '.mp4';
    w.preload = 'auto'; w.muted = true; w.playsInline = true;
    try { w.load(); } catch (e) {}
    _warm.push(w); // keep a reference so the buffer is not discarded
  });

  // Homepage backdrop: keep cycling random clips (never the sleep one)
  (function () {
    const v = document.getElementById('ask-bgvid');
    if (!v) return;
    v.preload = 'auto'; v.loop = false; v.muted = true;
    let seq = shuffle(NONSLEEP), pos = 0, t = null;
    function go() {
      v.src = 'assets/dm/' + seq[pos] + '.mp4';
      v.load();
      v.play().catch(() => {});
      clearTimeout(t);
      t = setTimeout(next, 7000);   // watchdog so it always keeps switching
    }
    function next() {
      pos = (pos + 1) % seq.length;
      if (pos === 0) seq = shuffle(NONSLEEP);
      go();
    }
    v.addEventListener('ended', next);
    go();
  })();

  const KB = [
    { key: 'profile', t: 'About Yushi', ch: 'Profile', open: false,
      tags: 'who are you yushi wang background skills education role payette boston shanghai 你是谁 简介 背景 技能 教育 经历',
      en: 'I am Yushi Wang, a Design Technologist at PAYETTE (Boston). I turn workflow bottlenecks into elegant tools across computational design, AI, web, data-viz and immersive (AR/VR).',
      zh: '我是王雨施，PAYETTE（波士顿）的设计技术专家。我擅长把工作流程中的瓶颈与痛点转化为优雅的技术方案，覆盖计算性设计、AI、Web、数据可视化与沉浸式（AR/VR）。',
      detail: 'Yushi Wang — Design Technologist at PAYETTE. M.S. Building Science, USC (GPA 4.0). Skills: Rhino/Grasshopper/Revit/Dynamo, JS/React/Node/Python/C#, Stable Diffusion/ComfyUI/LoRA/RAG, Unity/ARKit, Power BI/Tableau. Led a 40+ member computational-design group and the firm AI research team.' },
    { key: 'ai1', t: 'Floorcast', ch: 'AI', open: true,
      tags: 'floorcast agent simulation spatial behavior schedule spatial memory ai interview circulation congestion 智能体 仿真 空间 行为 日程 记忆 动线',
      en: 'Floorcast is an AI agent-based spatial simulation: occupants follow realistic role-based daily routines, each with focus/sociability/exploration parameters and a spatial-memory layer; you can AI-interview any agent.',
      zh: 'Floorcast 是基于智能体的 AI 空间仿真：使用者按角色遵循真实日程，每个体含专注度/社交性/探索等参数与空间记忆层，并可对任意智能体进行 AI 访谈。',
      detail: 'Floorcast: agent-based spatial simulation that reconstructs role schedules, per-agent behavior (focus, sociability, exploration, destination preference, route variation), a spatial-memory layer (crowding/comfort/familiarity/delays), and AI interviews. Outputs circulation, congestion, utilization and social-interaction insight for early design.' },
    { key: 'ai2', t: 'Promptitect', ch: 'AI', open: true,
      tags: 'promptitect prompt knowledge base rag comfyui gpt image nano banana generation board closed loop 提示词 渲染 知识库 闭环',
      en: 'Promptitect is an AI prompt-intelligence + image-generation platform: a searchable prompt knowledge gallery, RAG retrieval, selective reference extraction, and a node-based generation board that compares image models — a closed loop that improves itself.',
      zh: 'Promptitect 是 AI 提示词智能 + 图像生成平台：可检索的提示词知识画廊、RAG 检索、参考图按需提取、节点式生成板对比模型，形成自我改进的闭环。',
      detail: 'Promptitect connects an internal prompt knowledge base with RAG retrieval, structured prompt decomposition, selective reference extraction, and a node-based generation board (GPT Image, Nano Banana Pro). Closed loop: good results return to the gallery and improve future prompts.' },
    { key: 'ai3', t: 'AI Video Generator', ch: 'AI', open: true,
      tags: 'ai video generator motion storyboard sora kling walkthrough animation 视频 生成 动画 漫游',
      en: 'AI Video Generator turns still concept frames into animated walkthroughs and atmosphere studies via an internal storyboard tool + multimodal video models — cutting scheme-video time about 60 percent.',
      zh: 'AI 视频生成器通过内部叙事画板 + 多模态视频模型，把静态概念帧变成动态漫游与氛围演示，方案视频制作周期缩短约 60%。',
      detail: 'AI Video Generator: keyframe parsing, shot-intent recognition, cinematic-language optimization; integrates Sora/Kling-class APIs; ~60% faster scheme video; used on 3 university-lab projects.' },
    { key: 'ai4', t: 'Ask Tom', ch: 'AI', open: true,
      tags: 'ask tom rag enterprise proposal knowledge retrieval citation pdf sql agent 检索 提案 知识 引用',
      en: 'Ask Tom is an enterprise RAG over PAYETTE proposals/case-studies/awards: hybrid vector+keyword retrieval, source-grounded answers with page-level citations and in-app PDF preview — built for the Marketing/proposal teams.',
      zh: 'Ask Tom 是面向 PAYETTE 提案/案例/获奖资料的企业级 RAG：向量+关键词混合检索，带页级引用与应用内 PDF 预览的可溯源回答，服务市场与提案团队。',
      detail: 'Ask Tom: two-stage RAG (offline parse/chunk/embed/tag + online hybrid retrieval), source cards, page-level citation, PDF preview, SQL Agent, feedback/regeneration; foundation for firm-wide proposal intelligence.' },
    { key: 'web1', t: 'Healthcare 3D Simulation', ch: 'Web Tools', open: true,
      tags: 'healthcare unity 3d agent navmesh circulation nurse patient workflow simulation 医疗 仿真 动线 护士 患者',
      en: 'A Unity 3D agent simulation: role-specific healthcare routines (nursing rounds, patient rooms, visitation), NavMesh-driven circulation/congestion/utilization analysis to compare layouts before construction.',
      zh: '一个 Unity 3D 智能体仿真：医护按角色的真实流程（巡查、病房、探视），基于 NavMesh 分析动线/拥堵/利用率，在施工前对比布局。',
      detail: 'Healthcare 3D Simulation: layered agent behavior (schedule + destination priority + preference + personality + stochastic routes); healthcare workflows; quantifies circulation, congestion, queuing, room utilization, staff-patient contact.' },
    { key: 'web2', t: 'Kaleidoscope', ch: 'Web Tools', open: true,
      tags: 'kaleidoscope embodied carbon react sustainability award metropolis aia tap architect r+d 隐含碳 可持续 获奖',
      en: 'Kaleidoscope is a React embodied-carbon platform with live material charts. 26,690+ views, 85 countries; won the 2022 ARCHITECT R+D and AIA TAP Innovation Awards; featured in Metropolis.',
      zh: 'Kaleidoscope 是基于 React 的建筑隐含碳平台，含实时材料图表。累计访问 26,690+、覆盖 85 国；荣获 2022 ARCHITECT R+D 与 AIA TAP 创新奖，并获《Metropolis》报道。',
      detail: 'Kaleidoscope: real-time embodied-carbon assessment for early design; 26,690+ views, 500-1,000 monthly visits, 85 countries; 2022 ARCHITECT R+D + AIA TAP Innovation Awards; Metropolis feature.' },
    { key: 'web3', t: 'Solar Comfort', ch: 'Web Tools', open: true,
      tags: 'solar comfort thermal visual facade weather heatmap javascript python 热舒适 立面 气象 热力图',
      en: 'Solar Comfort (JS + Python) integrates global weather data for real-time facade thermal and visual comfort feedback via color heatmaps. 1,669 visits, 49 countries.',
      zh: 'Solar Comfort（JS + Python）集成全球气象数据，用彩色热力图实时反馈立面热/视觉舒适度。累计访问 1,669，覆盖 49 国。',
      detail: 'Solar Comfort: orientation/daylighting/shading trade-offs evaluated interactively; publicly recognized on LinkedIn by industry leaders.' },
    { key: 'web4', t: 'Floorish', ch: 'Web Tools', open: true,
      tags: 'floorish plan fusion dwg excel floorplan coloring pdf grasshopper json 平面图 上色 导出',
      en: 'Floorish links Excel room data to interactive DWG floorplans with auto area coloring and one-click print-ready PDF — drawing cycle cut from 1-2 weeks to 1-2 days.',
      zh: 'Floorish 把 Excel 房间数据对接交互式 DWG 平面图，自动上色并一键导出印刷就绪 PDF——制图周期从 1-2 周压缩到 1-2 天。',
      detail: 'Floorish (Plan Fusion): Grasshopper pre-processes CAD to JSON; web handles coloring and export; built and deployed on Azure within a month.' },
    { key: 'web5', t: 'Sectioneer', ch: 'Web Tools', open: true,
      tags: 'sectioneer section design drag stack departmental layout azure 剖面 设计 堆叠 部门',
      en: 'Sectioneer makes early section/massing playful and precise: drag and stack to generate building form in real time, auto multi-version departmental layouts; about 80 percent manual redraw time saved.',
      zh: 'Sectioneer 让早期剖面/体量推敲既灵活又精准：拖放堆叠实时生成形体，自动多版本部门布局；节省约 80% 手动重绘时间。',
      detail: 'Sectioneer: real-time parametric section adjustment during client meetings; built and deployed on Azure within a month.' },
    { key: 'uiux', t: 'PAYETTE Places', ch: 'UI/UX', open: true,
      tags: 'payette places aia conference qr business card map google maps facade tour 导览 名片 二维码 地图',
      en: 'PAYETTE Places is a public digital project-tour for the 2025 AIA Conference — the QR on the business card opens an interactive Boston map of 8 projects with Google Maps wayfinding; about 300 visitors in one open-day.',
      zh: 'PAYETTE Places 是为 2025 AIA 大会打造的公众数字导览——名片二维码打开 8 个波士顿项目的交互地图与 Google Maps 寻路；开放日单日约 300 名访客。',
      detail: 'PAYETTE Places: project detail pages, photo tours, animated facade diagrams; fully responsive; a digital brand front door, not a static brochure.' },
    { key: 'arvrar', t: 'AR on-site / on-model', ch: 'AR/VR', open: true,
      tags: 'ar ipad on-site on-model full-scale facade material color jhu hillco 现场 实体模型 材质',
      en: 'Custom iPad AR across 7 projects: place full-scale models on real sites, and switch components/materials directly on physical models — sharpening client engagement and on-site decisions.',
      zh: '覆盖 7 个项目的定制 iPad AR：在真实现场放置等比例模型，并在实体模型上直接切换构件/材质——增强客户参与与现场决策。',
      detail: 'AR: on-site full-scale overlays + on-model component/material switching across JHU, White Plains Hospital, 232 A Street, Hillco.' },
    { key: 'arvrvr', t: 'Interactive Virtual Mockup', ch: 'AR/VR', open: true,
      tags: 'vr meta quest mockup healthcare unity rhino revit equipment ceiling multiplayer 样板间 设备 吊顶 多人',
      en: 'A Unity/Meta Quest VR mockup — a digital extension of physical healthcare mockups: navigate full-scale rooms, operate medical equipment, catch conflicts invisible in 2D, screenshot + speech-to-text notes, early multiplayer review.',
      zh: '基于 Unity/Meta Quest 的 VR 样板间——实体样板间的数字延伸：等比例房间漫游、操作医疗设备、发现 2D 看不到的冲突、截图+语音转文字记录、早期多人评审。',
      detail: 'IVM: built from cleaned Rhino/Revit models split into interactive components; v1 basics, v2 realism + button-driven equipment, v3 ceiling trusses + multiplayer.' },
    { key: 'dv1', t: 'Space Strategy Web Tool', ch: 'Data Viz', open: true,
      tags: 'space strategy programming dashboard stacking budget scenario waterfall radar 空间策略 配置 堆叠 预算 方案',
      en: 'A web space-strategy and programming dashboard: user groups, block and stacking, departmental distribution, budget and scenario comparison with live sliders and rich charts.',
      zh: '网页空间策略与功能配置仪表盘：用户群体、体块堆叠、部门分布、预算与方案对比，含实时滑块与丰富图表。',
      detail: 'Space Strategy Web Tool: live KPIs (area/efficiency/cost/delta); waterfall/radar/stacked/section diagrams; lightweight decision support replacing spreadsheets.' },
    { key: 'dv2', t: 'PAYETTE Lens', ch: 'Data Viz', open: true,
      tags: 'payette lens power bi ai analytics dashboard natural language chart portfolio 商业智能 图表 自然语言',
      en: 'PAYETTE Lens is an AI-assisted, Power BI-style analytics platform: ask in natural language, it generates/refines charts and adds them to the dashboard; auto record matching on imported project history.',
      zh: 'PAYETTE Lens 是 AI 辅助、类 Power BI 的分析平台：自然语言提问即生成/修改图表并加入仪表盘；导入历史项目自动匹配。',
      detail: 'PAYETTE Lens: KPI cards, portfolio filters, project search, conversational chart generation — from question to chart to insight without manual setup.' },
    { key: 'dv3', t: 'Pulse', ch: 'Data Viz', open: true,
      tags: 'pulse survey building floor map client feedback 调研 反馈 楼层',
      en: 'Pulse is a web survey platform with building and floor maps — clients leave targeted feedback on specific rooms across education and science projects.',
      zh: 'Pulse 是带建筑与楼层地图的网页调研平台——客户在教育与科研项目中针对具体房间提交精准反馈。',
      detail: 'Pulse: room/building-level targeted feedback collection on interactive plans.' },
    { key: 'dv4', t: 'MassIt', ch: 'Data Viz', open: true,
      tags: 'massit rhino grasshopper plugin massing section plan area metrics 体量 插件 面积',
      en: 'MassIt is a Rhino plug-in (via Grasshopper) giving real-time sectional and plan views with department-specific area metrics during massing iterations.',
      zh: 'MassIt 是基于 Grasshopper 的 Rhino 插件，在体量推敲中实时给出剖面/平面与按部门细分的面积指标。',
      detail: 'MassIt: keeps program area in check while the form is still fluid.' },
    { key: 'dv5', t: 'Power BI · Tableau', ch: 'Data Viz', open: true,
      tags: 'power bi tableau speckle revit json occupancy heatmap chord dashboard 占用 热力图 弦图',
      en: 'Architectural data fused with floor plans via Speckle: Power BI color-coded plans and Tableau occupancy heatmaps/chord diagrams for space planning and client conversations.',
      zh: '通过 Speckle 将建筑数据与平面图融合：Power BI 彩色编码平面图与 Tableau 占用热力图/弦图，服务空间规划与客户沟通。',
      detail: 'Power BI / Tableau: Revit geometry to JSON via Speckle; annual occupancy heatmaps inform planning.' },
    { key: 'reading', t: 'Reading now', ch: 'Personal', open: false,
      tags: 'reading book read now lately project hail mary andy weir novel film movie hobby 最近 在看 读 书 小说 电影 兴趣 业余',
      en: "Right now I'm reading Project Hail Mary by Andy Weir. I caught the film recently and absolutely loved how playful and inventive it is — that science-as-adventure energy is so my thing — so I went straight to the original novel. Honestly it reads a lot like how I like to work: a hard problem, way too much curiosity, and improvising your way to something that actually flies.",
      zh: "最近在读安迪·威尔的《Project Hail Mary（挽救计划）》。前阵子看了电影，太喜欢它那种好玩又脑洞大开的劲儿——这种“把科学当冒险”的能量特别对我胃口——于是直接去啃原著了。说真的，它读起来很像我做项目的方式：一个硬核难题、一肚子好奇心，然后即兴地把它捣鼓到真能跑起来。",
      detail: "Currently reading Project Hail Mary (Andy Weir); loved the film, now on the novel; it mirrors her curious, improvisational, problem-solving working style." },
    { key: 'why', t: 'Why hire me', ch: 'Personal', open: false,
      tags: 'why hire me reasons reject refuse 10 ten cannot say no 无法拒绝 理由 为什么 招 录用 选我 优势 卖点 hire',
      en: "Ten reasons, fast: 1) I ship 0 to 1 — owned 30+ tools end to end, from need to deploy. 2) Architecture + CS double background, so I speak both designer and engineer. 3) Real impact: an AI pipeline that lifted design efficiency ~70% and saved $50K+; an award-winning platform used in 85 countries. 4) Full-stack — JS/React/Node/Python + Azure — plus deep AIGC, Stable Diffusion control and enterprise RAG. 5) I turn workflow bottlenecks into elegant tools other teams can actually maintain. 6) I led a 40+ person digital group and the AI research team — I level people up, not just code. 7) Strong product sense: I sweat the user experience, not only the tech. 8) Fast, self-driven learner who keeps evolving with the tooling. 9) Bilingual and globally minded — easy to work with across teams and time zones. 10) I'm an ENFJ who genuinely loves this stuff — curious, high-energy, and I make the people around me better. Kind of hard to say no to, right? 😉",
      zh: "十个理由，快问快答：1）我能把 0 做到 1——独立交付过 30+ 工具，从需求到上线全流程。2）建筑 + 计算机双背景，设计师和工程师的话我都能讲。3）真实战绩：一条 AI 管线把设计效率提升约 70%、节省 5 万+ 美元；一个获奖平台被 85 个国家使用。4）全栈——JS/React/Node/Python + Azure——还深耕 AIGC、Stable Diffusion 控制与企业级 RAG。5）我把流程瓶颈变成别人也维护得动的优雅工具。6）带过 40+ 人数字社团和 AI 研究团队——我不只写代码，还能带人成长。7）产品感强：不只抠技术，更抠用户体验。8）学习快、自驱强，能跟着工具一起进化。9）双语、国际视野，跨团队跨时区都好合作。10）我是个真心热爱这行的 ENFJ——好奇、能量高，还能让身边的人变更好。是不是有点难拒绝？😉",
      detail: "Hire case: 0->1 ownership of 30+ tools; architecture+CS background; ~70% efficiency gain and $50K+ saved; award-winning platform in 85 countries; full-stack + AIGC/RAG; led 40+ digital group and AI team; product sense; fast learner; bilingual; ENFJ team multiplier." }
  ];

  const SAMPLES = [
    { en: 'Which project saved the most money?', zh: '哪个项目最省钱？' },
    { en: 'How does Floorcast simulate people?', zh: 'Floorcast 怎么模拟人的行为？' },
    { en: 'Which AI tools do you use?', zh: '你常用哪些 AI 工具？' },
    { en: 'What is your most challenging project?', zh: '你最有挑战的项目是哪个？' },
    { en: '10 reasons you cannot reject me', zh: '无法拒绝我的 10 个理由' },
    { en: 'What are you reading lately?', zh: '你最近在看什么书？' }
  ];

  const isZh = () => window.__lang === 'zh';

  function renderTags() {
    tagsEl.innerHTML = '';
    SAMPLES.forEach(s => {
      const b = document.createElement('button');
      b.className = 'asst-tag'; b.type = 'button'; b.setAttribute('data-cursor', 'link');
      b.textContent = isZh() ? s.zh : s.en;
      b.addEventListener('click', () => { qEl.value = b.textContent; qEl.focus(); setTwin('typing'); });
      tagsEl.appendChild(b);
    });
    qEl.setAttribute('placeholder', isZh() ? (qEl.getAttribute('data-zh-ph') || '输入一个问题…') : 'Type a question…');
  }

  function score(entry, q) {
    const hay = (entry.t + ' ' + entry.tags + ' ' + entry.en + ' ' + entry.zh).toLowerCase();
    let s = 0;
    (q.toLowerCase().match(/[a-z0-9]{2,}/g) || []).forEach(w => { if (hay.indexOf(w) >= 0) s += 2; });
    (q.match(/[一-龥]+/g) || []).forEach(run => {
      for (let i = 0; i < run.length; i++) {
        const bi = run.substr(i, 2);
        if (bi.length === 2 && hay.indexOf(bi) >= 0) s += 2;
        else if (hay.indexOf(run[i]) >= 0) s += 1;
      }
    });
    return s;
  }
  function rank(q) {
    return KB.map(e => ({ e, s: score(e, q) })).filter(x => x.s > 0).sort((a, b) => b.s - a.s).map(x => x.e);
  }

  function keysOf(list) { return list.filter(e => e.open).slice(0, 4).map(e => e.key); }
  function showKeys(keys) {
    resEl.innerHTML = '';
    (keys || []).forEach(k => {
      const e = byKey[k];
      if (!e || !e.open) return;
      const c = document.createElement('button');
      c.className = 'asst-chip'; c.type = 'button'; c.setAttribute('data-cursor', 'link');
      c.textContent = (isZh() ? '查看 · ' : 'View · ') + e.t;
      c.addEventListener('click', () => { if (window.__openProject) window.__openProject(k); });
      resEl.appendChild(c);
    });
  }

  function appendTurn(q, text) {
    const hint = ansEl.querySelector('.asst-hint');
    if (hint) hint.remove();
    const turn = document.createElement('div');
    turn.className = 'a-turn';
    const ql = document.createElement('div'); ql.className = 'a-q'; ql.textContent = q;
    const a = document.createElement('p'); a.textContent = text;
    turn.appendChild(ql); turn.appendChild(a);
    ansEl.appendChild(turn);
    ansEl.scrollTop = ansEl.scrollHeight;
  }
  // Commit a turn: render, persist, show its resources
  function respond(q, text, keys) {
    THREAD.push({ q: q, a: text, r: keys || [] });
    saveThread();
    appendTurn(q, text);
    showKeys(keys || []);
  }
  function renderThread() {
    ansEl.innerHTML = '';
    if (!THREAD.length) {
      const p = document.createElement('p');
      p.className = 'asst-hint';
      p.textContent = isZh()
        ? '嗨，我是数字分身版的雨施 👋 关于我的项目、技能、经历，尽管问——我会用自己的话回答，并在下面给你相关项目，一点就能展开看。'
        : 'Hi — I am the digital-twin version of Yushi 👋 Ask me anything about my projects, skills or path. I will answer in my own words and surface the related work below, one tap to dive in.';
      ansEl.appendChild(p);
      resEl.innerHTML = '';
      return;
    }
    THREAD.forEach(t => appendTurn(t.q, t.a));
    const last = THREAD[THREAD.length - 1];
    showKeys(last && last.r);
    ansEl.scrollTop = ansEl.scrollHeight;
  }

  const pick = a => a[Math.floor(Math.random() * a.length)];
  const LEAD_EN = ['Oh, good one — ', 'Happy you asked! ', 'Love this question. ', 'Short version: ', 'Here is the honest take — '];
  const LEAD_ZH = ['这个问题问得好——', '哈，我很爱聊这个。', '简单说，', '说点实在的——', '来，跟你讲讲：'];
  const CLOSE_EN = ['Want the full story? Tap the project below 👇', 'Curious how it actually works? Open it below — there is video.', 'There is more (and footage) in the project card below.', 'Pop the project open below if you want to nerd out on the details.'];
  const CLOSE_ZH = ['想看细节？点下面那个项目卡片就能展开（有视频）。', '好奇它怎么跑起来的？下面点开就能看。', '更完整的故事和影像都在下面的项目里。', '想深挖的话，下面那个卡片一点就开。'];
  const NO_EN = "Hmm, I do not have that one on hand yet — but I am the type who would happily go figure it out. Meanwhile, here are a few projects I am proud of; ask me about any of them.";
  const NO_ZH = '诶，这个我手头暂时没有现成资料——不过我向来是那种很乐意去把它搞明白的人。先看看下面这几个我挺得意的项目吧，随便挑一个问我都行。';

  function localAnswer(q) {
    const r = rank(q);
    if (!r.length) {
      respond(q, isZh() ? NO_ZH : NO_EN, keysOf(KB.filter(e => e.open).slice(0, 4)));
      twinYesThenIdle();
      return;
    }
    const top = r.slice(0, 3);
    const facts = top.slice(0, 2).map(e => isZh() ? e.zh : e.en).join(' ');
    const body = (isZh() ? pick(LEAD_ZH) : pick(LEAD_EN)) + facts +
      ' ' + (top[0].open ? (isZh() ? pick(CLOSE_ZH) : pick(CLOSE_EN)) : '');
    respond(q, body.trim(), keysOf(top));
    twinYesThenIdle();
  }

  async function llmAnswer(q) {
    const kbText = KB.map(e => '• ' + e.t + ' [' + e.ch + ']: ' + e.detail + ' (keywords: ' + e.tags + ')').join('\n');
    const messages = [
      { role: 'system', content: (CFG.persona || 'You are the digital twin of Yushi Wang.') + '\n\nKNOWLEDGE BASE:\n' + kbText },
      { role: 'user', content: q }
    ];
    let text = '';
    if (CFG.proxyUrl) {
      const res = await fetch(CFG.proxyUrl, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: messages, model: CFG.model || 'gpt-4o-mini' })
      });
      const j = await res.json();
      text = j.text || (j.choices && j.choices[0] && j.choices[0].message && j.choices[0].message.content) || '';
    } else if (CFG.apiKey) {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + CFG.apiKey },
        body: JSON.stringify({ model: CFG.model || 'gpt-4o-mini', messages: messages, temperature: 0.4 })
      });
      const j = await res.json();
      text = (j.choices && j.choices[0] && j.choices[0].message && j.choices[0].message.content) || '';
    }
    return text.trim();
  }

  // Friendly, on-voice message shown whenever the AI call errors out
  const AI_ERR = [
    "Ah — Yushi ran off on vacation with the API key tucked in her backpack. 🧳 Shoot her an email and she'll sprint back to squash this bug. Meanwhile, the projects below still have the good stuff 👇",
    "Plot twist: the API key is sunbathing somewhere with Yushi right now. ☀️ Email her to hurry home and debug me — until then, poke around the projects below.",
    "My AI brain is briefly offline — Yushi took the API key on a trip. ✈️ A quick email will summon her back to fix it. Try a project card below in the meantime!",
    "Looks like the API key went hiking with Yushi and lost signal. 📵 Drop her a line to come rescue me — the related projects below are still wide awake."
  ];
  function aiError(q) {
    respond(q, AI_ERR[Math.floor(Math.random() * AI_ERR.length)], keysOf(rank(q)));
    clearTimeout(idleTimer);
    setTwin('sleep');
  }

  async function ask() {
    const q = (qEl.value || '').trim();
    if (!q) return;
    qEl.value = '';
    setTwin('thinking');
    if (CFG.proxyUrl || CFG.apiKey) {
      showKeys(keysOf(rank(q)));
      const loadEl = ansEl.querySelector('.asst-hint'); if (loadEl) loadEl.remove();
      ansEl.classList.add('loading');
      ansEl.scrollTop = ansEl.scrollHeight;
      try {
        const text = await llmAnswer(q);
        ansEl.classList.remove('loading');
        if (text) { respond(q, text, keysOf(rank(q))); twinYesThenIdle(); }
        else aiError(q);
      } catch (e) {
        ansEl.classList.remove('loading');
        aiError(q);
      }
    } else {
      localAnswer(q);
    }
  }

  function open() {
    renderTags();
    renderThread();
    root.classList.add('open');
    root.setAttribute('aria-hidden', 'false');
    twinState = ''; setTwin('idle');
    setTimeout(() => qEl && qEl.focus(), 420);
  }
  function close() {
    root.classList.remove('open');
    root.setAttribute('aria-hidden', 'true');
    clearTimeout(rotTimer); clearTimeout(idleTimer);
    twinState = '';
    if (twinEl) twinEl.pause();
  }

  btn && btn.addEventListener('click', e => { e.preventDefault(); open(); });
  closeB && closeB.addEventListener('click', close);
  bg && bg.addEventListener('click', close);
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && root.classList.contains('open')) close(); });
  sendB && sendB.addEventListener('click', ask);
  qEl && qEl.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); ask(); }
  });
  qEl && qEl.addEventListener('input', () => {
    if (twinState === 'thinking') return;
    setTwin(qEl.value.trim() ? 'typing' : 'idle');
  });
  document.addEventListener('langchange', () => { renderTags(); renderThread(); });
  renderTags();
  renderThread();
})();
