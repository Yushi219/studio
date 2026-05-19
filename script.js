// ---------- Loading intro / preloader ----------
(() => {
  const pl = document.getElementById('preloader');
  if (!pl) return;
  const fill = document.getElementById('pl-fill');
  const pct = document.getElementById('pl-pct');
  const start = Date.now();
  let p = 0, loaded = false;
  window.addEventListener('load', () => { loaded = true; });
  function tick() {
    const t = Date.now() - start;
    const target = loaded ? 100 : Math.min(92, (t / 1700) * 92);
    p += (target - p) * 0.12;
    const v = Math.min(100, Math.round(p));
    if (fill) fill.style.width = v + '%';
    if (pct) pct.textContent = String(v).padStart(2, '0');
    if (p >= 99 && ((loaded && t > 900) || t > 4500)) {
      if (fill) fill.style.width = '100%';
      if (pct) pct.textContent = '100';
      pl.classList.add('done');
      setTimeout(() => pl.remove(), 750);
      return;
    }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
})();

// ---------- Eye pupil tracking in "see" word ----------
(() => {
  const eyes = document.querySelectorAll('.eye-glyph');
  if (!eyes.length) return;
  window.addEventListener('mousemove', e => {
    eyes.forEach(svg => {
      const r = svg.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const ang = Math.atan2(dy, dx);
      const dist = Math.min(10, Math.hypot(dx, dy) / 60);
      const tx = Math.cos(ang) * dist;
      const ty = Math.sin(ang) * dist * 0.4;
      const iris = svg.querySelector('.eye-iris-group');
      if (iris) iris.setAttribute('transform', `translate(${tx.toFixed(1)} ${ty.toFixed(1)})`);
    });
  });
})();

// ---------- Custom Cursor ----------
(() => {
  const dot = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  if (!dot || !ring) return;

  let mx = window.innerWidth / 2, my = window.innerHeight / 2;
  let rx = mx, ry = my;
  let ringText = '';

  window.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
  window.addEventListener('mousedown', () => document.body.classList.add('c-drag'));
  window.addEventListener('mouseup', () => document.body.classList.remove('c-drag'));

  function tick() {
    rx += (mx - rx) * 0.18;
    ry += (my - ry) * 0.18;
    dot.style.transform = `translate3d(${mx}px, ${my}px, 0)`;
    ring.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
    requestAnimationFrame(tick);
  }
  tick();

  // hover label
  function bindHover(sel, label = '') {
    document.querySelectorAll(sel).forEach(el => {
      el.addEventListener('mouseenter', () => {
        document.body.classList.add('c-hover');
        ring.textContent = label;
      });
      el.addEventListener('mouseleave', () => {
        document.body.classList.remove('c-hover');
        ring.textContent = '';
      });
    });
  }
  bindHover('[data-cursor="view"]', 'View');
  bindHover('[data-cursor="open"]', 'Open');
  bindHover('[data-cursor="email"]', 'Email');
  bindHover('[data-cursor="link"]', '→');
  bindHover('[data-cursor="drag"]', 'Drag');
  // "Open" cursor — orange circle
  document.querySelectorAll('[data-cursor="open"]').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('c-open'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('c-open'));
  });
  // Video cursor — bigger, italic serif "View Video"
  document.querySelectorAll('[data-cursor="video"]').forEach(el => {
    el.addEventListener('mouseenter', () => {
      document.body.classList.add('c-video');
      ring.textContent = 'View Project';
    });
    el.addEventListener('mouseleave', () => {
      document.body.classList.remove('c-video');
      ring.textContent = '';
    });
  });
})();

// ---------- Hero dissolve effect (particle scatter, reveal name) ----------
(() => {
  const h1 = document.querySelector('.hero-display');
  const heroCenter = document.querySelector('.hero-center');
  if (!h1 || !heroCenter) return;

  const name = document.createElement('div');
  name.className = 'hero-name';
  name.setAttribute('aria-hidden', 'true');
  name.textContent = 'YUSHI WANG';
  heroCenter.appendChild(name);

  const canvas = document.createElement('canvas');
  canvas.className = 'hero-particles';
  heroCenter.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  let chars = [];
  let positions = [];
  let cw = 0, ch = 0;
  const dpr = Math.min(2, window.devicePixelRatio || 1);

  function resizeCanvas() {
    const r = heroCenter.getBoundingClientRect();
    cw = r.width; ch = r.height;
    canvas.width = cw * dpr; canvas.height = ch * dpr;
    canvas.style.width = cw + 'px'; canvas.style.height = ch + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  function init() {
    h1.querySelectorAll('.word').forEach(w => {
      if (w.dataset.split) return;
      if (w.classList.contains('word-see')) { w.dataset.split = '1'; return; }
      const text = w.textContent;
      w.textContent = '';
      [...text].forEach(c => {
        if (c === ' ' || c === '\u00A0') { w.appendChild(document.createTextNode(c)); return; }
        const s = document.createElement('span');
        s.className = 'dis-ch';
        s.dataset.c = c;
        s.textContent = c;
        w.appendChild(s);
      });
      w.dataset.split = '1';
    });
    chars = [...h1.querySelectorAll('.dis-ch')].map(el => ({ el, dissolved: false }));
    recompute(); resizeCanvas();
  }
  function recompute() {
    const hr = heroCenter.getBoundingClientRect();
    positions = chars.map(c => {
      const r = c.el.getBoundingClientRect();
      return { x: r.left + r.width / 2 - hr.left, y: r.top + r.height / 2 - hr.top, w: r.width, h: r.height };
    });
  }
  setTimeout(init, 1900);
  window.addEventListener('resize', () => { recompute(); resizeCanvas(); });

  const particles = [];
  // Track cursor velocity → becomes "wind"
  let pmx = 0, pmy = 0, windX = 0, windY = 0;

  function spawnChar(p) {
    // Higher density, smaller particles
    const N = Math.min(120, Math.max(40, Math.floor(p.w * p.h * 0.04)));
    for (let k = 0; k < N; k++) {
      const px = p.x + (Math.random() - 0.5) * p.w * 0.95;
      const py = p.y + (Math.random() - 0.5) * p.h * 0.95;
      // Base outward burst
      const angle = Math.random() * Math.PI * 2;
      const burst = 0.4 + Math.random() * 1.4;
      particles.push({
        x: px, y: py,
        vx: Math.cos(angle) * burst + windX * (0.4 + Math.random() * 0.6),
        vy: Math.sin(angle) * burst + windY * (0.3 + Math.random() * 0.5) - 0.2,
        size: 0.3 + Math.random() * 0.9,
        life: 0.85 + Math.random() * 0.5,
        decay: 0.008 + Math.random() * 0.012,
        seed: Math.random() * Math.PI * 2,        // phase for flutter
        flutter: 0.4 + Math.random() * 0.5,
      });
    }
  }

  const RADIUS = 110;
  let mx = -9999, my = -9999;

  heroCenter.addEventListener('mousemove', e => {
    const hr = heroCenter.getBoundingClientRect();
    const nmx = e.clientX - hr.left;
    const nmy = e.clientY - hr.top;
    // wind = cursor velocity, smoothed
    if (pmx) {
      windX = windX * 0.6 + (nmx - pmx) * 0.25;
      windY = windY * 0.6 + (nmy - pmy) * 0.25;
    }
    pmx = nmx; pmy = nmy;
    mx = nmx; my = nmy;
    name.style.setProperty('--mx', mx + 'px');
    name.style.setProperty('--my', my + 'px');
    name.classList.add('active');
    if (!chars.length) return;
    chars.forEach((c, i) => {
      const p = positions[i]; if (!p) return;
      const d = Math.hypot(mx - p.x, my - p.y);
      if (d < RADIUS && !c.dissolved) {
        c.dissolved = true;
        c.el.style.opacity = '0';
        spawnChar(p);
      } else if (d >= RADIUS + 30 && c.dissolved) {
        c.dissolved = false;
        c.el.style.opacity = '';
      }
    });
  });
  heroCenter.addEventListener('mouseleave', () => {
    mx = -9999; my = -9999;
    windX *= 0.5; windY *= 0.5;
    name.classList.remove('active');
    chars.forEach(c => { if (c.dissolved) { c.dissolved = false; c.el.style.opacity = ''; } });
  });

  let t = 0;
  function render() {
    t += 0.05;
    // decay wind slowly when no input
    windX *= 0.96;
    windY *= 0.96;
    ctx.clearRect(0, 0, cw, ch);
    ctx.fillStyle = '#1a1a1a';
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      // Wind-driven curl: sinusoidal cross-wind per particle
      const curlX = Math.sin(t + p.seed) * p.flutter;
      const curlY = Math.cos(t * 0.7 + p.seed) * p.flutter * 0.6;
      p.vx += windX * 0.012 + curlX * 0.05;
      p.vy += windY * 0.008 + curlY * 0.04;
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.008;          // light gravity
      p.vx *= 0.985;           // air resistance
      p.vy *= 0.985;
      p.life -= p.decay;
      if (p.life <= 0) { particles.splice(i, 1); continue; }
      ctx.globalAlpha = Math.max(0, p.life);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
})();
(() => {
  const el = document.querySelector('[data-clock]');
  if (!el) return;
  function update() {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    const s = String(now.getSeconds()).padStart(2, '0');
    el.textContent = `${h}:${m}:${s}`;
  }
  update();
  setInterval(update, 1000);
})();

// ---------- Reveal on scroll ----------
(() => {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.05, rootMargin: '0px 0px -4% 0px' });
  document.querySelectorAll('.reveal, .reveal-stagger, .split-line').forEach(el => io.observe(el));

  // Hero elements: trigger immediately on load (IO can be flaky on inline spans)
  window.addEventListener('load', () => {
    requestAnimationFrame(() => {
      document.querySelectorAll('.hero .split-line, .hero .reveal, .hero .reveal-stagger').forEach(el => el.classList.add('in'));
    });
  });
})();

// ---------- Row preview follow cursor ----------
(() => {
  const preview = document.querySelector('.preview');
  if (!preview) return;
  const rows = document.querySelectorAll('.row[data-row]');
  let active = null, raf = null, tx = 0, ty = 0, cx = 0, cy = 0;
  // Matisse / Fauvist palette — random accent on hover (matches project-card colors)
  const ROW_C = ['#C0392B', '#2E6F95', '#E0A93B', '#3F7A52', '#B23A6B',
    '#2F4B7C', '#D9692F', '#5FA39A', '#8E5BA6', '#C9512E',
    '#356E8C', '#9C3551', '#3A6B57', '#5560A6', '#CF6A28', '#7D9C45'];

  function follow() {
    cx += (tx - cx) * 0.18;
    cy += (ty - cy) * 0.18;
    const offsetX = 28, offsetY = -160;
    preview.style.transform = `translate3d(${cx + offsetX}px, ${cy + offsetY}px, 0) scale(${active ? 1 : 0.92})`;
    raf = requestAnimationFrame(follow);
  }

  function move(e) { tx = e.clientX; ty = e.clientY; }

  rows.forEach(row => {
    row.addEventListener('mouseenter', () => {
      const id = row.dataset.row;
      active = id;
      row.style.setProperty('--row-c', ROW_C[Math.floor(Math.random() * ROW_C.length)]);
      preview.querySelectorAll('.pv').forEach(p => p.classList.toggle('show', p.dataset.pv === id));
      preview.classList.add('active');
      if (!raf) raf = requestAnimationFrame(follow);
      window.addEventListener('mousemove', move);
    });
    row.addEventListener('mouseleave', () => {
      active = null;
      preview.classList.remove('active');
      window.removeEventListener('mousemove', move);
    });
  });
})();

