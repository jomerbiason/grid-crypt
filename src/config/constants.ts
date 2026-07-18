export const GAME_WIDTH = 480;
export const GAME_HEIGHT = 720;

export const SCENE_KEYS = {
    BOOT: 'BootScene',
    MENU: 'MenuScene',
    PLANE_SELECT: 'PlaneSelectScene',
    GAME: 'GameScene',
    PAUSE: 'PauseScene',
    ENDING: 'EndingScene',
} as const;

export const STAGE_NAMES = [
    'COASTAL ASSAULT',
    'JUNGLE FRONT',
    'DESERT FORTRESS',
    'STEEL ARMADA',
    'SKY CITADEL',
] as const;

export const STAGE = {
    survivalDurationMs: 120_000,
    warningDurationMs: 1800,
    clearedDurationMs: 2200,
} as const;

export const PLAYER = {
    speed: 260,
    startLives: 3,
    startBombs: 2,
    bulletDamage: 1,
    invincibilityMs: 1800,
    hitboxRadius: 10,
} as const;

export const BULLET = {
    speed: 520,
    width: 4,
    height: 12,
    poolSize: 40,
} as const;

export const ENEMY_BULLET = {
    speed: 220,
    width: 4,
    height: 10,
    poolSize: 24,
} as const;

export type EnemyMovement = 'straight' | 'sine' | 'stationary';

export interface EnemyTypeConfig {
    id: string;
    color: number;
    shape: 'triangle' | 'rect' | 'circle';
    health: number;
    speed: number;
    width: number;
    height: number;
    contactDamage: number;
    scoreValue: number;
    movement: EnemyMovement;
    canShoot: boolean;
    fireCooldownMs: number;
}

export const ENEMY_TYPES: EnemyTypeConfig[] = [
    {
        id: 'fighter', color: 0xff4a4a, shape: 'triangle',
        health: 2, speed: 90, width: 20, height: 20,
        contactDamage: 1, scoreValue: 100,
        movement: 'straight', canShoot: false, fireCooldownMs: 0,
    },
    {
        id: 'fastFighter', color: 0xff8a4a, shape: 'triangle',
        health: 1, speed: 170, width: 16, height: 16,
        contactDamage: 1, scoreValue: 120,
        movement: 'straight', canShoot: false, fireCooldownMs: 0,
    },
    {
        id: 'bomber', color: 0x8a4aff, shape: 'rect',
        health: 5, speed: 50, width: 30, height: 26,
        contactDamage: 2, scoreValue: 250,
        movement: 'straight', canShoot: true, fireCooldownMs: 1400,
    },
    {
        id: 'helicopter', color: 0x4affb0, shape: 'rect',
        health: 4, speed: 70, width: 26, height: 22,
        contactDamage: 2, scoreValue: 220,
        movement: 'sine', canShoot: true, fireCooldownMs: 1100,
    },
    {
        id: 'tank', color: 0x8a8a4a, shape: 'rect',
        health: 10, speed: 30, width: 34, height: 30,
        contactDamage: 3, scoreValue: 400,
        movement: 'straight', canShoot: false, fireCooldownMs: 0,
    },
    {
        id: 'turret', color: 0xaaaaaa, shape: 'circle',
        health: 6, speed: 15, width: 24, height: 24,
        contactDamage: 2, scoreValue: 300,
        movement: 'stationary', canShoot: true, fireCooldownMs: 900,
    },
];

export function getEnemyType(id: string): EnemyTypeConfig {
    const found = ENEMY_TYPES.find((type) => type.id === id);
    if (!found) throw new Error(`Unknown enemy type: ${id}`);
    return found;
}

export const ENEMY_SPAWN = {
    intervalMs: 900,
} as const;

export interface BossConfig {
    id: number;
    name: string;
    color: number;
    width: number;
    height: number;
    health: number;
    hoverSpeed: number;
    volleySize: number;
    fireCooldownMs: number;
    bulletSpeedMultiplier: number;
}

export const BOSS_TYPES: BossConfig[] = [
    { id: 1, name: 'COASTAL WARDEN', color: 0xff4a4a, width: 70, height: 50, health: 60, hoverSpeed: 60, volleySize: 5, fireCooldownMs: 1000, bulletSpeedMultiplier: 1 },
    { id: 2, name: 'JUNGLE REAPER', color: 0x6aff4a, width: 76, height: 54, health: 90, hoverSpeed: 70, volleySize: 6, fireCooldownMs: 900, bulletSpeedMultiplier: 1.1 },
    { id: 3, name: 'DESERT COLOSSUS', color: 0xffd24a, width: 84, height: 60, health: 130, hoverSpeed: 55, volleySize: 7, fireCooldownMs: 850, bulletSpeedMultiplier: 1.15 },
    { id: 4, name: 'ARMADA FLAGSHIP', color: 0x4a9aff, width: 92, height: 66, health: 180, hoverSpeed: 50, volleySize: 8, fireCooldownMs: 800, bulletSpeedMultiplier: 1.2 },
    { id: 5, name: 'PROJECT OMEGA', color: 0xd04aff, width: 100, height: 74, health: 260, hoverSpeed: 45, volleySize: 10, fireCooldownMs: 700, bulletSpeedMultiplier: 1.3 },
];

export function getBossType(id: number): BossConfig {
    const found = BOSS_TYPES.find((boss) => boss.id === id);
    if (!found) throw new Error(`Unknown boss id: ${id}`);
    return found;
}

export interface PlaneConfig {
    id: string;
    name: string;
    color: number;
    speedMultiplier: number;
    fireRateMultiplier: number;
    unlockScore: number;
}

export const PLANE_TYPES: PlaneConfig[] = [
    { id: 'phoenix', name: 'PHOENIX', color: 0x4ac2ff, speedMultiplier: 1, fireRateMultiplier: 1, unlockScore: 0 },
    { id: 'valkyrie', name: 'VALKYRIE', color: 0xffe066, speedMultiplier: 1.15, fireRateMultiplier: 0.9, unlockScore: 5000 },
    { id: 'juggernaut', name: 'JUGGERNAUT', color: 0xff6a6a, speedMultiplier: 0.85, fireRateMultiplier: 1.15, unlockScore: 15000 },
] as const;

export function getPlaneType(id: string): PlaneConfig {
    return PLANE_TYPES.find((plane) => plane.id === id) ?? PLANE_TYPES[0];
}
