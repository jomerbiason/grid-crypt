import { state } from './state.js';
import { MAP_SIZE, XP_TABLE } from './constants.js';
import { AudioEngine } from '../audio/AudioEngine.js';
import { shake, showToast, updateUI } from '../ui/hud.js';
import { render, updateExploration } from '../world/render.js';
import { generateMap } from '../world/mapgen.js';
import { togglePause, toggleMute, endGame } from './game.js';

export function handleInput(key) {
    const k = key.toLowerCase();
    if (k === 'p') { togglePause(); return; }
    if (k === 'm') { toggleMute(); return; }
    if (!state.started || state.paused || state.isGameOver) return;
    AudioEngine.init();
    if(['w','a','s','d','q','e','r','t'].includes(k)) AudioEngine.sfx('ui-click');
    if(['w','a','s','d'].includes(k)) tryMove(k);
    const { player, inv } = state;
    if(k==='q') { if(inv.swordDur > 0) { player.swdOn = !player.swdOn; AudioEngine.sfx(player.swdOn?'sword-on':'sword-off'); } }
    if(k==='e') { if(inv.shieldDur > 0) { player.shdOn = !player.shdOn; AudioEngine.sfx(player.shdOn?'shield-on':'shield-off'); } }
    if(k==='r') { if(inv.torchDur > 0) { state.torchActive = !state.torchActive; AudioEngine.sfx('torch'); } }
    if(k==='t') { if(inv.potions > 0 && player.hp < player.maxHp) { player.hp = Math.min(player.maxHp, player.hp + 8); inv.potions--; AudioEngine.sfx('potion'); showToast('+8 HP'); } }
    updateUI();
    render();
}

export function tryMove(k) {
    if(state.isGameOver) return;
    const { player, map, enemies, inv } = state;
    let dx=0, dy=0;
    if(k==='w') dy=-1; if(k==='s') dy=1;
    if(k==='a') dx=-1; if(k==='d') dx=1;
    const nx = player.x + dx, ny = player.y + dy;

    if(nx < 0 || nx >= MAP_SIZE || ny < 0 || ny >= MAP_SIZE) return;
    const aliveEnemyIdx = enemies.findIndex(e => e.x === nx && e.y === ny && !e.dead);
    if(aliveEnemyIdx > -1) {
        let enemy = enemies[aliveEnemyIdx];
        let pAtk = player.atk + (player.swdOn ? 4 : 0);
        enemy.hp -= Math.max(1, pAtk - enemy.def);
        AudioEngine.sfx(player.swdOn ? 'sword-hit' : 'punch');
        if(player.swdOn) { inv.swordDur--; if(inv.swordDur <= 0) { player.swdOn=false; AudioEngine.sfx('sword-off'); } }
        enemy.slashTimer = 6; enemy.slashDir = (state.slashState++ % 2 === 0) ? '/' : '\\';
        shake(2);
        if(enemy.hp <= 0) {
            enemy.dead = true; state.kills++; gainXp(enemy.xp);
            if(Math.random() < enemy.drop) state.items.push({x:nx, y:ny, type: Math.random() > 0.1 ? 'coin' : 'potion'});
        }
        if(state.torchActive) { inv.torchDur--; if(inv.torchDur <= 0) { state.torchActive = false; AudioEngine.sfx('torch'); } }
        moveEnemies();
    } else if(map[ny][nx] === 0) {
        player.x = nx; player.y = ny;
        if(state.torchActive) {
            inv.torchDur--;
            if(inv.torchDur <= 0) { state.torchActive = false; AudioEngine.sfx('torch'); }
        }
        updateExploration();
        checkItems();
        if(player.x === state.stairsPos.x && player.y === state.stairsPos.y) {
            if(player.floor === 10) { endGame(true); return; }
            else {
                player.floor++; generateMap(); AudioEngine.sfx('pickup');
                showToast(player.floor === 5 ? 'Floor 5: Merchant found!' : `Floor ${player.floor}`);
                return;
            }
        } else {
            moveEnemies();
        }
    }
    if(player.hp <= 0) { player.hp = 0; endGame(false); }
    updateUI();
}

export function moveEnemies() {
    if(state.isGameOver) return;
    const { player, enemies, map, inv } = state;
    enemies.forEach(e => {
        if(e.dead || state.isGameOver) return;
        let dist = Math.abs(player.x - e.x) + Math.abs(player.y - e.y);
        if(e.charging) {
            if(dist <= 1) {
                let pDef = player.def + (player.shdOn ? 4 : 0);
                player.hp -= Math.max(1, e.atk - pDef);
                if(player.shdOn) { inv.shieldDur--; AudioEngine.sfx('block'); if(inv.shieldDur <= 0) player.shdOn=false; }
                else AudioEngine.sfx('hurt');
                shake(5);
            } e.charging = false;
        } else if(dist < 6) {
            const mx = player.x > e.x ? 1 : player.x < e.x ? -1 : 0;
            const my = player.y > e.y ? 1 : player.y < e.y ? -1 : 0;

            let nextX = e.x, nextY = e.y;
            if (map[e.y][e.x + mx] === 0 && !enemies.some(en => !en.dead && en.x === e.x + mx && en.y === e.y)) {
                nextX += mx;
            }
            if (map[e.y + my][nextX] === 0 && !enemies.some(en => !en.dead && en.x === nextX && en.y === e.y + my)) {
                nextY += my;
            }
            e.x = nextX; e.y = nextY;

            if(Math.abs(player.x-e.x) <= 1 && Math.abs(player.y-e.y) <= 1) e.charging = true;
        }
        if(player.hp <= 0) { player.hp = 0; endGame(false); }
    });
}

export function gainXp(amt) {
    const { player } = state;
    player.xp += amt;
    while(player.lvl < 7 && player.xp >= XP_TABLE[player.lvl]) {
        player.xp -= XP_TABLE[player.lvl]; player.lvl++; player.maxHp += 4; player.hp = player.maxHp; player.atk += 1;
        AudioEngine.sfx('lvl'); showToast(`LEVEL UP! Lv.${player.lvl}`);
    }
}

export function checkItems() {
    const { player } = state;
    state.items = state.items.filter(i => {
        if(i.x === player.x && i.y === player.y) {
            if(i.type === 'merchant') { showToast('Merchant: 5 coins each'); return true; }
            if(i.cost && state.coins < i.cost) { AudioEngine.sfx('denied'); showToast(`Need ${i.cost} coins`); return true; }
            if(i.cost) { state.coins -= i.cost; showToast('Purchased!'); }
            if(i.type === 'sword') { state.inv.swordDur = 15; showToast('Sword restored'); }
            if(i.type === 'shield') { state.inv.shieldDur = 15; showToast('Shield restored'); }
            if(i.type === 'torch') { state.inv.torchDur = 30; showToast('Torch refueled'); }
            if(i.type === 'potion') { state.inv.potions += 1; showToast('Potion +1'); }
            if(i.type === 'coin') { state.coins += 1; }
            AudioEngine.sfx('pickup'); return false;
        } return true;
    });
}
