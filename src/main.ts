import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from './config/constants';
import BootScene from './scenes/BootScene';
import MenuScene from './scenes/MenuScene';
import PlaneSelectScene from './scenes/PlaneSelectScene';
import GameScene from './scenes/GameScene';
import PauseScene from './scenes/PauseScene';
import EndingScene from './scenes/EndingScene';

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    parent: 'game-container',
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    backgroundColor: '#000000',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { x: 0, y: 0 },
            debug: false,
        },
    },
    scene: [BootScene, MenuScene, PlaneSelectScene, GameScene, PauseScene, EndingScene],
};

new Phaser.Game(config);
