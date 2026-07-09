export const TILE_SIZE = 16, MAP_SIZE = 20;

export const ENEMIES = {
    lvl1: { hp: 2, atk: 2, def: 0, xp: 1, drop: 0.2, icons: ['🪲','🕷️','🦂'] },
    lvl2: { hp: 10, atk: 3, def: 1, xp: 3, drop: 0.4, icons: ['🦎','🐀','🦇'] },
    lvl3: { hp: 25, atk: 5, def: 2, xp: 8, drop: 0.6, icons: ['🐺','🧟','💀'] }
};

export const XP_TABLE = [0, 8, 16, 32, 64, 128, 256, 512];

export const EMOJIS = { player:'⚔️', stairs:'🪜', potion:'🧪', coin:'🪙', sword:'🗡️', shield:'🛡️', torch:'🔥', merchant: '👳' };
