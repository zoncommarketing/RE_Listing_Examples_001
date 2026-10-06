/* Website 9 · shared behaviour: the top bar, the image viewer (every image opens large, with previous / next),
   the original-vs-concept sliders, the dual-cut films on the Media page and the 3D model / virtual tour pages.
   Progressive enhancement: every link and file works without it. */
(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const root = document.documentElement;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const IMG_RE = /\.(jpe?g|png|webp|gif)(?:[?#].*)?$/i;
  const DOC_RE = /\.(pdf|docx?|zip|pptx?)(?:[?#].*)?$/i;

  /* ---------- top bar: real height into --w9-h; the bar stays put on every screen size ----------
     Nothing here changes the bar's size, position or the page layout while scrolling (a size change moved
     the page, which re-triggered the change: the bar shook). The user asked (2026-10-01) for the bar to stay
     stationary on phones too, so it no longer tucks away; scrolling only adds a shadow. */
  const top = $('.w9-top');
  if (top) {
    const bar = $('.w9-bar', top), tabsEl = $('.w9-tabs', top);
    const setH = () => {
      const bh = bar ? bar.offsetHeight : 0, th = tabsEl ? tabsEl.offsetHeight + 4 : 0;
      if (bh + th > 40) root.style.setProperty('--w9-h', Math.round(bh + th) + 'px');
      root.style.setProperty('--w9-bar-h', bh + 'px');
    };
    let ticking = false;
    const onScroll = () => { ticking = false; top.classList.toggle('is-scrolled', scrollY > 24); };
    addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
    addEventListener('resize', setH);
    setH(); onScroll();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(setH);
    const strip = $('.w9-tabs-in', top);
    if (strip && tabsEl) {
      const edges = () => {
        tabsEl.classList.toggle('has-l', strip.scrollLeft > 4);
        tabsEl.classList.toggle('has-r', strip.scrollLeft + strip.clientWidth < strip.scrollWidth - 4);
      };
      strip.addEventListener('scroll', edges, { passive: true });
      addEventListener('resize', edges);
      const cur = $('a[aria-current=page]', strip);
      if (cur && strip.scrollWidth > strip.clientWidth) strip.scrollLeft = Math.max(0, cur.offsetLeft - (strip.clientWidth - cur.offsetWidth) / 2);
      edges();
      // the strip's width settles once the web fonts load: re-check the edges then (and on any later size change)
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(edges);
      addEventListener('load', edges);
      if ('ResizeObserver' in window) new ResizeObserver(edges).observe(strip);
      /* Side-scrolling the tabs when they don't fit (phones, narrow or vertical windows), 2026-10-03:
         touch swipes scroll natively; the ‹ › buttons, the mouse wheel and a mouse drag work too. */
      const canScroll = () => strip.scrollWidth > strip.clientWidth + 2;
      $$('.w9-tabs-arrow', tabsEl).forEach(b => b.addEventListener('click', () => {
        strip.scrollBy({ left: (b.classList.contains('l') ? -1 : 1) * Math.max(160, strip.clientWidth * 0.6), behavior: reduced ? 'auto' : 'smooth' });
      }));
      strip.addEventListener('wheel', e => {
        if (!canScroll() || e.ctrlKey) return;
        const d = (Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY) * (e.deltaMode === 1 ? 32 : e.deltaMode === 2 ? strip.clientWidth : 1);
        const max = strip.scrollWidth - strip.clientWidth;
        if (!d || (d < 0 && strip.scrollLeft <= 0) || (d > 0 && strip.scrollLeft >= max - 1)) return;   // at an end: the page scrolls
        e.preventDefault();
        strip.scrollLeft += d;
      }, { passive: false });
      let dragX = null, dragL = 0, dragged = false;
      strip.addEventListener('pointerdown', e => {
        if (e.pointerType !== 'mouse' || e.button !== 0 || !canScroll()) return;
        dragX = e.clientX; dragL = strip.scrollLeft; dragged = false;
      });
      addEventListener('pointermove', e => {
        if (dragX === null) return;
        const d = e.clientX - dragX;
        if (!dragged && Math.abs(d) > 6) { dragged = true; strip.classList.add('is-dragging'); }
        if (dragged) strip.scrollLeft = dragL - d;
      });
      addEventListener('pointerup', () => { dragX = null; strip.classList.remove('is-dragging'); });
      strip.addEventListener('click', e => { if (dragged) { e.preventDefault(); e.stopPropagation(); dragged = false; } }, true);
      $$('a', strip).forEach(a => { a.draggable = false; });
    }
  }

  /* ---------- original-vs-concept and photograph-vs-model sliders ---------- */
  const initSlider = box => {
    const r = $('input[type=range]', box);
    if (!r || box.__w9) return;
    box.__w9 = true;
    // the corner tags fade as their side is wiped away, so at either end only the visible image keeps its tag (2026-10-03)
    const op = share => Math.max(0, Math.min(1, (share - 6) / 24)).toFixed(2);
    const set = () => {
      const v = +r.value;
      box.style.setProperty('--x', v + '%');
      box.style.setProperty('--l-op', op(v)); box.style.setProperty('--r-op', op(100 - v));
      r.setAttribute('aria-valuetext', v + ' percent original');
    };
    r.addEventListener('input', set); set();
  };
  $$('.w9-cmp-box, .w9-cs').forEach(initSlider);

  /* ---------- image viewer ---------- */
  // Images already handled by a site viewer (photographs, plans, concept comparisons) keep that viewer.
  const SITE_OWNED = '[data-photo],[data-i],[data-plan],[data-compare],[data-concept-open],[data-set],[data-fact],[data-replay-hero]';
  const SKIP = '.w9-top,.w9-card,.w9-pager,button,video,.mt,[data-tour],.zc-band,.zoncom-review-band,.zc-review-badge,dialog,svg,.arrival-stage,'
    + '.hero,.hero-full,.hero-split,#top,.agent-card,.arrival-agent,footer,.foot,.site-footer,.mobilebar,.mobile-bar,.ex-plans,.plan-floor,.plan,.pins,'
    + '.leaflet-container,.map-box,.map-workspace,.loc-map,.w9-cs,.w9-cmp-box,.doc-fb,[data-w9-nolb]';
  const bestSrc = img => {
    const ss = img.getAttribute('srcset');
    if (ss) {
      let best = null, bw = 0;
      ss.split(',').forEach(p => { const [u, w] = p.trim().split(/\s+/); const n = parseInt(w, 10) || 0; if (n >= bw) { bw = n; best = u; } });
      if (best) return best;
    }
    return img.currentSrc || img.getAttribute('src');
  };
  const capOf = (el, img) => {
    const fig = el.closest('figure');
    const fc = fig && $('figcaption', fig);
    let t = fc ? fc.textContent : '';
    if (!t.trim() && img) t = img.alt || '';
    if (!t.trim()) t = (el.getAttribute('aria-label') || el.textContent || '');
    return t.replace(/\s+/g, ' ').trim();
  };
  // what clicking `el` (an <a> or an <img>) should show, or null
  const itemOf = el => {
    if (!el || el.closest(SKIP) || el.closest(SITE_OWNED)) return null;
    if (el.tagName === 'A') {
      const href = el.getAttribute('href') || '';
      const img = $('img', el);
      if (IMG_RE.test(href)) return { el, src: href, cap: capOf(el, img), alt: img ? img.alt : '' };
      if (DOC_RE.test(href) && img && img.getAttribute('src')) return { el, src: bestSrc(img), cap: capOf(el, img), alt: img.alt, dl: href };
      return null;
    }
    if (el.tagName === 'IMG') {
      if (el.closest('a')) return itemOf(el.closest('a'));
      if (!el.getAttribute('src') || (el.naturalWidth && el.naturalWidth < 120)) return null;
      return { el, src: bestSrc(el), cap: capOf(el, el), alt: el.alt };
    }
    return null;
  };
  const groupOf = el => {
    const box = el.closest('[data-w9-group]') || el.closest('main > section') || el.closest('main') || document.body;
    const items = [], seen = new Set();
    $$('a[href], img', box).forEach(n => {
      const it = itemOf(n);
      if (!it || seen.has(it.el)) return;
      seen.add(it.el); items.push(it);
    });
    return items;
  };
  const cmpGroupOf = el => {
    const box = el.closest('[data-w9-group]') || el.closest('main > section') || document.body;
    return $$('.w9-cs, .w9-cmp-box', box).map(b => {
      const imgs = $$('img', b);
      const orig = imgs.find(i => i.classList.contains('w9-cs-orig')) || imgs.find(i => !i.classList.contains('model')) || imgs[0];
      const other = imgs.find(i => i !== orig) || imgs[1];
      const ar = b.offsetWidth && b.offsetHeight ? b.offsetWidth / b.offsetHeight : 1.5;
      return { el: b, cmp: true, ar, a: bestSrc(orig), b: bestSrc(other), la: b.dataset.labelA || 'Original photograph', lb: b.dataset.labelB || 'Concept', cap: capOf(b, other), alt: other ? other.alt : '' };
    });
  };

  let LB = null, list = [], pos = 0, opener = null;
  const build = () => {
    LB = document.createElement('dialog');
    LB.className = 'w9-lb';
    LB.setAttribute('aria-label', 'Image viewer');
    LB.innerHTML = '<div class="w9-lb-bar"><span class="w9-lb-count" aria-live="polite"></span><span class="w9-lb-acts">'
      + '<a class="w9-lb-dl" download>Download</a><a class="w9-lb-open" target="_blank" rel="noopener">Open full size ↗</a>'
      + '<button type="button" class="w9-lb-x"><span class="w9-x" aria-hidden="true">✕</span>Close</button></span></div>'
      + '<div class="w9-lb-stage"><img class="w9-lb-img" alt="">'
      + '<div class="w9-lb-cmp w9-cmp-box" hidden><img class="w9-lb-a" alt=""><img class="model w9-lb-b" alt=""><span class="w9-cmp-lab l"></span><span class="w9-cmp-lab r"></span>'
      + '<input type="range" min="0" max="100" value="50" aria-label="Slide between the two images"><span class="w9-cmp-line" aria-hidden="true"></span></div></div>'
      + '<p class="w9-lb-cap"></p>'
      + '<button type="button" class="w9-lb-nav w9-lb-prev" aria-label="Previous image">‹</button><button type="button" class="w9-lb-nav w9-lb-next" aria-label="Next image">›</button>';
    document.body.appendChild(LB);
    initSlider($('.w9-lb-cmp', LB));
    $('.w9-lb-x', LB).addEventListener('click', () => LB.close());
    $('.w9-lb-prev', LB).addEventListener('click', () => step(-1));
    $('.w9-lb-next', LB).addEventListener('click', () => step(1));
    LB.addEventListener('keydown', e => {
      if (e.target && e.target.type === 'range') return;
      if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1); }
      if (e.key === 'ArrowRight') { e.preventDefault(); step(1); }
    });
    LB.addEventListener('click', e => { if (e.target === LB || e.target.classList.contains('w9-lb-stage')) LB.close(); });
    let sx = null, sy = null;
    LB.addEventListener('pointerdown', e => { if (e.target.type === 'range') return; sx = e.clientX; sy = e.clientY; });
    LB.addEventListener('pointerup', e => {
      if (sx === null) return;
      const dx = e.clientX - sx, dy = e.clientY - sy; sx = null;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) step(dx < 0 ? 1 : -1);
    });
    LB.addEventListener('close', () => { $('.w9-lb-img', LB).removeAttribute('src'); if (opener && opener.focus) opener.focus({ preventScroll: true }); });
  };
  const show = () => {
    const it = list[pos], img = $('.w9-lb-img', LB), cmp = $('.w9-lb-cmp', LB);
    $('.w9-lb-count', LB).textContent = list.length > 1 ? (pos + 1) + ' / ' + list.length : '';
    $('.w9-lb-cap', LB).textContent = it.cap || '';
    const dl = $('.w9-lb-dl', LB), op = $('.w9-lb-open', LB);
    if (it.cmp) {
      img.hidden = true; cmp.hidden = false;
      cmp.style.aspectRatio = String(it.ar); cmp.style.width = 'min(100%, calc((100dvh - 210px) * ' + it.ar.toFixed(4) + '))';
      $('.w9-lb-a', cmp).src = it.a; $('.w9-lb-b', cmp).src = it.b; $('.w9-lb-b', cmp).alt = it.alt || '';
      $('.w9-cmp-lab.l', cmp).textContent = it.la; $('.w9-cmp-lab.r', cmp).textContent = it.lb;
      const r = $('input', cmp); r.value = 50; r.dispatchEvent(new Event('input'));
      op.href = it.b; dl.hidden = true;
    } else {
      cmp.hidden = true; img.hidden = false;
      img.removeAttribute('src'); img.alt = it.alt || it.cap || ''; img.src = it.src;
      op.href = it.src;
      dl.hidden = !it.dl; if (it.dl) dl.href = it.dl;
    }
    $$('.w9-lb-nav', LB).forEach(b => { b.hidden = list.length < 2; });
    [pos + 1, pos - 1].forEach(k => { const n = list[(k + list.length) % list.length]; if (n && !n.cmp) { const p = new Image(); p.src = n.src; } });
  };
  const step = d => { if (list.length < 2) return; pos = (pos + d + list.length) % list.length; show(); };
  const openViewer = (items, start, from) => {
    if (!items.length) return;
    if (!LB) build();
    list = items; pos = Math.max(0, start); opener = from;
    show();
    if (typeof LB.showModal === 'function') LB.showModal(); else LB.setAttribute('open', '');
  };
  window.__W9_VIEWER__ = { open: openViewer, groupOf, itemOf };

  document.addEventListener('click', e => {
    if (e.defaultPrevented || e.button > 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const zoom = e.target.closest('.w9-cs-zoom, .w9-cmp-zoom');
    if (zoom) {
      e.preventDefault();
      const box = zoom.closest('.w9-cs, .w9-cmp-box') || zoom.parentElement.querySelector('.w9-cs, .w9-cmp-box');
      const items = cmpGroupOf(box);
      openViewer(items, items.findIndex(i => i.el === box), zoom);
      return;
    }
    const t = e.target.closest('a, img');
    if (!t) return;
    const it = itemOf(t);
    if (!it) return;
    e.preventDefault();
    const items = groupOf(it.el);
    openViewer(items, items.findIndex(i => i.el === it.el), t);
  });
  // images that open the viewer show a zoom cursor
  const markZoomable = () => $$('main img').forEach(img => { const it = itemOf(img); if (it && !it.el.classList.contains('w9-zoomable')) it.el.classList.add('w9-zoomable'); });
  markZoomable();
  addEventListener('load', markZoomable);

  /* ---------- Media page: one film at a time; 16:9 / 9:16 switch; posters load on approach ---------- */
  document.addEventListener('play', e => {
    const v = e.target;
    if (!(v instanceof HTMLMediaElement)) return;
    $$('video').forEach(o => { if (o !== v && o.id !== 'hero-film' && !o.paused) o.pause(); });
  }, true);
  const lazyPosters = $$('video[data-w9-poster]');
  const armPoster = v => { if (!v.getAttribute('poster')) v.setAttribute('poster', v.dataset.w9Poster); };
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { io.unobserve(en.target); armPoster(en.target); } }), { rootMargin: '600px 0px' });
    lazyPosters.forEach(v => io.observe(v));
  } else lazyPosters.forEach(armPoster);
  $$('[data-w9-cut]').forEach(b => b.addEventListener('click', () => {
    const fig = b.closest('.w9-film'), v = $('video', fig), frame = $('.w9-film-frame', fig);
    const cut = b.dataset.w9Cut;
    if (!v || v.dataset.cut === cut) return;
    const playing = !v.paused && !v.ended;
    v.pause();
    v.dataset.cut = cut;
    v.setAttribute('poster', v.dataset['poster' + cut]);
    v.src = v.dataset['src' + cut];
    frame.classList.toggle('is-portrait', cut === '9');
    $$('[data-w9-cut]', fig).forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    const dl = $('[data-w9-dl]', fig); if (dl) dl.href = v.dataset['src' + cut];
    if (playing) { const p = v.play(); if (p && p.catch) p.catch(() => {}); }
  }));

  /* ---------- 3D model and virtual tour pages ---------- */
  const tourRoot = $('[data-tour]');
  if (tourRoot) {
    const whenReady = fn => {
      if (tourRoot.getAttribute('data-ready') === 'true') { fn(); return; }
      new MutationObserver((m, obs) => { if (tourRoot.getAttribute('data-ready') === 'true') { obs.disconnect(); fn(); } })
        .observe(tourRoot, { attributes: true, attributeFilter: ['data-ready'] });
    };
    if (tourRoot.hasAttribute('data-w9-dollhouse')) {
      whenReady(() => { if (!window.TOUR) return; window.TOUR.jump('hall'); setTimeout(() => window.TOUR.dollhouse(true), reduced ? 0 : 450); });
    }
    $$('[data-w9-stop]').forEach(b => b.addEventListener('click', () => {
      const T = window.TOUR; if (!T) return;
      const go = () => { T.jump(b.dataset.w9Stop); tourRoot.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' }); };
      if (tourRoot.getAttribute('data-ready') === 'true') go(); else { whenReady(go); T.start(); }
    }));
  }

  /* ---------- self-test for the Website 9 layer: window.__W9_ASSERT__() ---------- */
  window.__W9_ASSERT__ = () => {
    const F = [];
    const need = (c, m) => { if (!c) F.push(m); };
    const t = $('.w9-top');
    need(!!t, 'no top bar');
    if (t) {
      need($$('.w9-tabs a[aria-current="page"]', t).length === 1, 'not exactly one current tab');
      need(!!$('.w9-offer strong', t) && /\$\d/.test($('.w9-offer strong', t).textContent), 'price missing from the top bar');
      need(!!$('.w9-call[href^="tel:"]', t), 'call link missing');
      need(!!$('.w9-book', t), 'book a tour missing');
      $$('.w9-tabs a', t).forEach(a => need(/^[\w-]+\.html$/.test(a.getAttribute('href')), 'tab link is not a page: ' + a.getAttribute('href')));
      ['model.html', 'virtual-tour.html'].forEach(p => { const a = $('.w9-tabs a[href="' + p + '"]', t); if (a) need(!!$('.w9-wip', a), p + ' tab is not marked as work in progress'); });
    }
    if (tourRoot) need(!!$('.w9-wipnote'), 'work-in-progress notice missing on a 3D page');
    need($$('h1').length === 1, 'page has ' + $$('h1').length + ' h1 elements');
    $$('a[href^="#"]').forEach(a => { const id = a.getAttribute('href').slice(1); if (id) need(!!document.getElementById(id), 'in-page link to a missing id: #' + id); });
    need(root.scrollWidth <= innerWidth + 1, 'horizontal overflow ' + root.scrollWidth + ' > ' + innerWidth);
    // every content image either opens a viewer or is decorative
    const orphan = $$('main img').filter(img => {
      const sl = img.closest('.w9-cs, .w9-cmp-box');
      if (sl) return !sl.querySelector('.w9-cs-zoom, .w9-cmp-zoom');
      if (img.closest(SKIP) || img.closest(SITE_OWNED)) return false;
      const a = img.closest('a');
      if (a && /\.html(?:[#?].*)?$/.test(a.getAttribute('href') || '')) return false;
      if (img.naturalWidth && img.naturalWidth < 120) return false;
      return !itemOf(img);
    }).map(i => i.getAttribute('src'));
    need(!orphan.length, 'images that do not open larger: ' + orphan.slice(0, 5).join(', '));
    $$('.w9-cs').forEach(b => need($$('img', b).length >= 2 && !!$('input[type=range]', b), 'concept slider incomplete'));
    return { ok: !F.length, failures: F };
  };
})();
