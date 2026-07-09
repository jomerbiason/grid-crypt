import { state } from './core/state.js';
import { handleInput } from './core/input.js';
import { startGame, togglePause, toggleMute, setMusicVol, setSfxVol } from './core/game.js';
import { openMenu, closeMenu, restartGame, returnToMainMenu } from './ui/menu.js';

// Inline onclick/onpointerdown handlers in index.html reference these by name,
// so they must be exposed on window (native <script type="module"> does not
// leak declarations into global scope).
Object.assign(window, {
    handleInput, startGame, togglePause, toggleMute, setMusicVol, setSfxVol,
    openMenu, closeMenu, restartGame, returnToMainMenu,
});

document.getElementById('bestFloorText').textContent = state.bestFloor > 0
    ? `Deepest descent so far: Floor ${state.bestFloor}`
    : 'No previous descent recorded.';
document.getElementById('musicVolSlider').value = state.settings.musicVol;
document.getElementById('musicVolLabel').textContent = `${state.settings.musicVol}%`;
document.getElementById('sfxVolSlider').value = state.settings.sfxVol;
document.getElementById('sfxVolLabel').textContent = `${state.settings.sfxVol}%`;
document.getElementById('muteCheckbox').checked = state.muted;
document.getElementById('muteBtn').textContent = state.muted ? '🔇' : '🔊';

window.addEventListener('keydown', e => handleInput(e.key));
