import Phaser from 'phaser';
import { GAME_WIDTH, ENEMY_TYPES, ENEMY_SPAWN } from '../config/constants';
import Enemy from '../entities/Enemy';

export default class EnemySpawner {
    private scene: Phaser.Scene;
    enemies: Enemy[] = [];
    private lastSpawnAt = 0;
    private spawnCount = 0;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
    }

    update(time: number): void {
        this.enemies = this.enemies.filter((enemy) => enemy.sprite.active);

        if (time - this.lastSpawnAt < ENEMY_SPAWN.intervalMs) return;
        this.lastSpawnAt = time;

        const config = ENEMY_TYPES[this.spawnCount % ENEMY_TYPES.length];
        this.spawnCount += 1;

        const x = Phaser.Math.Between(30, GAME_WIDTH - 30);
        const y = config.movement === 'stationary' ? 40 : -20;
        this.enemies.push(new Enemy(this.scene, x, y, config, time));
    }

    removeOffscreen(gameHeight: number): void {
        this.enemies = this.enemies.filter((enemy) => {
            if (enemy.sprite.y > gameHeight + 40) {
                enemy.destroy();
                return false;
            }
            return true;
        });
    }
}
