/* ==========================================================================
   PENUMBRA · projects
   The whole site is generated from this list. To add a project:

     1. Create assets/projects/<id>/            (cover.jpg, images, diagrams, docs…)
     2. Add one object to the array below.
     3. Done. Card, filters, counters, featured section and detail page appear.

   FIELDS
     id           unique, lowercase, no spaces            (required)
     title        project name                            (required)
     subtitle     one short line                          (required)
     category     must match one in js/config.js          (required)
     type         free text: "Application", "Hardware"…   (used for sorting)
     status       IN DEVELOPMENT | EXPERIMENTAL | COMPLETED | CONCEPT
                  | COMING SOON | ARCHIVED
     date         "2026" or "2026-03"
     featured     true = appears in FEATURED PROJECTS
     relevance    0–10, used for "Relevance" sorting
     cover        image inside assets/projects/<id>/ (optional)
     art          generated artwork if there is no cover:
                  "eclipse" | "orbits" | "waves" | "lattice" | "rings" | "scatter"
     github       repository URL (optional → button appears automatically)
     description  string or array of paragraphs  (supports `code` and **bold**)
     process      string, or array of { title, text } steps
     technologies ["Python", "…"]
     code         [{ title, language, code }]  or  { title, language, src: "file.py" }
     diagrams     [{ src: "diagrams/x.svg", caption }]
     images       [{ src: "images/x.jpg", caption }]  or  [{ art: "waves", caption }]
     docs         [{ title, src: "docs/x.pdf", type: "PDF" }]
     links        [{ label, url }]

   Asset paths without a leading "assets/" or "http" are resolved to
   assets/projects/<id>/<path> automatically.

   NOTE: every project below is SAMPLE CONTENT so the site is not empty.
   Replace the text and delete what you do not need.
   ========================================================================== */
window.PENUMBRA = window.PENUMBRA || {};

/*Proyectos Principales 10-9*/

