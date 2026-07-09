# Architecture

## Current State (v0.2.x)

GridCrypt is split into native ES modules under `src/`, loaded from
`index.html` via `<script type="module" src="src/main.js"></script>`.
`index.html` itself holds only markup and CSS. No build step or bundler is
used — the project remains directly playable by opening `index.html` (or its
GitHub Pages URL), which was the deliberate reason for choosing native ES
modules over a bundled setup.

### Module map

| Module | Responsibility |
| :--- | :--- |
| `src/core/constants.js` | Static config: `TILE_SIZE`, `MAP_SIZE`, `ENEMIES`, `XP_TABLE`, `EMOJIS` |
| `src/core/dom.js` | Cached DOM/canvas references (`canvas`, `ctx`, `shakeTarget`) |
| `src/core/state.js` | The single mutable `state` object shared across modules, plus `saveSettings()`/`saveStats()`/`saveBestFloor()` persistence helpers |
| `src/audio/AudioEngine.js` | Procedural Web Audio synth — music layer, one-shot SFX, independent music/SFX gain nodes |
| `src/world/mapgen.js` | `generateMap()`, `generateCaves()`, `generateMaze()`, `setFurthestStairs()` |
| `src/world/render.js` | `render()`, `drawEmoji()`, `updateExploration()` |
| `src/entities/spawn.js` | `spawnItemsForFloor()`, `spawnEnemiesForFloor()`, `spawnEnemy()`, `spawnItem()` |
| `src/core/input.js` | `handleInput()`, `tryMove()`, `moveEnemies()`, `gainXp()`, `checkItems()` |
| `src/core/game.js` | `startGame()`, `togglePause()`, `toggleMute()`, `setMusicVol()`/`setSfxVol()`, `endGame()` |
| `src/ui/hud.js` | `shake()`, `showToast()`, `updateUI()`, `renderStatsScreen()` |
| `src/ui/menu.js` | `openMenu()`/`closeMenu()` (origin-aware navigation stack), `restartGame()`, `returnToMainMenu()` |
| `src/main.js` | Entry point — wires DOM init (slider/label defaults), binds `keydown`, and exposes the handful of functions referenced by inline `onclick`/`onpointerdown` HTML attributes onto `window` |

### State sharing model

All mutable game state (`player`, `map`, `enemies`, `items`, `inv`,
`settings`, `stats`, etc.) lives on one object, `state`, exported by
`core/state.js`. Every module that needs to read or mutate game state imports
`{ state }` and accesses/mutates its properties directly (e.g.
`state.player.x = nx`). This avoids the ES module restriction against
reassigning a `let` binding from outside its owning module, without
introducing a class-based state manager — appropriate for the project's size.

### Why functions are exposed on `window`

`index.html` still uses inline `onclick="startGame()"` / `onpointerdown="handleInput('w')"`
attributes (a deliberate choice — no build step, no event-listener
boilerplate for a dozen buttons). Native `<script type="module">` does not
leak top-level declarations into global scope, so `src/main.js` explicitly
assigns the handful of functions referenced by those attributes onto
`window`. This is the only place global scope is touched.

The render loop draws directly to an HTML5 Canvas; audio is generated
procedurally through the Web Audio API (no external sound assets).

## Design Principles

- **Zero-install:** the game must always be playable by opening a URL — no
  build step required to *play* it.
- **Vanilla JS + Canvas2D only:** no frameworks, no game engine (e.g. no
  Godot/Phaser). This is a deliberate constraint of the project, not a
  temporary limitation.
- **Original assets only:** no third-party sprites, audio samples, or fonts
  with unclear licensing.
- **GitHub Pages hosting:** the deployed artifact is static files served
  directly from the repo — no server-side component.

## Planned Direction

See [ROADMAP.md](../ROADMAP.md) for what's next (combat/AI depth, world-gen
pluggable generators, progression content). This document will keep evolving
alongside the code so it always reflects the actual structure rather than an
aspirational one.
