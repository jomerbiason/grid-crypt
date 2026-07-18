import Phaser from 'phaser';
import { SCENE_KEYS, GAME_WIDTH, GAME_HEIGHT, PLAYER, getBossType } from '../config/constants';
import Player from '../entities/Player';
import BulletPool from '../systems/BulletPool';
import EnemyBulletPool from '../systems/EnemyBulletPool';
import EnemySpawner from '../systems/EnemySpawner';
import StageManager from '../systems/StageManager';
import InputHandler from '../input/InputHandler';
import HUD from '../ui/HUD';
import BossHealthBar from '../ui/BossHealthBar';
import Powerup from '../entities/Powerup';
import Boss from '../entities/Boss';
import { spawnExplosion } from '../effects/spawnExplosion';
import sound from '../audio/SoundManager';
import { saveHighScore } from '../systems/SaveData';

const POWERUP_DROP_CHANCE = 0.12;

export default class GameScene extends Phaser.Scene {
    private player!: Player;
    private bulletPool!: BulletPool;
    private enemyBulletPool!: EnemyBulletPool;
    private enemySpawner!: EnemySpawner;
    private inputHandler!: InputHandler;
    private hud!: HUD;
    private bossHealthBar!: BossHealthBar;
    private stageManager!: StageManager;
    private stageBanner!: Phaser.GameObjects.Text;
    private score = 0;
    private powerups: Powerup[] = [];
    private boss: Boss | null = null;
    private planeId = 'phoenix';

    constructor() {
        super(SCENE_KEYS.GAME);
    }

    init(data: { planeId?: string }): void {
        this.planeId = data?.planeId ?? 'phoenix';
    }

    create(): void {
        this.cameras.main.setBackgroundColor('#05050f');
        this.drawStarfield();
        this.score = 0;
        this.powerups = [];
        this.boss = null;

        this.bulletPool = new BulletPool(this);
        this.enemyBulletPool = new EnemyBulletPool(this);
        this.player = new Player(this, this.bulletPool, this.planeId);
        this.enemySpawner = new EnemySpawner(this);
        this.inputHandler = new InputHandler(this);
        this.hud = new HUD(this, this.player);
        this.bossHealthBar = new BossHealthBar(this);
        this.stageManager = new StageManager();
        this.stageManager.startStage(this.time.now, 1);

        this.stageBanner = this.add
            .text(GAME_WIDTH / 2, GAME_HEIGHT / 2, '', {
                fontFamily: 'monospace',
                fontSize: '22px',
                color: '#ffe066',
            })
            .setOrigin(0.5)
            .setVisible(false);

        this.input.keyboard!.once('keydown-ESC', () => this.scene.launch(SCENE_KEYS.PAUSE, { gameSceneKey: SCENE_KEYS.GAME }));
        this.input.keyboard!.once('keydown-ESC', () => this.scene.pause());
    }

    update(time: number, delta: number): void {
        const inputState = this.inputHandler.getState();
        const phase = this.stageManager.update(time);

        this.player.update(time, delta, inputState);
        this.bulletPool.update();
        this.enemyBulletPool.update(GAME_HEIGHT);

        if (phase === 'survival') {
            this.enemySpawner.update(time);
        }
        this.enemySpawner.removeOffscreen(GAME_HEIGHT);
        this.enemySpawner.enemies.forEach((enemy) => enemy.update(time, this.enemyBulletPool));

        this.handleStagePhase(time, phase);

        if (this.boss) {
            this.boss.update(time, this.enemyBulletPool);
            this.bossHealthBar.update(this.boss);
        }

        this.handlePlayerBulletHits();
        this.handleEnemyBulletHits();
        this.handlePlayerContact();
        this.handleBossCollisions();
        this.updatePowerups();

        if (inputState.bombPressed && this.player.useBomb()) this.clearScreenWithBomb();

        this.hud.update(this.score, this.stageManager);
    }

    private handleStagePhase(time: number, phase: string): void {
        if (phase === 'warning' && !this.stageBanner.visible) {
            this.stageBanner.setText('WARNING').setVisible(true);
            sound.warning();
        } else if (phase === 'boss' && this.stageBanner.visible) {
            this.stageBanner.setVisible(false);
            this.spawnBossForCurrentStage(time);
        }

        if (phase === 'cleared') {
            if (!this.stageBanner.visible) {
                this.stageBanner.setText(`STAGE ${this.stageManager.stage} CLEAR`).setVisible(true);
            }
            if (this.stageManager.isClearedDelayDone(time)) {
                this.stageBanner.setVisible(false);
                this.advanceStage(time);
            }
        }
    }

    private spawnBossForCurrentStage(time: number): void {
        this.enemySpawner.enemies.forEach((enemy) => enemy.destroy());
        this.enemySpawner.enemies = [];

        this.boss = new Boss(this, getBossType(this.stageManager.stage), time);
        this.bossHealthBar.show(this.boss);
    }

    private advanceStage(time: number): void {
        if (this.stageManager.stage >= 5) {
            saveHighScore(this.score);
            this.scene.start(SCENE_KEYS.ENDING);
            return;
        }
        this.stageManager.startStage(time, this.stageManager.stage + 1);
    }

