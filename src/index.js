import Phaser, { Game } from "phaser";
import TitleScene from "./scenes/titleScene";
import flyHoreth from './scenes/flyHoreth';

const titleScene = new TitleScene();
const playScene = new flyHoreth();

const config = {
    type: Phaser.AUTO,
    width: 1280,
    height: 720,
    physics: {
        default: 'arcade',
        arcade: {
            //debug:true
            // gravity: { y: 200 }
        }
    },
};



const game = new Phaser.Game(config);

game.scene.add('titleScene', titleScene);
game.scene.add('PlayScene', playScene);

game.scene.start('titleScene');