// ---------- Parallax on selected projects ----------
(() => {
  const items = document.querySelectorAll('[data-parallax]');
  if (!items.length) return;
  function update() {
    const vh = window.innerHeight;
    items.forEach(el => {
      const r = el.getBoundingClientRect();
      const center = r.top + r.height / 2;
      const offset = (center - vh / 2) / vh; // -1..1 range roughly
      const amt = parseFloat(el.dataset.parallax || '20');
      el.style.transform = `translateY(${offset * -amt}px)`;
    });
    requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
})();

// ---------- Draggable sigil ----------
(() => {
  const sig = document.querySelector('.sigil svg');
  if (!sig) return;
  let dragging = false, startX = 0, startY = 0, rot = 0, baseRot = 0;
  sig.addEventListener('mousedown', e => {
    dragging = true; startX = e.clientX; startY = e.clientY; baseRot = rot;
    sig.style.animation = 'none';
    document.body.style.userSelect = 'none';
  });
  window.addEventListener('mousemove', e => {
    if (!dragging) return;
    const dx = e.clientX - startX;
    rot = baseRot + dx * 0.6;
    sig.style.transform = `rotate(${rot}deg)`;
  });
  window.addEventListener('mouseup', () => {
    if (dragging) { dragging = false; document.body.style.userSelect = ''; }
  });
})();

// ---------- Magnetic hover ----------
(() => {
  document.querySelectorAll('[data-magnetic]').forEach(el => {
    const strength = parseFloat(el.dataset.magnetic || '12');
    el.addEventListener('mousemove', e => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      el.style.transform = `translate(${x / r.width * strength}px, ${y / r.height * strength}px)`;
    });
    el.addEventListener('mouseleave', () => { el.style.transform = ''; });
  });
})();

// ---------- Smooth anchor scroll ----------
(() => {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const href = a.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
})();

// ---------- AI Cube scroll-driven ----------
(() => {
  const scroller = document.querySelector('.ai-scroller');
  const cube = document.getElementById('cube');
  if (!scroller || !cube) return;
  const infoRows = document.querySelectorAll('.ai-info-row');
  const dots = document.querySelectorAll('.ai-face-indicator .dot');
  const cur = document.querySelector('.ai-face-progress .cur');

  let lastFace = -1;

  function update() {
    const r = scroller.getBoundingClientRect();
    const vh = window.innerHeight;
    // progress: 0 at top of scroller entering, 1 when leaving
    const total = r.height - vh;
    const prog = Math.max(0, Math.min(1, -r.top / total));

    // Phase 1 (0 - 0.25): cube approaches (scale 0.3 → 1)
    // Phase 2 (0.25 - 1.0): cube rotates -360deg
    let scale, rot;
    if (prog < 0.25) {
      const p = prog / 0.25;
      scale = 0.3 + p * 0.7;
      rot = 0;
    } else {
      scale = 1;
      const p = (prog - 0.25) / 0.75;
      rot = -p * 360;
    }
    cube.style.setProperty('--scale', scale.toFixed(3));
    cube.style.setProperty('--rot', rot.toFixed(2) + 'deg');

    // Determine current face by rotation
    // face 0 = 0°, face 1 = -90°, face 2 = -180°, face 3 = -270°
    let normRot = ((rot % 360) + 360) % 360; // 0..360
    let face = Math.round((360 - normRot) / 90) % 4;
    if (prog < 0.25) face = 0;
    if (face !== lastFace) {
      lastFace = face;
      infoRows.forEach((el, i) => el.classList.toggle('active', i === face));
      dots.forEach((el, i) => el.classList.toggle('active', i === face));
      if (cur) cur.textContent = String(face + 1).padStart(2, '0');
    }

    requestAnimationFrame(update);
  }
  requestAnimationFrame(update);

  // Initial active
  infoRows[0] && infoRows[0].classList.add('active');
})();

