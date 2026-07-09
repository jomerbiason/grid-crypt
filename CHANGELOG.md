# Changelog

All notable changes to GridCrypt are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Start/pause overlays, mute toggle, and toast notifications.
- Expanded Title screen menu with Play, Stats, Settings, and Credits.
- Pause menu with Resume, Restart, Settings, and Main Menu options, with origin-aware back navigation.
- Settings screen: independent music/SFX volume sliders, mute toggle, and a controls legend.
- Credits screen.
- Persistent Stats screen (deepest floor, highest level, most kills, most coins, runs played, victories) tracked via `localStorage` across runs.
- Project documentation: `CHANGELOG.md`, `ROADMAP.md`, `docs/ARCHITECTURE.md`.

## [0.1.0] - 2026-05-29

### Added
- Initial playable release: procedural Maze/Cave dungeon generation.
- Core survival loop — Torch (light radius), Sword (durability), Shield (defense), Potions (health).
- Dynamic HUD with HP, Level, XP, and equipment tracking.
- Touch-optimized virtual D-Pad and diamond action-button layout.
- Custom Web Audio API synthesizer for procedural sound effects (no external audio assets).
- Ghost-click mitigation and forced-landscape viewport lock for mobile play.

[Unreleased]: https://github.com/jomerbiason/grid-crypt/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/jomerbiason/grid-crypt/releases/tag/v0.1.0
