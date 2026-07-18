import Phaser from 'phaser';
import { SCENE_KEYS, GAME_WIDTH, PLANE_TYPES } from '../config/constants';
import { loadHighScore, unlockPlanesByScore } from '../systems/SaveData';
import sound from '../audio/SoundManager';

export default class PlaneSelectScene extends Phaser.Scene {
    constructor() {
        super(SCENE_KEYS.PLANE_SELECT);
    }

    create(): void {
        this.cameras.main.setBackgroundColor('#0a0a1a');

        this.add
            .text(GAME_WIDTH / 2, 60, 'SELECT YOUR PLANE', {
                fontFamily: 'monospace',
                fontSize: '20px',
                color: '#ffffff',
            })
            .setOrigin(0.5);

        const highScore = loadHighScore();
        const unlockedIds = unlockPlanesByScore(highScore, PLANE_TYPES);

        const startY = 150;
        const gapY = 130;

        PLANE_TYPES.forEach((plane, index) => {
            const y = startY + index * gapY;
            const isUnlocked = unlockedIds.includes(plane.id);

            const g = this.add.graphics();
            g.fillStyle(plane.color, isUnlocked ? 1 : 0.25);
            g.fillTriangle(GAME_WIDTH / 2, y - 16, GAME_WIDTH / 2 - 16, y + 16, GAME_WIDTH / 2 + 16, y + 16);

            const label = this.add
                .text(GAME_WIDTH / 2, y + 34, isUnlocked ? plane.name : `${plane.name} (LOCKED ${plane.unlockScore})`, {
                    fontFamily: 'monospace',
                    fontSize: '14px',
                    color: isUnlocked ? '#ffffff' : '#666666',
                })
                .setOrigin(0.5);

            if (!isUnlocked) return;

            const hitZone = this.add
                .zone(GAME_WIDTH / 2, y, 220, 90)
                .setInteractive({ useHandCursor: true });

            hitZone.on('pointerover', () => label.setColor('#ffe066'));
            hitZone.on('pointerout', () => label.setColor('#ffffff'));
            hitZone.on('pointerdown', () => {
                sound.uiClick();
                this.scene.start(SCENE_KEYS.GAME, { planeId: plane.id });
            });
        });

        this.input.keyboard!.once('keydown-ESC', () => this.scene.start(SCENE_KEYS.MENU));
    }
}
