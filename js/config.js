/* ==========================================================================
   PENUMBRA · config
   Everything that is "about the site" (not about a single project) lives here.
   Change the name, the phrase, the links or the status rules from this file.
   ========================================================================== */
window.PENUMBRA = window.PENUMBRA || {};

PENUMBRA.config = {
  /* ---- Identity (change the name here and it updates everywhere) ---- */
  name: "Penumbra",
  tagline: ["Some ideas only", "show up in the dark."],
  lede: "Two perspectives. One shared space. Here, Dark AB and White Bunny. bring together what we build, explore, and leave in progress. Some projects have a defined form; others are just beginning to find theirs. This space grows with every idea.",
  description: "An archive of projects, experiments and ideas.",

  /* ---- Entrance sequence ---- */
  intro: {
    enabled: true,
    lines: ["Unknown space", "Initializing", "Entering"],
    oncePerSession: true,           // true = only plays the first time per browser session
  },

  /* ---- Navigation (target = id of the section) ---- */
  nav: [
    { label: "Threshold",        target: "top" },
    { label: "Featured",         target: "featured" },
    { label: "Archive",          target: "archive" },
    { label: "The space",        target: "about" },
    { label: "Other dimensions", target: "dimensions" },
  ],

  /* ---- Project states. `order` is used when sorting by status. ---- */
  statuses: {
    "IN DEVELOPMENT": { order: 0, meaning: "Being built right now." },
    "EXPERIMENTAL":   { order: 1, meaning: "An open question. It may or may not become something." },
    "COMPLETED":      { order: 2, meaning: "Finished and working." },
    "CONCEPT":        { order: 3, meaning: "An idea on paper. Nothing built yet." },
    "COMING SOON":    { order: 4, meaning: "A signal of what is on its way." },
    "ARCHIVED":       { order: 5, meaning: "Retired, but kept for the record." },
  },

  /* Statuses that never open a detail page unless the project says `openable: true` */
  lockedStatuses: ["COMING SOON"],

  /* ---- Categories (the filter buttons are generated from this list) ---- */
  categories: [
    "Software & Programming",
    "Automation & Robotics",
    "Design & Experimentation",
  ],

  /* ---- GitHub ----
     The site works without it. If `username` is set (and not the placeholder),
     the "Other dimensions" section shows recently active repositories. */
  github: {
    username: "your-username",
    showRepos: true,
    maxRepos: 4,
  },

  /* ---- OTHER DIMENSIONS ---- */
  dimensions: [
    {
      id: "github",
      name: "GitHub",
      description: "Where the code lives: repositories, commits and everything still unfinished.",
      url: "https://github.com/Dark-AB-0",
      glyph: "rings",
      newTab: false,
    },
    {
      id: "portfolio",
      name: "Dark AB",
      description: "The portfolio. Who is behind the work, what I do and how to reach me.",
      url: "https://dark-ab-portafolio.vercel.app/",
      glyph: "eclipse",
      newTab: false,
    },
    {
      id: "signal",
      name: "Signal",
      description: "What I offer, shown for people who need something built.",
      url: "https://dark-ab-services.vercel.app/",
      glyph: "signal",
      newTab: false,
    },
  ],
};
