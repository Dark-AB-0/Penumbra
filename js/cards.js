/* ==========================================================================
   PENUMBRA · cards
   One card component used by FEATURED and ALL PROJECTS.

   Mouse  : the card tilts slightly and a violet "flashlight" reveals the
            hidden, lit version of the artwork under the cursor.
   Touch  : no hover exists, so the card lights up while it is near the
            centre of the screen and its subtitle is always visible.
   ========================================================================== */
(function (P) {
  "use strict";
  const U = P.U;

  /* Cover image if the project has one, otherwise generated artwork */
  function coverSrc(p) {
    return p.cover ? U.asset(p, p.cover) : P.art.url(p.id, p.art);
  }

  /* ---- touch: light the card closest to the middle of the screen ---- */
  let io = null;
  function observer() {
    if (io) return io;
    io = new IntersectionObserver((entries) => {
      entries.forEach((e) => e.target.classList.toggle("is-lit", e.isIntersecting));
    }, { rootMargin: "-32% 0px -32% 0px", threshold: 0 });
    return io;
  }

  /* ---- mouse: tilt + flashlight ---- */
  function bindPointer(card, link) {
    let raf = 0, last = null;

    function frame() {
      raf = 0;
      if (!last) return;
      const r = link.getBoundingClientRect();
      const x = last.clientX - r.left, y = last.clientY - r.top;
      const px = x / r.width - 0.5, py = y / r.height - 0.5;
      link.style.setProperty("--mx", x + "px");
      link.style.setProperty("--my", y + "px");
      link.style.setProperty("--rx", (-py * 5).toFixed(2) + "deg");
      link.style.setProperty("--ry", (px * 6).toFixed(2) + "deg");
      link.style.setProperty("--px", (-px * 14).toFixed(1) + "px");
      link.style.setProperty("--py", (-py * 14).toFixed(1) + "px");
    }

    card.addEventListener("pointermove", (e) => {
      if (e.pointerType !== "mouse") return;
      last = e;
      if (!raf) raf = requestAnimationFrame(frame);
    });
    card.addEventListener("pointerleave", () => {
      last = null;
      ["--rx", "--ry", "--px", "--py"].forEach((k) => link.style.removeProperty(k));
    });
  }

  function create(p, index, opts) {
    opts = opts || {};
    const soon = U.isSoon(p);
    const openable = U.isOpenable(p);
    const src = coverSrc(p);

    const card = U.el("article", {
      class: "card" + (soon ? " card--soon" : "") + (opts.large ? " card--large" : ""),
      "data-id": p.id,
      "data-status": U.statusKey(p.status),
    });

    const inner =
      `<div class="card__media" aria-hidden="true">
         <img class="card__art card__art--base" src="${src}" alt="" loading="lazy" decoding="async">
         <img class="card__art card__art--lit" src="${src}" alt="" loading="lazy" decoding="async">
       </div>
       <div class="card__veil" aria-hidden="true"></div>
       <div class="card__body">
         <div class="card__top">
           <span class="chip chip--${U.statusKey(p.status)}">${U.esc(p.status)}</span>
           ${p.date && !soon ? `<span class="card__date">${U.esc(U.dateLabel(p.date))}</span>` : ""}
         </div>
         <div class="card__text">
           <h3 class="card__title">${U.esc(p.title)}</h3>
           <div class="card__reveal"><div>
             <p class="card__sub">${U.esc(p.subtitle || "")}</p>
             ${soon ? "" : `<p class="card__meta"><span>${U.esc(p.category)}</span><span>${U.esc(p.type || "")}</span></p>`}
           </div></div>
         </div>
       </div>`;

    let link;
    if (openable) {
      link = U.el("a", { class: "card__link", href: "#/project/" + p.id, "aria-label": `Open project: ${p.title}. ${p.status}.` }, inner);
      link.addEventListener("click", (e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return;
        e.preventDefault();
        P.project.open(p.id, card, { push: true });
      });
    } else {
      link = U.el("div", { class: "card__link card__link--static", role: "group", "aria-label": `${p.title}. ${p.status}.` }, inner);
    }
    card.appendChild(link);

    if (U.canHover()) bindPointer(card, link);
    else observer().observe(card);

    return card;
  }

  P.cards = { create, coverSrc };
})(window.PENUMBRA);
