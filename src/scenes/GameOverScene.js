import Phaser from '../vendor/phaser.js';
import { SCENE_KEYS, GAME_WIDTH, GAME_HEIGHT } from '../config/constants.js';

export default class GameOverScene extends Phaser.Scene {
    constructor() {
        super(SCENE_KEYS.GAME_OVER);
    }

    create() {
        this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 20, 'YOU WERE NOT ALONE', {
            fontFamily: 'monospace',
            fontSize: '24px',
            color: '#ff3333',
        }).setOrigin(0.5);

        const retry = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 30, '[ RETURN TO MENU ]', {
            fontFamily: 'monospace',
            fontSize: '16px',
            color: '#ffffff',
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        retry.on('pointerdown', () => this.scene.start(SCENE_KEYS.MENU));
    }
}
