import Phaser from '../vendor/phaser.js';
import { SCENE_KEYS, GAME_WIDTH, GAME_HEIGHT } from '../config/constants.js';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super(SCENE_KEYS.GAME);
    }

    create() {
        this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'GAMEPLAY COMING SOON', {
            fontFamily: 'monospace',
            fontSize: '18px',
            color: '#88eeaa',
        }).setOrigin(0.5);

        this.input.keyboard.once('keydown-ESC', () => this.scene.start(SCENE_KEYS.MENU));
    }
}
