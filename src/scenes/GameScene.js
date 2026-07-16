import Phaser from '../vendor/phaser.js';
import { SCENE_KEYS, GAME_WIDTH, GAME_HEIGHT } from '../config/constants.js';
import Player from '../entities/Player.js';
import InputHandler from '../input/InputHandler.js';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super(SCENE_KEYS.GAME);
        this.player = null;
        this.inputHandler = null;
    }

    create() {
        this.cameras.main.setBackgroundColor(0x1a1a2e);
        this.player = new Player(this, GAME_WIDTH / 2, GAME_HEIGHT - 60);
        this.inputHandler = new InputHandler(this);
        this.input.keyboard.once('keydown-ESC', () => this.scene.start(SCENE_KEYS.MENU));
    }

    update() {
        if (this.player) {
            const inputState = this.inputHandler.getInputState();
            this.player.update(inputState);
        }
    }
}
