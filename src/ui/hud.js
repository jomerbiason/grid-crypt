import { state } from '../core/state.js';
import { shakeTarget } from '../core/dom.js';
import { XP_TABLE } from '../core/constants.js';

export function shake(amt = 4) {
    shakeTarget.style.transform = `translate(${Math.random()*amt-amt/2}px, ${Math.random()*amt-amt/2}px)`;
    setTimeout(() => shakeTarget.style.transform = 'translate(0,0)', 50);
}

export function showToast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.style.opacity = '1';
    clearTimeout(state.toastTimer);
    state.toastTimer = setTimeout(() => { t.style.opacity = '0'; }, 1400);
}

export function updateUI() {
    const { player, inv, coins, torchActive } = state;
    document.getElementById('lvl').textContent = `✨${player.lvl}`;
    document.getElementById('hp').textContent = `❤️${player.hp}`;
    document.getElementById('atk').textContent = `🦾${player.atk + (player.swdOn?4:0)}`;
    document.getElementById('def').textContent = `🗿${player.def + (player.shdOn?4:0)}`;
    document.getElementById('xp').textContent = player.lvl < 7 ? `${player.xp}/${XP_TABLE[player.lvl]}` : 'MAX';
    document.getElementById('fl').textContent = `🪜${player.floor}`;
    document.getElementById('light').textContent = torchActive ? '💡ON' : '💡OFF';
    document.getElementById('h-sw').textContent = `🗡️${inv.swordDur}`;
    document.getElementById('h-sh').textContent = `🛡️${inv.shieldDur}`;
    document.getElementById('h-tr').textContent = `🔥${inv.torchDur}`;
    document.getElementById('h-pt').textContent = `🧪${inv.potions}`;
    document.getElementById('coins').textContent = `💰${coins}`;
}

export function syncThemeUI() {
    document.body.classList.remove('theme-emoji', 'theme-terminal', 'theme-ascii');
    document.body.classList.add(`theme-${state.settings.theme}`);
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.theme === state.settings.theme);
    });
}

export function renderStatsScreen() {
    const s = state.stats;
    document.getElementById('stat-bestFloor').textContent = s.bestFloor;
    document.getElementById('stat-bestLevel').textContent = s.bestLevel;
    document.getElementById('stat-bestKills').textContent = s.bestKills;
    document.getElementById('stat-bestCoins').textContent = s.bestCoins;
    document.getElementById('stat-runs').textContent = s.runs;
    document.getElementById('stat-victories').textContent = s.victories;
}
