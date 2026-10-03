# GUÍA DE USO Y MANTENIMIENTO — PENUMBRA

Manual para modificar la página, agregar proyectos y publicarla sin depender de nadie más.

> **Cómo usar esta guía:** no hace falta leerla de corrido. Usa el índice, ve a la sección que necesitas y sigue los pasos. Todos los nombres de archivos, rutas, clases, variables y funciones que aparecen aquí existen realmente en el proyecto. Cuando algo **no está implementado**, se dice expresamente.
>
> **Atajo de VS Code que usarás todo el tiempo:** `Ctrl + Shift + F` (buscar en todo el proyecto) y `Ctrl + F` (buscar dentro del archivo abierto). En Mac: `Cmd` en lugar de `Ctrl`.

## Índice

1. [Introducción](#1-introducción)
2. [Estructura de carpetas y archivos](#2-estructura-de-carpetas-y-archivos)
3. [Cómo modificar el diseño](#3-cómo-modificar-el-diseño)
4. [Cómo modificar las animaciones](#4-cómo-modificar-las-animaciones)
5. [Cómo agregar un proyecto nuevo](#5-cómo-agregar-un-proyecto-nuevo)
6. [Cómo modificar proyectos existentes](#6-cómo-modificar-proyectos-existentes)
7. [Proyectos próximos y experimentales](#7-cómo-agregar-proyectos-próximos-y-experimentales)
8. [Filtros, ordenamiento y contadores](#8-cómo-funcionan-los-filtros-y-los-contadores)
9. [OTHER DIMENSIONS](#9-cómo-modificar-other-dimensions)
10. [Contenido de la página](#10-cómo-modificar-el-contenido-de-la-página)
11. [Código, diagramas y documentación](#11-cómo-añadir-código-diagramas-y-documentación)
12. [Ejecutar y probar la página](#12-cómo-ejecutar-y-probar-la-página)
13. [Publicar en GitHub y Vercel](#13-cómo-actualizar-la-página-en-github-y-vercel)
14. [Errores frecuentes y soluciones](#14-errores-frecuentes-y-soluciones)
15. [Referencia rápida](#15-referencia-rápida)
16. [Recomendaciones de mantenimiento](#16-recomendaciones-de-mantenimiento)

---

# 1. Introducción

## 1.1 Cómo está organizada la página

La página (nombre actual: **Penumbra**) es un sitio estático de una sola pantalla con estas zonas, de arriba abajo:

| Zona | Id en `index.html` | Qué muestra |
|---|---|---|
| Entrada | `#intro` | Animación inicial (anillo, tres palabras, "iris" que se abre) |
| Navegación | `#nav` | Barra superior fija (en móvil, botón *Menu*) |
| Portada (*Threshold*) | `#top` | Eclipse + frase principal |
| Estadísticas | `#inventory` / `#stats` | Contadores automáticos |
| Proyectos destacados | `#featured` / `#featured-grid` | Tarjetas con `featured: true` |
| Todos los proyectos | `#archive` / `#all-grid` | Filtros, orden y tarjetas |
| Sobre este espacio | `#about` | Texto fijo + leyenda de estados |
| Otras dimensiones | `#dimensions` | Tres "portales" (GitHub, Dark AB, Signal) |
| Pie de página | `.footer` | Enlaces y marca grande |
| Página de proyecto | `#project` | Capa a pantalla completa que se llena al abrir una tarjeta |

Casi todo el contenido **no está escrito en el HTML**: `index.html` solo contiene contenedores vacíos (por ejemplo `<div class="grid" id="all-grid"></div>`) y JavaScript los llena a partir de los datos.

## 1.2 Tecnologías

* **HTML + CSS + JavaScript puro.** Sin frameworks, sin Node, sin `npm install`, sin compilar. No existe `package.json`.
* **Scripts clásicos** (no módulos ES). Por eso la página también se puede abrir con doble clic en `index.html`.
* **Fuentes incluidas en el proyecto** (`assets/fonts/`): Instrument Serif (títulos), Hanken Grotesk (texto) y JetBrains Mono (código). No dependen de internet.
* **Sin librerías externas.** El resaltado de código, el visor de imágenes y las ilustraciones generadas están programados en el propio proyecto.

## 1.3 Cómo funciona la estructura general

```
 js/config.js ──┐                         (textos y reglas del sitio)
                ├──►  js/main.js  ──►  genera la página
 data/projects.js ┘                      (la lista de tus proyectos)
```

1. `index.html` carga los CSS y luego los scripts **en un orden concreto**.
2. Cada script guarda sus funciones dentro de un único objeto global: `window.PENUMBRA` (dentro del código se abrevia `P`). Por ejemplo: `PENUMBRA.config`, `PENUMBRA.projects`, `PENUMBRA.cards`, `PENUMBRA.stats`.
3. `js/main.js` se ejecuta al final: valida los proyectos y llama a cada módulo (estadísticas, destacados, archivo, dimensiones, navegación, entrada…).
4. Cada módulo lee `PENUMBRA.config` y `PENUMBRA.projects` y construye su parte de la página.

**Consecuencia práctica:** para agregar o cambiar un proyecto, o cambiar textos globales, solo editas **datos**. No tocas la lógica.

## 1.4 Los archivos más importantes

| Archivo | Por qué es importante |
|---|---|
| `data/projects.js` | **Aquí viven tus proyectos.** Es el archivo que más vas a editar. |
| `js/config.js` | Nombre, frase, navegación, estados, categorías, enlaces de *Other dimensions*, GitHub. |
| `css/base.css` | Colores, tipografías y espacios globales (bloque `:root`). |
| `index.html` | Textos fijos (ABOUT THIS SPACE, títulos de sección) y orden de los scripts. |
| `assets/projects/<id>/` | Imágenes, diagramas y documentos de cada proyecto. |

## 1.5 Qué puedes modificar sin riesgo y qué no

| Nivel | Qué | Notas |
|---|---|---|
| 🟢 **Seguro** | `data/projects.js`, `js/config.js` (textos, URLs, listas), archivos dentro de `assets/`, **valores** de las variables de `:root` en `css/base.css`, textos visibles de `index.html` | Cambiar *valores* y *textos* no rompe nada mientras respetes comillas y comas. |
| 🟡 **Con cuidado** | Reglas de `css/*.css` (tamaños, márgenes, duraciones), constantes numéricas de `js/*.js` indicadas en esta guía | Cambia **un valor a la vez**, guarda y revisa. |
| 🔴 **No tocar** | Nombres de clases (`.card__link`, `.p-hero`…) y de `id` (`#all-grid`…), el **orden** de las etiquetas `<script>`, la lógica dentro de `js/*.js` | Los nombres de clase se usan en CSS **y** en JS. Si renombras uno solo en un lado, esa parte de la página deja de funcionar. |

## 1.6 Lo que NO está implementado

Para que no pierdas tiempo buscando cómo hacerlo:

* No hay buscador de proyectos.
* No hay modo claro / oscuro (la página es siempre oscura).
* No hay cambio de idioma. La interfaz está escrita en inglés; el texto se edita directamente (secciones 10 y 15).
* No hay sonido (a propósito).
* La tarjeta **no cambia a una segunda imagen** al pasar el cursor: lo que hace es *iluminar* la misma imagen con una "linterna" violeta.
* No hay vídeo en los proyectos (solo imágenes, SVG, código y enlaces a documentos).
* Los documentos (`docs`) **no se muestran dentro de la página**: se abren en una pestaña nueva del navegador.
* El repositorio de GitHub **por proyecto** es solo un botón con enlace. La conexión con la API de GitHub solo se usa en *Other dimensions* (para listar repos recientes) y es opcional.
* No hay panel de administración ni base de datos: todo se edita en archivos.
* No se optimizan imágenes automáticamente: tú decides su tamaño (sección 16).
* No hay paginación en "All projects": se muestran todos.

---

# 2. Estructura de carpetas y archivos

## 2.1 Árbol completo

```
penumbra/                         ← raíz del proyecto (aquí está index.html)
├── index.html                    ← esqueleto de la página
├── README.md                     ← resumen breve
├── GUIA.md                       ← este manual
│
├── css/                          ← DISEÑO
│   ├── base.css
│   ├── layout.css
│   ├── components.css
│   ├── project.css
│   └── intro.css
│
├── js/                           ← FUNCIONAMIENTO
│   ├── config.js                 ← (también es INFORMACIÓN)
│   ├── utils.js
│   ├── art.js
│   ├── code-viewer.js
│   ├── cards.js
│   ├── stats.js
│   ├── archive.js
│   ├── lightbox.js
│   ├── project-view.js
│   ├── dimensions.js
│   ├── nav.js
│   ├── hero.js
│   ├── intro.js
│   └── main.js
│
├── data/                         ← INFORMACIÓN
│   └── projects.js
│
└── assets/                       ← RECURSOS
    ├── fonts/
    │   ├── hanken-grotesk-latin-wght-normal.woff2
    │   ├── instrument-serif-latin-400-italic.woff2
    │   ├── instrument-serif-latin-400-normal.woff2
    │   └── jetbrains-mono-latin-wght-normal.woff2
    └── projects/
        └── ava/                  ← una carpeta por proyecto (nombre = id)
            ├── diagrams/
            │   └── architecture.svg
            └── docs/
                └── design-notes.md
```

> Los demás proyectos de ejemplo (`lumen-rig`, `static-bloom`, etc.) **no tienen carpeta** porque usan ilustraciones generadas automáticamente en lugar de imágenes. Cuando tengas imágenes reales, crearás su carpeta (sección 5).

## 2.2 Archivos de INFORMACIÓN (qué se muestra)

| Archivo | Para qué sirve | Qué contiene | Qué puedes modificar | Qué se ve afectado |
|---|---|---|---|---|
| `data/projects.js` | Lista de todos los proyectos | Un arreglo `PENUMBRA.projects = [ {...}, {...} ]` | Agregar, quitar o editar proyectos | Tarjetas, destacados, filtros, contadores, páginas de detalle |
| `js/config.js` | Ajustes globales del sitio | `PENUMBRA.config`: `name`, `tagline`, `lede`, `intro`, `nav`, `statuses`, `lockedStatuses`, `categories`, `github`, `dimensions` | Textos, URLs, categorías, estados, enlaces | Portada, navegación, filtros, leyenda de estados, entrada, *Other dimensions* |
| `index.html` | Esqueleto + textos fijos | Secciones, el texto de ABOUT THIS SPACE, títulos y botones fijos | Textos visibles (sección 10) | Solo lo que se ve; no cambies `id` ni `class` |
| `assets/projects/<id>/…` | Medios de cada proyecto | Imágenes, SVG, documentos, archivos de código | Reemplazar o añadir archivos | Solo el proyecto cuyo `id` coincide con la carpeta |

## 2.3 Archivos de DISEÑO (cómo se ve)

Se cargan en este orden desde `index.html` (el orden importa: los últimos pueden anular a los primeros):

| Archivo | Para qué sirve | Qué contiene |
|---|---|---|
| `css/base.css` | Fundamentos | `@font-face`, **variables `:root`** (colores, fuentes, espacios), reinicio, grano de película, botones `.btn`, chips de estado `.chip`, bloque `prefers-reduced-motion` |
| `css/layout.css` | Estructura de la página | Barra de navegación, menú móvil, portada y eclipse, estadísticas, secciones, ABOUT, pie de página |
| `css/components.css` | Piezas reutilizables | Rejillas `.featured` y `.grid`, **tarjetas `.card`**, filtros `.pill` y `.sort`, portales `.portal`, repos |
| `css/project.css` | Página de proyecto | Cabecera, secciones, proceso, etiquetas, galerías, documentación, "Keep exploring", **visor de código `.code`**, **visor de imágenes `.lb`** |
| `css/intro.css` | Animación de entrada | Anillo, luna, texto, máscara del "iris" |
| `assets/fonts/` | Archivos de las fuentes | Solo se referencian desde `css/base.css` (`@font-face`) |

Si modificas un CSS, solo cambia el aspecto. No altera datos ni lógica.

## 2.4 Archivos de FUNCIONAMIENTO (qué hace la página)

Se cargan en este orden (está en `index.html`, al final; **no lo cambies**):

| # | Archivo | Qué hace | Si lo modificas afecta a… |
|---|---|---|---|
| 1 | `js/config.js` | Define `PENUMBRA.config` | Todo (lo leen casi todos los módulos) |
| 2 | `data/projects.js` | Define `PENUMBRA.projects` | Todo |
| 3 | `js/utils.js` | Funciones auxiliares (`U.esc`, `U.dateLabel`, `U.asset`, `U.reducedMotion`…) | Todos los módulos |
| 4 | `js/art.js` | Genera ilustraciones SVG cuando un proyecto no tiene `cover` | Tarjetas, cabecera de proyecto, galerías con `art:` |
| 5 | `js/code-viewer.js` | Resaltado de sintaxis, pestañas, copiar | Sección "Code" de los proyectos |
| 6 | `js/cards.js` | Crea cada tarjeta, linterna e inclinación | Destacados y "All projects" |
| 7 | `js/stats.js` | Calcula y anima los contadores | Sección de estadísticas |
| 8 | `js/archive.js` | Filtros, ordenamiento, animación de reordenar | Destacados y "All projects" |
| 9 | `js/lightbox.js` | Visor a pantalla completa con zoom | Imágenes y diagramas |
| 10 | `js/project-view.js` | Página de proyecto, expansión de tarjeta, rutas `#/project/id` | Apertura/cierre de proyectos |
| 11 | `js/dimensions.js` | Portales y (opcional) repos de GitHub | *Other dimensions* |
| 12 | `js/nav.js` | Navegación, indicador, menú móvil | Barra superior |
| 13 | `js/hero.js` | Movimiento del eclipse y texto de portada | Portada |
| 14 | `js/intro.js` | Secuencia de entrada | Pantalla inicial |
| 15 | `js/main.js` | Arranca todo y valida los proyectos | Todo |

**Regla:** los archivos de `js/` (excepto `config.js`) están pensados para que **no tengas que editarlos**. Esta guía te indica los pocos números concretos que sí puedes ajustar.

---

# 3. Cómo modificar el diseño

## 3.0 Reglas para no romper nada

1. **Haz un commit antes de empezar** (sección 13) o copia la carpeta. Así puedes volver atrás.
2. **Prueba en vivo antes de editar.** En el navegador pulsa `F12` → pestaña *Elements* → selecciona el elemento → en *Styles* cambia valores y mira el resultado. Cuando te guste, copia el valor al archivo real.
3. **Cambia primero las variables** (`:root` en `css/base.css`), porque afectan a toda la página de forma coherente. Edita reglas sueltas solo si no hay variable.
4. **Un cambio a la vez:** guarda, recarga con `Ctrl + F5` y revisa.
5. **Nunca renombres clases ni ids** (ver sección 1.5).
6. **Respeta la sintaxis CSS:** cada propiedad termina en `;` y cada regla cierra con `}`.
7. Hay un puñado de valores **escritos directamente** (sin variable). En cada subsección te indico cuáles son y cómo encontrarlos.

## 3.1 El bloque de variables (el panel de control del diseño)

**Archivo:** `css/base.css` → busca `:root {`

```css
:root {
  /* colour — black dominates, violet is energy, white is voice */
  --void:       #030304;                    /* negro de fondo */
  --ink:        #08070c;                    /* negro un poco más claro (paneles) */
  --ink-2:      #0e0c15;
  --white:      #f5f2fb;                    /* blanco de textos */
  --mute:       rgba(245, 242, 251, .64);   /* texto secundario */
  --faint:      rgba(245, 242, 251, .5);    /* texto terciario */
  --line:       rgba(245, 242, 251, .1);    /* líneas finas */
  --line-2:     rgba(245, 242, 251, .22);   /* líneas más visibles */
  --violet:     #8f63ff;                    /* morado principal */
  --violet-hi:  #b79cff;                    /* morado claro (acentos) */
  --violet-lo:  #5b2fd1;                    /* morado oscuro */
  --glow:       rgba(143, 99, 255, .38);    /* resplandor morado */

  /* type */
  --display: "Instrument Serif", "Iowan Old Style", "Times New Roman", serif;
  --ui:      "Hanken Grotesk", system-ui, -apple-system, "Segoe UI", sans-serif;
  --code:    "JetBrains Mono", ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace;

  /* motion */
  --ease:     cubic-bezier(.76, 0, .18, 1);
  --ease-out: cubic-bezier(.16, 1, .3, 1);

  /* layout */
  --gutter: clamp(20px, 5vw, 72px);
  --maxw:   1440px;
  --nav-h:  72px;
  --radius: 18px;
}
```

## 3.2 Color de fondo

**Archivo principal:** `css/base.css`

* Cambia `--void: #030304;`. Lo usan `html`, `body`, la capa de proyecto (`.project`) y la "luna" del eclipse.
* Paneles ligeramente más claros que el fondo: `--ink` y `--ink-2`.

**Otros sitios donde el negro está escrito a mano** (cámbialos si cambias `--void` y quieres coherencia total):

| Dónde | Qué buscar | Qué es |
|---|---|---|
| `index.html` | `<meta name="theme-color" content="#030304">` | Color de la barra del navegador en móvil |
| `index.html` | `%23030304` (dentro del `<link rel="icon" …>`) | Fondo del favicon |
| `css/components.css` | `background: #050408;` (regla `.card__link`) | Fondo de la tarjeta |
| `css/intro.css` | `background: #000;` | Fondo de la pantalla de entrada |
| `css/project.css` | `#060509`, `#0b0911`, `#0d0a17` | Fondos del visor de código |
| `css/project.css` | `rgba(2,2,3,.97)` (regla `.lb`) | Fondo del visor de imágenes |
| `js/art.js` | `const BG = "#050408"` (arriba del archivo) | Fondo de las ilustraciones generadas |

Cómo localizarlos todos: `Ctrl + Shift + F` y busca `#030304`, `#050408`, `#000`, `rgba(3,3,4`.

## 3.3 Colores morado, blanco y gris

**Archivo:** `css/base.css`, bloque `:root`.

| Quiero cambiar… | Variable |
|---|---|
| El morado principal | `--violet` |
| El morado claro (línea del menú, botones activos, acentos) | `--violet-hi` |
| El morado oscuro | `--violet-lo` |
| El resplandor / sombras moradas | `--glow` |
| El blanco | `--white` |
| El gris del texto secundario | `--mute` (más claro = sube el último número, por ejemplo `.64` → `.8`) |
| El gris del texto terciario | `--faint` |
| El color de las líneas finas | `--line` y `--line-2` |

**Ejemplo — cambiar el morado a un azul violáceo.** Edita en `css/base.css`:

```css
  --violet:     #6b6cff;
  --violet-hi:  #9fa3ff;
  --violet-lo:  #3a3dd1;
  --glow:       rgba(107, 108, 255, .38);
```

**Importante — el morado también está escrito a mano en varios lugares.** Después de cambiar las variables, busca con `Ctrl + Shift + F` estos textos y reemplázalos por tu nuevo color:

| Buscar | Aparece en |
|---|---|
| `143, 99, 255` y `143,99,255` | `css/base.css`, `css/components.css`, `css/layout.css`, `css/project.css` |
| `183,156,255` | `css/base.css`, `css/components.css`, `css/project.css` |
| `#8f63ff`, `#b79cff`, `#5b2fd1` | `js/art.js` (constantes `VIOLET`, `HI`), `js/dimensions.js` |
| `#7446f5`, `#3a1a99`, `#f6f0ff`, `#f3ecff`, `#6d3df0` | Degradado del eclipse (`css/layout.css`), logo (`css/layout.css`), anillo de entrada (`css/intro.css`) |
| `#d9caff`, `#f0b6ff`, `#c9b6ff` | Colores de las palabras del código (`css/project.css`) |
| `#e9deff` | Destello al cruzar una dimensión (`.wipe` en `css/components.css`) |

> Las ilustraciones generadas (`js/art.js`) se guardan solo en memoria: tras cambiar sus colores basta con recargar la página.

**Para quitar el "grano de película"** (ruido sutil sobre toda la página): en `css/base.css`, regla `body::after`, cambia `opacity: .04;` por `opacity: 0;`.

## 3.4 Tipografías

**Archivos:** `css/base.css` (fuentes y variables) e `index.html` (si usas Google Fonts).

Las tres fuentes se declaran con `@font-face` al inicio de `css/base.css` y se asignan por variable:

| Variable | Fuente actual | Dónde se usa |
|---|---|---|
| `--display` | Instrument Serif | Títulos, números grandes, nombre de proyecto |
| `--ui` | Hanken Grotesk | Texto general, botones, menús |
| `--code` | JetBrains Mono | Visor de código |

**Opción A — usar una fuente de Google Fonts (la más fácil):**

1. En `index.html`, dentro de `<head>`, **antes** de las líneas `<link rel="stylesheet" href="css/base.css">`, añade:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;1,400&display=swap" rel="stylesheet">
```

2. En `css/base.css`, cambia la variable:

```css
  --display: "Cormorant Garamond", "Iowan Old Style", "Times New Roman", serif;
```

**Opción B — fuente propia (funciona sin internet):**

1. Convierte la fuente a `.woff2` y guárdala en `assets/fonts/`.
2. En `css/base.css`, copia un bloque `@font-face` existente y cambia `font-family` y la ruta `url(...)`.
3. Cambia la variable correspondiente (`--display`, `--ui` o `--code`).

**Precauciones:**

* La segunda línea del título de portada está en cursiva (`.hero__title .line:nth-child(2) .line__in { font-style: italic; }`). Elige una fuente que tenga cursiva o ese texto se verá "inclinado artificialmente".
* Los títulos usan `font-weight: 400`. Si tu fuente nueva tiene otros pesos, ajústalos en las reglas de título (`.hero__title`, `.sec__title`, `.card__title`, `.p-title`).
* Las fuentes incluidas solo traen caracteres latinos (acentos y ñ funcionan; alfabetos como cirílico o griego, no).

## 3.5 Tamaños de texto

Los tamaños usan `clamp(mínimo, ideal, máximo)`: el texto crece con el ancho de la pantalla pero nunca baja del mínimo ni sube del máximo. Para agrandar, sube los tres números; para achicar, bájalos.

| Elemento | Archivo | Regla y propiedad |
|---|---|---|
| Texto general | `css/base.css` | `body { font-size: 1rem; }` |
| Título de portada | `css/layout.css` | `.hero__title { font-size: clamp(3.3rem, 9.2vw, 9.4rem); }` (en móvil lo sustituye la regla dentro de `@media (max-width: 860px)`) |
| Texto bajo el título | `css/layout.css` | `.hero__lede { font-size: clamp(1.02rem, 1.4vw, 1.2rem); }` |
| Número grande (total) | `css/layout.css` | `.stats__num { font-size: clamp(8rem, 21vw, 19rem); }` |
| Números de estados | `css/layout.css` | `.stat__num { font-size: clamp(2.2rem, 3.6vw, 3.4rem); }` |
| Títulos de sección | `css/layout.css` | `.sec__title { font-size: clamp(2.6rem, 6.2vw, 5.8rem); }` |
| Título en tarjeta | `css/components.css` | `.card__title { font-size: clamp(2.3rem, 3.6vw, 3.8rem); }` |
| Título en tarjeta destacada | `css/components.css` | `.card--large .card__title { font-size: clamp(2.8rem, 5vw, 5.2rem); }` |
| Título de proyecto (página) | `css/project.css` | `.p-title { font-size: clamp(4.2rem, 13vw, 12.5rem); }` |
| Párrafo principal del proyecto | `css/project.css` | `.p-lead { font-size: clamp(1.5rem, 2.6vw, 2.35rem); }` |
| Código | `css/project.css` | `.code code { font-size: .86rem; }` |

**Ejemplo — título de portada más pequeño.** En `css/layout.css`:

```css
.hero__title { font-family: var(--display); font-weight: 400; font-size: clamp(2.8rem, 7.5vw, 7.5rem); ... }
```

(solo cambia los tres números dentro de `clamp`; deja el resto de la línea igual).

## 3.6 Márgenes y espacios

| Qué | Dónde | Cómo |
|---|---|---|
| Margen lateral de toda la página | `css/base.css` → `--gutter` | `clamp(20px, 5vw, 72px)` |
| Ancho máximo del contenido | `css/base.css` → `--maxw` | `1440px` |
| Alto de la barra de navegación | `css/base.css` → `--nav-h` | `72px` |
| Espacio vertical entre secciones | `css/layout.css` → `.sec { padding-block: clamp(72px, 10vw, 150px); }` | Sube o baja los números |
| Espacio de la sección de estadísticas | `css/layout.css` → `.stats-sec { padding-block: ... }` | |
| Separación entre tarjetas destacadas | `css/components.css` → `.featured { gap: clamp(16px, 2.2vw, 32px); }` | |
| Separación entre tarjetas de "All projects" | `css/components.css` → `.grid { gap: clamp(16px, 2vw, 28px); }` | |
| Espacio interior de la tarjeta | `css/components.css` → `.card__body { padding: clamp(18px, 2vw, 28px); }` | |
| Espacio entre secciones del proyecto | `css/project.css` → `.p-sec { padding-block: clamp(48px, 7vw, 104px); }` | |

## 3.7 Bordes y esquinas

* **Esquinas redondeadas globales:** `css/base.css` → `--radius: 18px;`. Lo usan las tarjetas (`.card`) y los portales (`.portal`).
* **⚠ Debe coincidir con JavaScript.** La animación de "tarjeta que se expande" también usa `18px` escrito a mano. Si cambias `--radius`, cambia también estos dos números en `js/project-view.js`:

```js
return `inset(${Math.max(0, rect.top)}px ... round 18px)`;     // función insetFor
const a = box(from, "18px"), b = box(to, "0px");                // función runFrame
```

  (Si no los cambias, nada se rompe: solo se verá un pequeño salto en las esquinas durante la animación.)
* **Botones y filtros** (forma de píldora): `border-radius: 999px;` en `.btn` (`css/base.css`), `.pill` y `.sort` (`css/components.css`). Pon `8px` para esquinas cuadradas suaves.
* **Imágenes y diagramas en proyectos:** `css/project.css` → `.p-media { border-radius: 14px; }`.
* **Visor de código:** `css/project.css` → `.code { border-radius: 14px; }`.
* **Grosor/color de bordes:** casi todos son `1px solid var(--line)` o `var(--line-2)`. Cambia esas variables en `:root` para afectar todos a la vez.

## 3.8 Sombras y efectos de iluminación

| Efecto | Archivo y regla | Qué cambiar |
|---|---|---|
| Resplandor de la tarjeta al pasar el cursor | `css/components.css` → bloque `@media (hover: hover)` → `.card:hover .card__link, .card__link:focus-visible { … box-shadow: … }` | Los valores de `box-shadow` |
| **Radio de la "linterna"** sobre la tarjeta | `css/components.css` → `.card__art--lit { mask-image: radial-gradient(circle 210px …` | `210px` (aparece dos veces: `-webkit-mask-image` y `mask-image`; cambia ambas) |
| Linterna en pantallas táctiles | `css/components.css` → `@media (hover: none)` → `circle 320px` | `320px` |
| Línea morada inferior de la tarjeta | `css/components.css` → `.card__link::after` | `height`, `box-shadow` |
| Luz del eclipse | `css/layout.css` → `.eclipse__glow`, `.eclipse__disc { box-shadow: 0 0 140px 12px rgba(143,99,255,.5); }` | Intensidad y tamaño |
| Luz del indicador del menú | `css/layout.css` → `.nav__light { box-shadow: 0 0 14px 1px var(--violet); }` | |
| Sombra del visor de código | `css/project.css` → `.code { box-shadow: … }` | |
| Luz del portal | `css/components.css` → `.portal__light` (radio `340px`) y `.portal:hover { box-shadow … }` | |

**Para quitar un efecto de iluminación sin romper nada:** cambia su `box-shadow` a `none;` (no borres la regla).

## 3.9 Transparencias

* **Texto secundario y líneas:** las variables `--mute`, `--faint`, `--line`, `--line-2` en `:root`. El último número de `rgba(…, .64)` es la opacidad (0 = invisible, 1 = opaco).
* **Qué tan oscura se ve una tarjeta "apagada":** `css/components.css` → `.card__art--base { filter: grayscale(1) brightness(.5) contrast(1.15); }`. Sube `.5` para verla más clara.
* **Degradado oscuro sobre la imagen de tarjeta (para que se lea el título):** `css/components.css` → `.card__veil { background: linear-gradient(...) }`.
* **Degradado sobre la imagen de cabecera del proyecto:** `css/project.css` → `.p-hero__shade`.
* **Fondo de la barra de navegación al hacer scroll:** `css/layout.css` → `.nav.is-scrolled { background: rgba(3,3,4,.72); }`.

## 3.10 Diseño de las tarjetas

**Archivo:** `css/components.css`. Estructura de una tarjeta (la genera `js/cards.js`):

```
.card
└── .card__link
    ├── .card__media  (dos imágenes: .card__art--base apagada y .card__art--lit iluminada)
    ├── .card__veil   (degradado oscuro)
    └── .card__body
        ├── .card__top    (estado .chip y fecha .card__date)
        └── .card__text   (título .card__title y bloque .card__reveal con subtítulo y meta)
```

| Quiero… | Dónde |
|---|---|
| Cambiar la altura de las tarjetas **destacadas** | `.featured .card { height: clamp(420px, 46vw, 660px); }` |
| Cambiar la proporción de las tarjetas de "All projects" | `.grid .card { aspect-ratio: 4 / 5; }` (prueba `1 / 1` o `3 / 4`) |
| Número de columnas en "All projects" | `.grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }` (en tablet `@media (max-width: 1000px)` → 2; móvil `@media (max-width: 760px)` → 1) |
| Cuánta inclinación tiene al pasar el cursor | `js/cards.js` → función `frame`: `(-py * 5)` y `(px * 6)` (grados). Pon `0` para no inclinar |
| Cuánto se desplaza la imagen (profundidad) | `js/cards.js` → `(-px * 14)` y `(-py * 14)` (píxeles). Pon `0` para quitarlo |
| Que el subtítulo esté siempre visible (no solo al pasar el cursor) | `css/components.css` → `.card__reveal { grid-template-rows: 1fr; opacity: 1; }` |
| Estilo de las tarjetas `COMING SOON` | bloque `.card--soon …` en el mismo archivo |

**Disposición de los destacados** (patrón escalonado de 7/5 columnas): las reglas `.featured .card:nth-child(4n+1)…` en `css/components.css`. Funciona con cualquier cantidad de destacados.

## 3.11 Tamaño y distribución de las imágenes

**Recomendación de archivo:** para `cover`, una imagen horizontal o cuadrada de **1600 px de ancho**, en `.jpg` o `.webp`, de menos de **400 KB**. La misma imagen se recorta (`object-fit: cover`) en la tarjeta (vertical) y en la cabecera del proyecto (horizontal), así que deja lo importante en el centro.

| Qué | Archivo y regla |
|---|---|
| Imagen de cabecera del proyecto | `css/project.css` → `.p-hero__img { object-fit: cover; }` y `.p-hero { min-height: min(92vh, 860px); }` |
| Rejilla de "Images" (2 columnas) | `css/project.css` → `.p-media-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }` |
| **Evitar que las imágenes de la galería se recorten** | `css/project.css` → `.p-media-grid--images .p-media img { aspect-ratio: 4 / 3; object-fit: cover; max-height: none; }` → cambia `cover` por `contain` |
| Diagramas a 2 columnas (hoy 1 columna) | `css/project.css` → `.p-media-grid--diagrams { grid-template-columns: minmax(0, 1fr); }` → `repeat(2, minmax(0, 1fr))` |
| Altura máxima de un diagrama | `css/project.css` → `.p-media img { max-height: 560px; }` |

## 3.12 Barra de navegación

**Archivos:** `css/layout.css` (aspecto), `js/config.js` (qué enlaces), `js/nav.js` (comportamiento).

| Quiero… | Dónde |
|---|---|
| Cambiar los nombres de los enlaces | `js/config.js` → `nav: [{ label: "Threshold", target: "top" }, …]` (cambia solo `label`) |
| Alto de la barra | `css/base.css` → `--nav-h` |
| Fondo al hacer scroll | `css/layout.css` → `.nav.is-scrolled` |
| Tamaño del logo/nombre | `css/layout.css` → `.nav__brand { font-size: 1.7rem; }` |
| Separación entre enlaces | `css/layout.css` → `.nav__links { gap: clamp(18px, 2.4vw, 38px); }` |
| Línea morada que se desliza | `css/layout.css` → `.nav__light` |
| Punto en que pasa a menú móvil | `css/layout.css` → `@media (max-width: 860px)` **y** `js/nav.js` → `matchMedia("(min-width: 861px)")`. Si cambias uno, cambia el otro (860 ↔ 861) |
| Menú móvil a pantalla completa | `css/layout.css` → `.menu`, `.menu a` |

> **Importante:** cada `target` de `nav` debe ser el `id` de una sección de `index.html` (`top`, `featured`, `archive`, `about`, `dimensions`). Si escribes un `target` que no existe, ese enlace no hará nada.

## 3.13 Apariencia de los botones

| Botón | Archivo y clase |
|---|---|
| Botones generales (Back, GitHub, enlaces) | `css/base.css` → `.btn`, `.btn--solid` (relleno blanco), `.btn--small` |
| Filtros de categoría y de orden | `css/components.css` → `.pill`, `.sort`, `.dir` |
| Botón *Copy* del código | `css/project.css` → `.code__copy`, `.code__copy.is-done` |
| Botones del visor de imágenes | `css/project.css` → `.lb button[data-act]` |
| Botón *Menu* móvil | `css/layout.css` → `.nav__toggle` |
| Botón *Skip* de la entrada | `css/intro.css` → `.intro__skip` |

Ejemplo — botones con esquinas menos redondeadas, en `css/base.css`, regla `.btn`:

```css
  border: 1px solid var(--line-2); border-radius: 10px; font-size: .92rem; font-weight: 500;
```

---

# 4. Cómo modificar las animaciones

## 4.0 Dos interruptores generales (útiles para probar)

1. **Desactivar casi todo el movimiento de JavaScript de una vez.** En `js/utils.js` busca:

```js
U.reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
```

   y cámbialo temporalmente por:

```js
U.reducedMotion = () => true;
```

   Con eso: la entrada se reduce a un destello breve, el eclipse deja de moverse, los contadores aparecen directamente, los proyectos se abren con un fundido, y los filtros reordenan sin deslizamiento. Los efectos de hover de CSS siguen activos. **Para revertirlo, restaura la línea original.**

2. **La página ya respeta la preferencia del sistema operativo** "Reducir movimiento": si la persona la tiene activada, `css/base.css` (bloque `@media (prefers-reduced-motion: reduce)` al final) anula transiciones CSS y `U.reducedMotion()` anula las de JavaScript. No tienes que hacer nada.

> **Dos tipos de animación:** las **de CSS** se cambian con `transition` / `animation` (valores en segundos: `.6s`) y las **de JavaScript** con números en **milisegundos** (`780`). 1 s = 1000 ms.

## 4.1 Animación de entrada

* **Archivos:** `js/intro.js` (secuencia), `css/intro.css` (aspecto), `js/config.js` (palabras y activación).
* **Duración real:** unos **4,2 segundos** (350 ms de arranque + 850 ms por palabra × 3 palabras + 250 ms de pausa + 1050 ms del "iris").

| Quiero… | Qué cambiar |
|---|---|
| **Desactivarla** | `js/config.js` → `intro: { enabled: false, … }` |
| Que se muestre en cada visita (no solo la primera de la sesión) | `js/config.js` → `oncePerSession: false` |
| Cambiar las palabras | `js/config.js` → `lines: ["Unknown space", "Initializing", "Entering"]` (puedes poner 1 a 5 palabras; la duración se ajusta sola) |
| Acortarla | `js/intro.js` → `const step = 850;` (tiempo que dura cada palabra). Con `600` dura ≈ 3,4 s |
| Más lenta/rápida la apertura final | `js/intro.js` → `dur = 1050` (milisegundos del "iris") |
| Velocidad con que se dibuja el anillo | `js/intro.js` → `{ duration: 1700, …}` dentro de `ring.animate(…)` |
| Suavidad del borde del "iris" | `css/intro.css` → `calc(var(--r) + 90px)` (dos veces). **Si lo cambias, cambia también `-90` y `+ 90` en `js/intro.js`**, en la línea `el.style.setProperty("--r", (-90 + e * (maxR + 90)).toFixed(1) + "px");` |

**Para verla de nuevo mientras pruebas:** usa el enlace **"Replay the entrance"** del pie de página, o en el navegador: `F12` → *Application* → *Session Storage* → borra la clave `pnb-intro-seen` y recarga.

**Cómo termina:** al acabar (o al saltarla con clic/tecla/botón *Skip*) se añade la clase `is-ready` al `<body>`, que dispara la aparición del título de portada. Si cambias la entrada, **no quites esa clase**: sin ella el título de portada queda oculto.

**Precaución:** la entrada no se muestra si la persona abre un enlace directo a un proyecto (`#/project/…`). Es intencional.

## 4.2 Transiciones entre secciones

Lo que existe (no hay "aparición al hacer scroll" de las secciones; eso **no está implementado**):

| Efecto | Archivo | Cómo ajustarlo |
|---|---|---|
| Desplazamiento suave al pulsar un enlace del menú | `css/base.css` → `html { scroll-behavior: smooth; }` y `js/nav.js` → `scrollIntoView({ behavior: … })` | Para scroll instantáneo: en `css/base.css` pon `scroll-behavior: auto;` y en `js/nav.js` cambia `U.reducedMotion() ? "auto" : "smooth"` por `"auto"` |
| Línea fina que se "dibuja" al llegar a una sección | `css/base.css` → `.rule { transition: transform 1.4s var(--ease); }` | Cambia `1.4s`. Para desactivar: `transform: none; transition: none;` |
| Indicador morado del menú que se desliza | `css/layout.css` → `.nav__light { transition: transform .6s …, width .6s … }` | Cambia `.6s` |
| La página "retrocede" cuando se abre un proyecto | `css/layout.css` (última regla) → `#app { transition: transform .8s var(--ease), opacity .8s; }` y `.is-project-open #app { transform: scale(.975); opacity: .3; }` | Para quitarlo: `.is-project-open #app { transform: none; opacity: 1; }` |

## 4.3 Efectos de las tarjetas al pasar el cursor

* **Archivos:** `css/components.css` (efectos visuales), `js/cards.js` (inclinación y posición de la linterna).

| Efecto | Dónde | Duración / valor |
|---|---|---|
| Inclinación 3D de la tarjeta | `.card__link { transition: transform .6s … }` y `js/cards.js` (`* 5`, `* 6`) | `.6s`; grados |
| Desplazamiento de la imagen | `.card__art { transition: transform .9s … }` y `js/cards.js` (`* 14`) | `.9s`; píxeles |
| Aparición de la imagen iluminada | `.card__art { transition: …, opacity .6s, … }` (la clase `.card__art--lit` pasa de `opacity: 0` a `1` dentro de `@media (hover: hover)`) | `.6s` |
| Aparición del subtítulo | `.card__reveal { transition: grid-template-rows .6s …, opacity .5s; }` | `.6s` / `.5s` |
| Línea morada inferior | `.card__link::after { transition: transform .8s … }` | `.8s` |
| Borde y resplandor | `.card__link { transition: …, border-color .5s, box-shadow .6s; }` | |

* **Desactivar la inclinación y la profundidad:** en `js/cards.js`, función `frame`, multiplica por `0` (`(-py * 0)`, `(px * 0)`, `(-px * 0)`, `(-py * 0)`). La linterna sigue funcionando.
* **Desactivar toda la reacción al cursor:** en `js/cards.js`, dentro de `create`, comenta la línea `if (U.canHover()) bindPointer(card, link); else observer().observe(card);` (añade `//` al inicio). Los efectos de CSS puro (`:hover`) seguirán.
* **En pantallas táctiles** no existe el hover: el equivalente es la clase `.is-lit` que `js/cards.js` pone a la tarjeta cuando pasa por el centro de la pantalla (`rootMargin: "-32% 0px -32% 0px"` en la función `observer`). Se estiliza en `@media (hover: none)` de `css/components.css`.
* **Precaución:** no pongas `transition: all` en `.card`; el reordenamiento de filtros anima la propiedad `transform` de la tarjeta desde JavaScript (`js/archive.js`) y podría entrar en conflicto.

## 4.4 Transición de las tarjetas al abrir un proyecto

* **Archivo:** `js/project-view.js` (casi todo), `css/project.css` (aparición de textos), `css/layout.css` (la página que retrocede).

Cómo funciona: la tarjeta se convierte en un recorte (`clip-path`) que crece hasta ocupar la pantalla, y un marco morado (`#project-frame`) viaja con ella.

| Quiero… | Qué cambiar |
|---|---|
| **Duración de apertura** | `js/project-view.js` (arriba) → `const OPEN_MS = 780` |
| **Duración de cierre** | `js/project-view.js` → `CLOSE_MS = 560` |
| Curva de aceleración | `js/project-view.js` → `const EASE = "cubic-bezier(.76,0,.18,1)"` |
| Zoom de la imagen al abrir | `js/project-view.js` → `[{ transform: "scale(1.28)" }, { transform: "scale(1)" }]` y `OPEN_MS + 500` |
| Aspecto del marco morado | `css/project.css` → `.project-frame` |
| Que el título/subtítulo aparezcan después | `css/project.css` → `.project.is-opening .p-title { animation-delay: .25s; }` (y `.p-subtitle` `.38s`, `.p-facts` `.5s`); duración `animation: rise 1s` |
| **Desactivar la transición** | `OPEN_MS = 1` y `CLOSE_MS = 1` en `js/project-view.js`, y en `css/project.css` cambia `animation: rise 1s var(--ease-out) both;` por `animation: none;` |

**Precauciones:**

* Cambia siempre `OPEN_MS`/`CLOSE_MS` (no el `duration` suelto de una línea): el código espera ese tiempo antes de dar por terminada la animación y quitar la clase `is-opening`.
* Si abres un proyecto desde un enlace directo, con el botón Atrás/Adelante o con "Keep exploring", no hay tarjeta de origen: la apertura es un fundido y el cierre es un desplazamiento hacia abajo. Eso es normal.
* El valor `18px` de esquinas debe coincidir con `--radius` (sección 3.7).

## 4.5 Animaciones de los contadores

* **Archivo:** `js/stats.js` (números) y `css/layout.css` (barras).

| Quiero… | Qué cambiar |
|---|---|
| Duración del conteo | `js/stats.js` → función `countUp` → `const dur = 1100;` (ms) |
| Retraso entre contadores | `js/stats.js` → `250 + i * 110` (dentro de `play`) |
| Cuándo se activa (qué parte debe verse) | `js/stats.js` → `{ threshold: 0.35 }` (0.35 = cuando se ve el 35 % de la sección) |
| Duración de las barras | `css/layout.css` → `.stat__bar i { transition: transform 1.5s var(--ease) .3s; }` |
| **Desactivar** | `js/stats.js` → `const dur = 1;` y en `css/layout.css` `.stat__bar i` pon `transition: none;` |

Los números **siempre** terminan en el valor correcto aunque cambies la duración, porque el valor final proviene de los datos (sección 8).

## 4.6 Efectos de aparición de textos e imágenes

| Efecto | Archivo y regla | Ajuste |
|---|---|---|
| Título de portada (cada línea "sube") | `css/layout.css` → `.hero__title .line__in { transform: translateY(108%); transition: transform 1.3s var(--ease-out); transition-delay: calc(var(--i) * .14s + .15s); }` | `1.3s` = duración; `.14s` = retraso entre líneas |
| Texto bajo el título | `css/layout.css` → `.hero__lede { … transition: opacity 1.2s ease .8s, transform 1.2s var(--ease-out) .8s; }` | El último `.8s` es el retraso |
| "Scroll to enter the archive" | `css/layout.css` → `.hero__cue { … transition: opacity 1.2s ease 1.4s; }` y animación `cue 3.4s` | |
| Título/subtítulo/datos en proyecto | `css/project.css` → `@keyframes rise` y reglas `.project.is-opening …` | Ver 4.4 |
| Imagen del visor al cambiar de foto | `css/project.css` → `.lb__img.is-in { animation: lbin .5s … }` | `.5s` |
| Zoom suave de miniaturas en proyecto | `css/project.css` → `.p-media img { transition: transform .9s … }` | |
| **Mostrar el título de portada sin animación** | En `css/layout.css`, `.hero__title .line__in`: cambia `transform: translateY(108%);` por `transform: none;`; y en `.hero__lede` y `.hero__cue` cambia `opacity: 0;` por `opacity: 1;` | |

Las imágenes de las tarjetas se cargan de forma diferida (`loading="lazy"`) y **no tienen animación de aparición propia**.

## 4.7 Animaciones de la ventana de detalles (página de proyecto)

| Efecto | Dónde | Ajuste |
|---|---|---|
| Apertura/cierre | Ver 4.4 | `OPEN_MS`, `CLOSE_MS` |
| Barra superior que se vuelve sólida | `css/project.css` → `.p-bar { transition: background .4s, border-color .4s; }` y `.p-bar__title { transition: opacity .4s; }` | El umbral (`> 80` píxeles de scroll) está en `js/project-view.js`: `scroller.scrollTop > 80` |
| Pasar de un proyecto a otro ("Keep exploring") | `js/project-view.js` → en `open`: `duration: reduce ? 1 : 180` (sale) y `360` (entra) | |
| Sobre la tarjeta "Keep exploring" | `css/project.css` → `.p-next__art`, `.p-next__title` | |
| Visor de imágenes (aparecer/cerrar) | `css/project.css` → `.lb { transition: opacity .26s ease; }`. **En `js/lightbox.js`, función `close`, el `260` debe coincidir** con ese `.26s` | |
| Zoom del visor | `js/lightbox.js` → `img.style.transition = animate ? "transform .35s …"` | `.35s` |
| Documentos y etiquetas (hover) | `css/project.css` → `.p-docs a`, `.p-tags li` | |

## 4.8 Animaciones de los filtros y la portada (extras)

* **Filtros y ordenamiento** (`js/archive.js`, función `update`): salida `duration: 220`, deslizamiento `duration: 620`, entrada `duration: 520, delay: 80 + i * 50`. Para desactivarlas, pon `220`→`1`, `620`→`1`, `520`→`1`.
* **Eclipse de la portada** (`js/hero.js`): velocidad de seguimiento `0.045` (más alto = más rápido); amplitud con el cursor `tx * 7` y `ty * 5`; deriva automática `Math.sin(t * 0.35) * 3.2`. Pon los multiplicadores en `0` para dejarlo fijo. La órbita del punto es `css/layout.css` → `animation: orbit 120s linear infinite;` (pon `animation: none;` para detenerla).
* **Punto pulsante del estado IN DEVELOPMENT:** `css/base.css` → `.chip--in-development::before { animation: beat 2.8s … }`.


---

# 5. Cómo agregar un proyecto nuevo

Esta sección te lleva de cero a un proyecto publicado en la página. Usaremos un proyecto **ficticio** llamado **Nocturne Clock** (un reloj de escritorio que solo enciende su pantalla cuando oscurece). Este ejemplo fue probado con la estructura real de la página.

> **Resumen de 4 pasos:** (1) crear la carpeta → (2) meter los archivos → (3) registrar el proyecto en `data/projects.js` → (4) recargar y comprobar. No tocas ningún otro archivo.

## 5.1 Qué vas a crear al final

```
assets/projects/nocturne-clock/        ← carpeta del proyecto (el nombre = el "id")
├── cover.jpg                          ← imagen principal
├── images/
│   └── prototype-01.jpg               ← imágenes adicionales
├── diagrams/
│   └── circuit.svg                    ← diagramas
├── code/
│   └── sensor.py                      ← código que quieres mostrar (opcional, ver paso 4)
└── docs/
    └── manual.pdf                     ← documentación
```

Y una entrada nueva dentro de `data/projects.js`.

> Los nombres de las subcarpetas (`images`, `diagrams`, `code`, `docs`) son una **convención** para mantener el orden. La página no las exige: lo que importa es que la ruta que escribas en `data/projects.js` coincida con dónde guardaste el archivo.

## 5.2 Paso a paso

### Paso 1 — Crear la carpeta del proyecto

1. En VS Code, en el panel izquierdo (Explorador), abre `assets` → `projects`.
2. Clic derecho sobre `projects` → **New Folder** → escribe `nocturne-clock`.

**Reglas para el nombre de la carpeta (que será también el `id`):**

* Solo letras minúsculas, números, guiones `-` o guion bajo `_`. **Sin espacios, sin acentos, sin puntos.**
* Debe ser único (no puede repetirse entre proyectos).
* Una vez publicado, evita cambiarlo: el `id` forma parte del enlace del proyecto (`#/project/nocturne-clock`).

> ⚠ Si usas espacios (`mi proyecto`), la tarjeta aparece pero **no se puede abrir**. Es una limitación real de las rutas (solo aceptan letras, números, `-` y `_`).

### Paso 2 — Colocar las imágenes

* **Imagen principal (la que ves en la tarjeta y en la cabecera):** guárdala como `assets/projects/nocturne-clock/cover.jpg`.
  * Tamaño recomendado: 1600 px de ancho, menos de 400 KB. Deja lo importante en el centro, porque se recorta (sección 3.11).
* **Imágenes adicionales:** `assets/projects/nocturne-clock/images/prototype-01.jpg`, etc.

### Paso 3 — Colocar los diagramas

Guárdalos en `assets/projects/nocturne-clock/diagrams/`. Formatos que funcionan: `.svg`, `.png`, `.jpg`, `.webp`.

> Los diagramas se muestran sobre un fondo casi negro. Si tu diagrama es de líneas negras sobre fondo transparente, no se verá; expórtalo con fondo (blanco u oscuro).

### Paso 4 — Guardar el código que quieres mostrar

Tienes **dos formas**; elige una por cada fragmento:

| Forma | Cómo | Cuándo usarla |
|---|---|---|
| **A. Escrito dentro de `data/projects.js`** | Campo `code` con el texto entre comillas invertidas | Fragmentos cortos. No necesita servidor. |
| **B. Archivo aparte** | Guardas `assets/projects/nocturne-clock/code/sensor.py` y en los datos pones `src: "code/sensor.py"` | Código largo o que contiene comillas invertidas (`` ` ``), `${` o barras invertidas `\`. **Recomendada.** |

> La forma B necesita que la página se sirva desde un servidor (Vercel, Live Server, `python -m http.server`). Si abres `index.html` con doble clic (`file://`), el navegador bloquea la lectura y verás un mensaje "Could not load…".

### Paso 5 — Colocar la documentación

Guárdala en `assets/projects/nocturne-clock/docs/` (por ejemplo `manual.pdf`). Se abrirá en una pestaña nueva al pulsarla.

### Paso 6 — Registrar el proyecto en el archivo de datos

1. Abre `data/projects.js`.
2. Baja hasta el final del archivo. Verás el último proyecto (`project-08`) y luego `];`.
3. **Después de la llave de cierre `},` del último proyecto y antes de `];`**, pega tu nuevo proyecto.
4. Comprueba que **cada proyecto termina en `},`** (con coma).

**Ejemplo completo y funcional (cópialo tal cual para probar):**

```js
  {
    id: "nocturne-clock",
    title: "Nocturne Clock",
    subtitle: "A clock that only shows the time once the room gets dark.",
    category: "Automation & Robotics",
    type: "Hardware",
    status: "IN DEVELOPMENT",
    date: "2026-10",
    featured: true,
    relevance: 8,
    cover: "cover.jpg",
    github: "https://github.com/your-username/nocturne-clock",

    description: [
      "Nocturne Clock is a small desk clock with a light sensor. In daylight the display stays off; when the room darkens, the time fades in.",
      "The firmware is written in `C++` and runs on a **microcontroller** with very low power draw.",
    ],

    process: [
      { title: "First prototype", text: "A breadboard, a light sensor and a small display." },
      { title: "Calibrating the sensor", text: "Choosing the darkness threshold that feels right in a real room." },
      { title: "Today", text: "Designing the enclosure and writing the build manual." },
    ],

    technologies: ["C++", "Arduino", "LDR sensor", "OLED display"],

    code: [
      {
        title: "clock.ino",
        language: "cpp",
        code: `void loop() {
  if (analogRead(A0) < 300) showTime();
}`,
      },
      { title: "sensor.py", language: "python", src: "code/sensor.py" },
    ],

    diagrams: [
      { src: "diagrams/circuit.svg", caption: "Circuit overview." },
    ],

    images: [
      { src: "images/prototype-01.jpg", caption: "First prototype on the breadboard." },
      { art: "rings", caption: "Generated study of the display glow." },
    ],

    docs: [
      { title: "Build manual", src: "docs/manual.pdf", type: "PDF" },
    ],

    links: [
      { label: "Write-up", url: "https://example.com/nocturne" },
    ],
  },
```

Dónde queda dentro del archivo:

```js
  {
    id: "project-08",
    title: "Project 08",
    ...
    art: "scatter",
  },                         ← este es el último proyecto existente (con coma)

  {                          ← AQUÍ pegas el nuevo
    id: "nocturne-clock",
    ...
  },
];                           ← cierre del arreglo: no lo borres
```

> **El orden dentro del archivo no importa.** La página ordena sola por relevancia, fecha, estado o tipo. Pon los nuevos al final para encontrarlos fácil.

### Paso 7 — Asignar una categoría

`category` debe ser **exactamente** una de las tres que existen (mayúsculas, espacios y el símbolo `&` incluidos):

```js
category: "Software & Programming",
category: "Automation & Robotics",
category: "Design & Experimentation",
```

(Se definen en `js/config.js` → `categories`. Para crear una nueva, ver sección 8.5.)

### Paso 8 — Establecer el estado

`status` debe ser exactamente uno de estos (en mayúsculas):

`"COMPLETED"`, `"IN DEVELOPMENT"`, `"EXPERIMENTAL"`, `"CONCEPT"`, `"ARCHIVED"`, `"COMING SOON"`.

Ver sección 7 para saber cuándo usar cada uno.

### Paso 9 — Indicar la fecha de creación

```js
date: "2026-10",     // año y mes  → se muestra "Oct 2026"
date: "2026",        // solo año   → se muestra "2026"
```

El formato debe empezar por **cuatro dígitos de año**; con mes: `AAAA-MM`. Formatos como `"10/2026"` o `"octubre 2026"` **no funcionan** (la fecha se ignora).

### Paso 10 — Marcarlo como destacado

```js
featured: true,      // aparece en FEATURED PROJECTS
featured: false,     // solo aparece en All projects (también si omites el campo)
```

Los destacados se ordenan por `relevance` (de mayor a menor). Los proyectos `COMING SOON` nunca aparecen en destacados, aunque pongas `featured: true`.

### Paso 11 — Añadir un enlace de GitHub

```js
github: "https://github.com/tu-usuario/nocturne-clock",
```

Con eso aparece **automáticamente** un botón "GitHub" en la barra superior del proyecto y un botón "View on GitHub" en la sección "Links". Escribe la URL completa con `https://`. Si omites el campo, no aparece ningún botón.

### Paso 12 — Añadir una descripción

```js
description: [
  "First paragraph.",
  "Second paragraph, in a quieter color.",
],
```

* Cada elemento del arreglo es un párrafo. También puedes usar un solo texto entre comillas.
* El **primer** párrafo se ve en blanco; los siguientes, en gris.
* Formato permitido dentro del texto: `` `código` `` (cuadro morado) y `**negrita**`. Nada más (no hay enlaces ni listas dentro de la descripción).
* Si escribes una comilla doble `"` dentro del texto, usa `\"` o cambia a comillas simples en el contenido.

### Paso 13 — Documentar el proceso de desarrollo

Dos formatos válidos:

```js
// A) Línea de tiempo con pasos (recomendado)
process: [
  { title: "First prototype", text: "A breadboard and a sensor." },
  { title: "Today",           text: "Writing the build manual." },
],

// B) Texto corrido (se separa en párrafos con una línea en blanco: \n\n)
process: "Prototype first, then the enclosure.\n\nFinally, the documentation.",
```

El **último** paso de la línea de tiempo se resalta con un punto luminoso (suele ser "Today").

### Paso 14 — Comprobar que aparece correctamente

1. Guarda los cambios (`Ctrl + S`).
2. Abre la página (sección 12) y recarga con `Ctrl + F5`.
3. Pulsa `F12` → pestaña **Console**. **No debe haber mensajes rojos.** Un mensaje amarillo `[Penumbra] Skipped a project…` significa que tu proyecto fue descartado (ver 5.4).
4. Lista de comprobación:

| Comprobación | Dónde mirar |
|---|---|
| El contador total subió en 1 | Sección de estadísticas |
| El estado correcto tiene su contador | Lista de estados junto al número grande |
| La tarjeta aparece en "All projects" | Sección All projects |
| Aparece en "Featured" (si `featured: true`) | Sección Featured |
| Se filtra bien | Pulsa el botón de su categoría |
| Al pulsar la tarjeta se abre el proyecto | Animación de expansión |
| Se ve la imagen principal | Cabecera del proyecto y tarjeta |
| Aparecen las secciones Overview, Process, Technologies, Code, Diagrams, Images, Documentation, Links | Dentro del proyecto |
| El botón *Copy* copia el código | Sección Code |
| Las imágenes se amplían al pulsarlas | Sección Diagrams / Images |
| Los enlaces abren la dirección correcta | GitHub, documento, Links |
| Se ve bien en móvil | `F12` → icono de móvil/tablet (`Ctrl + Shift + M`) |

## 5.3 Campos obligatorios y opcionales

**Obligatorios (sin ellos el proyecto no funciona):**

| Campo | Tipo | Qué ocurre si lo omites o está mal |
|---|---|---|
| `id` | texto único, solo letras/números/`-`/`_` | Si falta o está repetido, el proyecto se **descarta** y aparece un aviso amarillo en la consola. Con espacios o puntos, la tarjeta aparece pero **no abre** |
| `title` | texto | El proyecto se **descarta** |
| `status` | uno de los 6 estados, exacto | Si no coincide (por ejemplo `"TERMINADO"` o `"completed"`), el proyecto se **descarta** |

**Muy recomendados (técnicamente opcionales):**

| Campo | Qué ocurre si lo omites |
|---|---|
| `subtitle` | La tarjeta y la cabecera no muestran la línea descriptiva |
| `category` | El proyecto **solo aparece bajo "All"**, nunca al filtrar por categoría; en la ficha, "Category" queda vacío |
| `date` | Sin fecha en la tarjeta; en la ficha aparece "—"; al ordenar por fecha queda como el más antiguo |
| `relevance` | Vale `0`: queda al final al ordenar por relevancia |

**Opcionales:**

| Campo | Qué ocurre si lo omites |
|---|---|
| `type` | No se muestra "Type"; al ordenar por tipo queda primero (vacío) |
| `featured` | Equivale a `false` |
| `cover` | Se genera automáticamente una ilustración |
| `art` | Se elige una ilustración según el `id` (siempre la misma para ese proyecto) |
| `github` | No aparece botón de GitHub |
| `description` | La ficha muestra: "The description for this project has not been written yet." |
| `process`, `technologies`, `code`, `diagrams`, `images`, `docs`, `links` | La sección correspondiente **no se muestra** |
| `openable` | Solo para `COMING SOON`: ponlo en `true` si quieres que se pueda abrir |

## 5.4 Si el proyecto no aparece

Abre la consola (`F12` → Console):

* **Error rojo con nombre de archivo y línea** (por ejemplo `Uncaught SyntaxError: Unexpected token '{'` en `projects.js`) → casi siempre falta una coma `,` entre dos proyectos, o sobra/falta una llave. Ver sección 14.2.
* **Aviso amarillo `[Penumbra] Skipped a project: …`** → el mensaje dice la causa (id repetido, falta título, estado no reconocido).
* **Aviso amarillo `category "…" is not listed in config.js`** → la categoría está mal escrita; el proyecto aparece, pero solo bajo "All".

---

# 6. Cómo modificar proyectos existentes

Todo se hace en **`data/projects.js`**: busca el proyecto con `Ctrl + F` (por ejemplo `id: "ava"`), cambia el valor y guarda. Los ejemplos usan el proyecto **AVA** tal como está registrado. Cuando un ejemplo menciona un archivo nuevo (`cover.jpg`, `images/dashboard.jpg`, `docs/user-guide.pdf`), ese archivo **todavía no existe**: tendrías que añadirlo tú a la carpeta `assets/projects/ava/`.

## 6.1 Cambiar el nombre

```js
// antes
title: "AVA",
// después
title: "AVA 2",
```

Cambia solo `title`. **No cambies `id`** (afecta al enlace y a la carpeta de imágenes). Si de verdad quieres cambiar el `id`: renombra la carpeta `assets/projects/ava/` al mismo nombre nuevo y cambia el `id` en el registro, a la vez.

## 6.2 Modificar la descripción

```js
description: [
  "AVA is now a full system with a plugin architecture.",
  "Version 2 adds a dashboard for observing every module.",
],
```

## 6.3 Cambiar la imagen principal

AVA hoy usa una ilustración generada (`art: "orbits"`). Para usar una imagen tuya:

1. Guarda `cover.jpg` en `assets/projects/ava/`.
2. En el registro, añade `cover` (puedes dejar `art`; `cover` tiene prioridad):

```js
cover: "cover.jpg",
```

Para volver a la ilustración, borra la línea `cover`. Para cambiar solo el estilo de la ilustración: `art: "eclipse"` (opciones: `eclipse`, `orbits`, `waves`, `lattice`, `rings`, `scatter`).

> Si reemplazas el archivo por otro con **el mismo nombre** y sigues viendo la antigua, es la caché del navegador: `Ctrl + F5`. En producción, usa un nombre nuevo (`cover-v2.jpg`).

## 6.4 Agregar más imágenes

Guarda el archivo en `assets/projects/ava/images/` y añádelo a `images`:

```js
images: [
  { art: "eclipse", caption: "Early visual study for the interface." },
  { art: "lattice", caption: "Data density map used while designing the dashboard." },
  { src: "images/dashboard.jpg", caption: "The first dashboard prototype." },   // ← nueva
],
```

## 6.5 Actualizar el proceso de desarrollo

Añade un paso al arreglo `process` (el último de la lista se resalta; deja "Today" al final):

```js
process: [
  { title: "First sketch", text: "A single script and a list of questions…" },
  { title: "Splitting it into modules", text: "…" },
  { title: "Making it observable", text: "…" },
  { title: "Plugin system", text: "Modules can now be installed without touching the core." },   // ← nuevo
  { title: "Today", text: "Hardening the core and writing the documentation…" },
],
```

## 6.6 Cambiar la categoría

```js
category: "Design & Experimentation",
```

Debe ser exactamente una de las categorías de `js/config.js`.

## 6.7 Cambiar el estado

```js
status: "COMPLETED",
```

Los contadores, los chips y la leyenda se actualizan solos.

## 6.8 Modificar la fecha

```js
date: "2026-03",
```

## 6.9 Marcar o quitar de destacados

```js
featured: true,     // destacar
featured: false,    // quitar (o borra la línea)
```

Para decidir **el orden** entre destacados, sube o baja `relevance` (mayor = antes).

## 6.10 Añadir o modificar el enlace de GitHub

```js
github: "https://github.com/tu-usuario/ava",      // añadir o cambiar
```

Para quitar el botón, borra la línea. Enlaces adicionales (artículo, demo…):

```js
links: [
  { label: "Live demo", url: "https://example.com/ava-demo" },
],
```

## 6.11 Actualizar la documentación

1. Copia el archivo a `assets/projects/ava/docs/`.
2. Regístralo:

```js
docs: [
  { title: "Design notes", src: "docs/design-notes.md", type: "Markdown" },
  { title: "User guide",   src: "docs/user-guide.pdf",  type: "PDF" },       // ← nuevo
],
```

`type` es solo una etiqueta de texto que se muestra a la derecha (puedes escribir lo que quieras).

---

# 7. Cómo agregar proyectos próximos y experimentales

## 7.1 Los seis estados

| Estado | Cuándo usarlo | Se puede abrir | Cuenta en el total |
|---|---|---|---|
| `IN DEVELOPMENT` | Lo estás construyendo ahora | Sí | Sí |
| `EXPERIMENTAL` | Una prueba o experimento sin promesa de continuidad | Sí | Sí |
| `COMPLETED` | Terminado y funcionando | Sí | Sí |
| `CONCEPT` | Una idea ya pensada, aún sin construir | Sí | Sí |
| `ARCHIVED` | Retirado pero conservado | Sí | Sí |
| `COMING SOON` | Una pista de algo que está por llegar; sin contenido | **No** (salvo `openable: true`) | **No** (se cuenta aparte) |

Los significados cortos que ve el visitante (leyenda en "About this space") salen de `js/config.js` → `statuses` → `meaning`.

**Diferencia clave entre `CONCEPT` y `COMING SOON`:** `CONCEPT` es un proyecto real con ficha (puedes escribir descripción, imágenes de bocetos…). `COMING SOON` es solo una tarjeta "misteriosa" con título y una frase, sin página de detalle.

## 7.2 Proyecto que todavía no has comenzado — como `COMING SOON` (solo una pista)

```js
{
  id: "project-09",
  title: "Project 09",
  subtitle: "Something is forming here.",
  category: "Software & Programming",
  status: "COMING SOON",
  date: "2027-01",
  relevance: 0,
},
```

Cómo se ve: tarjeta con la imagen difuminada, borde punteado, el título "Project 09" en cursiva y la frase. No es clicable. No cuenta en el total (aparece como "COMING SOON" en la lista de estados). No aparece en destacados.

Puedes poner el nombre real si quieres que se vea qué viene (`title: "Nocturne Clock"`), o mantener "Project NN" para generar intriga.

## 7.3 Proyecto que no has comenzado — como `CONCEPT` (con ficha)

```js
{
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
  description: "Still only a sketch: a screen that remembers where you looked and slowly fades it.",
  technologies: ["WebGL", "Eye tracking (maybe)"],
},
```

Este ya existe en `data/projects.js` y sirve de modelo: tiene ficha, pero poco contenido.

## 7.4 Proyecto en desarrollo

```js
{
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
  description: "A group of servos that coordinate through a shared clock to play simple rhythms.",
  process: "Currently solving the hardest part: keeping every motor in time when the supply voltage dips.",
  technologies: ["C++", "I²C", "Servo control"],
},
```

(También existe ya en el archivo.) Cuando tengas más material, añade `process` como lista, `code`, `images`, etc.

## 7.5 Cómo "avanzar" un proyecto de estado

El ciclo natural es `COMING SOON` → `CONCEPT` → `IN DEVELOPMENT` → `COMPLETED`. Para avanzar basta con cambiar `status` y añadir el contenido nuevo; **no hay que crear nada más**. Los contadores se actualizan solos.

Para un proyecto `COMING SOON` que ya quieras poder abrir sin cambiar su estado: añade `openable: true,`.

---

# 8. Cómo funcionan los filtros y los contadores

Todo se calcula **en el navegador, cada vez que se carga la página**, a partir de `data/projects.js`. No hay nada que sumar a mano.

## 8.1 Cómo se actualizan los contadores

`js/stats.js` → función `compute(projects)`:

1. Toma la lista de proyectos válidos.
2. **Total** = todos los proyectos **excepto** los de estado `COMING SOON`.
3. Cuenta cuántos proyectos hay por cada estado.
4. Muestra una fila por cada estado que tenga **al menos 1 proyecto**, ordenadas según `order` en `js/config.js` → `statuses`.
5. Anima los números cuando la sección entra en pantalla.

## 8.2 Cómo se determina el total

* Cuentan `IN DEVELOPMENT`, `EXPERIMENTAL`, `COMPLETED`, `CONCEPT` y `ARCHIVED`.
* **No** cuenta `COMING SOON` (son pistas, no proyectos). Aparece en su propia fila.

Con los proyectos de ejemplo: 7 proyectos (2 en desarrollo + 1 experimental + 3 completados + 1 concepto) y 1 `COMING SOON`.

## 8.3 Completados y en desarrollo

Son simplemente los proyectos con `status: "COMPLETED"` y `status: "IN DEVELOPMENT"`. Si cambias el estado de un proyecto, ambos números cambian al recargar. La barra bajo cada número muestra la proporción respecto al total.

> **Diferencia que puede parecer un error pero no lo es:** el botón de filtro **"All 08"** (en "All projects") cuenta *todas las tarjetas*, incluida la de `COMING SOON`; el número grande de estadísticas muestra **07**, porque excluye los `COMING SOON`.

## 8.4 Cómo se asignan las categorías y cómo funcionan los filtros

* Cada proyecto lleva `category: "…"` con el texto exacto.
* Los botones de filtro se generan **desde `js/config.js` → `categories`**, no desde los proyectos. Cada botón muestra cuántos proyectos hay en esa categoría.
* Al pulsar un botón, `js/archive.js` muestra solo los proyectos cuya `category` es **idéntica** al texto del botón (comparación exacta: mayúsculas, espacios y `&` incluidos).
* Los que salen se desvanecen; los que se quedan se deslizan a su nueva posición; los que entran aparecen con un ligero zoom.
* Los destacados **no** se ven afectados por el filtro (el filtro es solo de "All projects").

## 8.5 Añadir una categoría nueva

**Solo hay que modificar un archivo:** `js/config.js`.

```js
categories: [
  "Software & Programming",
  "Automation & Robotics",
  "Design & Experimentation",
  "Music & Sound",                 // ← nueva
],
```

Luego, en los proyectos que correspondan: `category: "Music & Sound",`. El botón de filtro y su contador aparecen solos. No hay que tocar CSS ni JavaScript.

* Para **renombrar** una categoría: cámbiala en `config.js` **y** en cada proyecto que la use (búscala con `Ctrl + Shift + F`). Los que no se actualicen solo aparecerán bajo "All".
* Para **eliminar** una: bórrala de `config.js` y cambia la categoría de sus proyectos.
* En móvil, los botones de categoría forman una fila que se desplaza horizontalmente; con muchas categorías sigue funcionando.

## 8.6 Cómo funciona el ordenamiento

En `js/archive.js`, el objeto `SORTS` define las cuatro opciones:

| Botón | Criterio | Dirección inicial | Desempate |
|---|---|---|---|
| **Relevance** | Campo `relevance` | Mayor primero | Fecha más reciente, luego título |
| **Date** | Campo `date` | Más reciente primero | Título |
| **Status** | Orden `order` de cada estado en `js/config.js` (`IN DEVELOPMENT`, `EXPERIMENTAL`, `COMPLETED`, `CONCEPT`, `COMING SOON`, `ARCHIVED`) | Ese orden | Fecha, título |
| **Type** | Campo `type`, en orden alfabético | A → Z | Fecha, título |

* El botón de flechas (⇅) invierte la dirección.
* Los `COMING SOON` **siempre quedan al final**, con cualquier orden.
* La opción inicial al cargar es *Relevance*. Para cambiarla, en `js/archive.js` busca:

```js
const state = { category: "all", sort: "relevance", dir: SORTS.relevance.dir };
```

  y cambia `"relevance"` y `SORTS.relevance.dir` por, por ejemplo, `"date"` y `SORTS.date.dir`.

## 8.7 Añadir un criterio de orden nuevo

Se añade una línea al objeto `SORTS` en `js/archive.js` y el botón aparece solo. Ejemplo — ordenar por título:

```js
const SORTS = {
  relevance: { label: "Relevance", dir: "desc", fn: (a, b) => (a.relevance || 0) - (b.relevance || 0) },
  date:      { label: "Date",      dir: "desc", fn: (a, b) => U.dateValue(a.date) - U.dateValue(b.date) },
  status:    { label: "Status",    dir: "asc",  fn: (a, b) => P.config.statuses[a.status].order - P.config.statuses[b.status].order },
  type:      { label: "Type",      dir: "asc",  fn: (a, b) => String(a.type || "").localeCompare(String(b.type || "")) },
  title:     { label: "Title",     dir: "asc",  fn: (a, b) => a.title.localeCompare(b.title) },   // ← nueva
};
```

## 8.8 Añadir un estado nuevo

Pasos en orden:

1. **`js/config.js`** → añade una entrada en `statuses`:

```js
statuses: {
  "IN DEVELOPMENT": { order: 0, meaning: "Being built right now." },
  "EXPERIMENTAL":   { order: 1, meaning: "An open question. It may or may not become something." },
  "COMPLETED":      { order: 2, meaning: "Finished and working." },
  "CONCEPT":        { order: 3, meaning: "An idea on paper. Nothing built yet." },
  "COMING SOON":    { order: 4, meaning: "A signal of what is on its way." },
  "ARCHIVED":       { order: 5, meaning: "Retired, but kept for the record." },
  "ON HOLD":        { order: 6, meaning: "Paused for now." },                 // ← nuevo
},
```

2. **(Opcional) `css/base.css`** → estilo propio del chip. El nombre de la clase es el estado en minúsculas con guiones: `ON HOLD` → `chip--on-hold`. Colócala junto a las otras `.chip--…`:

```css
.chip--on-hold { border-style: dashed; color: var(--mute); }
.chip--on-hold::before { background: transparent; border: 1px solid var(--mute); }
```

   Sin este paso, el chip se muestra con el estilo básico (punto blanco), que es correcto.

3. **Usarlo** en un proyecto: `status: "ON HOLD",`.

**Se actualizan solos:** la lista de estados de las estadísticas, la leyenda de "About this space", el orden por estado y el chip de las tarjetas.

**Aclaraciones importantes:**

* El estado `COMING SOON` tiene comportamiento especial **escrito en el código** (`U.isSoon` en `js/utils.js`: se excluye del total, no aparece en destacados y va siempre al final). **No lo renombres.** Si quieres otro estado que tampoco se pueda abrir, añádelo a `lockedStatuses` en `js/config.js`: `lockedStatuses: ["COMING SOON", "ON HOLD"],` (eso solo evita que se abra; sí contará en el total).
* Los nombres de estado deben escribirse **idénticos** en `config.js` y en los proyectos (mayúsculas incluidas).
* Para quitar un estado, bórralo de `statuses` **y** cambia el estado de los proyectos que lo usen; si no, esos proyectos serán descartados.

---

# 9. Cómo modificar OTHER DIMENSIONS

**Archivo principal:** `js/config.js` → `dimensions`. Es una lista con un objeto por cada "dimensión":

```js
dimensions: [
  {
    id: "github",
    name: "GitHub",
    description: "Where the code lives: repositories, commits and everything still unfinished.",
    url: "https://github.com/your-username",
    glyph: "rings",
    newTab: false,
  },
  {
    id: "portfolio",
    name: "Dark AB",
    description: "The portfolio. Who is behind the work, what I do and how to reach me.",
    url: "https://example.com/dark-ab",
    glyph: "eclipse",
    newTab: false,
  },
  {
    id: "signal",
    name: "Signal",
    description: "What I offer, shown for people who need something built.",
    url: "https://example.com/signal",
    glyph: "signal",
    newTab: false,
  },
],
```

> **Antes de publicar:** las URL actuales son de ejemplo (`your-username`, `example.com`). Sustitúyelas por las reales.

## 9.1 Qué se modifica y dónde

| Quiero cambiar… | Dónde | Cómo |
|---|---|---|
| La **URL** | `js/config.js` → `url` | Escribe la dirección completa con `https://` |
| El **título** | `js/config.js` → `name` | |
| La **descripción** | `js/config.js` → `description` | Mantenla en 1–2 líneas |
| El **icono** | `js/config.js` → `glyph` | Valores disponibles: `"rings"`, `"eclipse"`, `"signal"`. Un valor desconocido muestra `rings` |
| Abrir en pestaña nueva | `js/config.js` → `newTab: true` | Con `false`, se cruza con un destello circular en la misma pestaña |
| El texto "Cross over" | `js/dimensions.js` → dentro de `render` busca `Cross over` | |
| Los efectos visuales (luz, arco, giro del icono) | `css/components.css` → bloque `/* ---------- other dimensions ---------- */`: `.portal`, `.portal__light`, `.portal__glyph`, `.portal__go` | |
| La forma de arco | `css/components.css` → `.portal { border-radius: 50% 50% var(--radius) var(--radius) / 30% 30% var(--radius) var(--radius); }` | Cambia `30%` por `10%` para un arco más plano |
| El destello al cruzar | `css/components.css` → `.wipe`; duración `620` en `js/dimensions.js` (función `cross`) | |
| Los textos del título de la sección | `index.html` → `id="dimensions"` | Sección 10 |

## 9.2 Crear un icono nuevo

Los iconos son SVG escritos en `js/dimensions.js`, en el objeto `GLYPHS`. Añade uno nuevo con un nombre propio:

```js
const GLYPHS = {
  rings: `...`,
  eclipse: `...`,
  signal: `...`,
  diamond: `<svg viewBox="0 0 200 200" aria-hidden="true"><path d="M100 20 L180 100 L100 180 L20 100 Z" fill="none" stroke="currentColor" stroke-width="1.4"/><circle cx="100" cy="100" r="6" fill="currentColor"/></svg>`,   // ← nuevo
};
```

Y úsalo en `js/config.js`: `glyph: "diamond",`. Usa `currentColor` para que tome el color morado y cambie en hover.

## 9.3 Añadir un cuarto enlace sin alterar el diseño

1. Añade un objeto más a `dimensions` en `js/config.js`, con un `id` distinto:

```js
  {
    id: "blog",
    name: "Journal",
    description: "Notes and write-ups about what I build.",
    url: "https://example.com/journal",
    glyph: "signal",
    newTab: false,
  },
```

2. Con la configuración actual, **la rejilla tiene 3 columnas fijas**: el cuarto portal pasará a una segunda fila. Si prefieres 4 en una misma fila, en `css/components.css` cambia:

```css
.portals { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); ... }
```

   por `repeat(4, minmax(0, 1fr))`. Ten en cuenta que el segundo portal tiene un desfase vertical (`.portal:nth-child(2) { margin-top: … }`) pensado para 3 elementos; puedes borrar esa regla si quieres que todos queden alineados.

## 9.4 Repositorios de GitHub (opcional)

Bajo los portales puede aparecer "Recently active on GitHub" con tus repos recientes. Se configura en `js/config.js`:

```js
github: {
  username: "your-username",     // ← pon tu usuario real
  showRepos: true,               // false = no mostrar nunca
  maxRepos: 4,
},
```

* Mientras `username` siga siendo `"your-username"`, la sección **no aparece** (es intencional).
* Usa la API pública de GitHub desde el navegador; si falla (sin conexión, límite de peticiones), la sección simplemente no se muestra y el resto de la página funciona igual.
* Solo muestra repositorios que no sean *forks* ni estén archivados. El resultado se guarda en la sesión del navegador (`sessionStorage`) para no repetir la petición.
* Eso es **todo lo que existe** de integración con la API. Los repos por proyecto son solo el botón con enlace (campo `github`).

---

# 10. Cómo modificar el contenido de la página

## 10.1 El nombre principal

* **`js/config.js`** → `name: "Penumbra",`. Cambia el nombre en el menú, el pie de página, el título de la pestaña y el texto de "About this space" (todo lo que tenga el atributo `data-site-name` se rellena solo).
* **Además, tres textos fijos en `index.html`** que conviene actualizar a mano:
  1. `<title>Penumbra · An archive of projects, experiments and ideas</title>` (en el `<head>`; JavaScript lo reemplaza al cargar, pero buscadores y vista previa pueden leer el original).
  2. `<a class="nav__brand" … aria-label="Penumbra, back to the top">` (texto leído por lectores de pantalla).
  3. `<meta name="description" content="…">`.
* Opcional: `README.md` y este manual mencionan el nombre.

Ejemplo — renombrar a "Umbral": en `js/config.js` pon `name: "Umbral",` y en `index.html` sustituye "Penumbra" en el `<title>` y en el `aria-label`.

## 10.2 La frase de bienvenida

**`js/config.js`** → `tagline`: cada elemento es **una línea**.

```js
tagline: ["Some ideas only", "show up in the dark."],
```

Ejemplo:

```js
tagline: ["Everything here", "began as a question."],
```

* Funciona mejor con **2 líneas**. La segunda se muestra en cursiva (`css/layout.css` → `.hero__title .line:nth-child(2) .line__in`).
* El tamaño máximo del bloque se limita con `max-width: 9.5em` en `.hero__title`.

## 10.3 El texto de presentación

**`js/config.js`** → `lede` (el párrafo bajo el título):

```js
lede: "A growing archive of what I build, test and imagine. Some of it is finished. Most of it is still taking shape.",
```

También `description` (frase corta que acompaña al nombre en el título de la pestaña).

## 10.4 El contenido de ABOUT THIS SPACE

**`index.html`** → busca `id="about"`. El texto está escrito directamente en el HTML:

```html
<p class="about__lead"><span data-site-name>Penumbra</span> is where the things I make come to rest: …</p>
<p class="about__text">Projects live here next to the experiments …</p>
...
<h3 class="about__h">What lives here</h3>
<ul class="about__list">
  <li><strong>Projects</strong> that are complete and work.</li>
  <li><strong>Developments</strong> still being built.</li>
  <li><strong>Experiments</strong> with no promise attached.</li>
  <li><strong>Ideas</strong> waiting for their turn.</li>
</ul>
<h3 class="about__h">How to read the archive</h3>
<dl class="legend" id="legend"></dl>
```

* Edita solo el **texto** entre etiquetas. Conserva `<span data-site-name>…</span> ` si quieres que el nombre se actualice solo.
* Puedes añadir o quitar `<li>…</li>` de la lista.
* **No borres** `<dl class="legend" id="legend"></dl>`: la leyenda de estados se genera ahí desde `js/config.js` → `statuses` → `meaning`.

## 10.5 Los nombres de las secciones

| Qué | Dónde |
|---|---|
| Enlaces del menú (*Threshold*, *Featured*, *Archive*, *The space*, *Other dimensions*) | `js/config.js` → `nav` → `label` |
| Títulos de sección ("Featured projects", "All projects", "About this space", "Other dimensions") | `index.html` → etiquetas `<h2 … class="sec__title">` (ids `featured-h`, `archive-h`, `about-h`, `dim-h`) |
| Frases bajo cada título | `index.html` → `<p class="sec__note">` |
| Títulos dentro de un proyecto (*Overview*, *Process*, *Technologies*, *Code*, *Diagrams*, *Images*, *Documentation*, *Links*) | `js/project-view.js` → función `render` (busca por ejemplo `section("overview", "Overview"`) |
| Etiquetas de datos del proyecto (*Category*, *Status*, *Created*, *Type*) | `js/project-view.js` → `<dl class="p-facts">` |

Ejemplo — renombrar el menú. En `js/config.js`:

```js
nav: [
  { label: "Start",     target: "top" },
  { label: "Selected",  target: "featured" },
  { label: "Archive",   target: "archive" },
  { label: "The space", target: "about" },
  { label: "Portals",   target: "dimensions" },
],
```

**No cambies los `target`** (son los ids de las secciones).

## 10.6 Los textos de los botones y mensajes fijos

| Texto | Archivo |
|---|---|
| "Skip to projects" | `index.html` (`class="skip"`) |
| "Skip" (entrada) | `index.html` (`class="intro__skip"`) |
| "Menu" / "Close" | `index.html` (`class="nav__toggle"`) **y** `js/nav.js` (busca `"Close"` y `"Menu"`) |
| "Scroll to enter the archive" | `index.html` (`class="hero__cue"`) |
| "Projects in the archive" | `js/stats.js` |
| "All", "Sort by", "Reverse order" | `js/archive.js` |
| "Back to the archive", "GitHub", "View on GitHub", "Keep exploring", "The description for this project has not been written yet." | `js/project-view.js` |
| "Copy", "Copied", "Press Ctrl+C", "Loading…" | `js/code-viewer.js` |
| "Cross over", "Recently active on GitHub" | `js/dimensions.js` |
| "Always one more piece to add.", "Back to the threshold", "Replay the entrance", "Built by hand." | `index.html` (`.footer`) |
| Nombres de los botones de orden (*Relevance*, *Date*, *Status*, *Type*) | `js/archive.js` → `SORTS` → `label` |

Para localizar cualquier texto: `Ctrl + Shift + F` y pega el texto exacto que ves en la página.

## 10.7 Los mensajes de proyectos próximos

No hay un mensaje global: **cada proyecto `COMING SOON` lleva el suyo**.

```js
{
  id: "project-08",
  title: "Project 08",                       // lo que se lee grande
  subtitle: "Something is forming here.",     // la pista
  status: "COMING SOON",                      // la etiqueta del chip
  ...
}
```

* Cambia `title` y `subtitle` para cambiar el mensaje.
* El texto del chip "COMING SOON" es el nombre del estado (no se cambia por proyecto).
* El aspecto de estas tarjetas (borde punteado, imagen difuminada): `css/components.css` → bloque `/* coming soon: a rumour, not a result */`.
* Si cambias la leyenda de ese estado: `js/config.js` → `statuses["COMING SOON"].meaning`.


---

# 11. Cómo añadir código, diagramas y documentación

Todo se declara dentro del registro del proyecto en `data/projects.js`. Los ejemplos parten del proyecto **AVA** (que ya tiene código, un diagrama, imágenes generadas y un documento). Los archivos nuevos que se mencionan (por ejemplo `code/events.py`) son ilustrativos.

## 11.1 Mostrar código

### Opción A — Código escrito dentro de `data/projects.js`

```js
code: [
  {
    title: "registry.py",          // nombre del archivo (se muestra en la pestaña)
    language: "python",            // lenguaje (ver lista abajo)
    code: `class Registry:
    """Keeps track of every module the system can load."""

    def __init__(self):
        self._modules = {}`,
  },
],
```

**Cuidados al pegar código dentro de las comillas invertidas (`` ` ``):**

* Si tu código contiene una comilla invertida `` ` ``, escríbela como `` \` ``.
* Si contiene `${`, escríbelo como `\${`.
* Las barras invertidas se escriben dobles: un `\n` dentro del código debe ir como `\\n`; de lo contrario se convierte en un salto de línea real.
* Si el código tiene muchos de esos caracteres, usa la **opción B**.
* La sangría (espacios al inicio de línea) se conserva tal cual la escribas.

### Opción B — Código en un archivo aparte (recomendada para código largo)

1. Guarda el archivo, por ejemplo `assets/projects/ava/code/events.py` (**archivo ilustrativo: todavía no existe en el proyecto**; lo crearías tú).
2. Regístralo con `src` en lugar de `code`:

```js
code: [
  { title: "events.py", language: "python", src: "code/events.py" },
],
```

* La ruta es relativa a `assets/projects/<id>/`.
* **Requiere servidor** (Vercel, Live Server o `python -m http.server`). Abierto con doble clic aparece "Could not load…".
* Si el fragmento tiene tanto `code` como `src`, se usa `code`.

### Varios archivos de código = pestañas

Si `code` tiene más de un elemento, aparecen **pestañas** (se pueden recorrer con las flechas ← →). Con un solo elemento se muestra el nombre del archivo sin pestañas.

```js
code: [
  { title: "registry.py", language: "python",     code: `...` },
  { title: "events.js",   language: "javascript", code: `...` },
],
```

### Resaltado de sintaxis

Funciona con estos valores de `language` (no distingue mayúsculas):

| Lenguaje | Valores aceptados en `language` |
|---|---|
| JavaScript / TypeScript | `javascript`, `js`, `jsx`, `ts`, `typescript`, `node` |
| Python | `python`, `py` |
| C / C++ / Arduino | `c`, `cpp`, `c++`, `arduino`, `ino`, `h` |
| Bash | `bash`, `sh`, `shell`, `zsh` |
| JSON | `json` |
| CSS | `css` |
| HTML / XML | `html`, `xml` |

* Cualquier otro valor (por ejemplo `rust` o `java`) se muestra como **texto sin colores** pero con números de línea y botón de copiar.
* Es un resaltador sencillo propio (`js/code-viewer.js`), no un analizador completo: colorea comentarios, cadenas, números, palabras clave, funciones y nombres con mayúscula inicial.
* Para añadir palabras clave a un lenguaje: `js/code-viewer.js` → objeto `KEYWORDS` (una cadena de palabras separadas por espacios).
* Los colores de las palabras están en `css/project.css` (clases `.tk-c` comentarios, `.tk-s` cadenas, `.tk-n` números, `.tk-k` palabras clave, `.tk-f` funciones, `.tk-t` tipos, `.tk-p` propiedades JSON).

### Botón "Copy"

Aparece **automáticamente** en cada visor, arriba a la derecha. Copia el fragmento de la pestaña activa y cambia a "Copied" durante unos 2 segundos. Si el navegador no permite copiar automáticamente (por ejemplo en páginas sin HTTPS), muestra "Press Ctrl+C". No hay nada que configurar. El texto del botón está en `js/code-viewer.js`.

### Apariencia del visor

* Altura máxima antes de aparecer la barra de desplazamiento: `css/project.css` → `.code__body { max-height: 560px; }`.
* Las líneas largas no se parten: se desplaza horizontalmente.
* Tamaño de letra: `.code code { font-size: .86rem; }`.

## 11.2 Añadir diagramas

1. Guarda el archivo en `assets/projects/<id>/diagrams/`.
2. Regístralo:

```js
diagrams: [
  { src: "diagrams/architecture.svg", caption: "High-level architecture: the core, the event bus and the modules around it." },
],
```

* `caption` (opcional) es el pie de imagen y también el texto alternativo.
* `alt` (opcional) permite un texto alternativo distinto para lectores de pantalla.
* Se muestran en una columna, a ancho completo, bajo el título "Diagrams".

## 11.3 Añadir imágenes

```js
images: [
  { src: "images/dashboard.jpg", caption: "The first dashboard prototype." },   // imagen real
  { art: "eclipse", caption: "Early visual study for the interface." },        // ilustración generada
],
```

* Con `art:` la página dibuja una ilustración (`eclipse`, `orbits`, `waves`, `lattice`, `rings`, `scatter`); no necesita archivo.
* Se muestran en dos columnas, recortadas a proporción 4:3 (sección 3.11 para cambiarlo).

## 11.4 Visualización ampliada (pantalla completa y zoom)

**No hay que activar nada**: todas las imágenes y diagramas de un proyecto son clicables y abren el visor.

| Acción | PC | Móvil / tablet |
|---|---|---|
| Abrir | Clic en la imagen | Toque |
| Acercar / alejar | Rueda del ratón, botones **+ / −**, teclas `+` / `-` | Pellizco con dos dedos |
| Mover (pan) | Arrastrar con el ratón | Arrastrar con un dedo (con zoom aplicado) |
| Zoom rápido | Doble clic | Doble toque |
| Restablecer | Botón de "ajustar" o tecla `0` | Botón de "ajustar" |
| Siguiente / anterior | Flechas ← → o botones laterales | Deslizar a los lados (sin zoom) o botones |
| Pantalla completa del navegador | Botón de pantalla completa o tecla `F` | Si el navegador lo permite; en algunos (iPhone) el botón no aparece |
| Cerrar | Botón ✕ o `Esc` | Botón ✕ |

El visor agrupa las imágenes por tipo: dentro de "Diagrams" navegas entre diagramas, dentro de "Images" entre imágenes.
Límites de zoom (en `js/lightbox.js`, arriba): `const MIN = 1, MAX = 8;`.

## 11.5 Enlaces a documentos

```js
docs: [
  { title: "Design notes", src: "docs/design-notes.md", type: "Markdown" },
  { title: "User guide",   src: "docs/user-guide.pdf",  type: "PDF" },
],
```

* `src` es relativo a `assets/projects/<id>/` (guárdalos en `docs/`).
* Se abren en una **pestaña nueva** del navegador. Los PDF se ven directamente; los archivos `.md` o de otros tipos pueden mostrarse como texto o descargarse, según el navegador (la página no los convierte a formato).
* `type` es solo la etiqueta que aparece a la derecha.
* Para enlazar a un documento **externo** (Google Drive, Notion…), usa una URL completa en `src` (`src: "https://…"`); o usa `links`:

```js
links: [
  { label: "Technical article", url: "https://example.com/article" },
],
```

---

# 12. Cómo ejecutar y probar la página

## 12.1 Requisitos previos

* **Visual Studio Code** (https://code.visualstudio.com).
* Un navegador moderno (Chrome, Edge, Firefox o Safari).
* **No necesitas instalar dependencias.** No hay `npm install`, ni `package.json`, ni compilación.
* Para probar con servidor local, una de estas (elige una):
  * La extensión **Live Server** de VS Code (la más cómoda), **o**
  * **Python 3** instalado (para el comando `python -m http.server`), **o**
  * **Node.js** instalado (solo si quieres usar `npx serve`; no es necesario).

## 12.2 Abrir el proyecto en VS Code

1. Abre VS Code.
2. Menú **File → Open Folder…** (Archivo → Abrir carpeta).
3. Elige la carpeta del proyecto (la que contiene `index.html`).
4. En el panel izquierdo verás `index.html`, `css`, `js`, `data`, `assets`.

## 12.3 Ejecutarla localmente

### Opción 1 — Doble clic (la más rápida)

Haz doble clic en `index.html` (o clic derecho → *Open with* → tu navegador). La URL empezará con `file:///…`.

* ✔ Funcionan el diseño, las animaciones, los filtros, los contadores, los proyectos, el visor de imágenes y el código escrito en `code:`.
* ✘ **No funcionan** los fragmentos de código cargados con `src:` (verás "Could not load…") ni algunas lecturas de archivos, por una restricción de seguridad del navegador.
* ✘ Los repositorios de GitHub (sección 9.4) pueden no cargar.

### Opción 2 — Live Server (recomendada)

1. En VS Code: icono de extensiones (`Ctrl + Shift + X`) → busca **Live Server** (autor *Ritwick Dey*) → **Install**.
2. Clic derecho sobre `index.html` → **Open with Live Server**.
3. Se abre el navegador en `http://127.0.0.1:5500/` y **se recarga solo** cada vez que guardas un archivo.
4. Para detenerlo: clic en **Port: 5500** en la barra inferior de VS Code.

### Opción 3 — Servidor de Python (sin extensiones)

1. En VS Code abre el terminal: `` Ctrl + ` `` (la tecla a la izquierda del 1) o menú **Terminal → New Terminal**.
2. Ejecuta (estando en la carpeta del proyecto):

```bash
python -m http.server 8000
```

   En Windows, si `python` no se reconoce, usa:

```bash
py -m http.server 8000
```

3. Abre en el navegador: `http://localhost:8000`
4. Para detenerlo: `Ctrl + C` en el terminal.

### Opción 4 — `npx serve` (solo si tienes Node.js)

```bash
npx serve .
```

Te mostrará la dirección (normalmente `http://localhost:3000`). Descarga un paquete temporal; no añade nada al proyecto.

## 12.4 Comprobar los cambios

1. Guarda el archivo (`Ctrl + S`). *VS Code puede guardar solo si activas File → Auto Save.*
2. Con Live Server la página se recarga sola; en las otras opciones, recarga con **`Ctrl + F5`** (recarga forzada que ignora la caché). En Mac: `Cmd + Shift + R`.
3. **La entrada animada solo se muestra la primera vez por sesión.** Para verla otra vez: pulsa "Replay the entrance" en el pie de página, o abre una ventana privada, o desactiva la entrada mientras pruebas (`js/config.js` → `intro: { enabled: false`).
4. Prueba en tamaño móvil: `F12` → botón de dispositivos (o `Ctrl + Shift + M`).
5. Prueba un proyecto directamente: añade `#/project/ava` al final de la dirección (cambia `ava` por cualquier `id`).

## 12.5 Cómo identificar errores comunes

Abre las herramientas del navegador con **`F12`**:

| Pestaña | Para qué |
|---|---|
| **Console** | Errores en rojo (de JavaScript) y avisos en amarillo (`[Penumbra] …`). Muestran archivo y línea |
| **Network** | Filtra por *Img* o *Fetch*: las peticiones en rojo (404) indican una ruta de archivo incorrecta |
| **Elements** | Inspeccionar y probar estilos CSS en vivo |
| **Application → Session Storage** | Ver/borrar `pnb-intro-seen` (controla si se repite la entrada) |

Errores típicos:

* La página está **vacía o sin proyectos** → casi seguro hay un error de sintaxis en `data/projects.js` (falta una coma, una llave o una comilla). La consola indicará la línea.
* Una imagen no se ve → ruta o nombre incorrecto (Network muestra el 404).
* El código `src:` dice "Could not load" → estás en `file://`; usa Live Server o el servidor de Python.

Más soluciones en la sección 14.

---

# 13. Cómo actualizar la página en GitHub y Vercel

Suponemos que el repositorio **ya está conectado** a Vercel y que `index.html` está en la raíz del repositorio.

## 13.1 Flujo normal (cada vez que cambias algo)

Abre el terminal en VS Code (`` Ctrl + ` ``), situado en la carpeta del proyecto, y ejecuta:

```bash
git status
git add .
git commit -m "Add Nocturne Clock project"
git push
```

| Comando | Para qué sirve |
|---|---|
| `git status` | Muestra qué archivos has modificado, añadido o borrado. Revísalo antes de subir: así detectas archivos que no esperabas |
| `git add .` | Marca **todos** los cambios para incluirlos en el próximo guardado (el punto significa "todo lo de esta carpeta") |
| `git commit -m "mensaje"` | Guarda una "foto" de los cambios en tu historial, con un mensaje que describe qué hiciste. Escribe mensajes claros (`"Update AVA description"`) |
| `git push` | Envía los commits a GitHub. Al llegar, Vercel detecta el cambio y publica automáticamente |

También puedes hacerlo desde VS Code sin comandos: panel **Source Control** (icono de ramas, `Ctrl + Shift + G`) → escribe el mensaje → botón **Commit** → botón **Sync Changes / Push**.

**Si Git te pide identificarte** la primera vez (error "Please tell me who you are"):

```bash
git config --global user.name "Tu Nombre"
git config --global user.email "tu-correo@ejemplo.com"
```

## 13.2 Comprobar que Vercel publicó los cambios

1. Entra en https://vercel.com → tu proyecto → pestaña **Deployments**.
2. Verás un despliegue nuevo con el mensaje de tu commit. Estados: **Building** (en proceso) → **Ready** (publicado). Suele tardar menos de un minuto.
3. Abre tu dirección pública (la que termina en `.vercel.app` o tu dominio) y recarga con **`Ctrl + F5`**.
4. Para confirmar que es la versión nueva, compara el commit:

```bash
git log -1 --oneline
```

   Los primeros caracteres que imprime (el *hash*) deben aparecer junto al despliegue en Vercel.
5. Prueba en una **ventana privada** si sospechas de la caché.

> Si Vercel está configurado con una rama de producción (normalmente `main`), solo los `push` a esa rama actualizan la página principal. Un `push` a otra rama genera una **Preview** con otra URL. Comprueba tu rama con `git branch --show-current`.

## 13.3 Configuración que debe tener el proyecto en Vercel

Al ser un sitio estático puro, la configuración mínima es (Vercel → proyecto → **Settings → General / Build & Development**):

| Ajuste | Valor |
|---|---|
| Framework Preset | **Other** |
| Build Command | *(vacío)* |
| Output Directory | *(vacío)* |
| Install Command | *(vacío)* |
| Root Directory | La carpeta donde está `index.html`. Si el repositorio contiene una carpeta intermedia (por ejemplo `penumbra/`), indícala aquí |

## 13.4 Si la publicación falla

1. En **Deployments**, abre el despliegue marcado en rojo (**Error**) → revisa el **Build Logs**.
2. Causas probables y soluciones:

| Síntoma | Causa | Solución |
|---|---|---|
| El `push` fue rechazado (`rejected`, `non-fast-forward`) | El repositorio en GitHub tiene cambios que no tienes localmente | `git pull --rebase` y luego `git push` |
| No aparece ningún despliegue nuevo | El `push` no se hizo, o fue a otra rama, o el repositorio no está conectado a ese proyecto de Vercel | `git status` / `git log` / revisa la rama; en Vercel → Settings → Git |
| La página da **404** | `index.html` no está en la raíz configurada | Corrige *Root Directory* (13.3) |
| Las imágenes o archivos no cargan solo en Vercel | Mayúsculas/minúsculas: Vercel distingue `Cover.JPG` de `cover.jpg` | Que el nombre del archivo y el escrito en `data/projects.js` sean idénticos, incluida la extensión |
| Falta un archivo en la web | No se subió (olvidaste `git add .`) | `git status`, luego `git add .`, `git commit`, `git push` |
| GitHub rechaza archivos grandes | Un archivo supera 100 MB | Comprímelo o sácalo del repositorio; usa un enlace externo para vídeos pesados |

3. **Volver a una versión anterior** (si algo salió mal):
   * Con Git: `git revert HEAD` (crea un commit que deshace el último) y luego `git push`.
   * Desde Vercel: Deployments → elige un despliegue anterior que funcionaba → menú (⋯) → *Promote to Production* / *Instant Rollback* (el nombre exacto depende de la versión del panel).

---

# 14. Errores frecuentes y soluciones

Orden recomendado para cualquier problema: **1)** abre la consola (`F12`), **2)** lee el primer mensaje rojo o amarillo, **3)** busca aquí el síntoma. Casi nunca hace falta tocar archivos de `js/` ni de `css/`.

## 14.1 Imágenes que no aparecen

**Síntoma:** tarjeta oscura sin imagen, ícono de imagen rota en galerías, cabecera vacía.

1. **Prueba la ruta directamente.** Si tu `cover` es `"cover.jpg"` y el `id` es `nocturne-clock`, abre en el navegador `http://localhost:8000/assets/projects/nocturne-clock/cover.jpg`. Si da 404, está mal ubicado o escrito.
2. Verifica:
   * La carpeta se llama **exactamente** como el `id` (sin mayúsculas ni espacios).
   * El nombre y la extensión coinciden **letra por letra** (`.jpg` ≠ `.jpeg` ≠ `.JPG`).
   * El archivo está guardado dentro de esa carpeta (o la subcarpeta indicada en la ruta, p. ej. `images/…`).
3. Reglas de ruta: un texto sin `assets/` ni `http` al inicio (`"cover.jpg"`) se busca en `assets/projects/<id>/`. Si empieza por `assets/` o `http`, se usa tal cual.
4. En Vercel: comprobar mayúsculas y que el archivo se subió (`git status`).
5. Si cambiaste la imagen y sigues viendo la antigua: `Ctrl + F5` o usa un nombre de archivo nuevo.

## 14.2 Proyectos que no se muestran

| Causa | Cómo identificarla | Solución |
|---|---|---|
| **Error de sintaxis en `data/projects.js`** (la causa más común) | Consola con error rojo, normalmente `Uncaught SyntaxError` y el nombre del archivo y la línea. La página aparece **sin ningún proyecto** y con los contadores en 00 | Revisa cerca de esa línea: falta una coma `,` al cerrar un proyecto `},`; una llave `{`/`}` sin pareja; una comilla sin cerrar; o texto con comillas dobles dentro de comillas dobles |
| Proyecto descartado por validación | Aviso amarillo `[Penumbra] Skipped a project: …` | Corrige lo que indica: `id` repetido o ausente, `title` ausente, `status` no reconocido |
| `status` mal escrito | El aviso dice `unknown status "…"` | Copia el estado exacto: `COMPLETED`, `IN DEVELOPMENT`, `EXPERIMENTAL`, `CONCEPT`, `ARCHIVED`, `COMING SOON` |
| Está en "All projects" pero no se abre al pulsarlo | `id` con espacios, puntos o acentos | Usa solo letras, números, `-` y `_` |
| Es `COMING SOON` y no se abre | Es el comportamiento diseñado | Cámbialo de estado, o añade `openable: true` |
| No aparece en "Featured" | `featured` no es `true` (sin comillas), o el estado es `COMING SOON` | `featured: true,` |
| Tienes un filtro de categoría activo | Botón de categoría resaltado | Pulsa "All" |
| No ves los cambios | Caché | `Ctrl + F5` |
| Guardaste el archivo equivocado | Pestaña de VS Code con punto (●) = sin guardar | `Ctrl + S` |

## 14.3 Enlaces que no funcionan

| Síntoma | Causa | Solución |
|---|---|---|
| El botón de GitHub no aparece | El campo `github` no existe o está vacío | `github: "https://github.com/…"` |
| El botón lleva a una página rara / no sale del sitio | Falta `https://` al inicio de la URL | Escribe la URL completa |
| *Other dimensions* lleva a `example.com` o a `your-username` | Son las URL de ejemplo | Edita `js/config.js` → `dimensions` → `url` y `github.username` |
| El documento (`docs`) no abre / 404 | Ruta incorrecta | Misma revisión que 14.1 |
| Un enlace del menú no hace nada | `target` en `nav` no coincide con el `id` de ninguna sección | Usa: `top`, `featured`, `archive`, `about`, `dimensions` |
| La página queda con el destello morado después de volver atrás | — | No debería ocurrir (se limpia al volver). Recarga con `Ctrl + F5` |

## 14.4 Contadores incorrectos

| Síntoma | Explicación y solución |
|---|---|
| El total no incluye un proyecto | Si es `COMING SOON`, no cuenta en el total (por diseño). También puede haber sido descartado: mira los avisos amarillos |
| "All" en los filtros dice 08 y el total dice 07 | Normal: "All" incluye las tarjetas `COMING SOON` |
| Falta la fila de un estado | Solo aparecen estados con al menos un proyecto |
| Los números empiezan en 00 y no se animan | Se animan al llegar a la sección. Si ya estás en ella al cargar, espera un instante |
| Un proyecto no se cuenta en su estado | El `status` no coincide exactamente (el proyecto fue descartado) |

## 14.5 Errores en los filtros

| Síntoma | Causa | Solución |
|---|---|---|
| Un proyecto solo aparece con "All" | `category` mal escrita o ausente | Cópiala exacta de `js/config.js` → `categories`; mira el aviso amarillo `category "…" is not listed` |
| Falta un botón de categoría | No está en `js/config.js` → `categories` | Añádela (sección 8.5) |
| El orden "no hace nada" | Los valores de ese campo son iguales | Ajusta `relevance`, `date` o `type` |
| El orden por tipo parece raro | Los proyectos sin `type` aparecen primero | Rellena `type` |
| Orden por fecha incorrecto | Fecha en formato no válido (`"10/2026"`) | Usa `"2026-10"` o `"2026"` |

## 14.6 Problemas con las animaciones

| Síntoma | Causa | Solución |
|---|---|---|
| La entrada no aparece | Ya se vio en esta sesión, o está desactivada | Footer → "Replay the entrance"; `js/config.js` → `intro.enabled: true` |
| La entrada no aparece al abrir un enlace a un proyecto | Es intencional | — |
| Título de portada invisible | La clase `is-ready` no se añadió (la entrada no terminó, o hay un error de JavaScript) | Pulsa una tecla o haz clic para saltar la entrada; mira la consola |
| Se abre el proyecto sin la animación de expansión | Se abrió con enlace directo, con Atrás/Adelante, con "Keep exploring", o el sistema tiene activado "Reducir movimiento" | Es lo esperado |
| Las animaciones van entrecortadas | Imágenes demasiado pesadas | Reduce `cover` a ≤ 400 KB (sección 16) |
| En el móvil las tarjetas no reaccionan al cursor | No hay cursor; se ilumina la tarjeta al pasar por el centro de la pantalla | Es lo esperado |
| Cambié una duración y algo se ve cortado | Duración desincronizada | Revisa las precauciones de cada animación en la sección 4 (`OPEN_MS`, el `260` del visor, el `18px`) |
| Quiero quitar el movimiento rápidamente | — | Sección 4.0 |

## 14.7 Errores al ejecutar el proyecto

| Síntoma | Solución |
|---|---|
| `python` no se reconoce como comando | En Windows prueba `py -m http.server 8000`; o instala Python; o usa Live Server |
| `Address already in use` / puerto ocupado | Usa otro puerto: `python -m http.server 8001` |
| Live Server no aparece al hacer clic derecho | Instala la extensión; abre la **carpeta** (no un archivo suelto) con File → Open Folder |
| El código `src:` muestra "Could not load…" | Abriste con doble clic (`file://`). Usa un servidor (12.3) |
| Las fuentes se ven distintas | Falla la ruta del `@font-face` en `css/base.css` o el nombre del archivo en `assets/fonts/` |
| El código mostrado tiene saltos de línea extraños o falta texto | Usaste `code:` con barras invertidas o comillas invertidas sin escapar. Usa `src:` (sección 11.1) |
| La página aparece en blanco | Revisa la consola; casi siempre es un error de sintaxis en `data/projects.js` o `js/config.js` |
| Cambié un archivo de `js/` y dejó de funcionar todo | Vuelve atrás con `Ctrl + Z` o con Git (`git restore js/archivo.js`) |

## 14.8 Problemas al publicar en Vercel

Ver la tabla de la sección 13.4. Resumen de lo más frecuente:

1. **Mayúsculas/minúsculas** en nombres de archivo (funciona en tu PC, falla en Vercel).
2. **Archivo no subido** (olvidaste `git add .`).
3. **Root Directory** mal configurado → 404.
4. **Caché del navegador** → `Ctrl + F5` o ventana privada.
5. **Cambios en otra rama** → generan una Preview, no actualizan producción.

---

# 15. Referencia rápida

| Quiero hacer… | Archivo que debo modificar | Qué debo cambiar |
|---|---|---|
| Agregar un proyecto | `data/projects.js` (+ carpeta `assets/projects/<id>/`) | Un nuevo objeto `{ id, title, … }` antes del `];` final |
| Quitar un proyecto | `data/projects.js` | Borrar su objeto completo (de `{` a `},`) |
| Cambiar el nombre de un proyecto | `data/projects.js` | `title` |
| Cambiar la descripción de un proyecto | `data/projects.js` | `description` |
| Cambiar la imagen principal | `data/projects.js` + `assets/projects/<id>/` | `cover: "cover.jpg"` |
| Añadir imágenes | `data/projects.js` + `assets/projects/<id>/images/` | Elementos en `images` |
| Añadir un diagrama | `data/projects.js` + `assets/projects/<id>/diagrams/` | Elementos en `diagrams` |
| Mostrar código | `data/projects.js` (+ `assets/projects/<id>/code/`) | `code: [{ title, language, code }]` o `src` |
| Añadir documentación | `data/projects.js` + `assets/projects/<id>/docs/` | Elementos en `docs` |
| Cambiar el proceso de desarrollo | `data/projects.js` | `process` |
| Cambiar categoría de un proyecto | `data/projects.js` | `category` |
| Cambiar el estado | `data/projects.js` | `status` |
| Cambiar la fecha | `data/projects.js` | `date` (`"2026-10"`) |
| Destacar / quitar de destacados | `data/projects.js` | `featured: true/false` |
| Ordenar los destacados | `data/projects.js` | `relevance` |
| Añadir GitHub a un proyecto | `data/projects.js` | `github: "https://…"` |
| Añadir un enlace extra a un proyecto | `data/projects.js` | `links: [{ label, url }]` |
| Crear proyecto próximo (pista) | `data/projects.js` | `status: "COMING SOON"` |
| Hacer abrible un `COMING SOON` | `data/projects.js` | `openable: true` |
| Añadir una categoría | `js/config.js` | `categories` |
| Añadir un estado | `js/config.js` (+ `css/base.css` opcional) | `statuses` (+ `.chip--nombre`) |
| Añadir un criterio de orden | `js/archive.js` | Objeto `SORTS` |
| Cambiar el orden inicial | `js/archive.js` | `const state = { category: "all", sort: "relevance", … }` |
| Cambiar colores | `css/base.css` | Variables `--void`, `--violet`, `--violet-hi`, `--violet-lo`, `--white`, `--mute`, `--faint`, `--line`, `--glow` (+ valores escritos a mano, 3.3) |
| Cambiar el color de fondo | `css/base.css` | `--void` (+ lista de 3.2) |
| Cambiar colores de las ilustraciones generadas | `js/art.js` | Constantes `BG`, `VIOLET`, `HI`, `WHITE` |
| Cambiar tipografías | `css/base.css` (+ `index.html` si Google Fonts) | `--display`, `--ui`, `--code` y `@font-face` |
| Cambiar tamaños de texto | `css/layout.css`, `css/components.css`, `css/project.css` | `font-size: clamp(…)` de cada clase (tabla 3.5) |
| Cambiar márgenes y espacios | `css/base.css` / `css/layout.css` | `--gutter`, `--maxw`, `--nav-h`, `.sec { padding-block }` |
| Cambiar esquinas | `css/base.css` (+ `js/project-view.js`) | `--radius` (y los `18px` de JS) |
| Cambiar sombras / luces | `css/components.css`, `css/layout.css` | `box-shadow`, `circle 210px` (linterna) |
| Cambiar el diseño de las tarjetas | `css/components.css` | Reglas `.card…`, `.featured`, `.grid` |
| Cambiar la inclinación de las tarjetas | `js/cards.js` | Multiplicadores en la función `frame` |
| Cambiar la barra de navegación | `css/layout.css` + `js/config.js` | `.nav…` y `nav` |
| Cambiar botones | `css/base.css` / `css/components.css` | `.btn`, `.pill`, `.sort` |
| Modificar animaciones CSS | `css/*.css` | Valores `transition` / `animation` en segundos |
| Modificar la animación de entrada | `js/intro.js` + `js/config.js` | `step`, `dur`, `intro.enabled`, `lines` |
| Modificar la apertura de proyectos | `js/project-view.js` | `OPEN_MS`, `CLOSE_MS`, `EASE` |
| Modificar los contadores | `js/stats.js` / `css/layout.css` | `dur`, `.stat__bar i { transition }` |
| Desactivar movimiento | `js/utils.js` | `U.reducedMotion = () => true;` |
| Cambiar enlaces de Other dimensions | `js/config.js` | `dimensions` → `url` |
| Cambiar títulos/descripciones de dimensiones | `js/config.js` | `name`, `description` |
| Cambiar iconos de dimensiones | `js/config.js` (+ `js/dimensions.js`) | `glyph`; objeto `GLYPHS` para crear nuevos |
| Añadir otra dimensión | `js/config.js` | Nuevo objeto en `dimensions` |
| Mostrar repos de GitHub | `js/config.js` | `github.username`, `showRepos`, `maxRepos` |
| Cambiar el nombre de la página | `js/config.js` (+ `index.html`) | `name` (+ `<title>`, `aria-label`, `meta description`) |
| Cambiar la frase principal | `js/config.js` | `tagline` |
| Cambiar el texto de portada | `js/config.js` | `lede` |
| Cambiar ABOUT THIS SPACE | `index.html` | Sección `id="about"` |
| Cambiar la leyenda de estados | `js/config.js` | `statuses[…].meaning` |
| Cambiar los nombres del menú | `js/config.js` | `nav[…].label` |
| Cambiar títulos de sección | `index.html` | Etiquetas `<h2 class="sec__title">` |
| Cambiar textos de botones y avisos | Según el texto (tabla 10.6) | `index.html`, `js/stats.js`, `js/archive.js`, `js/project-view.js`, `js/code-viewer.js`, `js/dimensions.js` |
| Cambiar el mensaje de un proyecto próximo | `data/projects.js` | `title`, `subtitle` del proyecto `COMING SOON` |
| Cambiar palabras de la entrada | `js/config.js` | `intro.lines` |
| Ver la entrada otra vez | Pie de página / navegador | "Replay the entrance" o borrar `pnb-intro-seen` |
| Subir cambios a la web | Terminal | `git add .` → `git commit -m "…"` → `git push` |

---

# 16. Recomendaciones de mantenimiento

## 16.1 Evitar duplicar información

* **Un dato, un lugar.** Los proyectos solo se describen en `data/projects.js`; las categorías, estados y enlaces globales solo en `js/config.js`. No copies el número de proyectos ni textos de estados en `index.html`: se calculan solos.
* **Evita copiar el mismo archivo en varios proyectos.** Si un diagrama sirve a dos proyectos, guárdalo en uno y enlázalo desde el otro con una ruta que empiece por `assets/` (por ejemplo `src: "assets/projects/ava/diagrams/architecture.svg"`), en lugar de duplicarlo.
* **Las categorías y estados se escriben siempre copiando** el texto exacto de `js/config.js`. Un error de ortografía crea un problema silencioso (sección 14).
* Antes de añadir un proyecto, busca (`Ctrl + Shift + F`) su `id` para confirmar que no existe.

## 16.2 Organizar imágenes y documentos

* **Una carpeta por proyecto** en `assets/projects/<id>/`, siempre con el mismo esquema:

```
assets/projects/<id>/
├── cover.jpg        ← la imagen principal
├── images/
├── diagrams/
├── code/
└── docs/
```

* **Nombres de archivo:** minúsculas, sin espacios ni acentos, con guiones: `prototype-01.jpg`, `circuit-v2.svg`. Evita `Captura de pantalla (3).PNG`.
* **Pesos recomendados:** `cover` ≤ 400 KB; imágenes de galería ≤ 300 KB; formatos `.jpg` o `.webp` para fotos, `.svg` o `.png` para diagramas. Páginas con muchas imágenes pesadas se vuelven lentas y las animaciones se entrecortan.
* **Documentos grandes** (PDF de varios MB): considera alojarlos en otro sitio y enlazarlos con una URL completa.
* **Versiones:** si actualizas una imagen, usa un nombre nuevo (`cover-v2.jpg`) y actualiza `cover`; evitas problemas de caché y conservas la anterior mientras compruebas.
* No dejes en `assets/` archivos que ya no uses: ocupan espacio y generan confusión.

## 16.3 Orden dentro de `data/projects.js`

* Añade los proyectos nuevos al final; la página los ordena sola.
* Mantén el mismo orden de campos en todos los proyectos (el del ejemplo de la sección 5) para encontrar cosas rápido.
* Sangría de 2 espacios y una línea en blanco entre proyectos.
* Deja siempre una coma al final de cada proyecto (`},`), incluido el último.
* Cuando un proyecto sea muy largo, puedes separar bloques con comentarios `// --- código ---`; los comentarios `//` están permitidos en este archivo.

## 16.4 Copias de seguridad

**Antes de cualquier cambio importante** (cambiar colores globales, tipografías, editar archivos de `js/`):

1. **Con Git (recomendado):** guarda y marca el punto de partida.

```bash
git add .
git commit -m "Backup before redesign"
git tag respaldo-2026-10
git push --tags
```

   Para volver a ese punto más adelante: `git checkout respaldo-2026-10` (solo para mirar) o crea una rama de trabajo para experimentar:

```bash
git switch -c experimento-colores
```

   Si te gusta el resultado, vuelve a la rama principal y fusiona; si no, la borras sin afectar nada.
2. **Copia manual:** copia la carpeta completa del proyecto y pégala con la fecha: `penumbra-copia-2026-10-02`. Es útil como segunda protección fuera de Git.
3. **Después de cada sesión de trabajo:** haz `commit` y `push`. GitHub es tu copia en la nube.

## 16.5 Rutina recomendada al añadir un proyecto

1. Crear carpeta `assets/projects/<id>/` y subir archivos con nombres limpios.
2. Añadir el objeto en `data/projects.js`.
3. Probar en local (Live Server) y revisar la consola.
4. `git status` → `git add .` → `git commit -m "Add <proyecto>"` → `git push`.
5. Esperar el estado **Ready** en Vercel y revisar la página publicada con `Ctrl + F5`.

## 16.6 Antes de publicar por primera vez (lista de pendientes)

* [ ] Sustituir las URL de ejemplo de `dimensions` en `js/config.js` (`your-username`, `example.com`).
* [ ] Poner el usuario real en `github.username` (si quieres ver repos recientes).
* [ ] Reemplazar el contenido de ejemplo de `data/projects.js` (los 8 proyectos son ficticios) y las `github: "…/your-username/…"` de cada uno.
* [ ] Reemplazar la carpeta de ejemplo `assets/projects/ava/` por la documentación real de AVA.
* [ ] Revisar el texto de "About this space" en `index.html`.
* [ ] Actualizar `<title>`, `meta description` y `aria-label` en `index.html` si cambias el nombre.

---

*Fin de la guía. Si algo de la página cambia en el futuro (nuevos archivos, nuevas funciones), actualiza esta guía junto con el cambio, para que siga siendo fiable.*