// ---------- Mini TOC drag + edge docking (tab behaviour) ----------
(() => {
  const toc = document.getElementById('mini-toc');
  if (!toc) return;
  let dragging = false, sx = 0, sy = 0, ox = 0, oy = 0;
  let docked = null;           // null | 'left' | 'right' | 'top' | 'bottom'
  const head = toc.querySelector('.mt-head');
  if (head) head.style.cursor = 'grab';

  const PEEK = 16;             // px of the panel left visible when docked
  const EDGE = 30;             // drop within this distance of an edge → dock
  const DOCK_TR = 'opacity .45s, transform .4s cubic-bezier(.2,.8,.2,1), left .4s cubic-bezier(.2,.8,.2,1), top .4s cubic-bezier(.2,.8,.2,1)';

  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  function setPos(x, y) {
    toc.style.left = x + 'px';
    toc.style.top = y + 'px';
    toc.style.right = 'auto';
    toc.style.bottom = 'auto';
  }

  function applyDock() {
    if (!docked) return;
    const r = toc.getBoundingClientRect();
    const w = r.width, h = r.height;
    const x = clamp(r.left, 0, window.innerWidth - w);
    const y = clamp(r.top, 0, window.innerHeight - h);
    toc.classList.add('docked');
    toc.style.transition = DOCK_TR;
    if (docked === 'left')  { setPos(0, y);                          toc.style.transform = `translateX(${-(w - PEEK)}px)`; }
    if (docked === 'right') { setPos(window.innerWidth - w, y);      toc.style.transform = `translateX(${ (w - PEEK)}px)`; }
    if (docked === 'top')   { setPos(x, 0);                          toc.style.transform = `translateY(${-(h - PEEK)}px)`; }
    if (docked === 'bottom'){ setPos(x, window.innerHeight - h);     toc.style.transform = `translateY(${ (h - PEEK)}px)`; }
  }

  function popOut() {
    if (!docked) return;
    toc.style.transition = DOCK_TR;
    toc.style.transform = 'translate(0, 0)';
  }

  function clearDock() {
    docked = null;
    toc.classList.remove('docked');
    toc.style.transform = '';
    toc.style.transition = '';
  }

  toc.addEventListener('mousedown', e => {
    if (e.target.closest('a')) return; // don't drag when clicking links
    dragging = true;
    clearDock();
    const r = toc.getBoundingClientRect();
    sx = e.clientX; sy = e.clientY;
    ox = r.left; oy = r.top;
    toc.style.transition = 'none';
    if (head) head.style.cursor = 'grabbing';
    e.preventDefault();
  });

  window.addEventListener('mousemove', e => {
    if (!dragging) return;
    setPos(ox + (e.clientX - sx), oy + (e.clientY - sy));
  });

  window.addEventListener('mouseup', () => {
    if (!dragging) return;
    dragging = false;
    if (head) head.style.cursor = 'grab';

    const r = toc.getBoundingClientRect();
    const dL = r.left;
    const dR = window.innerWidth - r.right;
    const dT = r.top;
    const dB = window.innerHeight - r.bottom;
    const min = Math.min(dL, dR, dT, dB);

    if (min <= EDGE) {
      docked = min === dL ? 'left' : min === dR ? 'right' : min === dT ? 'top' : 'bottom';
      applyDock();
    } else {
      // keep it fully on screen if dropped free
      const w = r.width, h = r.height;
      setPos(clamp(r.left, 8, window.innerWidth - w - 8),
             clamp(r.top, 8, window.innerHeight - h - 8));
      toc.style.transition = '';
    }
  });

  // Hover the docked sliver → slide back out; leave → tuck away again
  toc.addEventListener('mouseenter', () => { if (docked && !dragging) popOut(); });
  toc.addEventListener('mouseleave', () => { if (docked && !dragging) applyDock(); });

  // Stay glued to the edge on resize
  window.addEventListener('resize', () => { if (docked && !dragging) applyDock(); });

  // ---- Onboarding hint: appear at left-centre, then tuck into the left edge ----
  function gutterPx() {
    const g = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--gutter'), 10);
    return isNaN(g) ? 24 : g;
  }
  function introHint() {
    const w = toc.offsetWidth, h = toc.offsetHeight;
    // Park it against the left side, vertically centred
    setPos(gutterPx(), clamp((window.innerHeight - h) / 2, 8, window.innerHeight - h - 8));
    toc.classList.add('intro');                 // force-visible during the hint
    setTimeout(() => {
      docked = 'left';
      applyDock();                              // slide it off to the left as a tab
      setTimeout(() => toc.classList.remove('intro'), 800);
    }, 2000);
  }
  // run once the panel has real dimensions
  if (document.readyState === 'complete') requestAnimationFrame(introHint);
  else window.addEventListener('load', () => requestAnimationFrame(introHint));
})();
(() => {
  const toc = document.getElementById('mini-toc');
  const index = document.getElementById('index');
  if (!toc || !index) return;

  const links = toc.querySelectorAll('.mt-list a');
  const sections = [...links].map(a => document.querySelector('#' + a.dataset.target)).filter(Boolean);

  function update() {
    const indexBottom = index.getBoundingClientRect().bottom;
    const show = indexBottom < window.innerHeight * 0.4;
    toc.classList.toggle('visible', show);

    // Determine active section
    let active = null;
    sections.forEach(sec => {
      const r = sec.getBoundingClientRect();
      if (r.top < window.innerHeight * 0.5 && r.bottom > window.innerHeight * 0.5) {
        active = sec.id;
      }
    });
    links.forEach(a => a.classList.toggle('active', a.dataset.target === active));

    // Update progress counter
    const idx = active ? sections.findIndex(s => s.id === active) + 1 : 1;
    const curEl = toc.querySelector('.mt-cur');
    if (curEl) curEl.textContent = String(idx).padStart(2, '0');

    requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
})();

// ---------- Project gallery modal (main media + related media + detailed description) ----------
(() => {
  const modal = document.getElementById('vmodal');
  if (!modal) return;
  const closeBtn = modal.querySelector('.vmodal-close');
  const bg = modal.querySelector('.vmodal-bg');
  const panel = modal.querySelector('.vmodal-panel');
  // Matisse / Fauvist palette — vivid, ordered so neighbours (same chapter) stay distinct
  const MATISSE = [
    '#C0392B', '#2E6F95', '#E0A93B', '#3F7A52',   // ai1-4
    '#B23A6B', '#2F4B7C', '#D9692F', '#5FA39A', '#8E5BA6', // web1-5
    '#C9512E',                                      // uiux
    '#356E8C', '#9C3551',                           // arvr ar / vr
    '#D8B23E', '#3A6B57', '#5560A6', '#CF6A28', '#7D9C45' // dv1-5
  ];
  function lum(hex) {
    const n = parseInt(hex.slice(1), 16);
    const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
    return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  }
  function applyColor(key) {
    const i = Math.max(0, PKEYS.indexOf(key));
    const bg = MATISSE[i % MATISSE.length];
    const dark = lum(bg) < 0.56;
    panel.style.setProperty('--vp-bg', bg);
    panel.style.setProperty('--vp-fg', dark ? '#f6f1e7' : '#1a1a1a');
    panel.style.setProperty('--vp-soft', dark ? 'rgba(246,241,231,0.62)' : 'rgba(26,26,26,0.55)');
    panel.style.setProperty('--vp-acc', dark ? '#f4b06a' : '#b8431e');
    panel.style.setProperty('--vp-line', dark ? 'rgba(246,241,231,0.32)' : 'rgba(26,26,26,0.22)');
  }
  const titleEl = document.getElementById('vmodal-title');
  const tagEl = document.getElementById('vmodal-tag');
  const mediaEl = document.getElementById('vmodal-media');
  const descEl = document.getElementById('vmodal-desc');

  const G = 'assets/g/';
  const im = (p, n) => { const a = []; for (let k = 1; k <= n; k++) a.push({ t: 'i', s: G + p + '-i' + k + '.png' }); return a; };
  const vd = (p, n) => { const a = []; for (let k = 1; k <= n; k++) a.push({ t: 'v', s: G + p + '-v' + k + '.mp4' }); return a; };

  const PROJ = {
    ai1: { title: 'Floorcast', tag: 'AI · Spatial Simulation · 2025', titleZh: 'Floorcast', tagZh: 'AI · 空间仿真 · 2025',
      m: [{ t: 'v', s: 'assets/ai-1-floorcast.mp4' }].concat(im('ai1', 10)),
      d: [{ p: 'An AI-driven, agent-based spatial simulation platform that evaluates how people actually experience and use a building over time — not just whether they can walk from A to B. It turns architectural layouts into a living environment where every occupant follows a realistic daily life.' },
          { h: 'Key Features', li: ['Role-based schedule reconstruction — destinations, work patterns, break behavior and movement preferences become dynamic agent logic.', 'Individual behavioral parameters per agent: focus, sociability, exploration tendency, destination preference, route variation.', 'A spatial-memory layer: agents remember visited places, perceived crowding, comfort, familiarity, social potential and delays.', 'AI agent interviews — ask any occupant about routines, decisions, frustrations and perceived experience.'] },
          { h: 'Workflow', flow: ['Role schedules', 'Agent behavior logic', 'Simulated daily routines', 'Spatial-memory layer', 'AI interview', 'Design insight'] },
          { h: 'Impact', li: ['Captures circulation, congestion, space utilization and social interaction at a nuanced, human level.', 'Turns raw simulation into qualitative feedback for scenario comparison and early-stage architectural decisions.'] },
          { h: 'In Progress', li: ['One-click 2D-to-3D scene generation.', 'A collaborative Revit and Rhino plugin that runs the simulation directly inside the design workflow.', 'Building toward an AI-agent, data-driven simulation platform that predicts how a building will perform before anything is built.'] }],
      dz: [{ p: '一个由 AI 驱动、基于智能体的空间仿真平台，评估人们在长时间内如何真实地体验与使用建筑——而不仅是能否从 A 走到 B。它把建筑布局变成一个“活的”环境，每个使用者都遵循真实的一天。' },
           { h: '核心功能', li: ['按角色重建日程——目的地、工作模式、休息行为与移动偏好转化为动态智能体逻辑。', '每个智能体含个性参数：专注度、社交性、探索倾向、目的地偏好、路径变化。', '空间记忆层：智能体记住到访地点、拥挤感、舒适度、熟悉度、社交可能与延误。', 'AI 智能体访谈——可向任意使用者询问其日常、决策、痛点与主观体验。'] },
           { h: '工作流程', flow: ['角色日程', '智能体行为逻辑', '模拟真实日常', '空间记忆层', 'AI 访谈', '设计洞察'] },
           { h: '成效', li: ['以细腻、贴近真人的方式捕捉动线、拥堵、空间利用与社交互动。', '将原始仿真转化为可用于方案对比与早期建筑决策的定性反馈。'] },
           { h: '进行中', li: ['一键 2D 转 3D 场景生成。', '可直接在 Revit 与 Rhino 内运行的协同插件，让仿真融入设计流程。', '迈向一个 AI 智能体与数据驱动、能在建成前预测建筑表现的仿真平台。'] }] },
    ai2: { title: 'Promptitect', tag: 'AI · Prompt Engine · 2025', titleZh: 'Promptitect', tagZh: 'AI · 提示词引擎 · 2025',
      m: [{ t: 'v', s: 'assets/ai-2-promptitect.mp4' }].concat(im('ai2', 9)),
      d: [{ p: 'An AI prompt-intelligence and image-generation platform that systematizes architectural AI rendering. It turns scattered, one-off prompt experiments into a searchable, reusable, self-improving design knowledge system.' },
          { h: 'Key Features', li: ['Knowledge Gallery — every successful render stored with project, model, tags, input/reference/process/final images, full prompt and takeaways.', 'Selective reference extraction — pull only materiality, lighting, atmosphere or entourage from a reference, not the whole image.', 'RAG database explorer — keyword search returns precedent cases with match scores; “Use as Reference” decomposes a past prompt into reusable categories.', 'AI prompt builder — start from a sketch (or blank) and get a complete, model-ready prompt.', 'Node-based Generation Board — connect inputs, references and prompt nodes; test GPT Image, Nano Banana Pro and compare models.'] },
          { h: 'Workflow', flow: ['Knowledge DB', 'RAG retrieval', 'AI prompt builder', 'Generation board', 'Review', 'Add back to gallery'] },
          { h: 'Impact', li: ['Closed-loop system: every good result strengthens the database and improves future prompt generation.', 'Transforms prompt engineering from individual trial-and-error into shared, accumulating firm knowledge.'] }],
      dz: [{ p: '一个 AI 提示词智能与图像生成平台，将建筑 AI 出图流程系统化——把零散、一次性的提示词实验，沉淀为可检索、可复用、能自我进化的设计知识系统。' },
           { h: '核心功能', li: ['知识画廊——每张成功渲染都附带项目、模型、标签、输入/参考/过程/最终图、完整提示词与心得。', '参考图按需提取——只取材质、光照、氛围或配景，而非整张图。', 'RAG 案例检索——关键词返回带匹配度的过往案例；“用作参考”将旧提示词拆解为可复用类别。', 'AI 提示词构建器——从草图（甚至空白）出发，生成完整、可直接喂给模型的提示词。', '节点式生成板——连接输入、参考与提示词节点；测试 GPT Image、Nano Banana Pro 并对比模型。'] },
           { h: '工作流程', flow: ['提示词知识库', 'RAG 检索', 'AI 提示词构建', '生成板', '评审', '回流知识库'] },
           { h: '成效', li: ['闭环系统：每个好结果都强化数据库，持续提升后续提示词质量。', '把提示词工程从个人试错，变为可累积、可共享的公司知识。'] }] },
    ai3: { title: 'AI Video Generator', tag: 'AI · Motion · 2026', titleZh: 'AI 视频叙事平台', tagZh: 'AI · 视频 · 2026',
      m: [{ t: 'v', s: 'assets/ai-3-aivideo.mp4' }].concat(vd('ai3', 2)),
      d: [{ p: 'An end-to-end AI video pipeline that turns still architectural concept frames into animated walkthroughs and atmosphere studies for client presentations.' },
          { h: 'Key Features', li: ['Internal storyboard web tool with keyframe parsing, shot-intent recognition and cinematic-language optimization.', 'Integrates multimodal video models (Sora / Kling-class APIs) into one workflow.', 'Customizable style and pacing parameters per shot.'] },
          { h: 'Workflow', flow: ['Concept frames', 'Storyboard board', 'Shot-intent + camera language', 'Multimodal video model', 'One-click scheme video'] },
          { h: 'Impact', li: ['Cuts architectural scheme-video production time ~60%.', 'Deployed on 3 university-lab projects for one-click scheme presentation.'] }],
      dz: [{ p: '一条端到端的 AI 视频管线，将静态建筑概念帧转化为动态漫游与氛围演示，用于客户方案展示。' },
           { h: '核心功能', li: ['内部叙事画板网页工具，含关键帧解析、分镜意图识别与镜头语言优化。', '将 Sora、Kling 等多模态视频模型集成进同一工作流。', '支持每个镜头的风格与节奏参数自定义。'] },
           { h: '工作流程', flow: ['概念帧', '叙事画板', '分镜意图 + 镜头语言', '多模态视频模型', '一键方案视频'] },
           { h: '成效', li: ['建筑方案视频制作周期缩短约 60%。', '已应用于 3 个大学实验室项目，实现方案一键生成。'] }] },
    ai4: { title: 'Ask Tom', tag: 'AI · Enterprise RAG · 2025', titleZh: 'Ask Tom', tagZh: 'AI · 企业级 RAG · 2025',
      m: [{ t: 'v', s: 'assets/ai-4-rag.mp4' }],
      d: [{ p: 'An enterprise Retrieval-Augmented Generation system that turns PAYETTE internal knowledge into a searchable, source-grounded, reusable intelligence layer — built for the Marketing and proposal teams.' },
          { h: 'Key Features', li: ['Natural-language search over proposals, case studies, award submissions, best text and project docs.', 'Hybrid retrieval — semantic vector search + keyword matching + category filters (healthcare / science / awards / best text).', 'Source-grounded answers: source cards, page-level citations, in-app PDF preview to verify context.', 'SQL Agent integration, adjustable source count, feedback, regeneration and chat-only mode.'] },
          { h: 'Workflow', flow: ['Offline: parse · chunk · embed · tag', 'User question', 'Hybrid retrieval', 'Grounded answer + citations', 'Feedback loop'] },
          { h: 'Impact', li: ['Replaces manual folder/PDF hunting with verifiable, proposal-ready answers in the firm voice.', 'Foundation for firm-wide proposal intelligence and a persistent institutional-knowledge memory.'] }],
      dz: [{ p: '一个企业级检索增强生成（RAG）系统，把 PAYETTE 的内部知识变成可检索、可溯源、可复用的智能层——为市场与提案团队打造。' },
           { h: '核心功能', li: ['对提案、案例、获奖材料、最佳文案与项目文档的自然语言检索。', '混合检索——语义向量 + 关键词匹配 + 类别筛选（医疗/科研/获奖/最佳文案）。', '可溯源回答：来源卡片、页级引用、应用内 PDF 预览以核对上下文。', 'SQL Agent 集成、可调来源数、反馈、重生成与纯聊天模式。'] },
           { h: '工作流程', flow: ['离线：解析·切块·向量化·打标', '用户提问', '混合检索', '可溯源回答 + 引用', '反馈闭环'] },
           { h: '成效', li: ['用可核验、可直接写进提案、符合公司语气的回答，取代手动翻文件夹/PDF。', '为公司级提案智能与持久的组织知识记忆奠定基础。'] }] },
    web1: { title: 'Healthcare 3D Simulation', tag: 'Web · Unity · 2024', titleZh: '医疗空间行为仿真', tagZh: '网页 · Unity · 2024',
      m: [{ t: 'v', s: 'assets/web-1-healthcare.mp4' }].concat(im('web1', 13)),
      d: [{ p: 'A Unity-based 3D agent simulation that evaluates architectural environments through realistic human movement, schedule-based behavior and spatial-interaction logic — turning a layout into a navigable, occupied building.' },
          { h: 'Key Features', li: ['Role-specific daily routines: arrival, work, meetings, breaks, restroom, patient-room visits, family visitation, end-of-day departure.', 'Layered behavior: schedule + destination priority + spatial preference + personality + stochastic route variation.', 'Healthcare workflows: nursing rounds, resource-room visits, charting checkpoints, visitor windows, overnight family-stay logic.', 'Behavioral tuning — sociability, focus, exploration, comfort preference, destination familiarity.'] },
          { h: 'Workflow', flow: ['Architecture layout', 'NavMesh + agent logic', 'Role schedules', 'Simulate circulation', 'Quantitative metrics'] },
          { h: 'Impact', li: ['Quantifies circulation, congestion, queuing, room utilization, staff–patient & staff–staff interaction.', 'Lets design teams test assumptions and compare layouts before construction.'] }],
      dz: [{ p: '一个基于 Unity 的 3D 智能体仿真，通过真实的人流移动、按日程的行为与空间交互逻辑评估建筑环境——把布局变成可漫游、有人使用的建筑。' },
           { h: '核心功能', li: ['按角色的真实日程：到达、工作、会议、休息、如厕、病房探视、家属探访、下班离开。', '分层行为：日程 + 目的地优先级 + 空间偏好 + 个性 + 随机路径变化。', '医疗工作流：护理巡查、资源室、记录节点、探视时间窗、过夜陪护逻辑。', '行为调参——社交性、专注度、探索性、舒适偏好、目的地熟悉度。'] },
           { h: '工作流程', flow: ['建筑布局', 'NavMesh + 智能体逻辑', '角色日程', '模拟动线', '量化指标'] },
           { h: '成效', li: ['量化动线、拥堵、排队、房间利用、医护-患者与医护-医护互动。', '让设计团队在施工前验证假设并对比不同布局。'] }] },
    web2: { title: 'Kaleidoscope', tag: 'Web · React · 2022', titleZh: 'Kaleidoscope', tagZh: '网页 · React · 2022',
      m: [{ t: 'v', s: 'assets/web-2-kaleidoscope.mp4' }].concat(im('web2', 5)),
      d: [{ p: 'A React embodied-carbon assessment platform that brings real-time sustainability analysis into early architectural design.' },
          { h: 'Key Features', li: ['Live material pie charts and emissions calculators.', 'Real-time embodied-carbon feedback as the design changes.'] },
          { h: 'Impact', li: ['26,690+ total views; 500–1,000 monthly visits; users across 85 countries.'] },
          { h: 'Recognition', li: ['2022 ARCHITECT R+D Award and AIA TAP Innovation Award.', 'Featured in Metropolis; cited by professionals on LinkedIn.'] }],
      dz: [{ p: '一个基于 React 的建筑隐含碳评估平台，将实时可持续性分析带入早期建筑设计。' },
           { h: '核心功能', li: ['实时材料饼图与碳排放计算器。', '随设计变化实时反馈隐含碳。'] },
           { h: '成效', li: ['累计访问 26,690+；月活 500–1,000；用户覆盖 85 个国家。'] },
           { h: '荣誉与影响', li: ['荣获 2022 ARCHITECT R+D 大奖与 AIA TAP 创新奖。', '获《Metropolis》专题报道；被业内人士在 LinkedIn 引用。'] }] },
    web3: { title: 'Solar Comfort', tag: 'Web · JS + Python · 2024', titleZh: 'Solar Comfort', tagZh: '网页 · JS + Python · 2024',
      m: [{ t: 'v', s: 'assets/web-3-solarcomfort.mp4' }].concat(im('web3', 5)),
      d: [{ p: 'A JavaScript + Python web tool that integrates global weather data to give real-time feedback on façade thermal and visual comfort.' },
          { h: 'Key Features', li: ['Global weather-data integration with real-time simulation.', 'Color-coded heatmaps for thermal & visual comfort.', 'Interactive evaluation of orientation, daylighting and shading trade-offs.'] },
          { h: 'Impact', li: ['1,669 total visits, ~50 per month, users from 49 countries.', 'Publicly recognized on LinkedIn by industry leaders.'] }],
      dz: [{ p: '一个基于 JavaScript + Python 的网页工具，集成全球气象数据，实时反馈建筑立面的热舒适与视觉舒适。' },
           { h: '核心功能', li: ['集成全球气象数据，实时模拟。', '热舒适与视觉舒适的彩色热力图。', '交互式评估朝向、采光与遮阳权衡。'] },
           { h: '成效', li: ['累计访问 1,669，月均约 50，用户覆盖 49 国。', '获行业领袖在 LinkedIn 公开推荐。'] }] },
    web4: { title: 'Floorish', tag: 'Web · DWG → Web · 2025', titleZh: 'Floorish', tagZh: '网页 · DWG → 网页 · 2025',
      m: [{ t: 'v', s: 'assets/web-4-floorish.mp4' }].concat(im('web4', 4)),
      d: [{ p: 'A DWG-based space-strategy platform that connects Excel room data to interactive floorplans and one-click, print-ready sheets.' },
          { h: 'Key Features', li: ['Auto area coloring by room category; interactive room-info highlighting.', 'One-click export of fully customizable, print-ready sheets.'] },
          { h: 'Workflow', flow: ['DWG + Excel', 'Grasshopper → JSON', 'Web auto-coloring', 'Interactive review', 'One-click PDF'] },
          { h: 'Impact', li: ['Drawing cycle compressed from 1–2 weeks to 1–2 working days.', 'Built end-to-end and deployed on Azure within a month.'] }],
      dz: [{ p: '一个基于 DWG 的空间策略平台，将 Excel 房间数据对接交互式平面图，并一键生成印刷就绪图纸。' },
           { h: '核心功能', li: ['按房间分类自动上色；房间信息交互高亮。', '一键导出高度可定制、印刷就绪的图纸。'] },
           { h: '工作流程', flow: ['DWG + Excel', 'Grasshopper → JSON', '网页自动上色', '交互查看', '一键 PDF'] },
           { h: '成效', li: ['制图周期从 1–2 周压缩至 1–2 个工作日。', '一个月内完成端到端开发并部署至 Azure。'] }] },
    web5: { title: 'Sectioneer', tag: 'Web · Azure · 2025', titleZh: 'Sectioneer', tagZh: '网页 · Azure · 2025',
      m: [{ t: 'v', s: 'assets/web-5-sectioneer.mp4' }].concat(im('web5', 3)),
      d: [{ p: 'An interactive section-design tool that makes early massing playful and precise — drag, stack and watch the building form generate in real time.' },
          { h: 'Key Features', li: ['Real-time parametric section adjustment during client meetings.', 'Auto-generates multi-version departmental layouts per building rules.', 'Visual, drag-and-stack design reasoning for fast decisions.'] },
          { h: 'Impact', li: ['~80% of manual redraw time saved.', 'Built and deployed on Azure within a month.'] }],
      dz: [{ p: '一个交互式剖面设计工具，让早期体量推敲既灵活又精准——拖放、堆叠，实时观察建筑形体生成。' },
           { h: '核心功能', li: ['客户会议中实时参数化调整剖面。', '按建筑细则自动生成多版本部门布局。', '以拖放堆叠的可视化方式快速决策。'] },
           { h: '成效', li: ['节省约 80% 手动重绘时间。', '一个月内完成开发并部署至 Azure。'] }] },
    uiux: { title: 'PAYETTE Places', tag: 'UI · UX · 2025', titleZh: 'PAYETTE Places', tagZh: 'UI · UX · 2025',
      m: [{ t: 'v', s: 'assets/uiux-payetteplaces.mp4' },
          { t: 'i', s: G + 'uiux-i1.png' }, { t: 'i', s: G + 'uiux-i2.jpg' },
          { t: 'i', s: G + 'uiux-i3.png' }, { t: 'i', s: G + 'uiux-i4.png' }],
      d: [{ p: 'A public-facing digital project-tour built for the 2025 AIA Conference — a branded “digital front door” that turns the PAYETTE business card into an interactive guide to its Boston work.' },
          { h: 'Key Features', li: ['Scan the QR on the business card → instant mobile guide to 8 Boston projects.', 'Interactive map; project names deep-link to Google Maps as a real walking guide.', 'Clickable building icons → project detail pages with image galleries and info panels.', 'Animated façade diagrams with walking figures and interactive envelope details.'] },
          { h: 'Workflow', flow: ['Business-card QR', 'Interactive Boston map', 'Project page', 'Photo tour', 'Google Maps wayfinding'] },
          { h: 'Impact', li: ['Fully responsive desktop & mobile for on-site conference use.', '~300 visitors in a single open-day; a digital brand portal, not a static brochure.'] }],
      dz: [{ p: '一个面向公众的数字项目导览，为 2025 AIA 大会打造——一个品牌化的“数字门面”，把 PAYETTE 的名片变成其波士顿作品的交互式向导。' },
           { h: '核心功能', li: ['扫描名片二维码 → 立即进入 8 个波士顿项目的移动导览。', '交互式地图；项目名一键跳转 Google Maps，成为真实步行向导。', '可点击建筑图标 → 含图片画廊与信息面板的项目详情页。', '含行走人物动画与可交互外围护细节的动态立面图解。'] },
           { h: '工作流程', flow: ['名片二维码', '交互式波士顿地图', '项目页', '图片导览', 'Google Maps 寻路'] },
           { h: '成效', li: ['桌面与移动端完全自适应，适配现场会议使用。', '开放日单日约 300 名访客；是数字品牌门户，而非静态画册。'] }] },
    arvrar: { title: 'AR — on-site / on-model', tag: 'AR · Unity · Xcode · 2024', titleZh: 'AR 现场与实体模型交互', tagZh: 'AR · Unity · Xcode · 2024',
      m: [{ t: 'v', s: 'assets/arvr-ar.mp4' }],
      d: [{ p: 'Custom iPad AR apps delivered across 7 projects, letting clients and teams see full-scale design in real context.' },
          { h: 'Key Features', li: ['On-site mode: place full-scale design models on real construction sites and compare with surroundings.', 'On-model mode: switch components (handrail types, wall materials/colors) directly on physical architectural models.', 'Live toggling of façade options, materials and colors.'] },
          { h: 'Impact', li: ['Sharpened client engagement and faster on-site decisions across JHU, White Plains Hospital, 232 A Street, Hillco.'] }],
      dz: [{ p: '覆盖 7 个项目的定制 iPad AR 应用，让客户与团队在真实环境中看到等比例设计。' },
           { h: '核心功能', li: ['现场模式：在真实施工现场放置等比例设计模型并与环境对比。', '实体模型模式：在实体建筑模型上直接切换构件（扶手类型、墙面材质/颜色）。', '实时切换立面方案、材质与颜色。'] },
           { h: '成效', li: ['在 JHU、White Plains 医院、232 A Street、Hillco 等项目中增强客户参与、加速现场决策。'] }] },
    arvrvr: { title: 'Interactive Virtual Mockup', tag: 'VR · Unity · Meta Quest · 2025', titleZh: '交互式虚拟样板间', tagZh: 'VR · Unity · Meta Quest · 2025',
      m: [{ t: 'v', s: 'assets/arvr-vr.mp4' }].concat(im('vr', 9)),
      d: [{ p: 'A Unity / Meta Quest VR review platform built as a digital extension of physical healthcare mockups — it does not replace the mockup, it adds the things hard to capture physically: movement, interaction, workflow and fast iteration.' },
          { h: 'Key Features', li: ['Navigate full-scale rooms; operate lights, monitors, injectors, articulated arms and ceiling-mounted equipment.', 'Detect equipment / ceiling-truss / door / workflow conflicts invisible in 2D drawings.', 'Screenshot capture + speech-to-text feedback notes; 1-ft grid for distance awareness.', 'Real-time design-option switching and saving; early multiplayer collaborative review.'] },
          { h: 'Workflow', flow: ['Rhino / Revit model', 'Clean + split components', 'Unity: materials · lighting · scripts', 'Build to Meta Quest', 'Interactive review + feedback'] },
          { h: 'Evolution', li: ['v1 — basic interactive environment, movement, notes, option switching.', 'v2 — improved rendering/lighting realism, button-driven equipment motions.', 'v3 — multi-layer ceiling trusses, synchronized equipment, multiplayer review.'] }],
      dz: [{ p: '一个基于 Unity / Meta Quest 的 VR 评审平台，作为实体样板间的数字延伸——不替代实体模型，而是补足实体难以呈现的：移动、交互、工作流与快速迭代。' },
           { h: '核心功能', li: ['等比例房间漫游；操作灯具、监视器、注射器、铰接臂与吊顶设备。', '发现 2D 图纸难以察觉的设备/吊顶桁架/门/工作流冲突。', '截图 + 语音转文字反馈；1 英尺网格辅助距离判断。', '实时切换并保存设计方案；早期多人协同评审。'] },
           { h: '工作流程', flow: ['Rhino / Revit 模型', '清理 + 拆分构件', 'Unity：材质·光照·脚本', '构建到 Meta Quest', '交互评审 + 反馈'] },
           { h: '版本演进', li: ['v1——基础交互环境、移动、标注、方案切换。', 'v2——提升渲染/光照真实感，按键驱动设备动作。', 'v3——多层吊顶桁架、设备联动、多人协同评审。'] }] },
    dv1: { title: 'Space Strategy Web Tool', tag: 'Data · Space Strategy · 2025', titleZh: '空间策略决策平台', tagZh: '数据 · 空间策略 · 2025',
      m: [{ t: 'v', s: 'assets/dv-1-planfusion.mp4' }],
      d: [{ p: 'A web-based planning & programming dashboard for early-stage space strategy — it connects program logic with visual analysis so teams can test options and communicate trade-offs in one place.' },
          { h: 'Key Features', li: ['Multi-tab workflow: user groups & typologies, block & stacking, departmental distribution, budget, AI/comparison, export.', 'Live KPIs: total/target area, efficiency ratio, department count, program SF, construction cost, area delta.', 'Interactive sliders test floor-plate size, efficiency factor, basement allocation and program scenarios in real time.', 'Rich viz: waterfall, radar, stacked bars, section diagrams, scenario comparison.'] },
          { h: 'Impact', li: ['A lightweight decision-support layer that replaces disconnected spreadsheets and static diagrams.', 'Enables transparent stakeholder conversations during early design.'] }],
      dz: [{ p: '一个面向早期空间策略的网页规划与功能配置仪表盘——把功能逻辑与可视化分析连接起来，让团队在同一处测试方案、沟通取舍。' },
           { h: '核心功能', li: ['多标签流程：用户群体与类型、体块与堆叠、部门分布、预算、AI/对比、导出。', '实时 KPI：总/目标面积、效率比、部门数、功能面积、建造成本、面积差值。', '交互滑块实时测试楼板尺寸、效率系数、地下分配与功能方案。', '丰富图表：瀑布图、雷达图、堆叠条、剖面图、方案对比。'] },
           { h: '成效', li: ['轻量决策支持层，取代割裂的电子表格与静态图。', '在早期设计阶段实现与相关方的透明沟通。'] }] },
    dv2: { title: 'PAYETTE Lens', tag: 'Data · BI · AI · 2025', titleZh: 'PAYETTE Lens', tagZh: '数据 · BI · AI · 2025',
      m: [{ t: 'v', s: 'assets/dv-2-payettelens.mp4' }],
      d: [{ p: 'A web-based, AI-assisted analytics platform that makes company project data easy to explore — a Power BI-style experience with a conversational AI layer.' },
          { h: 'Key Features', li: ['KPI cards, portfolio filters, project search, data tables, bar/stacked/pie/line charts and comparison views.', 'Natural-language analytics — ask a question, generate a chart, refine it through conversation, add it back to the dashboard.', 'Historical-project import with automatic record matching (manual override available).'] },
          { h: 'Workflow', flow: ['Import project data', 'Auto match', 'Ask in natural language', 'AI generates chart', 'Add to dashboard'] },
          { h: 'Impact', li: ['Conversational BI for portfolio, market and proposal intelligence — from question to chart to insight without manual setup.'] }],
      dz: [{ p: '一个网页端、AI 辅助的数据分析平台，让公司项目数据易于探索——类 Power BI 的体验加上对话式 AI 层。' },
           { h: '核心功能', li: ['KPI 卡片、组合筛选、项目检索、数据表，柱/堆叠/饼/折线图与对比视图。', '自然语言分析——提问、生成图表、对话式修改、加回仪表盘。', '历史项目导入并自动匹配记录（可手动修正）。'] },
           { h: '工作流程', flow: ['导入项目数据', '自动匹配', '自然语言提问', 'AI 生成图表', '加入仪表盘'] },
           { h: '成效', li: ['面向组合、市场与提案智能的对话式 BI——从提问到图表到洞察，无需手动配置。'] }] },
    dv3: { title: 'Pulse', tag: 'Data · Web Tool', titleZh: 'Pulse', tagZh: '数据 · 网页工具',
      m: [{ t: 'i', s: 'assets/dv-3-pulse.jpg' }, { t: 'i', s: G + 'dv3-i1.png' }],
      d: [{ p: 'A web survey platform with building and floor maps that lets clients leave targeted feedback on specific rooms or buildings.' },
          { h: 'Key Features', li: ['Interactive building & floor plans as the feedback canvas.', 'Room/building-level targeted comments.'] },
          { h: 'Impact', li: ['Used across education and science projects to close the client-feedback loop.'] }],
      dz: [{ p: '一个集成建筑与楼层平面图的网页调研平台，让客户针对具体房间或建筑提交精准反馈。' },
           { h: '核心功能', li: ['以交互式建筑与楼层平面图作为反馈载体。', '房间/建筑级别的精准评论。'] },
           { h: '成效', li: ['应用于教育与科研项目，闭合客户反馈环。'] }] },
    dv4: { title: 'MassIt', tag: 'Data · Rhino Plug-in', titleZh: 'MassIt', tagZh: '数据 · Rhino 插件',
      m: [{ t: 'v', s: 'assets/dv-4-massit.mp4' }],
      d: [{ p: 'A Rhino plug-in (via Grasshopper) that gives real-time feedback during massing iterations.' },
          { h: 'Key Features', li: ['Real-time sectional and plan views as the mass changes.', 'Department-specific area metrics during design.'] },
          { h: 'Impact', li: ['Keeps program area in check while the form is still fluid.'] }],
      dz: [{ p: '一个基于 Grasshopper 的 Rhino 插件，在体量推敲中提供实时反馈。' },
           { h: '核心功能', li: ['随体量变化实时生成剖面与平面视图。', '设计中提供按部门细分的面积指标。'] },
           { h: '成效', li: ['在形体仍可变时持续把控功能面积。'] }] },
    dv5: { title: 'Power BI · Tableau', tag: 'Data · Speckle · BI', titleZh: '空间数据洞察 · Power BI / Tableau', tagZh: '数据 · Speckle · BI',
      m: [{ t: 'i', s: 'assets/dv-5-powerbi.jpg' }, { t: 'i', s: G + 'dv5-i1.png' }],
      d: [{ p: 'Architectural project data fused with floor plans to support spatial-strategy analysis and client engagement.' },
          { h: 'Key Features', li: ['Revit geometry exported to JSON via Speckle.', 'Power BI color-coded plans; Tableau occupancy heatmaps and chord diagrams.'] },
          { h: 'Workflow', flow: ['Revit', 'Speckle → JSON', 'Power BI / Tableau', 'Interactive dashboards'] },
          { h: 'Impact', li: ['Annual occupancy heatmaps inform space planning and client conversations.'] }],
      dz: [{ p: '将建筑项目数据与平面图融合，支撑空间策略分析与客户沟通。' },
           { h: '核心功能', li: ['通过 Speckle 将 Revit 几何导出为 JSON。', 'Power BI 彩色编码平面图；Tableau 占用热力图与弦图。'] },
           { h: '工作流程', flow: ['Revit', 'Speckle → JSON', 'Power BI / Tableau', '交互式仪表盘'] },
           { h: '成效', li: ['年度占用热力图为空间规划与客户沟通提供依据。'] }] }
  };

  /* Curated S-images (S1 = main). 'p'=png 'j'=jpg, in display order.
     Single source of truth; also read by the Snapshot deck (window.__SIMG). */
  const SX = {
    ai1:'pppp', ai2:'pppppppp', ai3:'p', ai4:'p',
    web1:'pppp', web2:'pppp', web3:'pppp', web4:'pppp', web5:'ppp',
    uiux:'ppppp', arvrar:'pppp', arvrvr:'pppppppp',
    dv1:'ppppp', dv2:'p', dv3:'pppp', dv4:'p', dv5:'pp'
  };
  window.__SIMG = SX;
  const Simg = (k) => {
    const s = SX[k] || ''; const a = [];
    for (let i = 0; i < s.length; i++) a.push({ t: 'i', s: 'assets/s/' + k + '-' + (i + 1) + '.jpg' });
    return a;
  };
  // Detail modal: keep any hero video, then show the curated S-images in S order.
  Object.keys(PROJ).forEach(k => {
    const m = PROJ[k].m || [];
    const vids = m.filter(x => x.t === 'v');
    const s = Simg(k);
    PROJ[k].m = vids.concat(s.length ? s : m.filter(x => x.t === 'i'));
  });

  let cur = null;

  function fsBtn(target) {
    const btn = document.createElement('button');
    btn.className = 'vp-fs'; btn.type = 'button';
    btn.setAttribute('data-cursor', 'link');
    btn.title = 'Fullscreen';
    btn.textContent = '⤢';
    btn.addEventListener('click', ev => {
      ev.stopPropagation();
      const el = target;
      if (document.fullscreenElement) { document.exitFullscreen(); return; }
      (el.requestFullscreen || el.webkitRequestFullscreen || el.webkitEnterFullscreen || (() => {})).call(el);
    });
    return btn;
  }

  function renderMedia(items) {
    mediaEl.innerHTML = '';
    items.forEach((it, k) => {
      const wrap = document.createElement('div');
      wrap.className = 'vp-item';
      let media;
      if (it.t === 'v') {
        media = document.createElement('video');
        media.src = it.s;
        media.controls = true;
        media.playsInline = true;
        media.preload = k === 0 ? 'auto' : 'metadata';
        if (k === 0) { media.autoplay = true; media.muted = true; media.loop = true; }
      } else {
        media = document.createElement('img');
        media.src = it.s; media.loading = k === 0 ? 'eager' : 'lazy';
      }
      wrap.appendChild(media);
      wrap.appendChild(fsBtn(media));
      mediaEl.appendChild(wrap);
    });
    mediaEl.scrollTop = 0;
    const first = mediaEl.querySelector('video');
    if (first && first.play) first.play().catch(() => {});
  }

  function renderBlocks(arr) {
    return (arr || []).map(b => {
      if (typeof b === 'string') return '<p class="vm-p">' + b + '</p>';
      const head = b.h ? '<h5 class="vm-h">' + b.h + '</h5>' : '';
      if (b.flow) {
        const steps = b.flow.map((s, i) =>
          '<span class="step">' + s + '</span>' + (i < b.flow.length - 1 ? '<span class="arr">→</span>' : '')
        ).join('');
        return '<div class="vm-sec">' + head + '<div class="vm-flow">' + steps + '</div></div>';
      }
      if (b.li) {
        return '<div class="vm-sec">' + head + '<ul class="vm-li">' +
          b.li.map(x => '<li>' + x + '</li>').join('') + '</ul></div>';
      }
      if (b.p) return '<div class="vm-sec">' + head + '<p class="vm-p">' + b.p + '</p></div>';
      return '';
    }).join('');
  }

  function renderText() {
    if (!cur) return;
    const zh = window.__lang === 'zh';
    titleEl.textContent = zh && cur.titleZh ? cur.titleZh : cur.title;
    tagEl.textContent = zh && cur.tagZh ? cur.tagZh : cur.tag;
    descEl.innerHTML = renderBlocks((zh && cur.dz) ? cur.dz : cur.d);
  }

  const PKEYS = Object.keys(PROJ);
  function openUI(key) {
    const p = PROJ[key];
    if (!p) return;
    cur = p;
    applyColor(key);
    renderText();
    renderMedia(p.m);
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('vm-locked');
  }
  function closeUI() {
    if (!modal.classList.contains('open')) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('vm-locked');
    mediaEl.querySelectorAll('video').forEach(v => v.pause());
    setTimeout(() => { if (!modal.classList.contains('open')) mediaEl.innerHTML = ''; }, 500);
    cur = null;
  }

  // Deep-link: open a project and push a shareable #!key into history
  function openProject(key) {
    if (!PROJ[key]) return;
    openUI(key);
    if (location.hash !== '#!' + key) {
      history.pushState({ proj: key }, '', '#!' + key);
    }
  }
  function shut() {
    // If the drawer added a history entry, go back so the URL/Back button stay in sync
    if (history.state && history.state.proj) history.back();
    else closeUI();
  }
  window.addEventListener('popstate', () => {
    const m = location.hash.match(/^#!(.+)$/);
    const k = m && m[1];
    if (k && PROJ[k]) openUI(k);
    else closeUI();
  });
  // Honor a deep link on first load (e.g. shared …/#!ai1)
  (function () {
    const m = location.hash.match(/^#!(.+)$/);
    const k = m && m[1];
    if (k && PROJ[k]) { history.replaceState({ proj: k }, '', '#!' + k); openUI(k); }
  })();

  closeBtn.addEventListener('click', shut);
  bg.addEventListener('click', shut);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') shut(); });
  document.addEventListener('langchange', () => { if (cur) renderText(); });

  function keyFor(el) {
    if (el.dataset && el.dataset.proj) return el.dataset.proj;
    if (el.classList.contains('cube-wrap') || el.id === 'cube') {
      const a = document.querySelector('.ai-info-row.active') || document.querySelector('.ai-info-row');
      return a && a.dataset.proj;
    }
    if (el.classList.contains('dv3-right')) {
      const pv = document.querySelector('.dv3-preview.active');
      return pv && pv.dataset.proj;
    }
    return null;
  }

  document.querySelectorAll('[data-cursor="video"]').forEach(el => {
    el.addEventListener('click', e => {
      if (e.target.closest('a')) return;
      e.preventDefault();
      const k = keyFor(el);
      if (k && PROJ[k]) openProject(k);
    });
  });

  const cube = document.getElementById('cube');
  if (cube) {
    cube.addEventListener('click', e => {
      e.preventDefault();
      const a = document.querySelector('.ai-info-row.active') || document.querySelector('.ai-info-row');
      const k = a && a.dataset.proj;
      if (k && PROJ[k]) openProject(k);
    });
  }

  // Expose for the AI assistant: one-click jump to a project drawer
  window.__openProject = (k) => { if (PROJ[k]) openProject(k); };
})();

// ---------- Management mosaic wall (proximity + dot hover + parallax) ----------
(() => {
  const wall = document.getElementById('mg-wall');
  if (!wall) return;
  const photosWrap = document.getElementById('mg-photos');
  const photos = wall.querySelectorAll('.mg-photo');
  const dots = wall.querySelectorAll('.mg-dot');
  const info = document.getElementById('mg-info');
  const infoKey = document.getElementById('mg-info-key');
  const infoName = document.getElementById('mg-info-name');
  const infoDesc = document.getElementById('mg-info-desc');

  const projects = [
    { name: 'Awards <em>&amp; press</em>', desc: 'Kaleidoscope: 2022 ARCHITECT R+D &amp; AIA TAP Innovation Awards; featured in Metropolis magazine.', urls: [{ label: 'Metropolis', href: 'https://metropolismag.com/products/four-pieces-of-software-by-architects-for-architects/' }],
      nameZh: '荣誉 <em>与报道</em>', descZh: 'Kaleidoscope：荣获 2022 ARCHITECT R+D 大奖与 AIA TAP 创新奖，并获《Metropolis》杂志专题报道。' },
    { name: 'AI Research <em>Lead</em>', desc: 'Directed firmwide AI research across ComfyUI, Fooocus &amp; Forge; built 3 core workflows; monthly leadership reports and an annual showcase.', urls: [],
      nameZh: 'AI 研究 <em>负责人</em>', descZh: '带领团队研究 ComfyUI、Fooocus、Forge 等 AI 平台，构建三大核心工作流，定期向管理层汇报并举办年度成果展。' },
    { name: 'Public <em>shout-outs</em>', desc: 'Solar Comfort Tool recognized publicly on LinkedIn by industry leaders; users across 49 countries.', urls: [{ label: 'LinkedIn', href: 'https://www.linkedin.com/posts/kjell-anderson-faia-leed-fellow-aa5a7010_payette-pathtozerocarbon-activity-7167950270327455744-E81a?utm_source=share&utm_medium=member_desktop' }],
      nameZh: '公开 <em>认可</em>', descZh: 'Solar Comfort Tool 在 LinkedIn 上获多位行业领袖公开推荐；用户覆盖 49 个国家。' },
    { name: 'Comp. Design <em>Lead</em>', desc: 'Led a 40+ member firmwide digital learning group; built a centralized, searchable script library with taxonomy &amp; version control.', urls: [],
      nameZh: '计算设计 <em>负责人</em>', descZh: '领导 40+ 人的全公司数字技术社团，建立带分类与版本控制的中央脚本库。' },
    { name: 'Tutorial <em>videos</em>', desc: 'Produced project-specific video tutorials for 15+ scripts &amp; plugins, substantially increasing firmwide adoption.', urls: [{ label: 'YouTube', href: 'https://www.youtube.com/@yushiwang4947/videos' }],
      nameZh: '教学 <em>视频</em>', descZh: '为 15+ 脚本与插件录制项目定制化教学视频，大幅提升数字工具在全公司的采用率。' },
    { name: 'Live <em>courses</em>', desc: 'Organized and taught a Grasshopper training series, upskilling design teams across the company.', urls: [{ label: 'Watch series', href: 'https://www.youtube.com/watch?v=r2j1Fd_j618' }],
      nameZh: '系列 <em>课程</em>', descZh: '策划并执教 Grasshopper 系列培训课程，系统化提升设计团队的计算设计能力。' },
    { name: 'GitHub <em>mgmt</em>', desc: "Managed the firm's GitHub repos &mdash; clean, modular, version-controlled codebases for multiple internal web tools.", urls: [{ label: 'My GitHub', href: 'https://github.com/Yushi219' }, { label: 'Payette GitHub', href: 'https://github.com/Payette' }],
      nameZh: 'GitHub <em>管理</em>', descZh: '管理公司 GitHub 仓库——为多个内部网页工具维护干净、模块化、版本可控的代码库。' },
    { name: 'Azure <em>mgmt</em>', desc: 'Managed Azure deployments hosting multiple internal web tools at scale, ensuring reliable delivery.', urls: [],
      nameZh: 'Azure <em>管理</em>', descZh: '管理 Azure 部署，规模化托管多个内部网页工具，保障稳定交付。' },
    { name: 'Usage <em>analytics</em>', desc: 'Google Analytics across all tools &mdash; monitored engagement &amp; feature usage for continuous UX tuning.', urls: [],
      nameZh: '使用 <em>分析</em>', descZh: '通过 Google Analytics 跟踪全部工具的使用与功能数据，持续优化用户体验。' },
  ];
  const zh = () => window.__lang === 'zh';
  const LBL = { 'Watch series': '观看课程', 'My GitHub': '我的 GitHub' };
  let shownIdx = -1;
  const infoLinks = document.getElementById('mg-info-links');
  let infoHover = false;
  function renderInfoLinks(i) {
    if (!infoLinks) return;
    const urls = (projects[i] && projects[i].urls) || [];
    infoLinks.innerHTML = urls.map(u =>
      `<a class="proj-link" href="${u.href}" target="_blank" rel="noopener" data-cursor="link">${zh() && LBL[u.label] ? LBL[u.label] : u.label} <span class="ar">↗</span></a>`
    ).join('');
    infoLinks.style.display = urls.length ? 'flex' : 'none';
  }
  if (info) {
    info.addEventListener('mouseenter', () => { infoHover = true; });
    info.addEventListener('mouseleave', () => {
      infoHover = false;
      info.classList.remove('show');
      dots.forEach(d => d.classList.remove('hot'));
      photos.forEach(p => p.classList.remove('active'));
      hotIdx = -1;
    });
  }
  document.addEventListener('langchange', () => {
    const d = projects[shownIdx < 0 ? 0 : shownIdx];
    if (!d || !infoName) return;
    infoName.innerHTML = (zh() && d.nameZh) ? d.nameZh : d.name;
    infoDesc.innerHTML = (zh() && d.descZh) ? d.descZh : d.desc;
    renderInfoLinks(shownIdx < 0 ? 0 : shownIdx);
  });

  let mouseX = -9999, mouseY = -9999;
  let targetPX = 0, targetPY = 0;
  let curPX = 0, curPY = 0;
  let hotIdx = -1;
  const photoCenters = [];

  function recompute() {
    const r = wall.getBoundingClientRect();
    photoCenters.length = 0;
    photos.forEach(p => {
      const pr = p.getBoundingClientRect();
      photoCenters.push({ x: pr.left + pr.width / 2 - r.left, y: pr.top + pr.height / 2 - r.top });
    });
  }
  recompute();
  window.addEventListener('resize', recompute);
  window.addEventListener('scroll', recompute, { passive: true });

  wall.addEventListener('mousemove', e => {
    const r = wall.getBoundingClientRect();
    mouseX = e.clientX - r.left;
    mouseY = e.clientY - r.top;
    // Parallax: photos move OPPOSITE to cursor (cursor left → photos right)
    const cx = r.width / 2;
    const cy = r.height / 2;
    targetPX = -(mouseX - cx) * 0.12;
    targetPY = -(mouseY - cy) * 0.12;
  });
  wall.addEventListener('mouseleave', () => {
    mouseX = -9999; mouseY = -9999;
    targetPX = 0; targetPY = 0;
    if (infoHover) return;            // keep panel open while hovering it
    if (info) info.classList.remove('show');
    dots.forEach(d => d.classList.remove('hot'));
    photos.forEach(p => p.classList.remove('active'));
    hotIdx = -1;
  });

  dots.forEach((dot, i) => {
    dot.addEventListener('mouseenter', () => {
      hotIdx = i;
      dots.forEach((d, j) => d.classList.toggle('hot', j === i));
      photos.forEach((p, j) => p.classList.toggle('active', j === i));
      const dr = dot.getBoundingClientRect();
      const wr = wall.getBoundingClientRect();
      let x = dr.left - wr.left + 22;
      let y = dr.top - wr.top + dr.height / 2;
      if (x > wr.width - 280) {
        x = dr.left - wr.left - 22 - 260;
      }
      info.style.setProperty('--ix', x + 'px');
      info.style.setProperty('--iy', y + 'px');
      info.classList.add('show');
      shownIdx = i;
      const data = projects[i] || projects[0];
      infoKey.textContent = String(i + 1).padStart(2, '0') + ' / 09';
      infoName.innerHTML = (zh() && data.nameZh) ? data.nameZh : data.name;
      infoDesc.innerHTML = (zh() && data.descZh) ? data.descZh : data.desc;
      renderInfoLinks(i);
    });
    dot.addEventListener('mouseleave', () => {
      setTimeout(() => {
        if (hotIdx === i && !infoHover) {
          dot.classList.remove('hot');
          photos[i].classList.remove('active');
          info.classList.remove('show');
          hotIdx = -1;
        }
      }, 240);
    });
  });

  function tick() {
    // Lerp parallax for smoothness
    curPX += (targetPX - curPX) * 0.08;
    curPY += (targetPY - curPY) * 0.08;
    if (photosWrap) {
      photosWrap.style.setProperty('--px', curPX.toFixed(2) + 'px');
      photosWrap.style.setProperty('--py', curPY.toFixed(2) + 'px');
    }
    // Brightness based on proximity
    const RADIUS = 380;
    photos.forEach((p, i) => {
      const c = photoCenters[i];
      if (!c) return;
      const dx = mouseX - c.x;
      const dy = mouseY - c.y;
      const d = Math.hypot(dx, dy);
      const br = Math.max(0, 1 - d / RADIUS);
      p.style.setProperty('--br', br.toFixed(3));
    });
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
})();

// ---------- About: rotating collage + dynamic lines + category switcher ----------
(() => {
  const stage = document.getElementById('ab2-stage');
  if (!stage) return;
  const linesSvg = document.getElementById('ab2-lines');
  const anchors = stage.querySelectorAll('.ab2-anchor');
  const tags = stage.querySelectorAll('.ab2-tag');
  const switcher = document.getElementById('ab2-switch');

  // Slot order → 0:TL  1:TR  2:BR  3:BL   (null = slot hidden for that category)
  const data = {
    work: [
      { key: '2022 — NOW',  name: 'Design <em>Technologist</em>',                 meta: 'Payette · Boston',
        nameZh: '设计 <em>技术专家</em>', metaZh: 'Payette · 波士顿' },
      { key: '2021',        name: 'Digital Design Specialist <em>Intern</em>',    meta: 'NBBJ · Seattle',
        nameZh: '数字设计 <em>专家（实习）</em>', metaZh: 'NBBJ · 西雅图' },
      null,
      { key: '2021 — 2022', name: 'Digital Construction Project <em>Engineer</em>', meta: 'Dowbuilt · Seattle',
        nameZh: '数字建筑项目 <em>工程师</em>', metaZh: 'Dowbuilt · 西雅图' },
    ],
    edu: [
      { key: '2019 — 2021', name: 'M.S. <em>Building Science</em>',  meta: 'USC · GPA 4.0 / 4.0',
        nameZh: '<em>建筑科学</em> 硕士', metaZh: '南加州大学 · GPA 4.0' },
      { key: '2016 — 2018', name: 'B.S. <em>Construction Mgmt</em>', meta: 'SUES · Shanghai',
        nameZh: '<em>工程管理</em> 学士', metaZh: '上海工程技术大学' },
      { key: '2021',        name: 'LEED <em>AP</em>',                meta: 'USGBC accredited',
        nameZh: 'LEED <em>AP</em> 认证', metaZh: 'USGBC 认证' },
      { key: 'ONGOING',     name: 'Self-<em>study</em>',             meta: 'AI · WebGL · Unity',
        keyZh: '持续中', nameZh: '<em>自学</em>', metaZh: 'AI · WebGL · Unity' },
    ],
    skills: [
      { key: '', name: 'Computational <em>Design</em>',
        meta: 'Rhino · Grasshopper · Revit · Dynamo · Rhino.Inside',
        nameZh: '计算性 <em>设计</em>' },
      { key: '', name: 'Development',
        meta: '<span class="grp">Code</span> JavaScript · HTML/CSS · Node.js · React · Python · GitHub · Azure<br><span class="grp">AR · VR</span> Unity · C# · iOS ARKit · Normcore<br><span class="grp">Data</span> MySQL · Power BI · Tableau · D3 · Power Automate',
        nameZh: '开发',
        metaZh: '<span class="grp">代码</span> JavaScript · HTML/CSS · Node.js · React · Python · GitHub · Azure<br><span class="grp">AR · VR</span> Unity · C# · iOS ARKit · Normcore<br><span class="grp">数据</span> MySQL · Power BI · Tableau · D3 · Power Automate' },
      { key: '', name: 'AI',
        meta: 'Claude Code · Codex · Gemini · ComfyUI · xfigura · Krea · Runway · Kohya · RAG',
        nameZh: 'AI' },
      { key: '', name: 'Design',
        meta: 'Figma · Adobe Creative Cloud · InDesign · Claude Design',
        nameZh: '设计' },
    ],
    skill: [
      { key: '', name: 'User <em>Research</em>',
        meta: 'Interviews · Contextual Inquiry · Ethnographic Observation · Workflow Analysis · Qual + Quant Methods · Personas',
        nameZh: '用户<em>研究</em>',
        metaZh: '用户访谈 · 情境调查 · 民族志观察 · 工作流分析 · 定性 + 定量方法 · 用户画像' },
      { key: '', name: 'Experience <em>Design</em>',
        meta: 'Interaction Design · Interactive Prototyping · Usability Testing · Wireframing · Design Thinking · Data-Driven Design',
        nameZh: '体验<em>设计</em>',
        metaZh: '交互设计 · 交互原型 · 可用性测试 · 线框图 · 设计思维 · 数据驱动设计' },
      { key: '', name: 'Delivery &amp; <em>Process</em>',
        meta: 'Concept to Implementation · Agile for UX · Complex Problem-Solving · Rapid Prototyping (vibe coding)',
        nameZh: '交付与<em>流程</em>',
        metaZh: '从概念到落地 · 面向 UX 的敏捷 · 复杂问题解决 · 快速原型 (vibe coding)' },
      { key: '', name: 'Collaboration &amp; <em>Influence</em>',
        meta: 'Cross-functional Collaboration · Stakeholder Management · Design Communication · Influencing at All Levels',
        nameZh: '协作与<em>影响</em>',
        metaZh: '跨职能协作 · 干系人管理 · 设计沟通 · 影响各层级决策' },
    ],
  };
  const zh = () => window.__lang === 'zh';
  const pick = (d, f) => (zh() && d[f + 'Zh'] != null) ? d[f + 'Zh'] : d[f];

  let currentCat = 'work';
  function setCategory(cat) {
    currentCat = cat;
    const set = data[cat] || data.work;
    stage.classList.toggle('cat-skills', cat === 'skills' || cat === 'skill');
    for (let i = 0; i < 4; i++) {
      const tag = stage.querySelector('.ab2-tag[data-tag="' + i + '"]');
      const anc = stage.querySelector('.ab2-anchor[data-anc="' + i + '"]');
      const d = set[i];
      if (!d) {
        if (tag) tag.classList.add('tag-hidden');
        if (anc) anc.classList.add('anc-hidden');
        continue;
      }
      if (tag) {
        const k = pick(d, 'key');
        tag.classList.remove('tag-hidden');
        tag.classList.toggle('no-key', !k);
        tag.querySelector('.tag-key').textContent = k || '';
        tag.querySelector('.tag-name').innerHTML = pick(d, 'name');
        tag.querySelector('.tag-meta').innerHTML = pick(d, 'meta');
      }
      if (anc) anc.classList.remove('anc-hidden');
    }
  }
  setCategory('work');
  document.addEventListener('langchange', () => setCategory(currentCat));

  // Click on switch buttons
  switcher && switcher.querySelectorAll('.sw').forEach(btn => {
    btn.addEventListener('click', () => {
      switcher.querySelectorAll('.sw').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      setCategory(btn.dataset.cat);
    });
  });

  // Cycle anchor positions every 1s — each anchor stays in its OWN CORNER zone
  // [xMin, xMax, yMin, yMax] per anchor, matching tag positions (TL, TR, BR, BL)
  const zones = [
    [8, 32, 10, 35],   // anchor 0 — top-left
    [68, 92, 10, 35],  // anchor 1 — top-right
    [68, 92, 60, 85],  // anchor 2 — bottom-right
    [8, 32, 60, 85],   // anchor 3 — bottom-left
  ];
  function rand(min, max) { return min + Math.random() * (max - min); }
  function shuffleAnchors() {
    anchors.forEach((anc, i) => {
      const z = zones[i];
      const x = rand(z[0], z[1]);
      const y = rand(z[2], z[3]);
      anc.style.setProperty('--ax', x.toFixed(1) + '%');
      anc.style.setProperty('--ay', y.toFixed(1) + '%');
    });
  }
  shuffleAnchors();
  setInterval(shuffleAnchors, 1000);

  // Video playback rate based on mouse distance to video center
  // (closer = slower, farther = up to 2x). Loops video.
  const video = stage.querySelector('.ab2-video video');
  if (video) {
    video.loop = true;
    video.muted = true;
    video.play().catch(() => {});
    stage.addEventListener('mousemove', e => {
      const r = video.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dist = Math.hypot(e.clientX - cx, e.clientY - cy);
      const maxDist = Math.hypot(window.innerWidth / 2, window.innerHeight / 2);
      const norm = Math.min(1, dist / maxDist);
      // 0.3 (closest) → 2.0 (farthest)
      video.playbackRate = 0.3 + norm * 1.7;
    });
  }

  // Draw lines from each tag to its anchor each frame
  function draw() {
    const sr = stage.getBoundingClientRect();
    const sw = sr.width, sh = sr.height;
    linesSvg.setAttribute('viewBox', '0 0 ' + sw + ' ' + sh);
    let paths = '';
    anchors.forEach((anc, i) => {
      const tag = tags[i];
      if (!tag) return;
      if (tag.classList.contains('tag-hidden') || anc.classList.contains('anc-hidden')) return;
      const ar = anc.getBoundingClientRect();
      const tr = tag.getBoundingClientRect();
      const ax = ar.left - sr.left + ar.width / 2;
      const ay = ar.top - sr.top + ar.height / 2;
      // Tag connection point: outer edge facing anchor
      let tx, ty;
      const tagSide = tag.classList.contains('tag-tl') || tag.classList.contains('tag-bl') ? 'right' : 'left';
      ty = tr.top - sr.top + tr.height / 2;
      tx = tagSide === 'right' ? tr.right - sr.left : tr.left - sr.left;
      // 3-segment path: horizontal — diagonal — horizontal
      const dx = ax - tx;
      const segH = dx * 0.35;     // horizontal stub from tag side
      const px1 = tx + segH;
      const px2 = ax - segH;
      paths += `<path d="M ${tx.toFixed(1)} ${ty.toFixed(1)} L ${px1.toFixed(1)} ${ty.toFixed(1)} L ${px2.toFixed(1)} ${ay.toFixed(1)} L ${ax.toFixed(1)} ${ay.toFixed(1)}" stroke="#1a1a1a" stroke-width="0.8" fill="none"/>`;
    });
    linesSvg.innerHTML = paths;
    requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);
})();

// ---------- Parametric "how it works" scroll-driven swap ----------
(() => {
  const scroller = document.querySelector('.hw-scroller');
  if (!scroller) return;
  const list = document.getElementById('hw-list');
  const track = document.getElementById('hw-image-track');
  const marker = document.getElementById('hw-marker-float');
  const items = list ? list.querySelectorAll('.hw-item') : [];
  const cur = document.getElementById('hw-cur');
  const N = items.length;
  if (!N) return;

  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));

  function placeMarker(idx) {
    if (!marker || !items[idx]) return;
    const item = items[idx];
    // Marker target Y = item top relative to list, plus offset to align with the hw-num baseline
    const y = item.offsetTop + 14;
    marker.style.setProperty('--my', y + 'px');
  }

  let lastIdx = -1;
  function tick() {
    const r = scroller.getBoundingClientRect();
    const vh = window.innerHeight;
    const total = r.height - vh;
    const prog = clamp(-r.top / total, 0, 1);
    const idx = clamp(Math.floor(prog * (N - 0.1) * 1.05), 0, N - 1);

    if (idx !== lastIdx) {
      lastIdx = idx;
      items.forEach((el, i) => el.classList.toggle('active', i === idx));
      if (track) track.style.setProperty('--hw-y', idx);
      if (cur) cur.textContent = String(idx + 1).padStart(2, '0');
      placeMarker(idx);
    }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);

  // Click on item also jumps to that position
  items.forEach((el, i) => {
    el.addEventListener('click', () => {
      // Find the scroll position within the scroller where item i is active.
      // Item i is active when prog ≈ (i + 0.4) / N. We need page scroll = scroller's pageTop + total * targetProg.
      const total = scroller.offsetHeight - window.innerHeight;
      const targetProg = (i + 0.4) / N;
      const scrollerPageTop = scroller.getBoundingClientRect().top + window.scrollY;
      const top = scrollerPageTop + total * targetProg;
      window.scrollTo({ top, behavior: 'smooth' });
    });
    el.style.cursor = 'pointer';
  });
})();

// ---------- Web Tool horizontal scroll ----------
(() => {
  const scroller = document.querySelector('.wt-scroller');
  if (!scroller) return;
  const track = scroller.querySelector('.wt-track');
  const cards = scroller.querySelectorAll('.wt-card');
  const bg = scroller.querySelector('.wt-bg-type');
  const fill = document.getElementById('wt-progress-fill');
  const curEl = document.getElementById('wt-cur');
  if (!track) return;

  // Apply preset rotation/y to each card (base values from data attrs)
  cards.forEach(card => {
    card.style.setProperty('--rot-base', card.dataset.rot || 0);
    card.style.setProperty('--yoff-base', card.dataset.yoff || 0);
    card.style.setProperty('--rot', card.dataset.rot || 0);
    card.style.setProperty('--yoff', card.dataset.yoff || 0);
  });

  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));

  // Smooth lerp state
  let currentX = window.innerWidth;
  let targetX = window.innerWidth;
  let activeIdx = -1;

  function tick() {
    const r = scroller.getBoundingClientRect();
    const vh = window.innerHeight;
    const vw = window.innerWidth;
    const total = r.height - vh;
    const prog = clamp(-r.top / total, 0, 1);

    // Total distance: cards stream from off-screen-right to off-screen-left
    const distance = vw + track.scrollWidth;
    // Slight ease-in/out so cards "settle" near each step
    targetX = vw - prog * distance;

    // Lerp for snappy/smooth feel
    currentX += (targetX - currentX) * 0.14;
    track.style.setProperty('--wt-x', currentX.toFixed(1) + 'px');

    // BG type drifts slower (0.2x) and stays mostly centered
    if (bg) bg.style.setProperty('--wt-bg-x', (-distance * prog * 0.18).toFixed(1) + 'px');

    // Per-card "magnetic catch" near viewport center
    let curIdx = 0;
    let curDist = Infinity;
    cards.forEach((card, i) => {
      const cr = card.getBoundingClientRect();
      const cardCenter = cr.left + cr.width / 2;
      const screenCenter = vw / 2;
      const off = cardCenter - screenCenter;
      const absOff = Math.abs(off);
      if (absOff < curDist) { curDist = absOff; curIdx = i; }

      // Magnetic effect: when card is within 60% of viewport from center, dampen rotation toward 0
      const range = vw * 0.5;
      const t = clamp(1 - absOff / range, 0, 1);
      const baseRot = parseFloat(card.dataset.rot || 0);
      const baseY = parseFloat(card.dataset.yoff || 0);
      // Ease the settle (cubic)
      const settle = t * t * (3 - 2 * t);
      const rotNow = baseRot * (1 - settle * 0.6);
      const yNow = baseY * (1 - settle * 0.4) + settle * -8;

      card.style.setProperty('--rot', rotNow.toFixed(2));
      card.style.setProperty('--yoff', yNow.toFixed(1));
    });

    if (curIdx !== activeIdx) {
      activeIdx = curIdx;
      if (curEl) curEl.textContent = String(activeIdx + 1).padStart(2, '0');
    }

    if (fill) fill.style.width = (prog * 100).toFixed(1) + '%';

    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
})();

// ---------- Data Viz: Featured Work (thumbnails + sliding marker) ----------
(() => {
  const stage = document.getElementById('dv3-stage');
  if (!stage) return;
  const thumbs = stage.querySelectorAll('.dv3-thumb');
  const previews = stage.querySelectorAll('.dv3-preview');
  const marker = document.getElementById('dv3-marker');
  const nameEl = document.getElementById('dv3-name');
  const descEl = document.getElementById('dv3-desc');
  const tagsEl = document.getElementById('dv3-tags');

  const projects = [
    { name: 'Space Strategy <em>· Web Tool</em>', nameZh: '空间策略 <em>· 决策平台</em>', desc: 'A web-based space-strategy & programming dashboard — test area targets, efficiency assumptions, departmental allocation, stacking logic, budget impact and scenario comparison through real-time interactive data visualization.', tags: '[ SPACE STRATEGY ] — [ PROGRAMMING ] — [ SCENARIO COMPARE ]', urls: [{ label: 'Open tool', href: 'https://pai-floorish-app-evhnbgbvb4epb4bh.eastus-01.azurewebsites.net/' }],
      descZh: '网页端空间策略与功能配置仪表盘——通过实时交互式数据可视化，测试面积目标、效率假设、部门分配、堆叠逻辑、成本影响与多方案对比。', tagsZh: '[ 空间策略 ] — [ 功能配置 ] — [ 方案对比 ]' },
    { name: 'PAYETTE <em>· Lens</em>', nameZh: 'PAYETTE <em>· Lens</em>', desc: 'An AI-assisted, Power BI-style analytics platform for company project data — interactive dashboards, portfolio filters and project search, plus natural-language chart generation: ask a question, build and refine charts, and add them back to the dashboard.', tags: '[ BUSINESS INTELLIGENCE ] — [ AI CHARTS ] — [ NL QUERY ]', urls: [],
      descZh: 'AI 辅助、类 Power BI 的公司项目数据分析平台——交互式仪表盘、组合筛选与项目检索，并支持自然语言生成图表：提问即可生成、修改图表并加回仪表盘。', tagsZh: '[ 商业智能 ] — [ AI 图表 ] — [ 自然语言查询 ]' },
    { name: 'Pulse', nameZh: 'Pulse', desc: 'A web survey platform with building & floor maps — clients leave targeted feedback on specific rooms across education & science projects.', tags: '[ WEB TOOL ] — [ CLIENT FEEDBACK ] — [ FLOOR MAPS ]', urls: [{ label: 'Open tool', href: 'https://engine.payette.com/pulse/login' }],
      descZh: '一款集成建筑与楼层平面图的网页调研平台，客户可在教育与科研项目中针对具体房间提交精准反馈。', tagsZh: '[ 网页工具 ] — [ 客户反馈 ] — [ 楼层地图 ]' },
    { name: 'MassIt', nameZh: 'MassIt', desc: 'A Rhino plug-in giving real-time sectional & plan views with department-specific area metrics during massing iterations.', tags: '[ RHINO PLUG-IN ] — [ REAL-TIME ] — [ AREA METRICS ]', urls: [],
      descZh: '一款基于 Grasshopper 的 Rhino 插件，在体量推敲中实时生成剖面与平面，并提供按部门细分的面积指标。', tagsZh: '[ RHINO 插件 ] — [ 实时 ] — [ 面积指标 ]' },
    { name: 'Power BI <em>· Tableau</em>', nameZh: '空间数据洞察 <em>· Power BI / Tableau</em>', desc: 'Architectural project data fused with floor plans — occupancy heatmaps, chord diagrams, and interactive dashboards for client engagement.', tags: '[ POWER BI ] — [ TABLEAU ] — [ DASHBOARD ]', urls: [],
      descZh: '将建筑项目数据与平面图融合——占用热力图、弦图与交互式仪表盘，助力客户沟通。', tagsZh: '[ POWER BI ] — [ TABLEAU ] — [ 仪表盘 ]' },
  ];
  const zh = () => window.__lang === 'zh';
  const LBL = { 'Open tool': '打开工具' };
  let curIdx = 0;
  const linksEl = document.getElementById('dv3-links');
  function renderLinks(idx) {
    if (!linksEl) return;
    const urls = (projects[idx] && projects[idx].urls) || [];
    linksEl.innerHTML = urls.map(u =>
      `<a class="proj-link" href="${u.href}" target="_blank" rel="noopener" data-cursor="link">${zh() && LBL[u.label] ? LBL[u.label] : u.label} <span class="ar">↗</span></a>`
    ).join('');
    linksEl.style.display = urls.length ? '' : 'none';
  }

  function placeMarker(idx) {
    if (!marker || !thumbs[idx]) return;
    const t = thumbs[idx];
    const list = t.parentElement;
    const tRect = t.getBoundingClientRect();
    const listRect = list.getBoundingClientRect();
    const x = tRect.left - listRect.left + (tRect.width - 14) / 2;
    marker.style.setProperty('--mx', x + 'px');
  }

  function paint(idx) {
    const p = projects[idx]; if (!p || !nameEl || !descEl) return;
    nameEl.innerHTML = (zh() && p.nameZh) ? p.nameZh : p.name;
    descEl.textContent = (zh() && p.descZh) ? p.descZh : p.desc;
    if (tagsEl) tagsEl.textContent = (zh() && p.tagsZh) ? p.tagsZh : p.tags;
    renderLinks(idx);
  }
  function setActive(idx) {
    curIdx = idx;
    thumbs.forEach((el, i) => el.classList.toggle('active', i === idx));
    previews.forEach((el, i) => el.classList.toggle('active', i === idx));
    placeMarker(idx);
    if (nameEl && descEl && projects[idx]) {
      nameEl.classList.add('swap');
      descEl.classList.add('swap');
      setTimeout(() => {
        paint(idx);
        nameEl.classList.remove('swap');
        descEl.classList.remove('swap');
      }, 280);
    }
  }
  renderLinks(0);
  document.addEventListener('langchange', () => paint(curIdx));

  thumbs.forEach((el, i) => {
    el.addEventListener('mouseenter', () => setActive(i));
    el.addEventListener('click', e => { e.preventDefault(); setActive(i); });
  });

  // Initial marker position
  window.addEventListener('load', () => placeMarker(0));
  window.addEventListener('resize', () => {
    const cur = [...thumbs].findIndex(t => t.classList.contains('active'));
    placeMarker(cur >= 0 ? cur : 0);
  });
})();

// ---------- ARVR split-pane hover focus ----------
(() => {
  const split = document.getElementById('arvr-split');
  if (!split) return;
  const panes = split.querySelectorAll('.arvr-pane');
  panes.forEach(p => {
    p.addEventListener('mouseenter', () => {
      split.classList.remove('h-l', 'h-r');
      split.classList.add('h-' + p.dataset.side);
    });
    p.addEventListener('mouseleave', () => {
      split.classList.remove('h-l', 'h-r');
    });
  });
})();

// ---------- UIUX sticky-note slide ----------
(() => {
  const pin = document.querySelector('.uiux-pin');
  const note = document.getElementById('uiux-note');
  if (!pin || !note) return;
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));

  function update() {
    const r = pin.getBoundingClientRect();
    const vh = window.innerHeight;
    const total = r.height - vh;
    const prog = clamp(-r.top / total, 0, 1);

    // Slide in between 0.15 and 0.6
    let p = (prog - 0.15) / 0.45;
    p = clamp(p, 0, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    note.style.setProperty('--p', eased.toFixed(3));

    requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
})();

// ---------- Inline preview videos that start at a given timestamp & loop from there ----------
(() => {
  const vids = document.querySelectorAll('video[data-start]');
  vids.forEach(v => {
    const start = parseFloat(v.dataset.start) || 0;
    v.loop = false; // we manage the loop so it returns to `start`, not 0
    const seekToStart = () => {
      try {
        if (isFinite(v.duration) && start < v.duration) v.currentTime = start;
      } catch (e) {}
    };
    if (v.readyState >= 1) seekToStart();
    else v.addEventListener('loadedmetadata', seekToStart, { once: true });
    v.addEventListener('ended', () => { seekToStart(); v.play().catch(() => {}); });
    // Safety: if it ever wraps back near 0, nudge it to the start point
    v.addEventListener('timeupdate', () => {
      if (v.currentTime < start - 0.5 && !v.seeking) seekToStart();
    });
  });
})();

// ---------- UIUX sticky note: draggable ----------
(() => {
  const note = document.getElementById('uiux-note');
  if (!note) return;
  const parent = note.offsetParent || note.parentElement;
  let dragging = false, sx = 0, sy = 0, ox = 0, oy = 0, moved = false;

  note.addEventListener('mousedown', e => {
    if (e.target.closest('a')) return;          // let the link buttons work
    e.preventDefault();
    const pr = parent.getBoundingClientRect();
    const nr = note.getBoundingClientRect();
    ox = nr.left - pr.left;
    oy = nr.top - pr.top;
    sx = e.clientX; sy = e.clientY;
    dragging = true; moved = false;
    note.style.left = ox + 'px';
    note.style.top = oy + 'px';
    note.style.transition = 'none';
    document.body.style.userSelect = 'none';
  });

  window.addEventListener('mousemove', e => {
    if (!dragging) return;
    const dx = e.clientX - sx, dy = e.clientY - sy;
    if (Math.abs(dx) > 2 || Math.abs(dy) > 2) moved = true;
    note.style.left = (ox + dx) + 'px';
    note.style.top = (oy + dy) + 'px';
  });

  window.addEventListener('mouseup', () => {
    if (!dragging) return;
    dragging = false;
    note.style.transition = '';
    document.body.style.userSelect = '';
  });

  // Swallow the click that ends a drag (so it never opens the video modal)
  note.addEventListener('click', e => {
    if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; }
  }, true);
})();

