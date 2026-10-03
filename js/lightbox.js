/* ==========================================================================
   PENUMBRA · lightbox
   Click image -> fullscreen -> zoom / pan -> close.

   Mouse : wheel zooms toward the cursor, drag pans, double-click toggles zoom.
   Touch : pinch zooms, one finger pans, double-tap toggles zoom,
           a horizontal swipe at 1x moves to the previous / next image.
   Keys  : Esc close · + / − zoom · 0 reset · ← → navigate · F fullscreen.
   ========================================================================== */
(function (P) {
  "use strict";
  const U = P.U;

  const MIN = 1, MAX = 8;
  let root, stage, img, caption, count, prevBtn, nextBtn, fsBtn;
  let items = [], index = 0, opener = null, open = false;
  let s = 1, tx = 0, ty = 0;
  const pointers = new Map();
  let pinch = null, drag = null, lastTap = 0, swipeStart = null;

  const ICON = {
    close: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M5 5l14 14M19 5L5 19"/></svg>',
    plus: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
    minus: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M5 12h14"/></svg>',
    fit: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg>',
    full: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><rect x="4" y="5" width="16" height="14" rx="1.5"/><path d="M9 5v14"/></svg>',
    prev: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>',
    next: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg>',
  };

  function build() {
    root = U.el("div", { class: "lb", role: "dialog", "aria-modal": "true", "aria-label": "Image viewer", hidden: "" });
    root.innerHTML = `
      <div class="lb__stage"><img class="lb__img" alt="" draggable="false"></div>
      <div class="lb__top">
        <span class="lb__count" aria-live="polite"></span>
        <div class="lb__tools">
          <button type="button" data-act="out" aria-label="Zoom out">${ICON.minus}</button>
          <button type="button" data-act="in" aria-label="Zoom in">${ICON.plus}</button>
          <button type="button" data-act="reset" aria-label="Fit to screen">${ICON.fit}</button>
          <button type="button" data-act="full" aria-label="Toggle full screen" class="lb__fs">${ICON.full}</button>
          <button type="button" data-act="close" aria-label="Close viewer">${ICON.close}</button>
        </div>
      </div>
      <button type="button" class="lb__nav lb__nav--prev" data-act="prev" aria-label="Previous image">${ICON.prev}</button>
      <button type="button" class="lb__nav lb__nav--next" data-act="next" aria-label="Next image">${ICON.next}</button>
      <p class="lb__caption"></p>`;
    document.body.appendChild(root);

    stage = U.$(".lb__stage", root); img = U.$(".lb__img", root);
    caption = U.$(".lb__caption", root); count = U.$(".lb__count", root);
    prevBtn = U.$(".lb__nav--prev", root); nextBtn = U.$(".lb__nav--next", root);
    fsBtn = U.$(".lb__fs", root);
    if (!document.fullscreenEnabled) fsBtn.hidden = true;

    root.addEventListener("click", (e) => {
      const b = e.target.closest("[data-act]");
      if (!b) return;
      const a = b.dataset.act;
      if (a === "close") close();
      else if (a === "in") zoomBy(1.6);
      else if (a === "out") zoomBy(1 / 1.6);
      else if (a === "reset") reset(true);
      else if (a === "full") toggleFull();
      else if (a === "prev") go(-1);
      else if (a === "next") go(1);
    });

    /* wheel zoom toward cursor (also trackpad pinch, which sends ctrlKey) */
    stage.addEventListener("wheel", (e) => {
      e.preventDefault();
      const k = Math.exp(-e.deltaY * (e.ctrlKey ? 0.01 : 0.0018));
      zoomAt(s * k, e.clientX, e.clientY);
    }, { passive: false });

    stage.addEventListener("pointerdown", onDown);
    stage.addEventListener("pointermove", onMove);
    stage.addEventListener("pointerup", onUp);
    stage.addEventListener("pointercancel", onUp);
    stage.addEventListener("dblclick", (e) => { e.preventDefault(); toggleZoom(e.clientX, e.clientY); });

    document.addEventListener("keydown", onKey);
    document.addEventListener("fullscreenchange", () => root.classList.toggle("is-full", !!document.fullscreenElement));
    window.addEventListener("resize", () => { if (open) clampPan(); apply(false); });
  }

  /* ---- transform ---- */
  function apply(animate) {
    img.style.transition = animate ? "transform .35s cubic-bezier(.16,1,.3,1)" : "none";
    img.style.transform = `translate(${tx}px, ${ty}px) scale(${s})`;
    root.classList.toggle("is-zoomed", s > 1.01);
  }

  function center() {
    const r = stage.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2, w: r.width, h: r.height };
  }

  function clampPan() {
    if (s <= 1.001) { tx = 0; ty = 0; return; }
    const c = center();
    const w = img.offsetWidth * s, h = img.offsetHeight * s;
    const mx = Math.max(0, (w - c.w) / 2) + 60, my = Math.max(0, (h - c.h) / 2) + 60;
    tx = U.clamp(tx, -mx, mx); ty = U.clamp(ty, -my, my);
  }

  function zoomAt(ns, cx, cy, animate) {
    ns = U.clamp(ns, MIN, MAX);
    const c = center();
    const px = cx - c.x, py = cy - c.y;
    const k = ns / s;
    tx = px - (px - tx) * k; ty = py - (py - ty) * k;
    s = ns;
    clampPan(); apply(animate);
  }
  function zoomBy(k) { const c = center(); zoomAt(s * k, c.x, c.y, true); }
  function toggleZoom(x, y) { s > 1.05 ? reset(true) : zoomAt(2.6, x, y, true); }
  function reset(animate) { s = 1; tx = 0; ty = 0; apply(animate); }

  /* ---- pointers: pan, pinch, swipe, double-tap ---- */
  function dist() { const p = Array.from(pointers.values()); return Math.hypot(p[0].x - p[1].x, p[0].y - p[1].y); }
  function mid() { const p = Array.from(pointers.values()); return { x: (p[0].x + p[1].x) / 2, y: (p[0].y + p[1].y) / 2 }; }

  function onDown(e) {
    stage.setPointerCapture(e.pointerId);
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.size === 2) {
      pinch = { d: dist(), s0: s }; drag = null; swipeStart = null;
    } else if (pointers.size === 1) {
      drag = { x: e.clientX, y: e.clientY, tx0: tx, ty0: ty, moved: false };
      swipeStart = { x: e.clientX, y: e.clientY, t: Date.now() };
      img.style.transition = "none";
    }
  }

  function onMove(e) {
    if (!pointers.has(e.pointerId)) return;
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.size === 2 && pinch) {
      const m = mid();
      zoomAt(pinch.s0 * (dist() / pinch.d), m.x, m.y);
    } else if (drag && s > 1.001) {
      drag.moved = true;
      tx = drag.tx0 + (e.clientX - drag.x); ty = drag.ty0 + (e.clientY - drag.y);
      clampPan(); apply(false);
    } else if (drag) {
      if (Math.abs(e.clientX - drag.x) > 6) drag.moved = true;
    }
  }

  function onUp(e) {
    const had = pointers.has(e.pointerId);
    pointers.delete(e.pointerId);
    if (!had) return;
    if (pointers.size < 2) pinch = null;

    if (pointers.size === 0 && drag) {
      /* double-tap (touch) */
      if (e.pointerType !== "mouse" && !drag.moved) {
        const now = Date.now();
        if (now - lastTap < 300) { toggleZoom(e.clientX, e.clientY); lastTap = 0; }
        else lastTap = now;
      }
      /* swipe between images at 1x */
      if (s <= 1.001 && swipeStart && e.pointerType !== "mouse") {
        const dx = e.clientX - swipeStart.x, dy = e.clientY - swipeStart.y;
        if (Math.abs(dx) > 70 && Math.abs(dx) > Math.abs(dy) * 1.5) go(dx < 0 ? 1 : -1);
      }
      drag = null; swipeStart = null;
    } else if (pointers.size === 1) {
      const p = Array.from(pointers.values())[0];
      drag = { x: p.x, y: p.y, tx0: tx, ty0: ty, moved: true };
    }
  }

  /* ---- keyboard ---- */
  function onKey(e) {
    if (!open) return;
    const k = e.key;
    if (k === "Escape") { e.preventDefault(); e.stopPropagation(); close(); }
    else if (k === "+" || k === "=") zoomBy(1.4);
    else if (k === "-" || k === "_") zoomBy(1 / 1.4);
    else if (k === "0") reset(true);
    else if (k === "ArrowRight" && s <= 1.01) go(1);
    else if (k === "ArrowLeft" && s <= 1.01) go(-1);
    else if (k === "f" || k === "F") toggleFull();
    else if (k === "Tab") trapFocus(e);
  }

  function trapFocus(e) {
    const f = U.$$("button:not([hidden]):not([disabled])", root).filter((b) => b.offsetParent !== null);
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  function toggleFull() {
    if (!document.fullscreenEnabled) return;
    if (document.fullscreenElement) document.exitFullscreen();
    else root.requestFullscreen().catch(() => {});
  }

  /* ---- navigation / display ---- */
  function show(i, animate) {
    index = (i + items.length) % items.length;
    const it = items[index];
    reset(false);
    img.alt = it.alt || it.caption || "";
    img.classList.remove("is-in");
    img.src = it.src;
    void img.offsetWidth;
    img.classList.add("is-in");
    caption.textContent = it.caption || "";
    caption.hidden = !it.caption;
    count.textContent = items.length > 1 ? `${index + 1} / ${items.length}` : "";
    prevBtn.hidden = nextBtn.hidden = items.length < 2;
  }
  function go(d) { if (items.length > 1) show(index + d); }

  function openViewer(list, i, trigger) {
    if (!root) build();
    items = list; opener = trigger || document.activeElement; open = true;
    root.hidden = false;
    document.documentElement.classList.add("is-lightbox-open");
    show(i || 0);
    root.classList.remove("is-closing");
    requestAnimationFrame(() => root.classList.add("is-open"));
    U.$('[data-act="close"]', root).focus({ preventScroll: true });
  }

  function close() {
    if (!open) return;
    open = false;
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    root.classList.remove("is-open");
    root.classList.add("is-closing");
    document.documentElement.classList.remove("is-lightbox-open");
    setTimeout(() => { root.hidden = true; root.classList.remove("is-closing"); img.removeAttribute("src"); }, U.reducedMotion() ? 0 : 260);
    if (opener && opener.isConnected) opener.focus({ preventScroll: true });
    pointers.clear(); pinch = null; drag = null;
  }

  P.lightbox = { open: openViewer, close, isOpen: () => open };
})(window.PENUMBRA);
