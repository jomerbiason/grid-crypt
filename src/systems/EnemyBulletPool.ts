import Phaser from 'phaser';
import { ENEMY_BULLET, GAME_WIDTH } from '../config/constants';

const TEXTURE_KEY = 'enemy-bullet';

export default class EnemyBulletPool {
    private scene: Phaser.Scene;
    group: Phaser.Physics.Arcade.Group;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
        this.ensureTexture();

        this.group = scene.physics.add.group({
            defaultKey: TEXTURE_KEY,
            maxSize: ENEMY_BULLET.poolSize,
            runChildUpdate: false,
        });
    }

    private ensureTexture(): void {
        if (this.scene.textures.exists(TEXTURE_KEY)) return;

        const g = this.scene.make.graphics({ x: 0, y: 0 });
        g.fillStyle(0xff5fa0, 1);
        g.fillCircle(ENEMY_BULLET.width, ENEMY_BULLET.width, ENEMY_BULLET.width);
        g.generateTexture(TEXTURE_KEY, ENEMY_BULLET.width * 2, ENEMY_BULLET.width * 2);
        g.destroy();
    }

    fire(x: number, y: number): void {
        const bullet = this.group.get(x, y) as Phaser.Physics.Arcade.Image | null;
        if (!bullet) return;

        bullet.setActive(true);
        bullet.setVisible(true);
        (bullet.body as Phaser.Physics.Arcade.Body).enable = true;
        bullet.setPosition(x, y);
        bullet.setVelocity(0, ENEMY_BULLET.speed);
    }

    fireDirectional(x: number, y: number, angle: number, speedMultiplier = 1): void {
        const bullet = this.group.get(x, y) as Phaser.Physics.Arcade.Image | null;
        if (!bullet) return;

        bullet.setActive(true);
        bullet.setVisible(true);
        (bullet.body as Phaser.Physics.Arcade.Body).enable = true;
        bullet.setPosition(x, y);

        const speed = ENEMY_BULLET.speed * speedMultiplier;
        bullet.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);
    }

    update(gameHeight: number): void {
        this.group.children.each((child) => {
            const bullet = child as Phaser.Physics.Arcade.Image;
            if (!bullet.active) return true;

            const offscreen = bullet.y > gameHeight + ENEMY_BULLET.height
                || bullet.y < -ENEMY_BULLET.height
                || bullet.x < -ENEMY_BULLET.height
                || bullet.x > GAME_WIDTH + ENEMY_BULLET.height;

            if (offscreen) this.deactivate(bullet);
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
