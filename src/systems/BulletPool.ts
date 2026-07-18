import Phaser from 'phaser';
import { BULLET } from '../config/constants';

const TEXTURE_KEY = 'player-bullet';

export default class BulletPool {
    private scene: Phaser.Scene;
    group: Phaser.Physics.Arcade.Group;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
        this.ensureTexture();

        this.group = scene.physics.add.group({
            defaultKey: TEXTURE_KEY,
            maxSize: BULLET.poolSize,
            runChildUpdate: false,
        });
    }

    private ensureTexture(): void {
        if (this.scene.textures.exists(TEXTURE_KEY)) return;

        const g = this.scene.make.graphics({ x: 0, y: 0 });
        g.fillStyle(0xffe066, 1);
        g.fillRect(0, 0, BULLET.width, BULLET.height);
        g.generateTexture(TEXTURE_KEY, BULLET.width, BULLET.height);
        g.destroy();
    }

    fire(x: number, y: number): void {
        const bullet = this.group.get(x, y) as Phaser.Physics.Arcade.Image | null;
        if (!bullet) return;

        bullet.setActive(true);
        bullet.setVisible(true);
        (bullet.body as Phaser.Physics.Arcade.Body).enable = true;
        bullet.setPosition(x, y);
        bullet.setVelocity(0, -BULLET.speed);
    }

    update(): void {
        this.group.children.each((child) => {
            const bullet = child as Phaser.Physics.Arcade.Image;
            if (bullet.active && bullet.y < -BULLET.height) {
                this.deactivate(bullet);
            }
            return true;
        });
    }

    deactivate(bullet: Phaser.Physics.Arcade.Image): void {
        bullet.setActive(false);
        bullet.setVisible(false);
        (bullet.body as Phaser.Physics.Arcade.Body).enable = false;
        bullet.setVelocity(0, 0);
    }
}
