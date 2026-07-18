import Phaser from 'phaser';
import type { BossConfig } from '../config/constants';
import { GAME_WIDTH } from '../config/constants';
import EnemyBulletPool from '../systems/EnemyBulletPool';

const HOVER_Y = 110;

export default class Boss {
    sprite: Phaser.Physics.Arcade.Image;
    config: BossConfig;
    health: number;
    private lastFiredAt = 0;
    private spawnTime: number;

    constructor(scene: Phaser.Scene, config: BossConfig, spawnTime: number) {
        this.config = config;
        this.health = config.health;
        this.spawnTime = spawnTime;

        Boss.ensureTexture(scene, config);
        this.sprite = scene.physics.add.image(GAME_WIDTH / 2, -config.height, `boss-${config.id}`);
        scene.tweens.add({
            targets: this.sprite,
            y: HOVER_Y,
            duration: 900,
            ease: 'Cubic.Out',
        });
    }

    private static ensureTexture(scene: Phaser.Scene, config: BossConfig): void {
        const key = `boss-${config.id}`;
        if (scene.textures.exists(key)) return;

        const g = scene.make.graphics({ x: 0, y: 0 });
        g.fillStyle(config.color, 1);
        g.fillRoundedRect(0, 0, config.width, config.height, 10);
        g.fillStyle(0x0a0a1a, 1);
        g.fillCircle(config.width / 2, config.height * 0.4, config.width * 0.12);
        g.generateTexture(key, config.width, config.height);
        g.destroy();
    }

    update(time: number, enemyBulletPool: EnemyBulletPool): void {
        this.sprite.x = GAME_WIDTH / 2 + Math.sin((time - this.spawnTime) / 700) * (GAME_WIDTH / 2 - this.config.width);

        if (time - this.lastFiredAt < this.config.fireCooldownMs) return;
        this.lastFiredAt = time;
        this.fireVolley(enemyBulletPool);
    }

    private fireVolley(enemyBulletPool: EnemyBulletPool): void {
        const spread = Math.PI / 3;
        const originX = this.sprite.x;
        const originY = this.sprite.y + this.config.height / 2;

        for (let i = 0; i < this.config.volleySize; i += 1) {
            const t = this.config.volleySize === 1 ? 0.5 : i / (this.config.volleySize - 1);
            const angle = Math.PI / 2 - spread / 2 + spread * t;
            enemyBulletPool.fireDirectional(originX, originY, angle, this.config.bulletSpeedMultiplier);
        }
    }

    takeDamage(amount: number): boolean {
        this.health -= amount;
        return this.health <= 0;
    }

    destroy(): void {
        this.sprite.destroy();
    }
}
