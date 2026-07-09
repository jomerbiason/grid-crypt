import { state } from '../core/state.js';
import { MAP_SIZE, ENEMIES } from '../core/constants.js';

export function spawnItemsForFloor() {
    const { player, stairsPos, map, items } = state;
    if(player.floor === 5) {
        let m = stairsPos;
        const placeShopItem = (ox, oy, type, cost) => {
            let nx = m.x + ox, ny = m.y + oy;
            if(nx >= 0 && nx < MAP_SIZE && ny >= 0 && ny < MAP_SIZE) {
                map[ny][nx] = 0;
                items.push({x:nx, y:ny, type, cost});
            }
        };
        placeShopItem(-1, 0, 'merchant');
        placeShopItem(-1, -1, 'potion', 5);
        placeShopItem(0, -1, 'sword', 5);
        placeShopItem(1, -1, 'torch', 5);
        placeShopItem(1, 0, 'shield', 5);
    } else {
        spawnItem('torch');
        if(Math.random() < 0.20) spawnItem('sword');
        if(Math.random() < 0.20) spawnItem('shield');
    }
}

export function spawnEnemiesForFloor() {
    const { player } = state;
    let count = 4 + Math.floor(player.floor / 2);
    for(let i = 0; i < count; i++) {
        let type = player.floor >= 7 ? (Math.random()>0.4?'lvl3':'lvl2') : (player.floor>=4 && Math.random()>0.5?'lvl2':'lvl1');
        spawnEnemy(type);
    }
}

export function spawnEnemy(lvl) {
    const { player, floorTiles, enemies } = state;
    let d = ENEMIES[lvl];
    let validTiles = floorTiles.filter(t => Math.max(Math.abs(t.x-player.x), Math.abs(t.y-player.y)) > 4);
    if(validTiles.length === 0) validTiles = floorTiles;
    let t = validTiles[Math.floor(Math.random()*validTiles.length)];
    enemies.push({ x: t.x, y: t.y, ...d, hp: d.hp, dead:false, charging:false, slashTimer:0, slashDir:'/', emoji: d.icons[Math.floor(Math.random()*d.icons.length)] });
}

export function spawnItem(type) {
    const { floorTiles, items } = state;
    let t = floorTiles[Math.floor(Math.random()*floorTiles.length)];
    items.push({x: t.x, y: t.y, type});
}
