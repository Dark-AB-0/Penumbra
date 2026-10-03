/* ==========================================================================
   PENUMBRA · project view
   Every project uses the same page structure, generated from its data.

   Opening   : the card's rectangle becomes a clip-path that expands to the
               full viewport while a thin violet frame travels with it, so the
               card visibly turns into the page.
   Closing   : the page collapses back into its card (or fades if the card is
               not on screen).
   Routing   : #/project/<id> — works with Back, Forward and direct links.
   ========================================================================== */
(function (P) {
  "use strict";
  const U = P.U;

  const EASE = "cubic-bezier(.76,0,.18,1)";
  const OPEN_MS = 780, CLOSE_MS = 560;

  let host, scroller, frame;
  let current = null;        // project currently shown
  let originCard = null;     // card that launched it
  let busy = false, queued = false;
  let opener = null;

  const byId = (id) => P.projects.find((p) => p.id === id);

  /* ---------------------------------------------------------------------- */
  /* Template                                                                */
  /* ---------------------------------------------------------------------- */
  const ICON = {
    back: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>',
    gh: '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.05-.71.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.04 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.58.23 2.75.11 3.04.74.81 1.19 1.83 1.19 3.09 0 4.42-2.7 5.4-5.27 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5z"/></svg>',
    zoom: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5L21 21M10.5 8v5M8 10.5h5"/></svg>',
    doc: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M7 3h7l5 5v12a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z"/><path d="M14 3v5h5M9 13h6M9 17h6"/></svg>',
    ext: '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M7 17L17 7M9 7h8v8"/></svg>',
  };

  function section(id, title, body) {
    return `<section class="p-sec" id="ps-${id}" aria-labelledby="ps-${id}-h">
      <h2 class="p-sec__title" id="ps-${id}-h">${title}</h2>
      <div class="p-sec__body">${body}</div>
    </section>`;
  }

  function mediaGrid(group, items) {
    return `<div class="p-media-grid p-media-grid--${group}">${items.map((m, i) => `
      <figure class="p-fig">
        <button type="button" class="p-media" data-group="${group}" data-i="${i}" aria-label="Open in full screen: ${U.esc(m.caption || m.alt || group)}">
          <img src="${m.src}" alt="${U.esc(m.alt || m.caption || "")}" loading="lazy" decoding="async">
          <span class="p-media__zoom" aria-hidden="true">${ICON.zoom}</span>
        </button>
        ${m.caption ? `<figcaption>${U.esc(m.caption)}</figcaption>` : ""}
      </figure>`).join("")}</div>`;
  }

  function render(p) {
    const cover = P.cards.coverSrc(p);
    const order = P.archive.exploreOrder(P.projects);
    const i = order.findIndex((x) => x.id === p.id);
    const next = order.length > 1 ? order[(i + 1) % order.length] : null;

    const paras = Array.isArray(p.description) ? p.description : String(p.description || "").split(/\n{2,}/).filter(Boolean);

    /* media with resolved sources (generated art works as images too) */
    const resolve = (list) => (list || []).map((m) => ({
      src: m.art ? P.art.url(p.id + ":" + (m.caption || m.art), m.art) : U.asset(p, m.src),
      caption: m.caption || "", alt: m.alt || m.caption || "",
    }));
    p._media = { diagrams: resolve(p.diagrams), images: resolve(p.images) };

    const parts = [];

    parts.push(section("overview", "Overview",
      paras.length ? paras.map((t) => `<p class="p-lead">${U.inline(t)}</p>`).join("")
                   : `<p class="p-lead p-muted">The description for this project has not been written yet.</p>`));

    if (p.process) {
      const body = Array.isArray(p.process)
        ? `<ol class="p-steps">${p.process.map((s) => `<li><h3>${U.esc(s.title)}</h3><p>${U.inline(s.text)}</p></li>`).join("")}</ol>`
        : String(p.process).split(/\n{2,}/).map((t) => `<p>${U.inline(t)}</p>`).join("");
      parts.push(section("process", "Process", body));
    }

    if (p.technologies && p.technologies.length) {
      parts.push(section("stack", "Technologies",
        `<ul class="p-tags">${p.technologies.map((t) => `<li>${U.esc(t)}</li>`).join("")}</ul>`));
    }

    if (p.code && p.code.length) parts.push(section("code", "Code", `<div class="p-code-slot"></div>`));
    if (p._media.diagrams.length) parts.push(section("diagrams", "Diagrams", mediaGrid("diagrams", p._media.diagrams)));
    if (p._media.images.length) parts.push(section("images", "Images", mediaGrid("images", p._media.images)));

    if (p.docs && p.docs.length) {
      parts.push(section("docs", "Documentation", `<ul class="p-docs">${p.docs.map((d) => `
        <li><a href="${U.esc(U.asset(p, d.src))}" target="_blank" rel="noopener">
          <span class="p-docs__icon">${ICON.doc}</span>
          <span class="p-docs__name">${U.esc(d.title)}</span>
          <span class="p-docs__type">${U.esc(d.type || "File")}</span>
          <span class="p-docs__open" aria-hidden="true">${ICON.ext}</span>
        </a></li>`).join("")}</ul>`));
    }

    const extra = (p.links || []).map((l) =>
      `<a class="btn" href="${U.esc(l.url)}" target="_blank" rel="noopener noreferrer">${U.esc(l.label)}${ICON.ext}</a>`).join("");
    if (p.github || extra) {
      parts.push(section("links", "Links", `<div class="p-links">
        ${p.github ? `<a class="btn btn--solid" href="${U.esc(p.github)}" target="_blank" rel="noopener noreferrer">${ICON.gh}View on GitHub</a>` : ""}${extra}</div>`));
    }

    const gh = p.github
      ? `<a class="btn btn--small" href="${U.esc(p.github)}" target="_blank" rel="noopener noreferrer">${ICON.gh}<span>GitHub</span></a>` : "";

    return `
      <div class="p-bar">
        <button type="button" class="btn btn--small p-back">${ICON.back}<span>Back to the archive</span></button>
        <span class="p-bar__title" aria-hidden="true">${U.esc(p.title)}</span>
        ${gh}
      </div>

      <header class="p-hero">
        <div class="p-hero__media" aria-hidden="true"><img class="p-hero__img" src="${cover}" alt=""></div>
        <div class="p-hero__shade" aria-hidden="true"></div>
        <div class="p-hero__content">
          <h1 class="p-title" tabindex="-1">${U.esc(p.title)}</h1>
          <p class="p-subtitle">${U.esc(p.subtitle || "")}</p>
          <dl class="p-facts">
            <div><dt>Category</dt><dd>${U.esc(p.category)}</dd></div>
            <div><dt>Status</dt><dd><span class="chip chip--${U.statusKey(p.status)}">${U.esc(p.status)}</span></dd></div>
            <div><dt>Created</dt><dd>${U.esc(U.dateLabel(p.date) || "—")}</dd></div>
            ${p.type ? `<div><dt>Type</dt><dd>${U.esc(p.type)}</dd></div>` : ""}
          </dl>
        </div>
      </header>

      <div class="p-content">${parts.join("")}</div>

      ${next ? `
      <a class="p-next" href="#/project/${next.id}" data-next="${next.id}">
        <img class="p-next__art" src="${P.cards.coverSrc(next)}" alt="" loading="lazy">
        <span class="p-next__shade"></span>
        <span class="p-next__text">
          <span class="p-next__kicker">Keep exploring</span>
          <span class="p-next__title">${U.esc(next.title)}</span>
          <span class="p-next__sub">${U.esc(next.subtitle || "")}</span>
        </span>
      </a>` : ""}`;
  }

  /* ---------------------------------------------------------------------- */
  /* Wiring for the freshly rendered page                                    */
  /* ---------------------------------------------------------------------- */
  function wire(p) {
    const slot = U.$(".p-code-slot", scroller);
    if (slot) slot.replaceWith(P.code.create(p.code.map((c) => Object.assign({}, c)), p));

    scroller.onclick = (e) => {
      const media = e.target.closest(".p-media");
      if (media) {
        const items = p._media[media.dataset.group];
        P.lightbox.open(items, Number(media.dataset.i), media);
        return;
      }
      const next = e.target.closest(".p-next");
      if (next) {
        e.preventDefault();
        open(next.dataset.next, null, { push: true });
        return;
      }
      if (e.target.closest(".p-back")) requestClose();
    };

    /* the top bar becomes solid once the hero is scrolled past */
    const bar = U.$(".p-bar", scroller);
    scroller.onscroll = () => bar.classList.toggle("is-stuck", scroller.scrollTop > 80);
    scroller.scrollTop = 0;
  }

  /* ---------------------------------------------------------------------- */
  /* Geometry helpers                                                        */
  /* ---------------------------------------------------------------------- */
  function pickCard(id) {
    if (originCard && originCard.isConnected && originCard.dataset.id === id) {
      const r = originCard.getBoundingClientRect();
      if (r.bottom > 0 && r.top < innerHeight && r.width) return originCard;
    }
    const all = U.$$('.card[data-id="' + id + '"]').filter((c) => !c.hidden);
    return all.find((c) => { const r = c.getBoundingClientRect(); return r.bottom > 40 && r.top < innerHeight - 40 && r.width; }) || null;
  }

  function insetFor(rect) {
    const vw = innerWidth, vh = innerHeight;
    return `inset(${Math.max(0, rect.top)}px ${Math.max(0, vw - rect.right)}px ${Math.max(0, vh - rect.bottom)}px ${Math.max(0, rect.left)}px round 18px)`;
  }
  const FULL = "inset(0px 0px 0px 0px round 0px)";

  /* travelling frame: a thin violet outline that grows from the card */
  function runFrame(from, to, duration, reverse) {
    frame.hidden = false;
    const box = (r, rad) => ({ top: r.top + "px", left: r.left + "px", width: r.width + "px", height: r.height + "px", borderRadius: rad });
    const a = box(from, "18px"), b = box(to, "0px");
    const kf = reverse ? [b, a] : [a, b];
    kf[0].opacity = reverse ? 0 : 1; kf[1].opacity = reverse ? 1 : 0;
    const anim = frame.animate(kf, { duration, easing: EASE, fill: "forwards" });
    anim.finished.then(() => { frame.hidden = true; anim.cancel(); }).catch(() => {});
  }

  /* DOMRect -> plain object (so we can also build our own rects) */
  const plain = (r) => ({ top: r.top, left: r.left, width: r.width, height: r.height, right: r.left + r.width, bottom: r.top + r.height });
  const fullRect = () => ({ top: 0, left: 0, width: innerWidth, height: innerHeight });

  /* ---------------------------------------------------------------------- */
  /* Open                                                                    */
  /* ---------------------------------------------------------------------- */
  async function open(id, origin, opts) {
    opts = opts || {};
    const p = byId(id);
    if (!p || !U.isOpenable(p)) return false;
    if (current && current.id === id) return true;
    if (busy) { queued = true; return true; }
    busy = true;

    const swap = !!current;
    if (opts.push) {
      const d = (history.state && history.state.depth) || 0;
      history.pushState({ pnb: 1, depth: d + 1 }, "", "#/project/" + id);
    }
    document.title = p.title + " · " + P.config.name;

    const reduce = U.reducedMotion();
    originCard = origin || null;
    if (!swap) opener = document.activeElement;

    /* ---- measure BEFORE the page behind changes ---- */
    const rect = origin ? origin.getBoundingClientRect() : null;

    if (swap) {
      await scroller.animate([{ opacity: 1 }, { opacity: 0 }], { duration: reduce ? 1 : 180, fill: "forwards" }).finished.catch(() => {});
    }

    current = p;
    scroller.innerHTML = render(p);
    wire(p);
    host.setAttribute("aria-label", p.title + " — project details");
    host.hidden = false;
    document.documentElement.classList.add("is-project-open");
    U.$("#app").inert = true; U.$("#nav").inert = true;
    host.classList.add("is-opening");

    if (swap) {
      scroller.getAnimations().forEach((a) => a.cancel());
      host.getAnimations().forEach((a) => a.cancel());
      host.style.clipPath = "";
      scroller.animate([{ opacity: 0 }, { opacity: 1 }], { duration: reduce ? 1 : 360, easing: "ease-out" });
    } else if (reduce) {
      host.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 160 });
    } else {
      const from = rect && rect.width ? plain(rect) : plain({ top: innerHeight * 0.4, left: innerWidth * 0.3, width: innerWidth * 0.4, height: innerHeight * 0.2 });
      host.animate([{ clipPath: insetFor(from) }, { clipPath: FULL }], { duration: OPEN_MS, easing: EASE });
      runFrame(from, fullRect(), OPEN_MS, false);
      U.$(".p-hero__img", scroller).animate(
        [{ transform: "scale(1.28)" }, { transform: "scale(1)" }],
        { duration: OPEN_MS + 500, easing: "cubic-bezier(.16,1,.3,1)" });
    }

    await U.wait(reduce ? 120 : OPEN_MS);
    host.classList.remove("is-opening");
    const t = U.$(".p-title", scroller);
    if (t) t.focus({ preventScroll: true });
    busy = false;
    if (queued) { queued = false; route(); }
    return true;
  }

  /* ---------------------------------------------------------------------- */
  /* Close                                                                   */
  /* ---------------------------------------------------------------------- */
  async function hide() {
    if (!current) return;
    if (busy) { queued = true; return; }
    busy = true;

    const id = current.id;
    const card = pickCard(id);
    const reduce = U.reducedMotion();
    document.documentElement.classList.remove("is-project-open");
    U.$("#app").inert = false; U.$("#nav").inert = false;
    document.title = P.config.name + " · " + P.config.description;

    if (reduce) {
      await host.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 120, fill: "forwards" }).finished.catch(() => {});
    } else if (card) {
      const rect = plain(card.getBoundingClientRect());
      host.animate([{ clipPath: FULL }, { clipPath: insetFor(rect) }], { duration: CLOSE_MS, easing: EASE, fill: "forwards" });
      runFrame(rect, fullRect(), CLOSE_MS, true);
      await U.wait(CLOSE_MS);
    } else {
      await host.animate(
        [{ opacity: 1, transform: "translateY(0)" }, { opacity: 0, transform: "translateY(28px)" }],
        { duration: 340, easing: "ease-in", fill: "forwards" }).finished.catch(() => {});
    }

    host.getAnimations().forEach((a) => a.cancel());
    host.hidden = true;
    scroller.innerHTML = "";
    current = null;

    const link = card && U.$(".card__link", card);
    const back = link || (opener && opener.isConnected ? opener : null);
    if (back && back.focus) back.focus({ preventScroll: true });
    originCard = null; opener = null;

    busy = false;
    if (queued) { queued = false; route(); }
  }

  /* UI close: step back through the history entries we created */
  function requestClose() {
    const d = history.state && history.state.pnb ? history.state.depth : 0;
    if (d > 0) history.go(-d);
    else {
      history.replaceState(null, "", location.pathname + location.search);
      hide();
    }
  }

  /* ---------------------------------------------------------------------- */
  /* Router                                                                  */
  /* ---------------------------------------------------------------------- */
  function parse() {
    const m = location.hash.match(/^#\/project\/([\w-]+)/);
    return m ? m[1] : null;
  }

  function route() {
    const id = parse();
    if (id) {
      if (!current || current.id !== id) open(id, null, {}).then((ok) => { if (ok === false) { history.replaceState(null, "", location.pathname); } });
    } else if (current) {
      hide();
    }
  }

  function init() {
    host = U.$("#project");
    scroller = U.$(".project__scroll", host);
    frame = U.$("#project-frame");

    window.addEventListener("popstate", route);
    window.addEventListener("hashchange", route);
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && current && !(P.lightbox && P.lightbox.isOpen())) { e.preventDefault(); requestClose(); }
    });
  }

  P.project = { init, open, route, requestClose, isOpen: () => !!current, parse };
})(window.PENUMBRA);
