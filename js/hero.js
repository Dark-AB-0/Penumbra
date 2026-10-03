/* ==========================================================================
   PENUMBRA · hero
   The eclipse: a dark disc covering a violet light. It follows the cursor
   slowly and drifts on its own, so touch devices and idle mice still feel
   alive. Everything pauses when the hero is off-screen.
   ========================================================================== */
(function (P) {
  "use strict";
  const U = P.U;

  function init() {
    const hero = U.$("#top"), eclipse = U.$(".eclipse", hero);
    const title = U.$(".hero__title", hero);

    title.innerHTML = P.config.tagline.map((l, i) =>
      `<span class="line"><span class="line__in" style="--i:${i}">${U.esc(l)}</span></span>`).join("");
    U.$(".hero__lede", hero).textContent = P.config.lede;

    if (U.reducedMotion()) { eclipse.style.setProperty("--ox", "9%"); eclipse.style.setProperty("--oy", "-6%"); return; }

    let tx = 0, ty = 0, cx = 0, cy = 0, visible = true, raf = 0, t0 = performance.now();
    const hover = U.canHover();

    if (hover) {
      window.addEventListener("pointermove", (e) => {
        tx = (e.clientX / innerWidth - 0.5) * 2;
        ty = (e.clientY / innerHeight - 0.5) * 2;
      }, { passive: true });
    }

    function frame(now) {
      raf = 0;
      const t = (now - t0) / 1000;
      // idle drift + cursor influence
      const dx = (hover ? tx * 7 : 0) + Math.sin(t * 0.35) * 3.2;
      const dy = (hover ? ty * 5 : 0) + Math.cos(t * 0.28) * 2.4;
      cx = U.lerp(cx, dx, 0.045); cy = U.lerp(cy, dy, 0.045);
      eclipse.style.setProperty("--ox", (9 + cx).toFixed(2) + "%");
      eclipse.style.setProperty("--oy", (-6 + cy).toFixed(2) + "%");
      if (visible) raf = requestAnimationFrame(frame);
    }

    new IntersectionObserver((es) => {
      visible = es[0].isIntersecting;
      if (visible && !raf) raf = requestAnimationFrame(frame);
    }).observe(hero);
    raf = requestAnimationFrame(frame);
  }

  P.hero = { init };
})(window.PENUMBRA);
