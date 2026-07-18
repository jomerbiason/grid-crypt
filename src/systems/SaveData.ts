const HIGH_SCORE_KEY = 'ois_high_score';
const SETTINGS_KEY = 'ois_settings';
const UNLOCKED_PLANES_KEY = 'ois_unlocked_planes';

export interface Settings {
    volume: number;
    difficulty: 'easy' | 'normal' | 'hard';
}

const DEFAULT_SETTINGS: Settings = {
    volume: 0.6,
    difficulty: 'normal',
};

export function loadHighScore(): number {
    const raw = localStorage.getItem(HIGH_SCORE_KEY);
    return raw ? Number(raw) : 0;
}

export function saveHighScore(score: number): void {
    const current = loadHighScore();
    if (score > current) localStorage.setItem(HIGH_SCORE_KEY, String(score));
}

export function loadSettings(): Settings {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    try {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
    } catch {
        return DEFAULT_SETTINGS;
    }
}

export function saveSettings(settings: Settings): void {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export function loadUnlockedPlaneIds(): string[] {
    const raw = localStorage.getItem(UNLOCKED_PLANES_KEY);
    if (!raw) return ['phoenix'];
    try {
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : ['phoenix'];
    } catch {
        return ['phoenix'];
    }
}

export function unlockPlanesByScore(highScore: number, planeUnlockScores: { id: string; unlockScore: number }[]): string[] {
    const unlocked = new Set(loadUnlockedPlaneIds());
    planeUnlockScores.forEach((plane) => {
        if (highScore >= plane.unlockScore) unlocked.add(plane.id);
    });
    const result = Array.from(unlocked);
    localStorage.setItem(UNLOCKED_PLANES_KEY, JSON.stringify(result));
    return result;
}
