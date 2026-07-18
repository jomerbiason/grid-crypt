import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, PLAYER, getPlaneType } from '../config/constants';
import BulletPool from '../systems/BulletPool';
import WeaponSystem from '../systems/WeaponSystem';
import sound from '../audio/SoundManager';
import type { InputState } from '../input/InputHandler';

const TEXTURE_KEY_PREFIX = 'player-ship';

export default class Player {
    scene: Phaser.Scene;
    sprite: Phaser.Physics.Arcade.Image;
    lives: number;
    bombs: number;
    isInvincible = false;
    private lastFiredAt = 0;
    private bulletPool: BulletPool;
    private speedMultiplier: number;
    private fireRateMultiplier: number;
    weapon = new WeaponSystem();

    constructor(scene: Phaser.Scene, bulletPool: BulletPool, planeId = 'phoenix') {
        this.scene = scene;
        this.bulletPool = bulletPool;
        this.lives = PLAYER.startLives;
        this.bombs = PLAYER.startBombs;

        const plane = getPlaneType(planeId);
        this.speedMultiplier = plane.speedMultiplier;
        this.fireRateMultiplier = plane.fireRateMultiplier;

        this.ensureTexture(plane.id, plane.color);
        this.sprite = scene.physics.add.image(GAME_WIDTH / 2, GAME_HEIGHT - 100, `${TEXTURE_KEY_PREFIX}-${plane.id}`);
        this.sprite.setCollideWorldBounds(true);
    }

    private ensureTexture(planeId: string, color: number): void {
        const key = `${TEXTURE_KEY_PREFIX}-${planeId}`;
        if (this.scene.textures.exists(key)) return;

        const g = this.scene.make.graphics({ x: 0, y: 0 });
        g.fillStyle(color, 1);
        g.fillTriangle(12, 0, 0, 24, 24, 24);
        g.fillStyle(0xffffff, 1);
        g.fillTriangle(12, 4, 6, 20, 18, 20);
        g.generateTexture(key, 24, 24);
        g.destroy();
    }

    update(time: number, delta: number, input: InputState): void {
        const deltaSeconds = delta / 1000;
        let vx = 0;
        let vy = 0;

        if (input.left) vx -= 1;
        if (input.right) vx += 1;
        if (input.up) vy -= 1;
        if (input.down) vy += 1;

        if (vx !== 0 && vy !== 0) {
            const inverseLength = 1 / Math.sqrt(2);
            vx *= inverseLength;
            vy *= inverseLength;
        }

        const speed = PLAYER.speed * this.speedMultiplier;
        this.sprite.x += vx * speed * deltaSeconds;
        this.sprite.y += vy * speed * deltaSeconds;

        this.sprite.x = Phaser.Math.Clamp(this.sprite.x, 12, GAME_WIDTH - 12);
        this.sprite.y = Phaser.Math.Clamp(this.sprite.y, 12, GAME_HEIGHT - 12);

        if (input.firing) this.tryFire(time);
    }

    private tryFire(time: number): void {
        const weaponLevel = this.weapon.current;
        const cooldown = weaponLevel.fireCooldownMs * this.fireRateMultiplier;
        if (time - this.lastFiredAt < cooldown) return;
        this.lastFiredAt = time;

        weaponLevel.offsets.forEach((offsetX) => {
            this.bulletPool.fire(this.sprite.x + offsetX, this.sprite.y - 16);
        });
        sound.shoot();
    }

    takeHit(): boolean {
        if (this.isInvincible) return false;

        this.lives -= 1;
        this.startInvincibility();
        return this.lives <= 0;
    }

    private startInvincibility(): void {
        this.isInvincible = true;
        this.sprite.setPosition(GAME_WIDTH / 2, GAME_HEIGHT - 100);

        this.scene.tweens.add({
            targets: this.sprite,
            alpha: 0.3,
            duration: 120,
            yoyo: true,
            repeat: Math.floor(PLAYER.invincibilityMs / 240),
            onComplete: () => {
                this.sprite.setAlpha(1);
                this.isInvincible = false;
            },
        });
    }

    useBomb(): boolean {
        if (this.bombs <= 0) return false;
        this.bombs -= 1;
        return true;
    }
}
