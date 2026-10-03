/* ==========================================================================
   PENUMBRA · archive
   Builds FEATURED PROJECTS and ALL PROJECTS, and handles filtering/sorting.

   Filtering and sorting use a FLIP animation: cards that stay slide to their
   new position instead of jumping; cards that leave fade out first.
   ========================================================================== */
(function (P) {
  "use strict";
  const U = P.U;

  const SORTS = {
    relevance: { label: "Relevance", dir: "desc", fn: (a, b) => (a.relevance || 0) - (b.relevance || 0) },
    date:      { label: "Date",      dir: "desc", fn: (a, b) => U.dateValue(a.date) - U.dateValue(b.date) },
    status:    { label: "Status",    dir: "asc",  fn: (a, b) => P.config.statuses[a.status].order - P.config.statuses[b.status].order },
    type:      { label: "Type",      dir: "asc",  fn: (a, b) => String(a.type || "").localeCompare(String(b.type || "")) },
  };

  function sortProjects(list, key, dir) {
    const s = SORTS[key], sign = dir === "desc" ? -1 : 1;
    return list.slice().sort((a, b) => {
      // "Coming soon" always stays at the end: they are hints, not results
      if (U.isSoon(a) !== U.isSoon(b)) return U.isSoon(a) ? 1 : -1;
      return sign * s.fn(a, b) || U.dateValue(b.date) - U.dateValue(a.date) || a.title.localeCompare(b.title);
    });
  }

  /* -------------------------------------------------------------------- */
  function renderFeatured(projects) {
    const section = U.$("#featured");
    const grid = U.$("#featured-grid");
    const list = sortProjects(projects.filter((p) => p.featured && !U.isSoon(p)), "relevance", "desc");
    if (!list.length) { section.hidden = true; return; }
    list.forEach((p, i) => grid.appendChild(P.cards.create(p, i, { large: true })));
  }

  /* -------------------------------------------------------------------- */
  function renderArchive(projects) {
    const grid = U.$("#all-grid");
    const controls = U.$("#archive-controls");
    const status = U.$("#archive-status");
    const state = { category: "all", sort: "relevance", dir: SORTS.relevance.dir };
    const nodes = new Map();
    let run = 0;

    projects.forEach((p, i) => nodes.set(p.id, P.cards.create(p, i)));

    /* category counts (coming soon entries are counted too: they appear in the grid) */
    const countFor = (c) => projects.filter((p) => c === "all" || p.category === c).length;

    controls.innerHTML = `
      <div class="filters" role="group" aria-label="Filter by category">
        ${["all"].concat(P.config.categories).map((c) => `
          <button type="button" class="pill" data-category="${U.esc(c)}" aria-pressed="${c === "all"}">
            <span>${c === "all" ? "All" : U.esc(c)}</span><span class="pill__n">${U.pad2(countFor(c))}</span>
          </button>`).join("")}
      </div>
      <div class="sorter" role="group" aria-label="Sort projects">
        <span class="sorter__label" id="sort-label">Sort by</span>
        ${Object.keys(SORTS).map((k) => `
          <button type="button" class="sort" data-sort="${k}" aria-pressed="${k === state.sort}">${SORTS[k].label}</button>`).join("")}
        <button type="button" class="dir" aria-label="Reverse order" title="Reverse order">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M8 4v16M8 20l-3.5-3.5M8 20l3.5-3.5M16 20V4M16 4l-3.5 3.5M16 4l3.5 3.5"/></svg>
        </button>
      </div>`;

    function visibleList() {
      const list = projects.filter((p) => state.category === "all" || p.category === state.category);
      return sortProjects(list, state.sort, state.dir);
    }

    function announce(n) {
      const cat = state.category === "all" ? "all categories" : state.category;
      status.textContent = `Showing ${n} project${n === 1 ? "" : "s"} in ${cat}, sorted by ${SORTS[state.sort].label.toLowerCase()}, ${state.dir === "desc" ? "descending" : "ascending"}.`;
    }

    function syncControls() {
      U.$$(".pill", controls).forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.category === state.category)));
      U.$$(".sort", controls).forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.sort === state.sort)));
      const d = U.$(".dir", controls);
      d.classList.toggle("is-asc", state.dir === "asc");
    }

    /* Initial paint: no animation */
    function paint() {
      const list = visibleList();
      const keep = new Set(list.map((p) => p.id));
      nodes.forEach((n, id) => { n.hidden = !keep.has(id); });
      list.forEach((p) => grid.appendChild(nodes.get(p.id)));
      announce(list.length);
    }

    /* Animated update */
    async function update() {
      const my = ++run;
      const list = visibleList();
      const keep = new Set(list.map((p) => p.id));
      const reduce = U.reducedMotion();

      syncControls();
      announce(list.length);

      // stop any running animation from a previous update
      nodes.forEach((n) => n.getAnimations().forEach((a) => a.cancel()));

      const leaving = [], entering = [];
      nodes.forEach((n, id) => {
        if (!n.hidden && !keep.has(id)) leaving.push(n);
        if (n.hidden && keep.has(id)) entering.push(n);
      });

      /* Phase A — leaving cards fade away */
      if (!reduce && leaving.length) {
        await Promise.all(leaving.map((n) =>
          n.animate([{ opacity: 1, transform: "scale(1)" }, { opacity: 0, transform: "scale(.96)" }],
            { duration: 220, easing: "ease-in", fill: "forwards" }).finished.catch(() => {})));
        if (my !== run) return;
      }

      /* Phase B — measure, rearrange, then glide into place (FLIP) */
      const stay = Array.from(grid.children).filter((n) => !n.hidden && keep.has(n.dataset.id));
      const first = new Map(stay.map((n) => [n, n.getBoundingClientRect()]));

      nodes.forEach((n, id) => { n.hidden = !keep.has(id); n.getAnimations().forEach((a) => a.cancel()); });
      list.forEach((p) => grid.appendChild(nodes.get(p.id)));

      if (reduce) return;

      stay.forEach((n) => {
        const a = first.get(n), b = n.getBoundingClientRect();
        const dx = a.left - b.left, dy = a.top - b.top;
        if (!dx && !dy) return;
        n.animate([{ transform: `translate(${dx}px, ${dy}px)` }, { transform: "none" }],
          { duration: 620, easing: "cubic-bezier(.16,1,.3,1)" });
      });
      entering.forEach((n, i) => {
        n.animate([{ opacity: 0, transform: "scale(.96)" }, { opacity: 1, transform: "none" }],
          { duration: 520, delay: 80 + i * 50, easing: "cubic-bezier(.16,1,.3,1)", fill: "backwards" });
      });
    }

    controls.addEventListener("click", (e) => {
      const pill = e.target.closest(".pill");
      const sort = e.target.closest(".sort");
      const dir = e.target.closest(".dir");
      if (pill) {
        if (state.category === pill.dataset.category) return;
        state.category = pill.dataset.category;
      } else if (sort) {
        if (state.sort === sort.dataset.sort) return;
        state.sort = sort.dataset.sort;
        state.dir = SORTS[state.sort].dir;
      } else if (dir) {
        state.dir = state.dir === "desc" ? "asc" : "desc";
      } else return;
      update();
    });

    paint();
    syncControls();
    return { cardFor: (id) => nodes.get(id) };
  }

  /* Order used for "keep exploring" at the end of a project */
  function exploreOrder(projects) {
    return sortProjects(projects.filter(U.isOpenable), "relevance", "desc");
  }

  P.archive = { renderFeatured, renderArchive, exploreOrder, sortProjects };
})(window.PENUMBRA);
