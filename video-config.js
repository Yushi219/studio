/* ============================================================
   VIDEO SOURCE CONFIG  —  host code on GitHub, videos on a CDN
   ------------------------------------------------------------
   Every video in the site is referenced locally as
       assets/....mp4
   In production the big .mp4 files DON'T live in the Git repo —
   they sit on object storage + CDN (e.g. Azure Blob + Front Door).
   Set `base` (and optionally a China mirror `baseCN`) below; this
   script transparently rewrites every <video>/<source> so the
   exact same code works locally and in production.

   base = '' (default)  ->  no rewrite, videos load from /assets
                            (perfect for local dev & GitHub clone)
   base = 'https://videos.YOURDOMAIN.com/'
                         -> assets/foo.mp4  ->  https://videos…/foo.mp4

   "Mainland China mirror" button (manual, ChatGPT 方式 B): appears
   only when `baseCN` is set; flips every video to the CN source.
   ============================================================ */
(() => {
  'use strict';
  window.VIDEO_SRC = window.VIDEO_SRC || {
    // Production videos — Azure Blob (Front Door blocked on Free/Student).
    // Container "videos" (anonymous Blob read) under account yushistudiovideos.
    base: 'https://yushistudiovideos.blob.core.windows.net/videos/',
    baseCN: '',   // later: Aliyun OSS / Tencent COS + ICP, e.g. 'https://cn-videos.yushiwang.studio/'
    useCN: false
  };
  const C = window.VIDEO_SRC;
  try { C.useCN = localStorage.getItem('yw_video_cn') === '1' && !!C.baseCN; } catch (e) {}

  // On localhost / the preview server, always use the bundled /assets files
  // so local development keeps working before the CDN is up.
  const isLocal = /^(localhost|127\.|0\.0\.0\.0|\[::1\]|.*\.local)$/i.test(location.hostname) || location.protocol === 'file:';
  const activeBase = () => isLocal ? '' : ((C.useCN && C.baseCN) ? C.baseCN : C.base);
  // pull the "assets/….mp4" path out of any local src
  const localPath = s => {
    if (!s) return null;
    const m = String(s).match(/(?:^|\/)(assets\/[^?#]+\.mp4)(?:[?#]|$)/i);
    return m ? m[1] : (/^assets\/[^?#]+\.mp4$/i.test(s) ? s : null);
  };
  function resolve(el) {
    const base = activeBase();
    let p = el.dataset.vpath;
    if (!p) { p = localPath(el.getAttribute('src')); if (p) el.dataset.vpath = p; }
    if (!p) return;
    const want = base ? base.replace(/\/?$/, '/') + p.replace(/^assets\//, '') : p;
    if (el.getAttribute('src') === want) return;
    el.setAttribute('src', want);
    const v = el.tagName === 'SOURCE' ? el.parentElement : el;
    if (v && v.tagName === 'VIDEO') { try { v.load(); } catch (e) {} }
  }
  function scan(root) {
    (root.querySelectorAll ? root.querySelectorAll('video[src],source[src]') : []).forEach(resolve);
    if (root.matches && root.matches('video[src],source[src]')) resolve(root);
  }
  function run() {
    scan(document);
    new MutationObserver(muts => {
      for (const m of muts) {
        if (m.type === 'attributes' && m.target && m.target.tagName) resolve(m.target);
        m.addedNodes && m.addedNodes.forEach(n => { if (n.nodeType === 1) scan(n); });
      }
    }).observe(document.documentElement, {
      subtree: true, childList: true, attributes: true, attributeFilter: ['src']
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
  else run();

  // ---- Mainland-China mirror toggle (only if a CN source is set) ----
  window.__toggleVideoCN = (on) => {
    C.useCN = on === undefined ? !C.useCN : !!on;
    try { localStorage.setItem('yw_video_cn', C.useCN ? '1' : '0'); } catch (e) {}
    document.querySelectorAll('video[data-vpath],source[data-vpath]').forEach(resolve);
    const b = document.getElementById('cn-mirror-btn');
    if (b) b.classList.toggle('on', C.useCN);
  };
  document.addEventListener('DOMContentLoaded', () => {
    if (!C.baseCN) return;                       // no CN source configured -> no button
    const nav = document.querySelector('.chrome .tr');
    if (!nav || document.getElementById('cn-mirror-btn')) return;
    const b = document.createElement('button');
    b.id = 'cn-mirror-btn';
    b.type = 'button';
    b.className = 'lang-toggle';
    b.setAttribute('data-cursor', 'link');
    b.setAttribute('data-zh', '🇨🇳 中国镜像');
    b.textContent = '🇨🇳 CN mirror';
    if (C.useCN) b.classList.add('on');
    b.addEventListener('click', e => { e.preventDefault(); window.__toggleVideoCN(); });
    nav.insertBefore(b, document.getElementById('lang-toggle') || nav.firstChild);
  });
})();
