import { state, saveStats, saveBestFloor, saveSettings } from './state.js';
import { AudioEngine } from '../audio/AudioEngine.js';
import { generateMap } from '../world/mapgen.js';
import { showToast } from '../ui/hud.js';
import { render } from '../world/render.js';

export function startGame() {
    AudioEngine.init();
    state.started = true;
    document.getElementById('startScreen').style.display = 'none';
    generateMap();
    showToast('Floor 1');
}

export function togglePause() {
    if (!state.started || state.isGameOver) return;
    state.paused = !state.paused;
    document.getElementById('pauseScreen').style.display = state.paused ? 'flex' : 'none';
}

export function toggleMute() {
    state.muted = !state.muted;
    state.settings.muted = state.muted; saveSettings();
    AudioEngine.setMuted(state.muted);
    document.getElementById('muteBtn').textContent = state.muted ? '🔇' : '🔊';
    const cb = document.getElementById('muteCheckbox');
    if (cb) cb.checked = state.muted;
}

export function setMusicVol(v) {
    state.settings.musicVol = parseInt(v, 10); saveSettings();
    document.getElementById('musicVolLabel').textContent = `${v}%`;
    AudioEngine.applyVolumes();
}

export function setSfxVol(v) {
    state.settings.sfxVol = parseInt(v, 10); saveSettings();
    document.getElementById('sfxVolLabel').textContent = `${v}%`;
    AudioEngine.applyVolumes();
    AudioEngine.sfx('ui-click');
}

export function endGame(win) {
    if(state.isGameOver) return;
    state.isGameOver = true;
    const { player, stats, kills, coins } = state;
    if(player.floor > state.bestFloor) { state.bestFloor = player.floor; saveBestFloor(); }
    stats.runs++;
    if (win) stats.victories++;
    stats.bestFloor = Math.max(stats.bestFloor, player.floor);
    stats.bestLevel = Math.max(stats.bestLevel, player.lvl);
    stats.bestKills = Math.max(stats.bestKills, kills);
    stats.bestCoins = Math.max(stats.bestCoins, coins);
    saveStats();
    const overlay = document.getElementById('gameOver');
    const summary = document.getElementById('stats-summary');
    const title = document.getElementById('statusTitle');
    overlay.style.display = 'flex';
    if (win) {
        title.textContent = "THE LIGHT REACHED"; title.style.color = "#00ff66";
    } else {
        title.textContent = "THE DUNGEON CONSUMES YOU"; title.style.color = "#ff3333";
    }
    summary.innerHTML = `Floor ${player.floor} &middot; Level ${player.lvl} &middot; ${coins} coins &middot; ${kills} slain<br>Deepest descent: Floor ${state.bestFloor}`;
    render();
}
