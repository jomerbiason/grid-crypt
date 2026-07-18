import Phaser from 'phaser';
import Player from '../entities/Player';
import type StageManager from '../systems/StageManager';

const MARGIN = 12;

export default class HUD {
    private player: Player;
    private livesText: Phaser.GameObjects.Text;
    private bombsText: Phaser.GameObjects.Text;
    private scoreText: Phaser.GameObjects.Text;
    private stageText: Phaser.GameObjects.Text;

    constructor(scene: Phaser.Scene, player: Player) {
        this.player = player;

        this.livesText = scene.add.text(MARGIN, MARGIN, '', {
            fontFamily: 'monospace',
            fontSize: '16px',
            color: '#ffffff',
        });

        this.bombsText = scene.add.text(MARGIN, MARGIN + 22, '', {
            fontFamily: 'monospace',
            fontSize: '16px',
            color: '#ffe066',
        });

        this.scoreText = scene.add.text(MARGIN, MARGIN + 44, '', {
            fontFamily: 'monospace',
            fontSize: '16px',
            color: '#4ac2ff',
        });

        this.stageText = scene.add
            .text(scene.game.config.width as number, MARGIN, '', {
                fontFamily: 'monospace',
                fontSize: '14px',
                color: '#ffffff',
            })
            .setOrigin(1, 0);

        this.update(0);
    }

    update(score: number, stageManager?: StageManager): void {
        this.livesText.setText(`LIVES: ${this.player.lives}`);
        this.bombsText.setText(`BOMBS: ${this.player.bombs}`);
        this.scoreText.setText(`SCORE: ${score}`);

        if (!stageManager) return;

        const marginRight = 12;
        this.stageText.setX((this.stageText.scene.game.config.width as number) - marginRight);

        if (stageManager.phase === 'survival') {
            const seconds = Math.ceil(stageManager.getSurvivalRemainingMs(this.stageTime()) / 1000);
            this.stageText.setText(`STAGE ${stageManager.stage}: ${stageManager.stageName}\n${seconds}s`);
        } else {
            this.stageText.setText(`STAGE ${stageManager.stage}: ${stageManager.stageName}`);
        }
    }

    private stageTime(): number {
        return this.player.scene.time.now;
    }
}