PENUMBRA.projects = [
  {
    id: "ava",
    title: "AVA",
    subtitle: "“Awareness. Vision. Aspiration.”",
    category: "Software & Programming",
    type: "Application",
    status: "IN DEVELOPMENT",
    date: "2026-07",
    featured: true,
    relevance: 10,
    art: "orbits",
    github: "https://github.com/your-username/ava",
    description: [
      "“Some things are part of the project without being part of its code.”",
      "“AVA is a project born from a single idea: to create a virtual intelligence capable of evolving alongside its creator. Driven by curiosity, knowledge, and a desire to discover, it aims to become far more than just an assistant—an extension of the way I think, learn, and imagine.”",
      "“Its story begins with a question: how far can an idea go when it becomes reality? From that starting point, AVA begins to evolve, integrating artificial intelligence, memory, voice recognition, and automation to build a system that is increasingly autonomous and adaptable.”",
      "“Behind its creation lies a personal story, shaped by experiences, ideas, and the people who left their mark. Some of these elements will remain solely at the project's origins, as part of what makes it unique.”",
      "“Curiosidad → Idea → Proyecto → Evolución.”",
      "“This started as an idea and ended up becoming something I never imagined.”",
    ],
    process: [
      { title: "First sketch", text: "A single script and a list of questions: what should it do, and what should it never do?" },
      { title: "Splitting it into modules", text: "Each capability moved into its own module with a small, explicit interface." },
      { title: "Making it observable", text: "Logging and a simple event bus, so every decision can be traced afterwards." },
      { title: "Today", text: "Hardening the core and writing the documentation while new modules keep arriving." },
    ],
    technologies: ["Python", "Modular architecture", "Event bus", "SQLite", "JavaScript"],
    code: [
      {
        title: "registry.py",
        language: "python",
        code: `class Registry:
    """Keeps track of every module the system can load."""

    def __init__(self):
        self._modules = {}

    def register(self, name):
        def decorator(cls):
            if name in self._modules:
                raise ValueError(f"'{name}' is already registered")
            self._modules[name] = cls
            return cls
        return decorator

    def load(self, name, **options):
        # Modules are created lazily, only when someone asks for them
        return self._modules[name](**options)


registry = Registry()


@registry.register("greeting")
class Greeting:
    def __init__(self, language="en"):
        self.language = language

    def run(self):
        return "Hello" if self.language == "en" else "Hola"`,
      },
      {
        title: "events.js",
        language: "javascript",
        code: `// A tiny event bus: modules talk through events, never directly.
export function createBus() {
  const listeners = new Map();

  return {
    on(event, handler) {
      if (!listeners.has(event)) listeners.set(event, new Set());
      listeners.get(event).add(handler);
      return () => listeners.get(event).delete(handler); // unsubscribe
    },
    emit(event, payload) {
      (listeners.get(event) || []).forEach((fn) => fn(payload));
    },
  };
}`,
      },
    ],
    diagrams: [
      { src: "diagrams/architecture.svg", caption: "High-level architecture: the core, the event bus and the modules around it." },
    ],
    images: [
      { src: "images/x2.jpg", caption: "AVA's representative logo. By: Ale" },
      { src: "images/x1.jpg", caption: "Graphic representation of AVA. By: Ale" },
    ],
    docs: [
      { title: "Design notes", src: "docs/design-notes.md", type: "Markdown" },
    ],
  },

/*Proyectos experimentales 8-7*/

  {
    id: "static-bloom",
    title: "Static Bloom",
    subtitle: "What happens when noise is allowed to grow.",
    category: "Design & Experimentation",
    type: "Visual study",
    status: "EXPERIMENTAL",
    date: "2026-03",
    featured: false,
    relevance: 8,
    art: "rings",
    description: "A series of generative studies that start from pure noise and let a few simple rules shape it. Sample content: edit or remove it.",
    process: "Each study is a short script and a single rule. I change one number, watch what grows, and keep what surprises me.",
    technologies: ["JavaScript", "Canvas", "Generative art"],
    images: [{ src: "images/x.jpg", caption: "Study 01" }],
  },

  {
    id: "Echoes-Syntax",
    title: "Echoes of Syntax",
    subtitle: "Fragments of code, translated into motion.",
    category: "Design & Experimentation",
    type: "Visual experiment",
    status: "EXPERIMENTAL",
    date: "2026-04",
    featured: false,
    relevance: 7,
    art: "rings",
    description: "An experimental interface that transforms fragments of text and code into visual compositions, exploring the relationship between typography, movement and digital identity.",
    process: "I explore different animation patterns, transitions and typographic arrangements to discover new ways of presenting information.",
    technologies: ["JavaScript", "CSS", "HTML"],
    images: [{ src: "images/x.jpg", caption: "Study 01" }],
  },

/*Proyectos terminados 9*/

  {
    id: "Dark-Archive",
    title: "Dark Archive",
    subtitle: "A place for everything that deserves to remain.",
    category: "Software & Programming",
    type: "web application",
    status: "COMPLETED",
    date: "2026-05",
    featured: true,
    relevance: 9,
    art: "eclipse",
    description: "A personal digital archive designed to organize projects, technical notes, experiments and ideas in a single environment.",
    process: "The application is planned around modular sections, searchable entries and a consistent visual language inspired by digital archives.",
    technologies: ["JavaScript", "HTML", "CSS"],
    images: [{ src: "images/x.jpg", caption: "Interface concept" }],
  },

  /*Proximamente 6-5*/
  {
    id: "project-07",
    title: "Project 07",
    subtitle: "Something is forming here.",
    category: "Design & Experimentation",
    type: "Unknown",
    status: "COMING SOON",
    date: "2026-09",
    featured: false,
    relevance: 6,
    art: "scatter",
  },
  
  /*Archivado 4-3*/

  {
    id: "ghost-interface",
    title: "Ghost Interface",
    subtitle: "An interface that never found its final form.",
    category: "Software & Programming",
    type: "visual concept",
    status: "ARCHIVED",
    date: "2026-03",
    featured: false,
    relevance: 4,
    art: "scatter",
    description: "An abandoned interface concept focused on experimental transitions, unconventional navigation and atmospheric visual effects.",
    process: "The original concept was explored through several interface sketches. Development was discontinued before a functional version could be completed.",
    technologies: ["JavaScript", "HTML", "CSS"],
    images: [{ src: "images/x.jpg", caption: "Original concept" }],
  },

  {
    id: "eidolon",
    title: "Eidolon",
    subtitle: "An existence shaped by what remains unseen.",
    category: "Artificial Intelligence & Concept",
    type: "conceptual study",
    status: "ARCHIVED",
    date: "2025-11",
    featured: false,
    relevance: 3,
    art: "scatter",
    description: "Eidolon is a conceptual exploration of digital identity, memory and artificial intelligence. It imagines an entity shaped by information, exploring the boundary between what is real, what is simulated and what exists only as an idea.",
    process: "The concept is currently in its initial stage. Its development will begin with exploring possible interactions, defining its visual identity and establishing the principles that could eventually turn the idea into a functional project.",
    technologies: ["Artificial Intelligence", "Python", "Generative Design"],
    images: [{ src: "images/x.jpg", caption: "Initial concept" }],
  },

  /*Concepto 2-1*/

  {
    id: "Null-Space",
    title: "Nul Space",
    subtitle: "A space governed by invisible rules.",
    category: "Design & Experimentation",
    type: "Visual Simulation",
    status: "CONCEPT",
    date: "2026-01",
    featured: false,
    relevance: 2,
    art: "rings",
    description: "A particle simulation designed to explore how simple mathematical rules can produce complex and unpredictable patterns in a virtual space.",
    process: "I experiment with particle movement, attraction, repulsion and randomness to observe how different parameters influence the resulting patterns.",
    technologies: ["JavaScript", "Canvas", "Mathematics"],
    images: [{ src: "images/x.jpg", caption: "particle study" }],
  },


  /*{
    id: "lumen-rig",
    title: "Lumen Rig",
    subtitle: "A motorised light rig that follows a score instead of a switch.",
    category: "Automation & Robotics",
    type: "Hardware",
    status: "COMPLETED",
    date: "2025-09",
    featured: true,
    relevance: 8,
    art: "rings",
    description: [
      "Lumen Rig moves a small set of lights along a track according to a written score. It was built to learn motor control and timing, and it ended up being the most-watched thing on my desk.",
      "Sample content: edit or remove it.",
    ],
    process: "Prototype on a breadboard first, then a printed chassis, then weeks of tuning the acceleration curves until the motion felt less mechanical.",
    technologies: ["C++", "Arduino", "Stepper motors", "3D printing"],
    code: [
      {
        title: "motion.ino",
        language: "cpp",
        code: `#include <AccelStepper.h>

AccelStepper rail(AccelStepper::DRIVER, 2, 3);

void setup() {
  rail.setMaxSpeed(1200);
  rail.setAcceleration(400);   // gentle: the lights should drift, not jump
  rail.moveTo(4800);
}

void loop() {
  if (rail.distanceToGo() == 0) {
    rail.moveTo(-rail.currentPosition());   // turn around
  }
  rail.run();
}`,
      },
    ],
    images: [{ art: "rings", caption: "Motion path visualised over one full cycle." }],
  },*/

  /*{
    id: "cartograph",
    title: "Cartograph",
    subtitle: "A tool that turns folders into maps.",
    category: "Software & Programming",
    type: "Tool",
    status: "COMPLETED",
    date: "2025-04",
    featured: false,
    relevance: 6,
    art: "scatter",
    github: "https://github.com/your-username/cartograph",
    description: "Cartograph scans a directory and draws it as a map, so large projects can be understood at a glance. Sample content.",
    technologies: ["Node.js", "SVG", "CLI"],
  },*/

  /*{
    id: "servo-choir",
    title: "Servo Choir",
    subtitle: "Small motors that learn to keep time together.",
    category: "Automation & Robotics",
    type: "Hardware",
    status: "IN DEVELOPMENT",
    date: "2026-05",
    featured: false,
    relevance: 6,
    art: "lattice",
    description: "A group of servos that coordinate through a shared clock to play simple rhythms. Sample content.",
    process: "Currently solving the hardest part: keeping every motor in time when the supply voltage dips.",
    technologies: ["C++", "I²C", "Servo control"],
  },*/

  /*{
    id: "afterimage",
    title: "Afterimage",
    subtitle: "An interactive piece about what stays when the light goes.",
    category: "Design & Experimentation",
    type: "Interactive piece",
    status: "CONCEPT",
    date: "2026-06",
    featured: false,
    relevance: 5,
    art: "eclipse",
    description: "Still only a sketch: a screen that remembers where you looked and slowly fades it. Sample content.",
    technologies: ["WebGL", "Eye tracking (maybe)"],
  },*/

  /*{
    id: "ledger-moth",
    title: "Ledger Moth",
    subtitle: "A quiet utility for tracking small expenses.",
    category: "Software & Programming",
    type: "Utility",
    status: "COMPLETED",
    date: "2024-11",
    featured: false,
    relevance: 4,
    art: "waves",
    github: "https://github.com/your-username/ledger-moth",
    description: "A small command-line utility I built for myself and kept using. Sample content.",
    technologies: ["Python", "SQLite"],
  },*/

];
