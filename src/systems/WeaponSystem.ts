export interface WeaponLevel {
    level: number;
    fireCooldownMs: number;
    offsets: number[];
}

const WEAPON_LEVELS: WeaponLevel[] = [
    { level: 1, fireCooldownMs: 160, offsets: [0] },
    { level: 2, fireCooldownMs: 150, offsets: [-6, 6] },
    { level: 3, fireCooldownMs: 140, offsets: [-10, 0, 10] },
    { level: 4, fireCooldownMs: 130, offsets: [-14, -5, 5, 14] },
];

export default class WeaponSystem {
    private levelIndex = 0;

    get current(): WeaponLevel {
        return WEAPON_LEVELS[this.levelIndex];
    }

    upgrade(): void {
        this.levelIndex = Math.min(WEAPON_LEVELS.length - 1, this.levelIndex + 1);
    }

    reset(): void {
        this.levelIndex = 0;
    }
}
