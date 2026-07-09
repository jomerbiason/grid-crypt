# Architecture

## Current State (v0.1.x)

GridCrypt currently ships as a **single-file architecture**: all markup, CSS,
and game logic live in `index.html`. This was a deliberate early-stage choice
to keep the project zero-install and instantly playable via GitHub Pages, with
no build step or bundler required.

### Runtime structure (within `index.html`)

| Concern | Key functions |
| :--- | :--- |
| **Game lifecycle** | `startGame()`, `togglePause()`, `endGame(win)` |
| **World generation** | `generateMap()`, `generateCaves()`, `generateMaze()`, `setFurthestStairs()` |
| **Entity spawning** | `spawnItemsForFloor()`, `spawnEnemiesForFloor()`, `spawnEnemy(lvl)`, `spawnItem(type)` |
| **Input handling** | `handleInput(key)`, `tryMove(k)` |
| **Simulation** | `moveEnemies()`, `gainXp(amt)`, `checkItems()`, `updateExploration()` |
| **Rendering** | `render()`, `drawEmoji(x, y, e)`, `updateUI()` |
| **Feedback/FX** | `shake(amt)`, `showToast(msg)`, `toggleMute()` |
| **Menu navigation** | `openMenu(screenId, origin)`, `closeMenu()`, `restartGame()`, `returnToMainMenu()` |
| **Persistence** | `saveSettings()`/`saveStats()` — music/SFX volume, mute state, and best-run stats (deepest floor, highest level, most kills, most coins, runs played, victories) via `localStorage` |

The render loop draws directly to an HTML5 Canvas; audio is generated
procedurally through the Web Audio API (no external sound assets).

## Design Principles

- **Zero-install:** the game must always be playable by opening a URL — no
  build step required to *play* it (a build step for *development* is fine,
  see below).
- **Vanilla JS + Canvas2D only:** no frameworks, no game engine (e.g. no
  Godot/Phaser). This is a deliberate constraint of the project, not a
  temporary limitation.
- **Original assets only:** no third-party sprites, audio samples, or fonts
  with unclear licensing.
- **GitHub Pages hosting:** the deployed artifact is static files served
  directly from the repo — no server-side component.

## Planned Direction (v0.2.0+)

The single-file structure works for a small prototype but doesn't scale
cleanly as systems (AI, combat, world-gen) grow. The next architectural pass
(tracked in [ROADMAP.md](../ROADMAP.md)) will:

1. Split logic into ES modules under `src/`:
   - `src/core/` — game loop, state manager, service locator
   - `src/world/` — map/dungeon generation
   - `src/entities/` — player, enemies, items
   - `src/ui/` — HUD, overlays, toasts
   - `src/audio/` — Web Audio synthesizer
2. Keep the **build-free constraint**: use native ES module imports
   (`<script type="module">`) so `index.html` remains directly playable from
   GitHub Pages without a bundler.
3. Introduce a minimal service locator so rendering, input, and simulation
   don't reach into each other's global state directly.

This document will be updated as the modularization lands, so it always
reflects the actual structure of the code rather than the aspirational one.
