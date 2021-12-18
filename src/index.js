import Phaser, { Game } from "phaser";
import TitleScene from "./scenes/titleScene";
import runNolan from './scenes/runNolan';
import PreloadScene from "./scenes/preloader";

const titleScene = new TitleScene();
const playScene = new runNolan();
const preloadScene = new PreloadScene();

const config = {
    type: Phaser.AUTO,
    width: 1280,
    height: 720,
    physics: {
        default: 'arcade',
        arcade: {
            debug:true,
           gravity: { y: 1800 }
        }
    },
};

const game = new Phaser.Game(config);

game.scene.add('titleScene', titleScene);
game.scene.add('PlayScene', playScene);
game.scene.add('PreloadScene', preloadScene);
game.scene.start('preloadScene');
