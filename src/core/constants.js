export const TILE_SIZE = 16, MAP_SIZE = 20;

export const ENEMIES = {
    lvl1: { hp: 2, atk: 2, def: 0, xp: 1, drop: 0.2 },
    lvl2: { hp: 10, atk: 3, def: 1, xp: 3, drop: 0.4 },
    lvl3: { hp: 25, atk: 5, def: 2, xp: 8, drop: 0.6 }
};

export const XP_TABLE = [0, 8, 16, 32, 64, 128, 256, 512];

const asciiColors = {
    player: '#00ffff', stairs: '#ffdd33', potion: '#ff66ff', coin: '#ffd700',
    sword: '#cccccc', shield: '#66aaff', torch: '#ff8800', merchant: '#33ff99', enemy: '#ff5555'
};

export const THEMES = {
    emoji: {
        label: 'EMOJI',
        font: '11px Arial',
        wallPalette: ['#1a261a', '#261a1a', '#26221a', '#1a1f26', '#2b2715'],
        glyphs: { player:'⚔️', stairs:'🪜', potion:'🧪', coin:'🪙', sword:'🗡️', shield:'🛡️', torch:'🔥', merchant:'👳' },
        enemyGlyphs: { lvl1:['🪲','🕷️','🦂'], lvl2:['🦎','🐀','🦇'], lvl3:['🐺','🧟','💀'] },
        color() { return '#fff'; }
    },
    terminal: {
        label: 'TERMINAL',
        font: 'bold 14px "Courier New", monospace',
        wallPalette: ['#003300'],
        glyphs: { player:'@', stairs:'>', potion:'!', coin:'$', sword:'/', shield:'[', torch:'i', merchant:'&' },
        enemyGlyphs: { lvl1:['r','b','s'], lvl2:['k','j','o'], lvl3:['T','Z','D'] },
        color() { return '#00ff66'; }
    },
    ascii: {
        label: 'ASCII',
        font: 'bold 14px "Courier New", monospace',
        wallPalette: ['#332200', '#3a2a00', '#3d2b00'],
        glyphs: { player:'@', stairs:'>', potion:'!', coin:'$', sword:'/', shield:'[', torch:'i', merchant:'&' },
        enemyGlyphs: { lvl1:['r','b','s'], lvl2:['k','j','o'], lvl3:['T','Z','D'] },
        color(type) { return asciiColors[type] || asciiColors.enemy; }
    }
};
