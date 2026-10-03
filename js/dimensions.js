/* ==========================================================================
   PENUMBRA · other dimensions
   Each external space is an arched "portal". Crossing one plays a circular
   light wipe from the click point before the browser leaves the page.
   GitHub repositories are optional: if the API fails, nothing breaks.
   ========================================================================== */
(function (P) {
  "use strict";
  const U = P.U;

  const GLYPHS = {
    rings: `<svg viewBox="0 0 200 200" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.2">
      <circle cx="100" cy="100" r="86" opacity=".25"/><circle cx="100" cy="100" r="62" opacity=".45"/><circle cx="100" cy="100" r="38" opacity=".8"/></g>
      <circle cx="100" cy="100" r="7" fill="currentColor"/><circle cx="186" cy="100" r="4" fill="currentColor"/><circle cx="62" cy="62" r="3" fill="currentColor" opacity=".7"/></svg>`,
    eclipse: `<svg viewBox="0 0 200 200" aria-hidden="true"><defs><radialGradient id="pg" cx=".35" cy=".3"><stop offset="0" stop-color="#efe6ff"/><stop offset=".55" stop-color="#b79cff"/><stop offset="1" stop-color="#5b2fd1"/></radialGradient></defs>
      <circle cx="100" cy="100" r="70" fill="url(#pg)"/><circle cx="114" cy="92" r="70" style="fill:var(--ink)"/>
      <circle cx="100" cy="100" r="92" fill="none" stroke="currentColor" stroke-width="1" opacity=".25"/></svg>`,
    signal: `<svg viewBox="0 0 200 200" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.2">
      <path d="M40 100a60 60 0 0 1 60-60" opacity=".3"/><path d="M20 100A80 80 0 0 1 100 20" opacity=".2"/>
      <path d="M60 100a40 40 0 0 1 40-40" opacity=".55"/><path d="M80 100a20 20 0 0 1 20-20" opacity=".9"/></g>
      <circle cx="100" cy="100" r="7" fill="currentColor"/><path d="M100 100L170 170" stroke="currentColor" stroke-width="1.2" opacity=".5"/><circle cx="170" cy="170" r="4" fill="currentColor"/></svg>`,
  };

  /* ---- circular wipe, then leave ---- */
  function cross(url, newTab, x, y) {
    if (newTab) { window.open(url, "_blank", "noopener"); return; }
    if (U.reducedMotion()) { location.href = url; return; }
    const w = U.el("div", { class: "wipe", "aria-hidden": "true" });
    document.body.appendChild(w);
    const far = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    w.animate(
      [{ clipPath: `circle(0px at ${x}px ${y}px)` }, { clipPath: `circle(${far + 40}px at ${x}px ${y}px)` }],
      { duration: 620, easing: "cubic-bezier(.76,0,.18,1)", fill: "forwards" }
    ).finished.then(() => { location.href = url; }).catch(() => { location.href = url; });
  }
  /* coming back with the Back button should not show a stuck wipe */
  window.addEventListener("pageshow", () => U.$$(".wipe").forEach((w) => w.remove()));

  function render(host) {
    host.innerHTML = P.config.dimensions.map((d) => `
      <a class="portal" href="${U.esc(d.url)}" data-id="${U.esc(d.id)}" ${d.newTab ? 'target="_blank" rel="noopener noreferrer"' : ""}>
        <span class="portal__light" aria-hidden="true"></span>
        <span class="portal__glyph" aria-hidden="true">${GLYPHS[d.glyph] || GLYPHS.rings}</span>
        <span class="portal__text">
          <span class="portal__name">${U.esc(d.name)}</span>
          <span class="portal__desc">${U.esc(d.description)}</span>
          <span class="portal__go"><i aria-hidden="true"></i>Cross over</span>
        </span>
      </a>`).join("");

    U.$$(".portal", host).forEach((a, i) => {
      const d = P.config.dimensions[i];
      a.addEventListener("click", (e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return;
        e.preventDefault();
        const r = a.getBoundingClientRect();
        const x = e.clientX || r.left + r.width / 2, y = e.clientY || r.top + r.height / 2;
        cross(d.url, d.newTab, x, y);
      });
      a.addEventListener("pointermove", (e) => {
        const r = a.getBoundingClientRect();
        a.style.setProperty("--mx", e.clientX - r.left + "px");
        a.style.setProperty("--my", e.clientY - r.top + "px");
      });
    });
  }

  /* ---- optional: recently active repositories ---- */
  async function repos(host) {
    const g = P.config.github || {};
    if (!g.showRepos || !g.username || g.username === "your-username") return;
    const key = "pnb-repos-" + g.username;
    try {
      let data = null;
      const cached = U.store.get(key);
      if (cached) data = JSON.parse(cached);
      else {
        const res = await fetch(`https://api.github.com/users/${encodeURIComponent(g.username)}/repos?sort=pushed&per_page=30`);
        if (!res.ok) return;
        data = (await res.json())
          .filter((r) => !r.fork && !r.archived)
          .slice(0, g.maxRepos || 4)
          .map((r) => ({ name: r.name, url: r.html_url, lang: r.language, stars: r.stargazers_count, desc: r.description }));
        U.store.set(key, JSON.stringify(data));
      }
      if (!data.length) return;
      host.innerHTML = `<h3 class="repos__title">Recently active on GitHub</h3>
        <ul>${data.map((r) => `<li><a href="${U.esc(r.url)}" target="_blank" rel="noopener noreferrer">
          <span class="repos__name">${U.esc(r.name)}</span>
          <span class="repos__desc">${U.esc(r.desc || "")}</span>
          <span class="repos__meta">${U.esc(r.lang || "")}${r.stars ? " · ★ " + r.stars : ""}</span></a></li>`).join("")}</ul>`;
      host.hidden = false;
    } catch (e) { /* GitHub unreachable: the section simply stays hidden */ }
  }

  P.dimensions = { render, repos };
})(window.PENUMBRA);
