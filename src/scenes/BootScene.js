import Phaser from '../vendor/phaser.js';
import { SCENE_KEYS, COLORS } from '../config/constants.js';

export default class BootScene extends Phaser.Scene {
    constructor() {
        super(SCENE_KEYS.BOOT);
    }

    create() {
        this.cameras.main.setBackgroundColor(COLORS.background);
        this.scene.start(SCENE_KEYS.MENU);
    }
}
