# Operation Iron Storm

A 2D vertical shoot 'em up built with Phaser 3, TypeScript, and Vite.

## Story

You are an elite Phoenix Squadron pilot. The Dominion controls the skies.
Destroy five strongholds, defeat Project OMEGA, and restore peace.

## Controls

| Action | Keys |
| --- | --- |
| Move | WASD or Arrow Keys |
| Fire | Space |
| Bomb | X |
| Pause | Esc |

## Gameplay Loop

Main Menu → Plane Select → Stage (2-minute survival) → Warning → Boss → Stage Clear → repeat until Stage 5 → Ending

## Development

```bash
npm install
npm run dev      # start local dev server
npm run build    # typecheck + production build to dist/
npm run preview  # preview the production build
npm run lint     # run ESLint
npm run format   # run Prettier
```

## Deployment

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds the
project and publishes `dist/` to GitHub Pages automatically.

## Project Structure

```
src/
  config/     game-wide constants and data-driven configs
  entities/   Player, Enemy, Boss, Powerup
  systems/    pooling, spawning, stage/weapon/save systems
  scenes/     Boot, Menu, PlaneSelect, Game, Pause, Ending
  ui/         HUD, boss health bar
  audio/      procedural WebAudio sound manager
  effects/    explosion particle effect
```

## Save Data

Stored in `localStorage`: high score, volume/difficulty settings, and planes
unlocked by score threshold. No backend, no online features.
