/* ==========================================================================
   PENUMBRA · main
   Boots every module. Nothing here is project-specific: the page is built
   entirely from js/config.js and data/projects.js.
   ========================================================================== */
(function (P) {
  "use strict";
  const U = P.U;

  function validate(list) {
    const seen = new Set();
    return list.filter((p) => {
      const problems = [];
      if (!p.id || seen.has(p.id)) problems.push("missing or duplicate id");
      if (!p.title) problems.push("missing title");
      if (!P.config.statuses[p.status]) problems.push('unknown status "' + p.status + '"');
      if (p.category && !P.config.categories.includes(p.category)) console.warn("[Penumbra] " + p.id + ': category "' + p.category + '" is not listed in config.js');
      if (problems.length) { console.warn("[Penumbra] Skipped a project:", p.id || p.title, problems.join(", ")); return false; }
      seen.add(p.id);
      return true;
    });
  }

  function boot() {
    P.projects = validate(P.projects || []);
    const cfg = P.config;

    document.title = cfg.name + " · " + cfg.description;
    U.$$("[data-site-name]").forEach((n) => { n.textContent = cfg.name; });
    U.$$("[data-year]").forEach((n) => { n.textContent = new Date().getFullYear(); });

    P.project.init();
    P.nav.init();
    P.hero.init();
    P.stats.render(U.$("#stats"), P.projects);
    P.archive.renderFeatured(P.projects);
    P.archive.renderArchive(P.projects);

    /* legend of statuses, taken from config so it never goes out of date */
    U.$("#legend").innerHTML = Object.keys(cfg.statuses)
      .sort((a, b) => cfg.statuses[a].order - cfg.statuses[b].order)
      .map((s) => `<div><dt><span class="chip chip--${U.statusKey(s)}">${U.esc(s)}</span></dt><dd>${U.esc(cfg.statuses[s].meaning)}</dd></div>`).join("");

    P.dimensions.render(U.$("#dimensions-list"));
    P.dimensions.repos(U.$("#repos"));

    U.$("#replay").addEventListener("click", () => P.intro.replay());

    /* thin lines "draw" themselves once, when they come into view */
    const rules = new IntersectionObserver((es) => es.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add("is-in"); rules.unobserve(e.target); }
    }), { threshold: 0.6 });
    U.$$(".rule").forEach((r) => rules.observe(r));

    /* intro first, then honour a deep link such as #/project/ava */
    P.intro.run().then(() => { if (P.project.parse()) P.project.route(); });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})(window.PENUMBRA);
