import Phaser from 'phaser';
import { SCENE_KEYS, GAME_WIDTH, GAME_HEIGHT } from '../config/constants';
import { loadHighScore } from '../systems/SaveData';
import sound from '../audio/SoundManager';

export default class MenuScene extends Phaser.Scene {
    constructor() {
        super(SCENE_KEYS.MENU);
    }

    create(): void {
        this.cameras.main.setBackgroundColor('#0a0a1a');
        sound.startMusic();

        this.add
            .text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 60, 'OPERATION IRON STORM', {
                fontFamily: 'monospace',
                fontSize: '26px',
                color: '#ffffff',
            })
            .setOrigin(0.5);

        this.add
            .text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 20, `HIGH SCORE: ${loadHighScore()}`, {
                fontFamily: 'monospace',
                fontSize: '13px',
                color: '#ffe066',
            })
            .setOrigin(0.5);

        const startText = this.add
            .text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 40, 'PRESS SPACE TO START', {
                fontFamily: 'monospace',
                fontSize: '14px',
                color: '#ffe066',
            })
            .setOrigin(0.5);

        this.tweens.add({ targets: startText, alpha: 0.4, duration: 700, yoyo: true, repeat: -1 });

        const goToPlaneSelect = (): void => {
            sound.uiClick();
            this.scene.start(SCENE_KEYS.PLANE_SELECT);
        };

        this.input.keyboard!.once('keydown-SPACE', goToPlaneSelect);
        this.input.once('pointerdown', goToPlaneSelect);
    }
}