// ---------- Language toggle (EN ↔ 中文) — titles stay English ----------
(() => {
  const btn = document.getElementById('lang-toggle');
  if (!btn) return;
  let zh = false;
  function apply() {
    document.querySelectorAll('[data-zh]').forEach(el => {
      if (el.getAttribute('data-en') === null) el.setAttribute('data-en', el.innerHTML);
      el.innerHTML = zh ? el.getAttribute('data-zh') : el.getAttribute('data-en');
    });
    btn.textContent = zh ? 'EN' : '中文';
    document.documentElement.setAttribute('lang', zh ? 'zh' : 'en');
    window.__lang = zh ? 'zh' : 'en';
    document.dispatchEvent(new CustomEvent('langchange', { detail: { zh } }));
  }
  btn.addEventListener('click', e => { e.preventDefault(); zh = !zh; apply(); });
  window.__lang = 'en';
})();

// ---------- UIUX hero video — hover playback progress bar + click-seek ----------
(() => {
  const wrap = document.querySelector('.uiux-hero-img');
  const bar = document.getElementById('uiux-prog');
  if (!wrap || !bar) return;
  const fill = bar.querySelector('i');
  const vid = wrap.querySelector('video');
  if (!vid || !fill) return;

  function paint() {
    const d = vid.duration;
    if (d && isFinite(d)) fill.style.width = Math.min(100, (vid.currentTime / d) * 100) + '%';
  }
  vid.addEventListener('timeupdate', paint);
  vid.addEventListener('loadedmetadata', paint);

  function seek(e) {
    const d = vid.duration;
    if (!d || !isFinite(d)) return;
    const r = bar.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
    try { vid.currentTime = ratio * d; } catch (err) {}
    paint();
  }
  // keep clicks on the bar from opening the project drawer (data-cursor="video")
  ['click', 'pointerdown', 'mousedown'].forEach(ev =>
    bar.addEventListener(ev, e => { e.stopPropagation(); e.preventDefault(); }, true));
  bar.addEventListener('click', seek);

  let scrubbing = false;
  bar.addEventListener('pointerdown', e => { scrubbing = true; seek(e); });
  window.addEventListener('pointermove', e => { if (scrubbing) seek(e); });
  window.addEventListener('pointerup', () => { scrubbing = false; });
})();
