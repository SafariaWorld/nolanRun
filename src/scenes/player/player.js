import HealthBar from "./healthBar";
class Player extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x, y) {
        super(scene, x, y, 'nolanSpriteFull300Percent.png');
        scene.physics.add.existing(this);
        scene.add.existing(this);


        this.healthBar = null;
        // let killPlayer = function killPlayer() {
        //     console.log('killPlayer Played');
        //     this.scene.pause();
        // }
    }

    killPlayer() {
        console.log('killPlayer Played');
        this.scene.scene.pause();
    }

    // addCollider(enemyGroup, player) {
    //     console.log('collider funct');
    //     scene.physics.add.collider(enemyGroup, player, this.killPlayer, null, this)
    // }

    
}



export default Player