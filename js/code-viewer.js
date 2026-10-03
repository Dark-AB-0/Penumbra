/* ==========================================================================
   PENUMBRA · code viewer
   A small dependency-free syntax highlighter and an editor-style viewer.
   Supported: javascript/typescript, python, c/cpp/arduino, bash, json,
   css, html. Unknown languages are shown as plain text.
   ========================================================================== */
(function (P) {
  "use strict";
  const U = P.U;

  const KEYWORDS = {
    js: "const let var function return if else for while do switch case break continue new class extends import export from default async await try catch finally throw typeof instanceof in of this null true false undefined yield static get set void delete super",
    python: "def class return if elif else for while in not and or is import from as with try except finally raise lambda None True False pass break continue yield async await global nonlocal self del assert",
    cpp: "int float double char bool void long short unsigned signed const static struct class public private protected if else for while do switch case break continue return new delete true false nullptr using namespace typedef enum sizeof byte String auto template typename virtual override volatile",
    bash: "if then else elif fi for do done while case esac function in echo export cd ls sudo exit return local",
    json: "true false null",
    css: "important",
    html: "",
  };
  const ALIAS = {
    javascript: "js", js: "js", jsx: "js", ts: "js", typescript: "js", node: "js",
    python: "python", py: "python",
    c: "cpp", cpp: "cpp", "c++": "cpp", arduino: "cpp", ino: "cpp", h: "cpp",
    bash: "bash", sh: "bash", shell: "bash", zsh: "bash",
    json: "json", css: "css", html: "html", xml: "html",
  };

  const reCache = {};
  function buildRegex(lang) {
    if (reCache[lang]) return reCache[lang];
    const hashComment = lang === "python" || lang === "bash";
    const comment =
      lang === "html" ? "<!--[\\s\\S]*?-->"
      : hashComment ? "#[^\\n]*"
      : "\\/\\/[^\\n]*|\\/\\*[\\s\\S]*?\\*\\/";
    const strings = (lang === "python" ? '"""[\\s\\S]*?"""|\'\'\'[\\s\\S]*?\'\'\'|' : "") +
      '"(?:\\\\.|[^"\\\\\\n])*"|\'(?:\\\\.|[^\'\\\\\\n])*\'' + (lang === "js" ? "|`(?:\\\\.|[^`\\\\])*`" : "");
    const pre = lang === "cpp" ? "|^[ \\t]*#\\s*\\w+" : "";
    const wordTail = lang === "css" || lang === "html" ? "[\\w$-]*" : "[\\w$]*";
    const src = "(" + comment + ")|(" + strings + ")|(0x[0-9a-fA-F]+|\\b\\d+(?:\\.\\d+)?\\b)|([A-Za-z_$]" + wordTail + ")" + pre;
    return (reCache[lang] = new RegExp(src, "gm"));
  }

  /* Returns an array of lines; each line is an HTML string */
  function highlight(code, language) {
    const lang = ALIAS[String(language || "").toLowerCase()] || "text";
    const tokens = [];
    const push = (cls, text) => text && tokens.push({ cls, text });

    if (lang === "text") {
      push("", code);
    } else {
      const kw = new Set((KEYWORDS[lang] || "").split(" ").filter(Boolean));
      const re = buildRegex(lang);
      re.lastIndex = 0;
      let last = 0, m;
      while ((m = re.exec(code))) {
        if (m.index > last) push("", code.slice(last, m.index));
        const text = m[0];
        if (m[1] !== undefined) push("tk-c", text);
        else if (m[2] !== undefined) {
          const after = code.slice(re.lastIndex).match(/^\s*:/);
          push(lang === "json" && after ? "tk-p" : "tk-s", text);
        }
        else if (m[3] !== undefined) push("tk-n", text);
        else if (m[4] !== undefined) {
          const next = code.charAt(re.lastIndex);
          if (kw.has(text)) push("tk-k", text);
          else if (next === "(") push("tk-f", text);
          else if (/^[A-Z]/.test(text) && lang !== "css") push("tk-t", text);
          else push("", text);
        } else push("tk-k", text); // c preprocessor
        last = re.lastIndex;
        if (m[0].length === 0) re.lastIndex++;
      }
      if (last < code.length) push("", code.slice(last));
    }

    /* split into lines (tokens such as comments can span several) */
    const lines = [""];
    tokens.forEach((t) => {
      t.text.split("\n").forEach((part, i) => {
        if (i > 0) lines.push("");
        if (part) lines[lines.length - 1] += t.cls ? `<span class="${t.cls}">${U.esc(part)}</span>` : U.esc(part);
      });
    });
    return lines;
  }

  /* ---- Copy to clipboard (with a fallback for older / insecure contexts) ---- */
  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text);
    return new Promise((resolve, reject) => {
      const ta = document.createElement("textarea");
      ta.value = text; ta.setAttribute("readonly", "");
      ta.style.cssText = "position:fixed;top:-1000px;opacity:0";
      document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy") ? resolve() : reject(); } catch (e) { reject(e); }
      ta.remove();
    });
  }

  /* ---- Viewer ---- */
  let uid = 0;

  function renderBody(snippet) {
    const lines = highlight(snippet.code || "", snippet.language);
    return lines.map((l, i) =>
      `<span class="ln"><span class="ln__n" aria-hidden="true">${i + 1}</span><span class="ln__t">${l || " "}</span></span>`
    ).join("");
  }

  /* snippets: [{title, language, code | src}] */
  function create(snippets, project) {
    const id = "cv" + (++uid);
    const root = U.el("figure", { class: "code" });
    const multi = snippets.length > 1;
    let active = 0;

    root.innerHTML = `
      <div class="code__bar">
        ${multi
          ? `<div class="code__tabs" role="tablist" aria-label="Code files">${snippets.map((s, i) =>
              `<button role="tab" class="code__tab" id="${id}-t${i}" aria-controls="${id}-p" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}">${U.esc(s.title || "snippet")}</button>`).join("")}</div>`
          : `<span class="code__file">${U.esc(snippets[0].title || "snippet")}</span>`}
        <span class="code__lang"></span>
        <button class="code__copy" type="button" aria-label="Copy code to clipboard">
          <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V6a2 2 0 0 1 2-2h9"/></svg>
          <span class="code__copy-label">Copy</span>
        </button>
      </div>
      <div class="code__body" id="${id}-p" role="${multi ? "tabpanel" : "region"}" tabindex="0" aria-label="Source code"><pre><code></code></pre></div>
      <span class="sr-only" role="status" aria-live="polite"></span>`;

    const codeEl = U.$("code", root), langEl = U.$(".code__lang", root);
    const copyBtn = U.$(".code__copy", root), label = U.$(".code__copy-label", root);
    const live = U.$("[role=status]", root);
    const tabs = U.$$(".code__tab", root);

    async function show(i) {
      active = i;
      const s = snippets[i];
      langEl.textContent = s.language || "text";
      tabs.forEach((t, k) => { t.setAttribute("aria-selected", k === i); t.tabIndex = k === i ? 0 : -1; });
      if (multi) U.$(".code__body", root).setAttribute("aria-labelledby", `${id}-t${i}`);
      if (s.code == null && s.src) {
        codeEl.innerHTML = '<span class="ln"><span class="ln__t tk-c">Loading…</span></span>';
        try {
          const res = await fetch(U.asset(project, s.src));
          if (!res.ok) throw new Error(res.status);
          s.code = await res.text();
        } catch (e) {
          s.code = "// Could not load " + s.src + "\n// (files can't be fetched when the page is opened with file://;\n// run a local server or use the inline `code` field).";
        }
      }
      codeEl.innerHTML = renderBody(s);
    }

    tabs.forEach((t, i) => {
      t.addEventListener("click", () => show(i));
      t.addEventListener("keydown", (e) => {
        if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
        const n = (i + (e.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length;
        tabs[n].focus(); show(n);
      });
    });

    let timer;
    copyBtn.addEventListener("click", async () => {
      const s = snippets[active];
      try {
        await copyText(s.code || "");
        label.textContent = "Copied"; live.textContent = "Code copied to clipboard";
        copyBtn.classList.add("is-done");
      } catch (e) {
        label.textContent = "Press Ctrl+C"; live.textContent = "Could not copy automatically";
      }
      clearTimeout(timer);
      timer = setTimeout(() => { label.textContent = "Copy"; copyBtn.classList.remove("is-done"); live.textContent = ""; }, 1800);
    });

    show(0);
    return root;
  }

  P.code = { create, highlight };
})(window.PENUMBRA);
