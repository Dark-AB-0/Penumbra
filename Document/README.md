# Penumbra

An archive of projects, experiments and ideas. Plain HTML + CSS + JavaScript:
no build step, no dependencies, fonts included. Open `index.html` or upload the
folder to GitHub Pages / any static host.

## Add a project (the whole workflow)

1. Create `assets/projects/<id>/` and put in it whatever you have:
   `cover.jpg`, `images/`, `diagrams/`, `docs/`.
2. Add one object to the array in `data/projects.js` (all fields are
   documented at the top of that file).
3. Reload. The card, filter counts, statistics, featured section and the
   detail page are generated automatically.

Minimum project:

```js
{ id: "my-thing", title: "My Thing", subtitle: "One line.",
  category: "Software & Programming", status: "CONCEPT", date: "2026-10",
  featured: false, relevance: 5 }
```

* **Featured:** set `featured: true`.
* **Future / hinted projects:** use `status: "CONCEPT"` or `"COMING SOON"`.
  COMING SOON cards show as a blurred rumour and do not open.
* **No cover yet?** Omit `cover`; a generated artwork is used
  (choose one with `art: "eclipse" | "orbits" | "waves" | "lattice" | "rings" | "scatter"`).
* **GitHub button:** add `github: "https://github.com/…"`.
* **Code:** `code: [{ title, language, code }]`. Languages: js/ts, python,
  c/cpp/arduino, bash, json, css, html.

## Change the site itself

Everything global lives in `js/config.js`: name (change it once and it
updates everywhere), main phrase, navigation labels, status meanings,
categories, entrance words, "Other dimensions" links, GitHub username.

Replace the placeholder URLs for the three dimensions and
`github.username` before publishing.

## Structure

```
index.html            page skeleton only
css/                  base · layout · components · project · intro
js/                   config · utils · art · code-viewer · cards · stats ·
                      archive · lightbox · project-view · dimensions · nav ·
                      hero · intro · main
data/projects.js      the project registry (edit this)
assets/fonts/         self-hosted fonts
assets/projects/<id>/ per-project media and docs
```

## Notes

* Scripts are classic (not ES modules) on purpose, so the site also works
  when opened directly from disk.
* `src:` code files and Markdown docs are fetched at runtime, which browsers
  block on `file://`; use inline `code:` or a local server
  (`python -m http.server`).
* The entrance plays once per session. "Replay the entrance" is in the footer.
* All sample projects are placeholders. Replace them.
