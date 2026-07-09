export const DEFAULT_SETTINGS = { musicVol: 70, sfxVol: 70, muted: false, theme: 'emoji' };
export const DEFAULT_STATS = { bestFloor: 0, bestLevel: 0, bestKills: 0, bestCoins: 0, runs: 0, victories: 0 };

const loadedSettings = Object.assign({}, DEFAULT_SETTINGS, JSON.parse(localStorage.getItem('gridcrypt_settings') || '{}'));
const loadedStats = Object.assign({}, DEFAULT_STATS, JSON.parse(localStorage.getItem('gridcrypt_stats') || '{}'));

export const state = {
    map: [], enemies: [], items: [], explored: [], floorTiles: [],
    torchActive: false, coins: 0, stairsPos: { x: 0, y: 0 }, isGameOver: false,
    inv: { torchDur: 20, potions: 1, swordDur: 10, shieldDur: 10 },
    player: { x: 1, y: 1, hp: 20, maxHp: 20, atk: 1, def: 0, lvl: 1, xp: 0, floor: 1, swdOn: false, shdOn: false },
    currentWallColor: '#444',
    slashState: 0,
    started: false, paused: false, muted: loadedSettings.muted, kills: 0,
    bestFloor: parseInt(localStorage.getItem('gridcrypt_best') || '0', 10),
    toastTimer: null,
    menuStack: [],
    settings: loadedSettings,
    stats: loadedStats,
};

export function saveSettings() { localStorage.setItem('gridcrypt_settings', JSON.stringify(state.settings)); }
export function saveStats() { localStorage.setItem('gridcrypt_stats', JSON.stringify(state.stats)); }
export function saveBestFloor() { localStorage.setItem('gridcrypt_best', String(state.bestFloor)); }
