# Roadmap

GridCrypt is an actively developed solo project. This roadmap tracks planned
work, grouped by milestone. Items move to [CHANGELOG.md](CHANGELOG.md) once shipped.

## v0.2.0 — Architecture Foundation
- [ ] Break the single-file `index.html` into a modular vanilla JS structure
      (`src/core`, `src/world`, `src/entities`, `src/ui`, `src/audio`).
- [ ] Introduce a lightweight service locator / game-state manager to decouple
      rendering, input, and simulation.
- [ ] Add a build-free module loading strategy (native ES modules) to keep the
      zero-install, GitHub Pages–hosted play experience.

## v0.3.0 — Combat & AI Depth
- [ ] Expand melee combat mechanics (attack timing, enemy variety).
- [ ] Add finite state machine–driven enemy AI (idle, chase, attack, flee).
- [ ] Tune A* / pathfinding for enemy movement performance on larger floors.

## v0.4.0 — World Generation Polish
- [ ] Decouple dungeon generation into a dedicated pipeline (Maze/Cave hybrid
      as pluggable generator strategies).
- [ ] Add floor-to-floor difficulty scaling and biome variation.

## v0.5.0 — Progression & Content
- [ ] Item/equipment variety beyond Torch, Sword, Shield, Potion.
- [ ] Persistent run stats (local storage) — best depth, runs played.
- [ ] Additional enemy types and boss encounter on deeper floors.

## Backlog / Ideas
- [ ] Optional desktop keybinding remap UI.
- [ ] Accessibility pass (colorblind-safe palette, reduced-motion mode).
- [ ] Procedural audio motif variation per floor theme.

---

This roadmap reflects planned direction, not commitments with fixed dates —
it will evolve as the project matures. See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
for the current technical structure.
