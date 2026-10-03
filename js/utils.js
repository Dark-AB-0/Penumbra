/* PENUMBRA · utils — small helpers shared by all modules */
(function (P) {
  "use strict";

  const U = {};

  U.$  = (sel, root) => (root || document).querySelector(sel);
  U.$$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));

  U.clamp = (v, min, max) => Math.min(max, Math.max(min, v));
  U.lerp  = (a, b, t) => a + (b - a) * t;
  U.pad2  = (n) => String(n).padStart(2, "0");

  /* Escape text before it goes into innerHTML */
  U.esc = (s) =>
    String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");

  /* Tiny inline formatting for descriptions: `code` and **bold** */
  U.inline = (s) =>
    U.esc(s)
      .replace(/`([^`]+)`/g, "<code>$1</code>")
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");

  U.reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  U.canHover      = () => window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* sessionStorage that never throws (private mode, file://, etc.) */
  U.store = {
    get(k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { sessionStorage.setItem(k, v); } catch (e) { /* ignore */ } },
    del(k) { try { sessionStorage.removeItem(k); } catch (e) { /* ignore */ } },
  };

  /* "2026" or "2026-03" -> sortable number, and a readable label */
  U.dateValue = (d) => {
    const m = String(d || "").match(/^(\d{4})(?:-(\d{1,2}))?/);
    return m ? Number(m[1]) * 12 + (m[2] ? Number(m[2]) - 1 : 0) : 0;
  };
  U.dateLabel = (d) => {
    const m = String(d || "").match(/^(\d{4})(?:-(\d{1,2}))?/);
    if (!m) return "";
    if (!m[2]) return m[1];
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    return months[Number(m[2]) - 1] + " " + m[1];
  };

  /* Resolve an asset path relative to the project's folder */
  U.asset = (project, path) => {
    if (!path) return "";
    if (/^(https?:|data:|\/|assets\/)/.test(path)) return path;
    return "assets/projects/" + project.id + "/" + path;
  };

  /* Project helpers driven by config */
  U.isSoon = (p) => p.status === "COMING SOON";
  U.isOpenable = (p) =>
    p.openable === true || !P.config.lockedStatuses.includes(p.status);

  U.statusKey = (s) => String(s || "").toLowerCase().replace(/\s+/g, "-");

  /* Tiny element factory */
  U.el = (tag, attrs, html) => {
    const n = document.createElement(tag);
    if (attrs) for (const k in attrs) {
      if (k === "class") n.className = attrs[k];
      else if (attrs[k] !== false && attrs[k] != null) n.setAttribute(k, attrs[k]);
    }
    if (html != null) n.innerHTML = html;
    return n;
  };

  /* Wait helper for sequencing animations */
  U.wait = (ms) => new Promise((r) => setTimeout(r, ms));

  P.U = U;
})(window.PENUMBRA);
