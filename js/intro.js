/* ==========================================================================
   PENUMBRA · intro
   A short entrance (~3.6 s): a violet ring draws itself, three words appear
   one after another, then the darkness opens from the centre like an iris
   and reveals the page. Any key, click or the Skip button ends it at once.
   Plays once per browser session (configurable in js/config.js).
   ========================================================================== */
(function (P) {
  "use strict";
  const U = P.U;
  const KEY = "pnb-intro-seen";

  function finishInstantly(el) {
    el.remove();
    document.documentElement.classList.remove("is-intro");
    document.body.classList.add("is-ready");
    U.$("#app").inert = P.project.isOpen();
  }

  function run() {
    const el = U.$("#intro");
    const cfg = P.config.intro;
    const deepLink = !!P.project.parse();

    if (!cfg.enabled || deepLink || (cfg.oncePerSession && U.store.get(KEY))) {
      finishInstantly(el);
      return Promise.resolve();
    }
    U.store.set(KEY, "1");

    const reduce = U.reducedMotion();
    const line = U.$(".intro__line", el);
    const ring = U.$(".intro__ring circle", el);
    const skip = U.$(".intro__skip", el);
    let done = false, timers = [], raf = 0;

    el.hidden = false;
    U.$("#app").inert = true;

    return new Promise((resolve) => {
      function end(fast) {
        if (done) return;
        done = true;
        timers.forEach(clearTimeout); cancelAnimationFrame(raf);
        document.removeEventListener("keydown", onKey);
        el.removeEventListener("click", onClick);
        document.body.classList.add("is-ready");
        if (fast) { finishInstantly(el); resolve(); return; }
        el.remove(); document.documentElement.classList.remove("is-intro");
        U.$("#app").inert = P.project.isOpen();
        resolve();
      }
      const onKey = () => end(true);
      const onClick = () => end(true);
      document.addEventListener("keydown", onKey);
      el.addEventListener("click", onClick);

      if (reduce) {
        line.textContent = cfg.lines[0];
        timers.push(setTimeout(() => end(true), 900));
        return;
      }

      // 1 — the ring draws itself
      ring.animate([{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], { duration: 1700, easing: "cubic-bezier(.65,0,.35,1)", fill: "forwards" });
      U.$(".intro__stage", el).animate([{ opacity: 0, transform: "scale(.92)" }, { opacity: 1, transform: "scale(1)" }], { duration: 1200, easing: "ease-out", fill: "forwards" });

      // 2 — words, one after another
      const step = 850;
      cfg.lines.forEach((text, i) => {
        timers.push(setTimeout(() => {
          line.textContent = text;
          line.animate(
            [{ opacity: 0, filter: "blur(10px)", letterSpacing: "0.12em" }, { opacity: 1, filter: "blur(0)", letterSpacing: "0.02em" }],
            { duration: 620, easing: "cubic-bezier(.16,1,.3,1)", fill: "forwards" });
        }, 350 + i * step));
      });

      // 3 — the iris opens
      const openAt = 350 + cfg.lines.length * step + 250;
      timers.push(setTimeout(() => {
        line.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 250, fill: "forwards" });
        U.$(".intro__stage", el).animate([{ transform: "scale(1)", opacity: 1 }, { transform: "scale(1.25)", opacity: 0 }], { duration: 650, easing: "ease-in", fill: "forwards" });
        const maxR = Math.hypot(innerWidth, innerHeight) / 2 + 120;
        const t0 = performance.now(), dur = 1050;
        document.body.classList.add("is-ready");
        (function tick(now) {
          const t = U.clamp((now - t0) / dur, 0, 1);
          const e = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;   // ease-in-out cubic
          el.style.setProperty("--r", (-90 + e * (maxR + 90)).toFixed(1) + "px");
          if (t < 1) raf = requestAnimationFrame(tick); else end(false);
        })(t0);
      }, openAt));

      timers.push(setTimeout(() => skip.classList.add("is-visible"), 700));
    });
  }

  P.intro = { run, replay() { U.store.del(KEY); history.replaceState(null, "", location.pathname); location.reload(); } };
})(window.PENUMBRA);
