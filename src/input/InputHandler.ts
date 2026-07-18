import Phaser from 'phaser';

export interface InputState {
    up: boolean;
    down: boolean;
    left: boolean;
    right: boolean;
    firing: boolean;
    bombPressed: boolean;
}

export default class InputHandler {
    private keys: {
        up: Phaser.Input.Keyboard.Key;
        down: Phaser.Input.Keyboard.Key;
        left: Phaser.Input.Keyboard.Key;
        right: Phaser.Input.Keyboard.Key;
        altUp: Phaser.Input.Keyboard.Key;
        altDown: Phaser.Input.Keyboard.Key;
        altLeft: Phaser.Input.Keyboard.Key;
        altRight: Phaser.Input.Keyboard.Key;
        fire: Phaser.Input.Keyboard.Key;
        bomb: Phaser.Input.Keyboard.Key;
    };

    constructor(scene: Phaser.Scene) {
        const KeyCodes = Phaser.Input.Keyboard.KeyCodes;
        this.keys = scene.input.keyboard!.addKeys({
            up: KeyCodes.W,
            down: KeyCodes.S,
            left: KeyCodes.A,
            right: KeyCodes.D,
            altUp: KeyCodes.UP,
            altDown: KeyCodes.DOWN,
            altLeft: KeyCodes.LEFT,
            altRight: KeyCodes.RIGHT,
            fire: KeyCodes.SPACE,
            bomb: KeyCodes.X,
        }) as typeof this.keys;
    }

    getState(): InputState {
        return {
            up: this.keys.up.isDown || this.keys.altUp.isDown,
            down: this.keys.down.isDown || this.keys.altDown.isDown,
            left: this.keys.left.isDown || this.keys.altLeft.isDown,
            right: this.keys.right.isDown || this.keys.altRight.isDown,
            firing: this.keys.fire.isDown,
            bombPressed: Phaser.Input.Keyboard.JustDown(this.keys.bomb),
        };
    }
}