    private handleBossCollisions(): void {
        if (!this.boss) return;

        this.bulletPool.group.children.each((child) => {
            const bullet = child as Phaser.Physics.Arcade.Image;
            if (!bullet.active || !this.boss) return true;

            const distance = Phaser.Math.Distance.Between(bullet.x, bullet.y, this.boss.sprite.x, this.boss.sprite.y);
            if (distance > this.boss.config.width / 2 + 4) return true;

            this.bulletPool.deactivate(bullet);
            if (this.boss.takeDamage(PLAYER.bulletDamage)) {
                this.score += this.boss.config.health * 10;
                spawnExplosion(this, this.boss.sprite.x, this.boss.sprite.y, this.boss.config.color);
                sound.explosion();
                this.boss.destroy();
                this.boss = null;
                this.bossHealthBar.hide();
                this.stageManager.markCleared(this.time.now);
            }
            return true;
        });

        if (!this.boss || this.player.isInvincible) return;

        const distance = Phaser.Math.Distance.Between(
            this.player.sprite.x, this.player.sprite.y,
            this.boss.sprite.x, this.boss.sprite.y,
        );
        if (distance > PLAYER.hitboxRadius + this.boss.config.width / 2) return;

        const isGameOver = this.player.takeHit();
        this.cameras.main.shake(160, 0.008);
        if (isGameOver) this.handleGameOver();
    }

    private handleGameOver(): void {
        saveHighScore(this.score);
        this.scene.start(SCENE_KEYS.MENU);
    }

    private handlePlayerBulletHits(): void {
        this.bulletPool.group.children.each((child) => {
            const bullet = child as Phaser.Physics.Arcade.Image;
            if (!bullet.active) return true;

            for (const enemy of this.enemySpawner.enemies) {
                if (!enemy.sprite.active) continue;
                const distance = Phaser.Math.Distance.Between(bullet.x, bullet.y, enemy.sprite.x, enemy.sprite.y);
                if (distance > enemy.config.width / 2 + 4) continue;

                this.bulletPool.deactivate(bullet);
                if (enemy.takeDamage(PLAYER.bulletDamage)) {
                    this.score += enemy.config.scoreValue;
                    spawnExplosion(this, enemy.sprite.x, enemy.sprite.y, enemy.config.color);
                    sound.explosion();
                    if (Math.random() < POWERUP_DROP_CHANCE) {
                        this.powerups.push(new Powerup(this, enemy.sprite.x, enemy.sprite.y));
                    }
                    enemy.destroy();
                } else {
                    sound.hit();
                }
                break;
            }
            return true;
        });
    }

    private handleEnemyBulletHits(): void {
        if (this.player.isInvincible) return;

        this.enemyBulletPool.group.children.each((child) => {
            const bullet = child as Phaser.Physics.Arcade.Image;
            if (!bullet.active) return true;

            const distance = Phaser.Math.Distance.Between(
                bullet.x, bullet.y,
                this.player.sprite.x, this.player.sprite.y,
            );
            if (distance > PLAYER.hitboxRadius) return true;

            this.enemyBulletPool.deactivate(bullet);
            const isGameOver = this.player.takeHit();
            this.cameras.main.shake(160, 0.008);
            if (isGameOver) this.handleGameOver();

            return true;
        });
    }

    private handlePlayerContact(): void {
        if (this.player.isInvincible) return;

        for (const enemy of this.enemySpawner.enemies) {
            if (!enemy.sprite.active) continue;
            const distance = Phaser.Math.Distance.Between(
                this.player.sprite.x,
                this.player.sprite.y,
                enemy.sprite.x,
                enemy.sprite.y,
            );
            if (distance > PLAYER.hitboxRadius + enemy.config.width / 2) continue;

            enemy.destroy();
            const isGameOver = this.player.takeHit();
            this.cameras.main.shake(160, 0.008);
            if (isGameOver) this.handleGameOver();
            break;
        }
    }

    private updatePowerups(): void {
        this.powerups = this.powerups.filter((powerup) => {
            if (powerup.sprite.y > GAME_HEIGHT + 20) {
                powerup.destroy();
                return false;
            }

            const distance = Phaser.Math.Distance.Between(
                powerup.sprite.x, powerup.sprite.y,
                this.player.sprite.x, this.player.sprite.y,
            );
            if (distance > PLAYER.hitboxRadius + 10) return true;

            this.player.weapon.upgrade();
            sound.powerup();
            powerup.destroy();
            return false;
        });
    }

    private clearScreenWithBomb(): void {
        sound.bomb();
        this.enemySpawner.enemies.forEach((enemy) => {
            this.score += enemy.config.scoreValue;
            enemy.destroy();
        });
        this.enemySpawner.enemies = [];

        this.enemyBulletPool.group.children.each((child) => {
            const bullet = child as Phaser.Physics.Arcade.Image;
            if (bullet.active) this.enemyBulletPool.deactivate(bullet);
            return true;
        });
    }

    private drawStarfield(): void {
        const g = this.add.graphics();
        g.fillStyle(0xffffff, 0.6);
        for (let i = 0; i < 60; i += 1) {
            const x = (i * 53) % GAME_WIDTH;
            const y = (i * 97) % GAME_HEIGHT;
            const size = 1 + (i % 3) * 0.5;
            g.fillCircle(x, y, size);
        }
    }
}
