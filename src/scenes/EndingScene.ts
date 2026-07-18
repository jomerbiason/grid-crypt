import Phaser from 'phaser';
import { SCENE_KEYS, GAME_WIDTH, GAME_HEIGHT } from '../config/constants';
import { loadHighScore } from '../systems/SaveData';
import sound from '../audio/SoundManager';

export default class EndingScene extends Phaser.Scene {
    constructor() {
        super(SCENE_KEYS.ENDING);
    }

    create(): void {
        this.cameras.main.setBackgroundColor('#0a0a1a');
        sound.stopMusic();

        this.add
            .text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 60, 'PROJECT OMEGA DEFEATED', {
                fontFamily: 'monospace',
                fontSize: '20px',
                color: '#4ac2ff',
            })
            .setOrigin(0.5);

        this.add
            .text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 20, 'The Dominion falls. Peace returns to the skies.', {
                fontFamily: 'monospace',
                fontSize: '13px',
                color: '#ffffff',
            })
            .setOrigin(0.5);

        this.add
            .text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 20, `HIGH SCORE: ${loadHighScore()}`, {
                fontFamily: 'monospace',
                fontSize: '14px',
                color: '#ffe066',
            })
            .setOrigin(0.5);

        const returnText = this.add
            .text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 70, 'PRESS SPACE TO RETURN', {
                fontFamily: 'monospace',
                fontSize: '12px',
                color: '#888888',
            })
            .setOrigin(0.5);

        this.tweens.add({ targets: returnText, alpha: 0.3, duration: 700, yoyo: true, repeat: -1 });

        this.input.keyboard!.once('keydown-SPACE', () => this.scene.start(SCENE_KEYS.MENU));
        this.input.once('pointerdown', () => this.scene.start(SCENE_KEYS.MENU));
    }
}
