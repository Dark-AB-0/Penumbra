/* ==========================================================================
   PENUMBRA · stats
   Every number is calculated from PENUMBRA.projects. Nothing is typed by hand.
   "COMING SOON" entries are signals of what is ahead, so they are listed
   separately and are not counted in the total.
   ========================================================================== */
(function (P) {
  "use strict";
  const U = P.U;

  function compute(projects) {
    const real = projects.filter((p) => !U.isSoon(p));
    const counts = {};
    projects.forEach((p) => { counts[p.status] = (counts[p.status] || 0) + 1; });

    const rows = Object.keys(P.config.statuses)
      .sort((a, b) => P.config.statuses[a].order - P.config.statuses[b].order)
      .filter((s) => counts[s])
      .map((s) => ({ status: s, count: counts[s] }));

    return { total: real.length, rows };
  }

  function countUp(node, to, delay) {
    const reduce = U.reducedMotion();
    const set = (v) => { node.textContent = U.pad2(Math.round(v)); };
    if (reduce || to === 0) { set(to); return; }
    const dur = 1100;
    setTimeout(() => {
      const t0 = performance.now();
      (function tick(now) {
        const t = U.clamp((now - t0) / dur, 0, 1);
        set(to * (1 - Math.pow(1 - t, 4)));    // ease-out quart
        if (t < 1) requestAnimationFrame(tick);
      })(t0);
    }, delay);
  }

  function render(host, projects) {
    const s = compute(projects);
    const denom = Math.max(1, s.total);

    host.innerHTML = `
      <div class="stats__total">
        <span class="stats__num" data-to="${s.total}" aria-hidden="true">00</span>
        <span class="sr-only">${s.total}</span>
        <span class="stats__caption">Projects in the archive</span>
      </div>
      <ul class="stats__list">
        ${s.rows.map((r) => `
          <li class="stat stat--${U.statusKey(r.status)}">
            <span class="stat__num" data-to="${r.count}" aria-hidden="true">00</span>
            <span class="sr-only">${r.count}</span>
            <span class="stat__label">${U.esc(r.status)}</span>
            <span class="stat__bar" aria-hidden="true"><i style="--p:${Math.min(1, r.count / denom).toFixed(3)}"></i></span>
          </li>`).join("")}
      </ul>`;

    const nums = U.$$("[data-to]", host);
    let played = false;
    const play = () => {
      if (played) return;
      played = true;
      host.classList.add("is-in");
      nums.forEach((n, i) => countUp(n, Number(n.dataset.to), i === 0 ? 0 : 250 + i * 110));
    };

    if (!("IntersectionObserver" in window)) return play();
    const io = new IntersectionObserver((es) => {
      if (es.some((e) => e.isIntersecting)) { play(); io.disconnect(); }
    }, { threshold: 0.35 });
    io.observe(host);
  }

  P.stats = { compute, render };
})(window.PENUMBRA);
