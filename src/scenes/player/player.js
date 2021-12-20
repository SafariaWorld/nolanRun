// class Player extends Phaser.GameObjects.Sprite {

//     constructor(config) {
//         super(config.scene, config.x, config.y, "playerSpriteSheet");
//         //this.setScale(4);
//         //this.setAlpha(0.6);
//         this.setInteractive();
//         this.on('pointerdown', this.sunClick, this);
//         config.scene.add.existing(this);
//     }


//     preload() {

//     }

//     sunClick() {
//         //this.alpha -= .5;
//         console.log('hello');
//     }
// }
class Player extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x, y) {
        super(scene, x, y, 'nolanSpriteFull300Percent.png');
        scene.physics.add.existing(this);
        scene.add.existing(this);
    }
}

export default Player