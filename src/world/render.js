import { state } from '../core/state.js';
import { MAP_SIZE, EMOJIS } from '../core/constants.js';
import { canvas, ctx } from '../core/dom.js';

export function render() {
    const { player, map, explored, items, enemies, stairsPos, torchActive, isGameOver, currentWallColor } = state;
    ctx.fillStyle = '#000'; ctx.fillRect(0,0,320,320);
    const range = torchActive ? 4 : 1;
    for(let y=0; y<MAP_SIZE; y++) {
        for(let x=0; x<MAP_SIZE; x++) {
            if(!explored[y][x]) continue;
            const inSight = Math.abs(player.x-x)<=range && Math.abs(player.y-y)<=range;
            ctx.fillStyle = map[y][x] === 1 ? (inSight ? currentWallColor : '#161a22') : (inSight ? '#0c1017' : '#040609');
            ctx.fillRect(x*16, y*16, 16, 16);
        }
    }

    if(explored[stairsPos.y][stairsPos.x]) {
        const inSight = Math.abs(player.x-stairsPos.x)<=range && Math.abs(player.y-stairsPos.y)<=range;
        if(inSight) drawEmoji(stairsPos.x, stairsPos.y, EMOJIS.stairs);
    }
    items.forEach(i => {
        if(explored[i.y][i.x] && Math.abs(player.x-i.x)<=range && Math.abs(player.y-i.y)<=range) drawEmoji(i.x, i.y, EMOJIS[i.type] || '❓');
    });
    enemies.forEach(e => {
        if(e.dead && explored[e.y][e.x] && Math.abs(player.x-e.x)<=range && Math.abs(player.y-e.y)<=range) {
            ctx.fillStyle='rgba(120,10,20,0.35)'; ctx.fillRect(e.x*16, e.y*16, 16, 16);
        }
    });
    if(!isGameOver) drawEmoji(player.x, player.y, EMOJIS.player);
    enemies.forEach(e => {
        if(!e.dead && Math.abs(player.x-e.x)<=range && Math.abs(player.y-e.y)<=range) {
            if(e.charging) { ctx.fillStyle='rgba(0,255,102,0.12)'; ctx.fillRect(e.x*16, e.y*16, 16, 16); }
            drawEmoji(e.x, e.y, e.emoji);
            if(e.slashTimer > 0) {
                ctx.strokeStyle = '#ff3333'; ctx.lineWidth = 2; ctx.beginPath();
                if(e.slashDir === '/') { ctx.moveTo(e.x*16+13, e.y*16+3); ctx.lineTo(e.x*16+3, e.y*16+13); }
                else { ctx.moveTo(e.x*16+3, e.y*16+3); ctx.lineTo(e.x*16+13, e.y*16+13); }
                ctx.stroke(); e.slashTimer--;
                if(e.slashTimer > 0) requestAnimationFrame(render);
            }
        }
    });
}

export function drawEmoji(x,y,e){
    ctx.font='11px Arial';
    ctx.textAlign='center';
    ctx.textBaseline='middle';
    ctx.fillStyle='#fff';
    ctx.fillText(e, x*16 + 8, y*16 + 8);
}

export function updateExploration() {
    const { player, torchActive, explored } = state;
    const r = torchActive ? 4 : 1;
    for(let y=player.y-r; y<=player.y+r; y++) {
        for(let x=player.x-r; x<=player.x+r; x++) {
            if(y>=0 && y<MAP_SIZE && x>=0 && x<MAP_SIZE) explored[y][x] = true;
        }
    }
}
