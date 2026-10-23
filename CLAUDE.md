# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Personal engineering portfolio for Pavlos P: a static, single-page site in three files (`index.html`, `style.css`, `script.js`). It has no build step, package manager, dependencies, linter or tests. The only external resource is Google Fonts (Newsreader and IBM Plex Mono).

To preview it, serve the folder statically. The workspace is set up for the VS Code Live Server extension on port 5501 (`.vscode/settings.json`); `python -m http.server` also works. Check changes in a browser at both desktop width and below the 860px breakpoint.

## Architecture

**Two views, hash routing.** `index.html` holds both `#home-view` (the résumé index plus a fixed preview panel) and `#project-view` (one article column). `route()` in `script.js` runs on `hashchange`. If `#<key>` matches a key in `projects`, the project view is shown and rebuilt from data; any other hash shows the home view. Because the hash selects the project, in-article navigation (the Contents list) uses buttons that scroll to the heading, not `#anchor` links.

**`projects` is the content model.** Each entry in the `projects` object in `script.js` becomes one index row and one project page. Insertion order sets the "drawing number" (`drawingNumber(key)`, zero-padded), so reordering keys renumbers projects. Optional fields: `subtitle`, `role`, `tools`, `results` (`[value, label, detail]`), `image`, `video`, and `specs` (`{ title, groups: [{ group, rows }] }`). Spec-line and section elements are hidden when their field is missing. The `text` array is a small document format:
- a string is a paragraph, inserted with `innerHTML` so it may contain `<strong>` lead-ins and `<a class="link">`
- `{ heading }` is a numbered subhead; three or more headings generate the Contents nav
- `{ list: [html] }` is a bullet list
- `{ figure: name }` calls a builder in the `figures` registry (`airfoils`, `polars`, `timeline`, `sweep`, `reynolds`)
- `{ media: [{ src, width, height, alt }], caption }` is a row of photos or clips, sized by aspect ratio. `width` and `height` are required. A `.mp4` item takes its poster from the same path with `.jpg`. Muted clips autoplay while on screen unless reduced motion is set.

Figure numbers ("Fig. N —") are added automatically at render time. Don't write them into captions.

**Home preview panel.** Hovering or focusing an index row calls `showPreview(key)`. Experience rows call `showRole(row)`, but only when `matchMedia("(hover: hover) and (min-width: 1320px) and (min-height: 640px)")` matches. In that case the role bullets are visually hidden in the row and shown in the panel card; everywhere else they stay inline. `previewToken` cancels stale async video loads, so bump it in any new code that changes the panel. The title block (`setTitleBlock`) and the dimension-line labels are updated from the same calls.

**Single sources.** The `contact` array fills every `.contact-links` element in both views. The role card is built from the row's own DOM (`data-dates`, `.entry-meta`, `.entry-points`), so edit roles in `index.html`, not in JS.

**Aerodynamics data.** The `airfoils` (profile coordinates and XFoil polars), `sweep` (275-foil batch ranking), `air(h)` (ISA plus Sutherland) and `reynolds()` blocks at the top of `script.js` feed the charts, the Reynolds calculator and one spec row. Comments there record the data provenance and solver settings, so keep them accurate. The polar charts and the sweep scatter each render inline SVG at the measured container width using a `ResizeObserver`, with a pointer-hover tooltip.

**Facts live in several places.** LWS X numbers (masses, speeds, Cl/Cd, airfoil counts) appear in the `results`, `specs` and `text` entries in `script.js`, in `index.html` (featured caption), and in `lws-x/lws-x-full-story.md`, a long-form prose version of the same write-up. When a figure changes, update every copy.

## Styling conventions

- The theme is a drafting sheet: paper, graphite ink and one red-pencil accent (`--accent`). The site's terms follow it: "Dwg no.", title block, dimension lines, "parts" for projects.
- Use the tokens in `:root` (colors, the `--t-*` type scale, the `--s-*` spacing scale, `--line`, `--dur`/`--ease`) rather than raw values.
- The "Primitives" section of `style.css` (`.mono`, `.mono-data`, `.muted`, `.title` + size modifiers, `.subhead`, `.link`, `.kv`, `.cells`, `.grid-paper`, `.section-head`) is what components are built from; compose them before adding new classes. `.mono` is uppercase for labels, and `.mono-data` keeps case for units. `.cells` draws its internal rules as 1px gaps over an ink background.
- `a.link` pointing outside the page automatically gets a ↗ suffix from CSS. Don't add arrows by hand.
- Keep the existing accessibility behavior: `:focus-visible` rings, `aria-live` on the title block and the Re output, and SVG `role="img"` + `aria-label`. Reduced motion is respected in both CSS and JS (`reduceMotion`).
- Responsive layout uses one breakpoint (`max-width: 860px`), where the fixed panel stacks under the index.

## Assets

Original photos and videos sit in `lws-x/` and `across-the-years/`. Web-encoded clips and their `.jpg` posters go in `lws-x/web/`. Many filenames contain spaces: use `%20` in `src` strings built in JS (as with the ESC schematic). `Resume 9_27_2026.pdf` is at the repo root and is not currently linked from the site. The `placeholder` and `over-the-years` projects are stubs and do show in the public index.
