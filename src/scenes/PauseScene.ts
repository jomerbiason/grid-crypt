import Phaser from 'phaser';
import { SCENE_KEYS, GAME_WIDTH, GAME_HEIGHT } from '../config/constants';
import { loadSettings, saveSettings } from '../systems/SaveData';
import sound from '../audio/SoundManager';

export default class PauseScene extends Phaser.Scene {
    private gameSceneKey: string = SCENE_KEYS.GAME;
    private volumeText!: Phaser.GameObjects.Text;

    constructor() {
        super(SCENE_KEYS.PAUSE);
    }

    init(data: { gameSceneKey: string }): void {
        this.gameSceneKey = data.gameSceneKey;
    }

    create(): void {
        const overlay = this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x000000, 0.7);
        overlay.setInteractive();

        this.add
            .text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 100, 'PAUSED', {
                fontFamily: 'monospace',
                fontSize: '26px',
                color: '#ffffff',
            })
            .setOrigin(0.5);

        this.createButton(GAME_HEIGHT / 2 - 30, 'RESUME', () => this.resumeGame());

        this.volumeText = this.add
            .text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 20, '', {
                fontFamily: 'monospace',
                fontSize: '14px',
                color: '#ffe066',
            })
            .setOrigin(0.5);
        this.updateVolumeText();

        this.createButton(GAME_HEIGHT / 2 + 60, 'VOLUME -', () => this.adjustVolume(-0.2));
        this.createButton(GAME_HEIGHT / 2 + 110, 'VOLUME +', () => this.adjustVolume(0.2));

        this.createButton(GAME_HEIGHT / 2 + 170, 'QUIT TO MENU', () => {
            sound.uiClick();
            this.scene.stop(this.gameSceneKey);
            this.scene.stop();
            this.scene.start(SCENE_KEYS.MENU);
        });

        this.input.keyboard!.once('keydown-ESC', () => this.resumeGame());
    }

    private createButton(y: number, label: string, onClick: () => void): void {
        const text = this.add
            .text(GAME_WIDTH / 2, y, label, {
                fontFamily: 'monospace',
                fontSize: '16px',
                color: '#ffffff',
            })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true });

        text.on('pointerover', () => text.setColor('#ffe066'));
        text.on('pointerout', () => text.setColor('#ffffff'));
        text.on('pointerdown', onClick);
    }

    private adjustVolume(delta: number): void {
        const settings = loadSettings();
        settings.volume = Phaser.Math.Clamp(settings.volume + delta, 0, 1);
        saveSettings(settings);
        this.updateVolumeText();
        sound.uiClick();
    }

    private updateVolumeText(): void {
        const settings = loadSettings();
        this.volumeText.setText(`VOLUME: ${Math.round(settings.volume * 100)}%`);
    }

    private resumeGame(): void {
        sound.uiClick();
        this.scene.stop();
        this.scene.resume(this.gameSceneKey);
    }
}
