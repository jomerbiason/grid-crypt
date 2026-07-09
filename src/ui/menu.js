import { state } from '../core/state.js';
import { AudioEngine } from '../audio/AudioEngine.js';
import { renderStatsScreen } from './hud.js';

export function openMenu(screenId, origin) {
    if (origin === 'title') document.getElementById('startScreen').style.display = 'none';
    state.menuStack.push(origin);
    if (screenId === 'statsScreen') renderStatsScreen();
    document.getElementById(screenId).style.display = 'flex';
    AudioEngine.sfx('ui-click');
}

export function closeMenu() {
    const opened = document.querySelectorAll('.overlay[style*="flex"]');
    opened.forEach(el => { if (['settingsScreen','creditsScreen','statsScreen'].includes(el.id)) el.style.display = 'none'; });
    const origin = state.menuStack.pop();
    if (origin === 'title') document.getElementById('startScreen').style.display = 'flex';
    AudioEngine.sfx('ui-click');
}

export function restartGame() { location.reload(); }
export function returnToMainMenu() { location.reload(); }
