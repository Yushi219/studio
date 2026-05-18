/* ============================================================
   PORTFOLIO DECK  —  exportable, full-screen, site aesthetic
   Opens from the nav "Snapshot" button (left of Résumé).
   Curated S-images (S1 = hero), borderless & uncropped.
   ============================================================ */
(() => {
  'use strict';
  const esc = s => (s == null ? '' : String(s));
  const bi = (en, zh) => `<span class="en">${esc(en)}</span><span class="zh">${esc(zh)}</span>`;

  const COVER = {
    nameEN: 'Yushi Wang', nameZH: '王雨施',
    credEN: 'LEED Accredited Professional (LEED AP)',
    credZH: 'LEED 认证专家（LEED AP）',
    bioEN: 'Design Technologist with a cross-disciplinary background — fluent in computational design, web & plug-in tooling, immersive (AR/VR) platforms and AI workflow development. I turn workflow bottlenecks and pain points into elegant technical solutions: building tools, scripts and systems that advance design clarity, performance and collaboration.',
    bioZH: '设计技术专家，具备交叉学科背景，精通计算性设计，Web 及其他插件工具开发，沉浸式（AR/VR）平台开发及人工智能（AI）流程开发。善于将工作流程中的瓶颈与痛点转化为优雅的技术解决方案——通过构建复杂的工具、脚本与系统，提升设计清晰度、性能表现与团队协作效率。',
    hero: 'assets/cover.jpg',
    links: [
      { kEN: 'HD Portfolio with Video', kZH: '高清视频作品集', v: 'drive.google.com/drive/folders/1MtS9D56_hdn44rsQf4NcXcefDyNN_QAU', href: 'https://drive.google.com/drive/folders/1MtS9D56_hdn44rsQf4NcXcefDyNN_QAU?usp=sharing' },
      { kEN: 'LinkedIn', kZH: 'LinkedIn', v: 'linkedin.com/in/yushi-wang-303817194', href: 'https://www.linkedin.com/in/yushi-wang-303817194' },
      { kEN: 'Email', kZH: '邮箱', v: 'yushiw620@gmail.com', href: 'mailto:yushiw620@gmail.com' }
    ]
  };

  const P = [
    { k:'ai1', sec:'AI', nEN:'Floorcast', nZH:'Floorcast', tEN:'AI · Spatial Simulation', tZH:'AI · 空间仿真',
      dEN:'An AI, agent-based spatial-simulation platform that evaluates how people actually experience a building over time — role schedules, behavior and spatial memory become living agents you can interview.',
      dZH:'AI 驱动、基于智能体的空间仿真平台，评估人们如何真实地体验一栋建筑——角色日程、行为与空间记忆化为可访谈的“活”智能体。',
      tech:['Agent simulation','Spatial memory','AI interviews','Early-stage'] },
    { k:'ai2', sec:'AI', nEN:'Promptitect', nZH:'Promptitect', tEN:'AI · Prompt Engine', tZH:'AI · 提示词引擎',
      dEN:'A closed-loop prompt-intelligence platform that turns scattered AI rendering experiments into a searchable, reusable, self-improving firm knowledge base.',
      dZH:'闭环式提示词智能平台，把零散的 AI 出图实验沉淀为可检索、可复用、能自我进化的公司知识库。',
      tech:['Knowledge gallery','RAG retrieval','Prompt builder','Node board'] },
    { k:'ai3', sec:'AI', nEN:'AI Video Storytelling Platform', nZH:'AI 视频叙事平台', tEN:'AI · Motion · AIGC', tZH:'AI · 视频 · AIGC',
      dEN:'An end-to-end AI video pipeline — an internal storyboard tool with keyframe parsing, shot-intent recognition and cinematic-language control turns concept frames into scheme walkthroughs.',
      dZH:'端到端 AI 视频管线——内部叙事画板，含关键帧解析、分镜意图识别与镜头语言控制，将概念帧转为方案漫游。',
      tech:['Sora / Kling','Storyboard tool','−60% video time','3 lab projects'] },
    { k:'ai4', sec:'AI', nEN:'Ask Tom', nZH:'Ask Tom', tEN:'AI · Enterprise RAG', tZH:'AI · 企业级 RAG',
      dEN:'An enterprise RAG platform turning firm knowledge into source-grounded, proposal-ready answers — hybrid retrieval, page-level citations and in-app PDF preview for Marketing & proposal teams.',
      dZH:'企业级 RAG 平台，把公司知识变成可溯源、可直接写进提案的回答——混合检索、页级引用与应用内 PDF 预览，服务市场与提案团队。',
      tech:['Hybrid retrieval','SQL Agent','Source-grounded','RFP base'] },
    { k:'web2', sec:'Web', nEN:'Kaleidoscope', nZH:'Kaleidoscope', tEN:'Web · React · Sustainability', tZH:'网页 · React · 可持续',
      dEN:'A React embodied-carbon platform bringing real-time sustainability analysis into early design — live material charts and emissions calculators.',
      dZH:'基于 React 的隐含碳平台，将实时可持续性分析带入早期设计——实时材料图表与碳排计算器。',
      tech:['AIA TAP Award','ARCHITECT R+D','26,690+ views','85 countries'] },
    { k:'web3', sec:'Web', nEN:'Solar Comfort', nZH:'Solar Comfort', tEN:'Web · JS + Python', tZH:'网页 · JS + Python',
      dEN:'A JS + Python tool integrating global weather data for real-time façade thermal & visual comfort — evaluate orientation, daylighting and shading via color-coded heatmaps.',
      dZH:'JS + Python 工具，集成全球气象数据，实时反馈立面热舒适与视觉舒适——以彩色热力图评估朝向、采光与遮阳。',
      tech:['Global weather','Real-time heatmaps','49 countries','Recognized'] },
    { k:'web4', sec:'Web', nEN:'Floorish', nZH:'Floorish', tEN:'Web · DWG → Web · Azure', tZH:'网页 · DWG → 网页 · Azure',
      dEN:'A DWG-based space-strategy platform linking Excel room data to interactive floorplans with one-click, print-ready sheets.',
      dZH:'基于 DWG 的空间策略平台，将 Excel 房间数据对接交互式平面图，一键导出印刷就绪图纸。',
      tech:['Auto coloring','1-click PDF','1–2 wks → 1–2 days','Azure / month'] },
    { k:'web5', sec:'Web', nEN:'Sectioneer', nZH:'Sectioneer', tEN:'Web · Azure', tZH:'网页 · Azure',
      dEN:'An interactive section-design tool — drag, stack and watch the building form generate in real time during client meetings.',
      dZH:'交互式剖面设计工具——客户会议中拖放、堆叠，实时生成建筑形体。',
      tech:['Real-time parametric','Auto multi-version','−80% redraw','Azure / month'] },
    { k:'web1', sec:'Web', nEN:'Healthcare Behavior Simulation', nZH:'医疗空间行为仿真', tEN:'Web · Unity · Simulation', tZH:'网页 · Unity · 仿真',
      dEN:'A Unity 3D agent simulation evaluating layouts through realistic human movement, schedule-based behavior and healthcare workflows.',
      dZH:'基于 Unity 的 3D 智能体仿真，以真实人流、按日程的行为与医疗工作流评估布局。',
      tech:['NavMesh agents','Healthcare workflows','Quantified circulation','Pre-construction'] },
    { k:'uiux', sec:'UI/UX', nEN:'PAYETTE Places', nZH:'PAYETTE Places', tEN:'UI / UX · Full-Stack', tZH:'UI / UX · 全栈',
      dEN:'The firm’s public digital brand portal & interactive tour for the 2025 AIA Conference — a QR business card opening an interactive Boston map of 8 projects.',
      dZH:'为 2025 AIA 大会打造的公司数字品牌门户与交互导览——名片二维码即可进入 8 个波士顿项目的交互地图。',
      tech:['React / Node','Map + AR','Responsive','~300 visitors'] },
    { k:'arvrvr', sec:'AR · VR', nEN:'Interactive Virtual Mockup', nZH:'交互式虚拟样板间', tEN:'VR · Unity · Meta Quest', tZH:'VR · Unity · Meta Quest',
      dEN:'A Unity / Meta Quest VR review platform extending physical healthcare mockups — navigate full-scale rooms, operate equipment, test clearances and switch options live.',
      dZH:'基于 Unity / Meta Quest 的 VR 评审平台，作为实体医疗样板间的数字延伸——等比例漫游、操作设备、测试净空、实时切换方案。',
      tech:['Full-scale VR','Equipment interaction','Multiplayer','3 versions'] },
    { k:'arvrar', sec:'AR · VR', nEN:'AR — on-site / on-model', nZH:'AR — 现场 / 实体模型', tEN:'AR · Unity · iOS ARKit', tZH:'AR · Unity · iOS ARKit',
      dEN:'Custom iPad AR apps across 7 projects — place full-scale models on real sites and physical models, toggle façade options, materials and colors live.',
      dZH:'覆盖 7 个项目的定制 iPad AR 应用——在实景场地与实体模型上放置等比例模型，实时切换立面、材质与颜色。',
      tech:['7 projects','On-site + on-model','Live material','On-site decisions'] },
    { k:'dv1', sec:'Data', nEN:'Space Strategy Platform', nZH:'空间策略决策平台', tEN:'Data · Space Strategy', tZH:'数据 · 空间策略',
      dEN:'A web planning dashboard turning program logic into visual analysis — test area targets, efficiency, stacking, budget and scenario comparison in real time.',
      dZH:'网页规划仪表盘，把功能逻辑变成可视化分析——实时测试面积目标、效率、堆叠、预算与方案对比。',
      tech:['Live KPIs','Scenario compare','Transparency','Early-stage'] },
    { k:'dv2', sec:'Data', nEN:'PAYETTE Lens', nZH:'PAYETTE Lens', tEN:'Data · BI · AI', tZH:'数据 · BI · AI',
      dEN:'An AI-assisted, Power BI-style analytics platform for company project data — natural-language charts: ask, build, refine, add back to the dashboard.',
      dZH:'AI 辅助、类 Power BI 的公司项目数据分析平台——自然语言生成图表：提问、生成、修改、加回仪表盘。',
      tech:['Conversational BI','NL → chart','Portfolio analytics','Auto match'] },
    { k:'dv3', sec:'Data', nEN:'Pulse', nZH:'Pulse', tEN:'Data · Web Tool', tZH:'数据 · 网页工具',
      dEN:'A web survey platform with building & floor maps — clients leave targeted feedback on specific rooms across education & science projects.',
      dZH:'集成建筑与楼层平面图的网页调研平台——客户在教育与科研项目中对具体房间提交精准反馈。',
      tech:['Floor-map feedback','Room-level','Client loop','Education / science'] },
    { k:'dv4', sec:'Data', nEN:'MassIt', nZH:'MassIt', tEN:'Data · Rhino Plug-in', tZH:'数据 · Rhino 插件',
      dEN:'A Rhino / Grasshopper plug-in giving real-time sectional & plan views with department-specific area metrics during massing iterations.',
      dZH:'基于 Grasshopper 的 Rhino 插件，在体量推敲中实时生成剖面与平面，并提供按部门细分的面积指标。',
      tech:['Real-time feedback','Area metrics','Massing control','Program in check'] },
    { k:'dv5', sec:'Data', nEN:'Power BI · Tableau', nZH:'空间数据洞察 · Power BI / Tableau', tEN:'Data · Speckle · BI', tZH:'数据 · Speckle · BI',
      dEN:'Architectural project data fused with floor plans via Speckle — occupancy heatmaps, chord diagrams and interactive dashboards for client engagement.',
      dZH:'通过 Speckle 将建筑项目数据与平面图融合——占用热力图、弦图与交互式仪表盘，助力客户沟通。',
      tech:['Speckle → JSON','Occupancy heatmaps','Chord diagrams','Client engagement'] }
  ];

  const MULTI = [
    { kind:'param', n:4, g:'r4', sec:'Parametric', tEN:'Parametric Design', tZH:'参数化设计',
      sEN:'Reusable computational systems behind the products.', sZH:'产品背后的可复用计算性体系。',
      cells:[
        { bEN:'GH Vibe Skill', bZH:'GH Vibe Skill', sEN:'A reusable, AI-assisted Grasshopper script ecosystem.', sZH:'以 AI 辅助的可复用 Grasshopper 脚本生态。' },
        { bEN:'Computational Practice', bZH:'计算性设计实践', sEN:'Production parametric work — façade, massing, documentation.', sZH:'立面 / 体量 / 出图的参数化生产实践。' },
        { bEN:'Revit Add-in & Dynamo', bZH:'Revit 插件 & Dynamo', sEN:'BIM automation — auto tagging, batch data, model-to-takeoff.', sZH:'BIM 自动化：自动标注、批量数据、模型转工料。' },
        { bEN:'Generative & Shadow', bZH:'生成式与阴影分析', sEN:'Solar / shadow-driven generative form-finding.', sZH:'日照 / 阴影驱动的生成式形体生成。' }
      ] },
    { kind:'mg', n:9, g:'r9', sec:'Enablement', tEN:'Enablement & Ops', tZH:'赋能与运维',
      sEN:'Scaling design technology across the firm.', sZH:'把设计技术规模化推向全公司。',
      cells:[
        { bEN:'Computational Design Lead', bZH:'计算性设计负责人', sEN:'Founded & led the firm-wide community.', sZH:'创立并主导全公司社区。' },
        { bEN:'Skill / Tool Video Series', bZH:'技能 / 工具视频系列', sEN:'Continuous video series, adopted office-wide.', sZH:'持续视频系列，全公司采用。' },
        { bEN:'Live Course', bZH:'直播课程', sEN:'Ran live Grasshopper / computational courses.', sZH:'开设 Grasshopper / 计算性设计课程。' },
        { bEN:'Award & Press', bZH:'获奖与报道', sEN:'AIA TAP + ARCHITECT R+D; in Metropolis.', sZH:'获 AIA TAP 与 R+D 奖；登《Metropolis》。' },
        { bEN:'AI Research Lead', bZH:'AI 研究负责人', sEN:'Led the AI group; firm-wide lectures & roadmap.', sZH:'带领 AI 组；全公司讲座与路线图。' },
        { bEN:'Public Recognition', bZH:'公开推荐', sEN:'Solar Comfort recognized by industry leaders.', sZH:'Solar Comfort 获行业领袖推荐。' },
        { bEN:'GitHub Management', bZH:'GitHub 管理', sEN:'Clean, modular, versioned firm tool repos.', sZH:'整洁、模块化、版本化的工具仓库。' },
        { bEN:'Azure Management', bZH:'Azure 管理', sEN:'Hosted internal tools at scale on Azure.', sZH:'在 Azure 上规模化托管内部工具。' },
        { bEN:'Usage Analytics', bZH:'使用分析', sEN:'Tracked tool usage to refine UX.', sZH:'追踪工具使用，持续优化体验。' }
      ] }
  ];

  const MAXIMG = 5;
  let built = false, ov, stage, S = [], cur = 0;
  const TOTAL = 1 + P.length + MULTI.length;

  function sImgs(k) {
    const sx = (window.__SIMG && window.__SIMG[k]) || '';
    const a = [];
    for (let i = 0; i < sx.length && i < MAXIMG; i++) a.push('assets/s/' + k + '-' + (i + 1) + '.jpg');
    return a;
  }
  const img = (src, cls) => `<div class="dk-img ${cls || ''}"><img loading="eager" src="${esc(src)}" alt=""></div>`;

  // short display names for the cover contents (derived from the live portfolio)
  const IXNAME = {
    ai1:['Floorcast','Floorcast'], ai2:['Promptitect','Promptitect'], ai3:['AI Video','AI 视频叙事'], ai4:['Ask Tom','Ask Tom'],
    web2:['Kaleidoscope','Kaleidoscope'], web3:['Solar Comfort','Solar Comfort'], web4:['Floorish','Floorish'], web5:['Sectioneer','Sectioneer'], web1:['Healthcare Sim','医疗行为仿真'],
    uiux:['PAYETTE Places','PAYETTE Places'],
    arvrvr:['Virtual Mockup','虚拟样板间'], arvrar:['On-site / On-model AR','现场 / 实体 AR'],
    dv1:['Space Strategy','空间策略平台'], dv2:['PAYETTE Lens','PAYETTE Lens'], dv3:['Pulse','Pulse'], dv4:['MassIt','MassIt'], dv5:['Power BI · Tableau','Power BI · Tableau']
  };
  const SECH = {
    'AI':['AI Tools','AI 工具'], 'Web':['Web Tools','网页工具'], 'UI/UX':['UI / UX','UI / UX'],
    'AR · VR':['AR · VR','AR · VR'], 'Data':['Data Visualization','数据可视化'],
    'Parametric':['Parametric Design','参数化设计'], 'Enablement':['Enablement & Ops','赋能与运维']
  };
  function coverIndex() {
    const groups = [];
    P.forEach(p => {
      let g = groups.find(x => x.sec === p.sec);
      if (!g) { g = { sec: p.sec, items: [] }; groups.push(g); }
      const nm = IXNAME[p.k] || [p.nEN, p.nZH];
      g.items.push({ en: nm[0], zh: nm[1] });
    });
    const pm = MULTI[0];
    groups.push({ sec: pm.sec, items: pm.cells.map(c => ({ en: c.bEN, zh: c.bZH })) });
    groups.push({ sec: 'Enablement', items: [
      { en: 'Computational Design Lead', zh: '计算性设计负责人' },
      { en: 'Courses & Video Series', zh: '课程与视频系列' },
      { en: 'Awards & Press', zh: '获奖与报道' },
      { en: 'GitHub / Azure / Analytics', zh: 'GitHub / Azure / 数据分析' }
    ] });
    return groups.map(g => ({ tEN: (SECH[g.sec] || [g.sec, g.sec])[0], tZH: (SECH[g.sec] || [g.sec, g.sec])[1], items: g.items }));
  }

  function coverHTML() {
    const C = COVER;
    const idx = coverIndex().map(g =>
      `<div class="dk-ix-g"><div class="ixt">${bi(g.tEN, g.tZH)}</div>` +
      `<div class="ixi">${bi(g.items.map(i => i.en).join(' · '), g.items.map(i => i.zh).join(' · '))}</div>` +
      `</div>`).join('');
    const links = C.links.map(l =>
      `<a class="dk-cvk" href="${esc(l.href)}" target="_blank" rel="noopener">` +
      `<span class="k">${bi(l.kEN, l.kZH)}</span><span class="v">${esc(l.v)}</span></a>`).join('');
    return `<div class="cv">
      <div class="dk-cv-l" data-a>
        <div class="dk-cv-name">${bi(C.nameEN, C.nameZH)}</div>
        <div class="dk-cv-cred">${bi(C.credEN, C.credZH)}</div>
        <div class="dk-cv-bio">${bi(C.bioEN, C.bioZH)}</div>
      </div>
      <div class="dk-cv-mid" data-a="f" style="--d:.08s">${img(C.hero)}</div>
      <div class="dk-cv-ix" data-a style="--d:.16s">${idx}</div>
    </div>
    <div class="dk-cvfoot" data-a style="--d:.26s">${links}</div>`;
  }

  function projHTML(p, n) {
    const imgs = sImgs(p.k);
    const fno = String(n).padStart(2, '0');
    let media;
    if (imgs.length === 2) {
      media = `<div class="dk-media two" data-a="f">${img(imgs[0], 'eq')}${img(imgs[1], 'eq')}</div>`;
    } else if (imgs.length <= 1) {
      media = `<div class="dk-media" data-a="f">${img(imgs[0] || '', 'dk-hero')}</div>`;
    } else {
      media = `<div class="dk-media">
        ${img(imgs[0], 'dk-hero')}
        <div class="dk-strip" data-a style="--d:.18s">${imgs.slice(1).map(s => img(s)).join('')}</div>
      </div>`;
    }
    const col = `<div class="dk-col">
      <div class="dk-kick" data-a><span>Pl. ${fno}</span><span class="pl">·</span><span>${bi(p.tEN, p.tZH)}</span></div>
      <h2 class="dk-title" data-a style="--d:.08s">${bi(p.nEN, p.nZH)}</h2>
      <p class="dk-desc" data-a style="--d:.18s">${bi(p.dEN, p.dZH)}</p>
      <div class="dk-tech" data-a style="--d:.3s">${p.tech.map(t => `<span>${esc(t)}</span>`).join('')}</div>
    </div>`;
    return `<div class="dk-rhead"><span class="mk">${bi('Yushi Wang', '王雨施')}</span><span>${bi(p.tEN, p.tZH)}</span></div>
      <div class="body">${media}${col}</div>
      <div class="dk-foot"><span>${bi(p.tEN, p.tZH)}</span><span class="pj">${bi(p.nEN, p.nZH)}<span class="pg"> &nbsp; ${fno} <em>—</em> ${String(TOTAL).padStart(2, '0')}</span></span></div>`;
  }

  function multiHTML(m, n) {
    const cells = m.cells.map((c, i) => `<div class="dk-gc" data-a style="--d:${(0.05 * i).toFixed(2)}s">
      ${img('assets/s/' + m.kind + '-' + (i + 1) + '.jpg', 'gi')}
      <div class="gx"><b>${bi(c.bEN, c.bZH)}</b><span>${bi(c.sEN, c.sZH)}</span></div></div>`).join('');
    return `<div class="dk-rhead"><span class="mk">${bi('Yushi Wang', '王雨施')}</span><span>${bi(m.tEN, m.tZH)}</span></div>
      <div class="gh" data-a>
        <div class="gt">${bi(m.tEN, m.tZH)}</div>
        <div class="gs">${bi(m.sEN, m.sZH)}</div>
      </div>
      <div class="dk-grid ${m.g}">${cells}</div>
      <div class="dk-foot"><span>${bi(m.tEN, m.tZH)}</span><span class="pj"><span class="pg">${String(n).padStart(2, '0')} <em>—</em> ${String(TOTAL).padStart(2, '0')}</span></span></div>`;
  }

  function mkSlide(cls, html, meta) {
    const s = document.createElement('section');
    s.className = 'dk-slide ' + cls;
    s.innerHTML = html;
    stage.appendChild(s);
    S.push(Object.assign({ el: s }, meta));
    return s;
  }

  function render() {
    stage.innerHTML = ''; S = [];
    mkSlide('dk-cover', coverHTML(), { sec: 'Cover', key: null, thumb: COVER.hero });
    P.forEach((p, i) => {
      const n = i + 2;
      const s = mkSlide('dk-proj', projHTML(p, n), { sec: p.sec, key: p.k, thumb: (sImgs(p.k)[0] || null) });
      s.setAttribute('data-side', i % 2 === 0 ? 'l' : 'r');
    });
    MULTI.forEach((m, i) => mkSlide('dk-gal', multiHTML(m, P.length + 2 + i),
      { sec: m.sec, key: null, thumb: 'assets/s/' + m.kind + '-1.jpg' }));
    buildFilm();
    cur = Math.min(cur, S.length - 1);
    go(cur, true);
  }

  function buildFilm() {
    const secs = ov.querySelector('.dk-secs');
    const tns = ov.querySelector('.dk-tns');
    // section groups (consecutive same sec)
    const groups = [];
    S.forEach((o, i) => {
      const g = groups[groups.length - 1];
      if (g && g.sec === o.sec) g.count++;
      else groups.push({ sec: o.sec, count: 1, start: i });
    });
    secs.innerHTML = groups.map(g =>
      `<div class="dk-sec" data-start="${g.start}" data-end="${g.start + g.count - 1}" style="flex:${g.count}">${esc(g.sec)}</div>`).join('');
    tns.innerHTML = S.map((o, i) =>
      `<div class="dk-tn" data-i="${i}">${o.thumb ? `<img loading="lazy" src="${esc(o.thumb)}" alt="">` : `<span class="tl">${i + 1}</span>`}</div>`).join('');
    tns.querySelectorAll('.dk-tn').forEach(t => t.addEventListener('click', () => go(+t.dataset.i)));
  }

  function go(n, init) {
    n = Math.max(0, Math.min(S.length - 1, n));
    if (n === cur && !init && S[n].el.classList.contains('active')) return;
    S.forEach((o, i) => o.el.classList.toggle('active', i === n));
    cur = n;
    const tns = ov.querySelectorAll('.dk-tn');
    tns.forEach((t, i) => t.classList.toggle('on', i === n));
    const at = tns[n]; if (at) at.scrollIntoView({ inline: 'nearest', block: 'nearest' });
    ov.querySelectorAll('.dk-sec').forEach(sec => {
      const a = +sec.dataset.start, b = +sec.dataset.end;
      sec.classList.toggle('cur', n >= a && n <= b);
    });
    ov.querySelector('.dk-prev').disabled = n === 0;
    ov.querySelector('.dk-next').disabled = n === S.length - 1;
    const gp = ov.querySelector('.dk-go');
    if (gp) gp.disabled = !S[n].key;
  }
  const next = () => go(cur + 1);
  const prev = () => go(cur - 1);

  function fit() {
    const k = Math.min(window.innerWidth / 1600, (window.innerHeight - 104) / 900);
    stage.style.transform = 'scale(' + Math.max(0.1, k) + ')';
  }
  let lang = (window.__lang === 'zh') ? 'zh' : 'en';
  function setLang(l) {
    lang = l;
    ov.setAttribute('data-lang', l);
    ov.querySelector('.dk-lang').textContent = l === 'zh' ? 'EN' : '中文';
    ov.querySelector('.dk-go').textContent = l === 'zh' ? '前往项目 ↗' : 'Go to Project ↗';
    ov.querySelector('.dk-exp').textContent = l === 'zh' ? '导出 PDF' : 'Export PDF';
  }
  function openInPortfolio(key) {
    if (!key) return;
    close();
    setTimeout(() => { if (window.__openProject) window.__openProject(key); }, 160);
  }
  function exportPDF() {
    document.documentElement.classList.add('dk-printing');
    setTimeout(() => {
      window.print();
      setTimeout(() => document.documentElement.classList.remove('dk-printing'), 400);
    }, 60);
  }

  function build() {
    ov = document.createElement('div');
    ov.id = 'dk-overlay';
    ov.innerHTML =
      '<div class="dk-viewport"><div class="dk-stage"></div></div>' +
      '<button class="dk-arrow dk-prev" aria-label="Previous">‹</button>' +
      '<button class="dk-arrow dk-next" aria-label="Next">›</button>' +
      '<div class="dk-ctrls">' +
        '<button class="dk-lang">中文</button>' +
        '<button class="dk-go">Go to Project ↗</button>' +
        '<button class="dk-exp">Export PDF</button>' +
        '<button class="dk-x">✕</button>' +
      '</div>' +
      '<div class="dk-film"><div class="dk-secs"></div><div class="dk-tns"></div></div>';
    document.body.appendChild(ov);
    stage = ov.querySelector('.dk-stage');

    ov.querySelector('.dk-x').addEventListener('click', close);
    ov.querySelector('.dk-prev').addEventListener('click', prev);
    ov.querySelector('.dk-next').addEventListener('click', next);
    ov.querySelector('.dk-exp').addEventListener('click', exportPDF);
    ov.querySelector('.dk-go').addEventListener('click', () => openInPortfolio(S[cur] && S[cur].key));
    ov.querySelector('.dk-lang').addEventListener('click', () => setLang(lang === 'zh' ? 'en' : 'zh'));

    document.addEventListener('keydown', e => {
      if (!ov.classList.contains('on')) return;
      if (e.key === 'Escape') { close(); return; }
      if (['ArrowRight', 'ArrowDown', 'PageDown', ' '].includes(e.key)) { e.preventDefault(); next(); }
      else if (['ArrowLeft', 'ArrowUp', 'PageUp'].includes(e.key)) { e.preventDefault(); prev(); }
      else if (e.key === 'Home') go(0);
      else if (e.key === 'End') go(S.length - 1);
      else if (e.key === 'l' || e.key === 'L') setLang(lang === 'zh' ? 'en' : 'zh');
    });
    let wl = false;
    ov.addEventListener('wheel', e => {
      if (!ov.classList.contains('on')) return;
      if (wl || (Math.abs(e.deltaY) < 24 && Math.abs(e.deltaX) < 24)) return;
      wl = true; (e.deltaY > 0 || e.deltaX > 0) ? next() : prev();
      setTimeout(() => wl = false, 600);
    }, { passive: true });
    let tx = 0, sw = false;
    stage.addEventListener('pointerdown', e => { tx = e.clientX; sw = true; });
    window.addEventListener('pointerup', e => {
      if (!sw) return; sw = false;
      const dx = e.clientX - tx;
      if (Math.abs(dx) > 56) (dx < 0 ? next : prev)();
    });
    document.addEventListener('langchange', () => {
      if (ov && ov.classList.contains('on')) setLang(window.__lang === 'zh' ? 'zh' : 'en');
    });
    window.addEventListener('resize', () => { if (ov.classList.contains('on')) fit(); });
    built = true;
  }

  function open() {
    if (window.__lang === 'zh') lang = 'zh'; else if (window.__lang === 'en') lang = 'en';
    if (!built) build();
    cur = 0;
    render();
    setLang(lang);
    document.body.classList.add('dk-open');
    ov.classList.add('on');
    fit();
  }
  function close() {
    ov.classList.remove('on');
    document.body.classList.remove('dk-open');
  }
  function init() {
    const b = document.getElementById('deck-btn');
    if (b) b.addEventListener('click', e => { e.preventDefault(); open(); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
