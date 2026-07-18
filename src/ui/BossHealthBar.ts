import Phaser from 'phaser';
import { GAME_WIDTH } from '../config/constants';
import type Boss from '../entities/Boss';

const BAR_WIDTH = 300;
const BAR_HEIGHT = 12;
const BAR_Y = 24;

export default class BossHealthBar {
    private bg: Phaser.GameObjects.Graphics;
    private fill: Phaser.GameObjects.Graphics;
    private nameText: Phaser.GameObjects.Text;

    constructor(scene: Phaser.Scene) {
        this.bg = scene.add.graphics().setVisible(false);
        this.fill = scene.add.graphics().setVisible(false);
        this.nameText = scene.add
            .text(GAME_WIDTH / 2, BAR_Y - 16, '', {
                fontFamily: 'monospace',
                fontSize: '12px',
                color: '#ffffff',
            })
            .setOrigin(0.5)
            .setVisible(false);
    }

    show(boss: Boss): void {
        this.nameText.setText(boss.config.name).setVisible(true);
        this.bg.setVisible(true);
        this.fill.setVisible(true);
    }

    hide(): void {
        this.bg.setVisible(false);
        this.fill.setVisible(false);
        this.nameText.setVisible(false);
    }

    update(boss: Boss): void {
        const x = GAME_WIDTH / 2 - BAR_WIDTH / 2;
        const ratio = Math.max(0, boss.health / boss.config.health);

        this.bg.clear();
        this.bg.fillStyle(0x1a1a1a, 0.9);
        this.bg.fillRect(x, BAR_Y, BAR_WIDTH, BAR_HEIGHT);
        this.bg.lineStyle(1, 0xffffff, 0.7);
        this.bg.strokeRect(x, BAR_Y, BAR_WIDTH, BAR_HEIGHT);

        this.fill.clear();
        this.fill.fillStyle(0xff4a4a, 1);
        this.fill.fillRect(x + 1, BAR_Y + 1, (BAR_WIDTH - 2) * ratio, BAR_HEIGHT - 2);
    }
}
