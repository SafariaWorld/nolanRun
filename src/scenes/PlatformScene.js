import Phaser from "Phaser";
import { DOWN, UP } from "phaser";

class PlayScene extends Phaser.Scene {

    constructor() {
        super('PlayScene');
        
        this.player = null;   
        this.cursors = null;
        this.keyUP = null;
        this.keyDOWN = null;
        this.fireball = null;

        this.itemDistance = null;
        this.Height = null;

        this.electricBall = null;
        this.itemDistanceModifier = null;
        this.itemHeightModifier = null;

        this.background = null;
        this.backgroundV = null;


        this.collisionItem = null;
    }

    

    preload() {
        this.load.image('background', 'assets/sky.png');
        this.load.image('player', 'assets/horus.png');
        this.load.image('fireball', 'assets/fireball.png');
        this.load.image('electricBall', 'assets/electricball.png');
    }

    create() {

    
    this.background = this.add.tileSprite(800,-100,1280,720, 'background');
    this.background.setScale(3);
    // this.background.setVelocityX(-15);

    this.player = this.physics.add.sprite(100, 250, 'player');
    this.player.setScale(0.6);
    this.player.setCollideWorldBounds(true);


    this.itemDistance = 500;
    this.itemHeight = Math.random() * (550 - 50) + 50;

    this.itemDistanceModifier = Math.random() * (400 - -250) + -250;
    this.itemHeightModifier = Math.random() * (400 - -250) + -250;

    // for (let i = 0; i < 10, i++) {
    //     this.fireball = this.add.image(this.fireballDistance, 200, 'fireball');
    //     // this.fireball.setScale(0.3);
    //     // this.fireballDistance += 50;
    // }
    
    this.collisionItem = this.physics.add.group();

    for (let i = 0; i < 30; i++) {

        this.fireball = this.collisionItem.create(this.itemDistance, this.itemHeight, 'fireball');
        this.fireball.setScale(0.3);

        this.electricBall = this.collisionItem.create(this.itemDistance + this.itemDistanceModifier, this.itemHeight + this.itemHeightModifier, 'electricBall');
        this.electricBall.setScale(0.5);


        this.itemDistance += 850;
        
        this.itemHeight = Math.random() * (550 - 50) + 50;
        this.fireball.setVelocityX(-300);
        this.electricBall.setVelocityX(-375);

        this.physics.add.collider(this.player, this.collisionItem, function() {
            this.physics.pause;
        });

    }

    

    this.cursors = this.input.keyboard.createCursorKeys();

    this.keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
    this.keyDOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);


    
}

    update() {

        

        this.background.tilePositionX += 1;

        const {left, right} = this.cursors;

        if (left.isDown) {
            this.player.setVelocityX(-250);
        } 
        else if (right.isDown) {
            this.player.setVelocityX(250);
        } 
        else if (this.keyUP.isDown) {
            this.player.setVelocityY(-250);
        }
        else if (this.keyDOWN.isDown) {
            this.player.setVelocityY(250);
        }
        else {
            this.player.setVelocityX(0);
            this.player.setVelocityY(0);
        }

        if (this.keyUP.isDown && right.isDown) {
            this.player.setVelocityY(-250);
            this.player.setVelocityX(250);
        }

        if (this.keyDOWN.isDown && right.isDown) {
            this.player.setVelocityY(150);
            this.player.setVelocityX(150);
        }

        // if (!left.isDown) {
        //     this.player.setVelocityX(0);
        // }
    }

    

    createFireball() {
        // for (let i = 0; i < 10, i++) {
        //  this.fireball = this.add.image(this.fireballDistance, 200, 'fireball');
        //  this.fireball.setScale(0.3);
        //  this.fireballDistance += 50;
        // }
    }


}

export default PlayScene;