/* ==========================================================================
   PENUMBRA · art
   Deterministic, procedural covers in the site palette (black / violet / white).
   The same seed always produces the same artwork, so a project keeps its look.
   ========================================================================== */
(function (P) {
  "use strict";

  const W = 800, H = 600;
  const BG = "#050408", VIOLET = "#8f63ff", HI = "#b79cff", WHITE = "#f5f2fb";

  /* ---- seeded random ---- */
  function seedFrom(str) {
    let h = 1779033703 ^ str.length;
    for (let i = 0; i < str.length; i++) {
      h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
      h = (h << 13) | (h >>> 19);
    }
    return h >>> 0;
  }
  function rng(seed) {
    let a = seedFrom(String(seed));
    return function () {
      a |= 0; a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  const f = (n) => Math.round(n * 10) / 10;

  function stars(r, n) {
    let s = "";
    for (let i = 0; i < n; i++) {
      s += `<circle cx="${f(r() * W)}" cy="${f(r() * H)}" r="${f(0.5 + r() * 1.3)}" fill="${WHITE}" opacity="${f(0.15 + r() * 0.5)}"/>`;
    }
    return s;
  }

  /* ---- variants ---- */
  const variants = {
    eclipse(r) {
      const cx = 360 + r() * 160, cy = 240 + r() * 120, R = 110 + r() * 50;
      const a = r() * Math.PI * 2, off = R * 0.2;
      return `
        <defs><radialGradient id="g"><stop offset="0" stop-color="${VIOLET}" stop-opacity=".6"/><stop offset="1" stop-color="${VIOLET}" stop-opacity="0"/></radialGradient>
        <radialGradient id="d" cx=".35" cy=".3"><stop offset="0" stop-color="#efe6ff"/><stop offset=".5" stop-color="${HI}"/><stop offset="1" stop-color="#5b2fd1"/></radialGradient></defs>
        <circle cx="${f(cx)}" cy="${f(cy)}" r="${f(R * 3)}" fill="url(#g)"/>
        <circle cx="${f(cx)}" cy="${f(cy)}" r="${f(R * 1.55)}" fill="none" stroke="${WHITE}" stroke-opacity=".12"/>
        <circle cx="${f(cx)}" cy="${f(cy)}" r="${f(R)}" fill="url(#d)"/>
        <circle cx="${f(cx + Math.cos(a) * off)}" cy="${f(cy + Math.sin(a) * off)}" r="${f(R * 1.01)}" fill="${BG}"/>
        ${stars(r, 34)}`;
    },

    orbits(r) {
      const cx = 380 + r() * 100, cy = 270 + r() * 70;
      let out = "";
      const tilt = -35 + r() * 70;
      for (let i = 0; i < 6; i++) {
        const rx = 70 + i * 62, ry = rx * (0.3 + r() * 0.22), rot = tilt + i * (4 + r() * 8);
        const violet = i === 3;
        out += `<ellipse cx="${f(cx)}" cy="${f(cy)}" rx="${f(rx)}" ry="${f(ry)}" transform="rotate(${f(rot)} ${f(cx)} ${f(cy)})" fill="none" stroke="${violet ? HI : WHITE}" stroke-opacity="${violet ? 0.75 : 0.16}" stroke-width="${violet ? 1.4 : 1}"/>`;
        const t = r() * Math.PI * 2;
        const px = cx + rx * Math.cos(t), py = cy + ry * Math.sin(t);
        const rr = rot * Math.PI / 180;
        const x = cx + (px - cx) * Math.cos(rr) - (py - cy) * Math.sin(rr);
        const y = cy + (px - cx) * Math.sin(rr) + (py - cy) * Math.cos(rr);
        out += `<circle cx="${f(x)}" cy="${f(y)}" r="${violet ? 7 : 3.5}" fill="${violet ? VIOLET : WHITE}"/>`;
      }
      return `
        <defs><radialGradient id="g"><stop offset="0" stop-color="${VIOLET}" stop-opacity=".45"/><stop offset="1" stop-color="${VIOLET}" stop-opacity="0"/></radialGradient></defs>
        <circle cx="${f(cx)}" cy="${f(cy)}" r="230" fill="url(#g)"/>
        ${out}<circle cx="${f(cx)}" cy="${f(cy)}" r="16" fill="${WHITE}"/>${stars(r, 26)}`;
    },

    waves(r) {
      const lines = 22, burstX = 200 + r() * 400, burstW = 110 + r() * 90, amp = 55 + r() * 30;
      let out = "";
      for (let i = 0; i < lines; i++) {
        const y0 = 60 + i * 22;
        let d = "";
        for (let x = 0; x <= W; x += 8) {
          const g = Math.exp(-Math.pow((x - burstX) / burstW, 2));
          const y = y0 - g * amp * Math.sin(x * 0.045 + i * 0.5) * (1 - i / (lines * 1.4));
          d += (x === 0 ? "M" : "L") + f(x) + " " + f(y);
        }
        const hot = i === 11 || i === 12;
        out += `<path d="${d}" fill="none" stroke="${hot ? HI : WHITE}" stroke-opacity="${hot ? 0.85 : 0.14 + (i / lines) * 0.22}" stroke-width="${hot ? 1.6 : 1}"/>`;
      }
      return `
        <defs><radialGradient id="g" cx="${f(burstX / W)}" cy=".5"><stop offset="0" stop-color="${VIOLET}" stop-opacity=".4"/><stop offset="1" stop-color="${VIOLET}" stop-opacity="0"/></radialGradient></defs>
        <rect width="${W}" height="${H}" fill="url(#g)"/>${out}`;
    },

    lattice(r) {
      const cols = 32, rows = 24, cx = (0.3 + r() * 0.4) * cols, cy = (0.3 + r() * 0.4) * rows;
      let out = "";
      for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) {
        const d = Math.hypot((i - cx) / cols, (j - cy) / rows);
        const size = Math.max(0.4, 6.5 * (1 - d * 2.1));
        if (size <= 0.45 && r() > 0.5) continue;
        const hot = d < 0.08;
        out += `<circle cx="${f(i * 25 + 12)}" cy="${f(j * 25 + 12)}" r="${f(size)}" fill="${hot ? HI : WHITE}" opacity="${f(hot ? 0.95 : 0.12 + Math.max(0, 0.5 - d))}"/>`;
      }
      return out;
    },

    rings(r) {
      const cx = 330 + r() * 140, cy = 260 + r() * 80, dx = 6 + r() * 12, dy = -4 - r() * 8;
      let out = "";
      for (let i = 0; i < 16; i++) {
        const hot = i === 9;
        out += `<circle cx="${f(cx + i * dx)}" cy="${f(cy + i * dy)}" r="${f(26 + i * 21)}" fill="none" stroke="${hot ? HI : WHITE}" stroke-opacity="${hot ? 0.9 : 0.1 + (i / 16) * 0.2}" stroke-width="${hot ? 1.6 : 1}"/>`;
      }
      return `
        <defs><radialGradient id="g"><stop offset="0" stop-color="${VIOLET}" stop-opacity=".35"/><stop offset="1" stop-color="${VIOLET}" stop-opacity="0"/></radialGradient></defs>
        <circle cx="${f(cx + 9 * dx)}" cy="${f(cy + 9 * dy)}" r="260" fill="url(#g)"/>${out}${stars(r, 20)}`;
    },

    scatter(r) {
      const pts = [];
      for (let i = 0; i < 46; i++) pts.push([40 + r() * (W - 80), 40 + r() * (H - 80)]);
      let out = "";
      for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) {
        const d = Math.hypot(pts[i][0] - pts[j][0], pts[i][1] - pts[j][1]);
        if (d < 135) out += `<line x1="${f(pts[i][0])}" y1="${f(pts[i][1])}" x2="${f(pts[j][0])}" y2="${f(pts[j][1])}" stroke="${WHITE}" stroke-opacity="${f(0.2 * (1 - d / 135))}"/>`;
      }
      pts.forEach((p, i) => {
        const hot = i % 11 === 0;
        out += `<circle cx="${f(p[0])}" cy="${f(p[1])}" r="${hot ? 6 : 2.4}" fill="${hot ? VIOLET : WHITE}" opacity="${hot ? 1 : 0.7}"/>`;
        if (hot) out += `<circle cx="${f(p[0])}" cy="${f(p[1])}" r="18" fill="none" stroke="${HI}" stroke-opacity=".5"/>`;
      });
      return out;
    },
  };

  const NAMES = Object.keys(variants);
  const cache = {};

  /* Returns an SVG string. `variant` falls back to one chosen from the seed. */
  function svg(seed, variant) {
    const name = variants[variant] ? variant : NAMES[seedFrom(String(seed)) % NAMES.length];
    const body = variants[name](rng(seed + ":" + name));
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice"><rect width="${W}" height="${H}" fill="${BG}"/>${body}</svg>`;
  }

  /* Returns a data: URI usable as <img src> */
  function url(seed, variant) {
    const key = seed + "|" + variant;
    return cache[key] || (cache[key] = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg(seed, variant)));
  }

  P.art = { svg, url, names: NAMES };
})(window.PENUMBRA);
