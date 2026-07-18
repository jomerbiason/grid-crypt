import Phaser from 'phaser';
import type { EnemyTypeConfig } from '../config/constants';
import EnemyBulletPool from '../systems/EnemyBulletPool';

export default class Enemy {
    sprite: Phaser.Physics.Arcade.Image;
    health: number;
    config: EnemyTypeConfig;
    private lastFiredAt = 0;
    private spawnTime: number;
    private baseX: number;

    constructor(scene: Phaser.Scene, x: number, y: number, config: EnemyTypeConfig, spawnTime: number) {
        this.config = config;
        this.health = config.health;
        this.baseX = x;
        this.spawnTime = spawnTime;

        Enemy.ensureTexture(scene, config);
        this.sprite = scene.physics.add.image(x, y, `enemy-${config.id}`);
        if (config.movement !== 'stationary') this.sprite.setVelocityY(config.speed);
    }

    private static ensureTexture(scene: Phaser.Scene, config: EnemyTypeConfig): void {
        const key = `enemy-${config.id}`;
        if (scene.textures.exists(key)) return;

        const g = scene.make.graphics({ x: 0, y: 0 });
        const w = config.width;
        const h = config.height;
        g.fillStyle(config.color, 1);

        if (config.shape === 'triangle') {
            g.fillTriangle(w / 2, h, 0, 0, w, 0);
        } else if (config.shape === 'circle') {
            g.fillCircle(w / 2, h / 2, w / 2);
        } else {
            g.fillRoundedRect(0, 0, w, h, 4);
        }

        g.generateTexture(key, w, h);
        g.destroy();
    }

    update(time: number, enemyBulletPool: EnemyBulletPool): void {
        if (this.config.movement === 'sine') {
            this.sprite.x = this.baseX + Math.sin((time - this.spawnTime) / 300) * 40;
        }

        if (this.config.canShoot && time - this.lastFiredAt > this.config.fireCooldownMs) {
            this.lastFiredAt = time;
            enemyBulletPool.fire(this.sprite.x, this.sprite.y + this.config.height / 2);
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
