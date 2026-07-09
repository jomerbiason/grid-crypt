import { state } from '../core/state.js';
import { MAP_SIZE, THEMES } from '../core/constants.js';
import { spawnItemsForFloor, spawnEnemiesForFloor } from '../entities/spawn.js';
import { updateExploration, render } from './render.js';
import { updateUI } from '../ui/hud.js';

export function generateMap() {
    const { player } = state;
    const isSpecialFloor = (player.floor === 1 || player.floor === 5 || player.floor === 10);
    const useMaze = !isSpecialFloor && Math.random() > 0.5;
    const wallPalette = (THEMES[state.settings.theme] || THEMES.emoji).wallPalette;
    state.currentWallColor = wallPalette[Math.floor(Math.random() * wallPalette.length)];

    state.floorTiles = [];
    if (useMaze) generateMaze(); else generateCaves();

    spawnItemsForFloor();
    spawnEnemiesForFloor();
    updateExploration();
    updateUI();
    render();
}

export function generateCaves() {
    const { player } = state;
    state.map = Array.from({length: MAP_SIZE}, () => Array(MAP_SIZE).fill(1));
    state.explored = Array.from({length: MAP_SIZE}, () => Array(MAP_SIZE).fill(false));
    state.enemies = []; state.items = [];
    let cx = 1, cy = 1;
    state.map[cy][cx] = 0;
    state.floorTiles.push({x:1, y:1});
    for(let i=0; i<180; i++) {
        let dir = [{x:1,y:0},{x:-1,y:0},{x:0,y:1},{x:0,y:-1}][Math.floor(Math.random()*4)];
        let nx = Math.max(1, Math.min(MAP_SIZE-2, cx + dir.x));
        let ny = Math.max(1, Math.min(MAP_SIZE-2, cy + dir.y));
        if(state.map[ny][nx] === 1) { state.map[ny][nx] = 0; state.floorTiles.push({x:nx, y:ny}); }
        cx = nx; cy = ny;
    }
    player.x = 1; player.y = 1;
    setFurthestStairs();
}

export function generateMaze() {
    const { player } = state;
    state.map = Array.from({length: MAP_SIZE}, () => Array(MAP_SIZE).fill(1));
    state.explored = Array.from({length: MAP_SIZE}, () => Array(MAP_SIZE).fill(false));
    state.enemies = []; state.items = [];
    function carve(x, y) {
        state.map[y][x] = 0; state.floorTiles.push({x, y});
        let dirs = [{x:2,y:0},{x:-2,y:0},{x:0,y:2},{x:0,y:-2}].sort(()=>Math.random()-0.5);
        for (let d of dirs) {
            let nx = x + d.x, ny = y + d.y;
            if (nx>0 && nx<MAP_SIZE-1 && ny>0 && ny<MAP_SIZE-1 && state.map[ny][nx]===1) {
                state.map[y+d.y/2][x+d.x/2] = 0; state.floorTiles.push({x: x+d.x/2, y: y+d.y/2});
                carve(nx, ny);
            }
        }
    }
    carve(1, 1);
    player.x = 1; player.y = 1;
    setFurthestStairs();
}

export function setFurthestStairs() {
    const { player, floorTiles } = state;
    let maxDist = 0, bestTile = floorTiles[0];
    floorTiles.forEach(t => {
        let d = Math.abs(t.x - player.x) + Math.abs(t.y - player.y);
        if (d > maxDist) { maxDist = d; bestTile = t; }
    });
    state.stairsPos = bestTile;
}
