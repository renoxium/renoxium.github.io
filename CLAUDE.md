# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project layout

The entire site lives in `Renoxium.com/`. There is no build step, no package.json, no bundler, no test suite. `index.html` loads React 18, ReactDOM, and `@babel/standalone` from unpkg, then loads each `.jsx` file via `<script type="text/babel">`. Babel transpiles JSX in the browser at page load.

Implication: any new component must be (a) added as another `<script type="text/babel">` tag in `index.html` in the correct order, and (b) attach itself to `window` (e.g. `window.MyComponent = MyComponent`) — there are no ES module imports. The order in `index.html` is the dependency order; helpers must load before consumers.

## Running locally

Serve `Renoxium.com/` over HTTP from any static server (the babel-standalone CDN won't work over `file://`). Anything works — `python -m http.server`, `npx serve`, IDE live-server. There are no commands to lint, build, or test.

## Architecture

### Stage-driven SPA
`app.jsx` mounts `<Stage pages={...}>`, where `pages` is a map of page-key → React element. There is no router; `Stage` (`components/Stage.jsx`) owns the current page and orchestrates a multi-phase ball-morph transition between pages:

```
idle → implode → chase → explode-init → explode → idle
```

Pages are: `home`, `craft`, `process`, `faq`, `contact`. Each page has a direction vector in `PAGE_DIR` (Stage.jsx) that controls where the transition ball flies in/out. Only one page is mounted at a time (keyed re-mount by `currentPage`).

`Stage` exposes a context via `useStage()` returning `{ currentPage, goTo(page, originRect?), phase, isMobile }`. `Nav` consumes this — clicking a label calls `stage.goTo(page, rect)` so the transition ball can originate from the clicked label's bounding box. Arrow keys cycle pages.

Mobile (`<= 720px`): the same phase machine runs but with shorter durations and reduced perspective translation.

### Page shell
Wrap every new page in `<PageShell label="...">` (set up in `app.jsx`). PageShell replays all `.reveal` elements inside it on mount with a staggered delay — this is how page-enter animations restart on each navigation. `SplitText` (in `_helpers.jsx`) handles its own `.char` reveal via IntersectionObserver and should not be interfered with.

### Shared interaction primitives (`components/_helpers.jsx`)
- Custom amber cursor (dot + lerping ring) is initialized once globally; disabled under 900px.
- `useMagnetic(strength)` — ref hook that tugs an element toward the cursor.
- `SplitText` — splits text into per-character spans for staggered reveal; respects `\n` as `<br/>`.
- `ScrambleOnView` — scrambles text in when scrolled into view.
- All exposed via `window.*`.

### Tweaks panel (`tweaks-panel.jsx`)
This is reusable infrastructure for an external host (an editor) to live-edit tweakable values. The panel:
- Reads defaults from a `window.TWEAK_DEFAULTS` block in `index.html` delimited by `/*EDITMODE-BEGIN*/ ... /*EDITMODE-END*/`. The host rewrites the JSON between those markers when values change — **do not remove or rename these comment markers**.
- Listens for `__activate_edit_mode` / `__deactivate_edit_mode` postMessages and announces itself with `__edit_mode_available`. Persists changes by posting `__edit_mode_set_keys` to the parent window.
- Provides `useTweaks(defaults)` and `<TweakSlider/Toggle/Radio/Select/Text/Number/Color/Button>` controls, all exposed on `window`.

The panel is hidden by default; it only appears when a parent frame activates it. End users visiting the deployed site never see it.

### Theming
Two themes (`dark` default, `light`) implemented entirely via CSS custom properties on `:root` and `[data-theme="light"]` in `index.html`. `app.jsx` toggles `data-theme` on `<html>` based on the `dark` tweak. Type scale is also a CSS variable (`--scale`) driven by the same tweaks. Use the existing tokens (`--bg`, `--ink`, `--amber`, `--serif`, etc.) rather than hardcoding colors or fonts.

### Fonts
Fraunces (serif/display), Space Grotesk (sans/UI), JetBrains Mono (mono labels) — loaded from Google Fonts in `index.html`. Display headlines use Fraunces with variable axes (`opsz`, `SOFT`).

## Git note

The site lives one level deep in `Renoxium.com/` even though the repo name is `renoxium.github.io`. If this is intended as a GitHub Pages deployment, content would normally need to be at the repo root — confirm with the user before restructuring.
