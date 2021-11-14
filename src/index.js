import Phaser, { Game } from "phaser";
import flyHoreth from './scenes/flyHoreth';

const config = {
  type: Phaser.AUTO,
  width: 1280,
  height: 720,
  physics: {
    default: 'arcade',
    arcade: {
      debug:true
      // gravity: { y: 200 }
    }
  },
  scene: [flyHoreth]
};

new Phaser.Game(config);


