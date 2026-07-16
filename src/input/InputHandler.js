import Phaser from '../vendor/phaser.js';

export default class InputHandler {
    constructor(scene) {
        this.scene = scene;
        this.keys = scene.input.keyboard.addKeys({
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D,
            altLeft: Phaser.Input.Keyboard.KeyCodes.LEFT,
            altRight: Phaser.Input.Keyboard.KeyCodes.RIGHT,
        });
    }

    getInputState() {
        return {
            isLeft: this.keys.left.isDown || this.keys.altLeft.isDown,
            isRight: this.keys.right.isDown || this.keys.altRight.isDown,
        };
    }
}
