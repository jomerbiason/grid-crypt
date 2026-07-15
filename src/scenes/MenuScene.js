import Phaser from '../vendor/phaser.js';
import { SCENE_KEYS, COLORS, GAME_WIDTH, GAME_HEIGHT } from '../config/constants.js';

export default class MenuScene extends Phaser.Scene {
    constructor() {
        super(SCENE_KEYS.MENU);
    }

    create() {
        const centerX = GAME_WIDTH / 2;
        const centerY = GAME_HEIGHT / 2;

        this.add.text(centerX, centerY - 60, "I'M NOT ALONE", {
            fontFamily: 'monospace',
            fontSize: '40px',
            color: '#ffffff',
        }).setOrigin(0.5);

        const startButton = this.add.text(centerX, centerY + 30, '[ START ]', {
            fontFamily: 'monospace',
            fontSize: '22px',
            color: '#ff3333',
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        startButton.on('pointerover', () => startButton.setColor('#ffffff'));
        startButton.on('pointerout', () => startButton.setColor('#ff3333'));
        startButton.on('pointerdown', () => this.scene.start(SCENE_KEYS.GAME));

        this.input.keyboard.once('keydown-SPACE', () => this.scene.start(SCENE_KEYS.GAME));
        this.input.keyboard.once('keydown-ENTER', () => this.scene.start(SCENE_KEYS.GAME));
    }
}
