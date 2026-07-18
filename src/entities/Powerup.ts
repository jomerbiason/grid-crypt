import Phaser from 'phaser';

const TEXTURE_KEY = 'powerup-weapon';
const FALL_SPEED = 90;

export default class Powerup {
    sprite: Phaser.Physics.Arcade.Image;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        Powerup.ensureTexture(scene);
        this.sprite = scene.physics.add.image(x, y, TEXTURE_KEY);
        this.sprite.setVelocityY(FALL_SPEED);
    }

    private static ensureTexture(scene: Phaser.Scene): void {
        if (scene.textures.exists(TEXTURE_KEY)) return;

        const g = scene.make.graphics({ x: 0, y: 0 });
        g.fillStyle(0x4affb0, 1);
        g.fillCircle(9, 9, 9);
        g.fillStyle(0x0a0a1a, 1);
        g.fillRect(6, 5, 6, 8);
        g.generateTexture(TEXTURE_KEY, 18, 18);
        g.destroy();
    }

    destroy(): void {
        this.sprite.destroy();
    }
}
