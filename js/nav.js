/* ==========================================================================
   PENUMBRA · nav
   Top navigation with a sliding light under the active section, plus a
   full-screen menu on small screens.
   ========================================================================== */
(function (P) {
  "use strict";
  const U = P.U;

  function init() {
    const nav = U.$("#nav"), links = U.$("#nav-links"), menu = U.$("#menu"), toggle = U.$(".nav__toggle");
    const items = P.config.nav;

    links.innerHTML = items.map((n) => `<a href="#${n.target}" data-target="${n.target}">${U.esc(n.label)}</a>`).join("") + '<span class="nav__light" aria-hidden="true"></span>';
    U.$("#menu-links").innerHTML = items.map((n) => `<a href="#${n.target}" data-target="${n.target}">${U.esc(n.label)}</a>`).join("");

    const light = U.$(".nav__light", links);
    function moveLight(a) {
      if (!a) { light.style.opacity = 0; return; }
      light.style.opacity = 1;
      light.style.transform = `translateX(${a.offsetLeft}px)`;
      light.style.width = a.offsetWidth + "px";
    }

    /* which section is on screen? */
    let activeId = null;
    function setActive(id) {
      if (id === activeId) return;
      activeId = id;
      U.$$("a", links).forEach((a) => a.toggleAttribute("aria-current", a.dataset.target === id));
      moveLight(U.$(`a[data-target="${id}"]`, links));
    }
    const targets = items.map((n) => document.getElementById(n.target)).filter(Boolean);
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); });
    }, { rootMargin: "-45% 0px -50% 0px" });
    targets.forEach((t) => io.observe(t));
    window.addEventListener("resize", () => moveLight(U.$(`a[data-target="${activeId}"]`, links)));
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => moveLight(U.$(`a[data-target="${activeId}"]`, links)));

    /* background once scrolled */
    const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true }); onScroll();

    /* smooth scroll that also works when a project is open */
    document.addEventListener("click", (e) => {
      const a = e.target.closest("a[data-target]");
      if (!a) return;
      e.preventDefault();
      closeMenu();
      const el = document.getElementById(a.dataset.target);
      if (el) el.scrollIntoView({ behavior: U.reducedMotion() ? "auto" : "smooth", block: "start" });
      history.replaceState(history.state, "", "#" + a.dataset.target);
    });

    /* mobile menu */
    function openMenu() {
      menu.hidden = false; requestAnimationFrame(() => menu.classList.add("is-open"));
      toggle.setAttribute("aria-expanded", "true"); toggle.querySelector("span").textContent = "Close";
      document.documentElement.classList.add("is-menu-open");
      U.$("#app").inert = true;
    }
    function closeMenu() {
      if (menu.hidden) return;
      menu.classList.remove("is-open"); toggle.setAttribute("aria-expanded", "false"); toggle.querySelector("span").textContent = "Menu";
      document.documentElement.classList.remove("is-menu-open");
      U.$("#app").inert = P.project.isOpen();
      setTimeout(() => { menu.hidden = true; }, 350);
    }
    toggle.addEventListener("click", () => (menu.hidden ? openMenu() : closeMenu()));
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeMenu(); });
    window.matchMedia("(min-width: 861px)").addEventListener("change", closeMenu);
  }

  P.nav = { init };
})(window.PENUMBRA);
