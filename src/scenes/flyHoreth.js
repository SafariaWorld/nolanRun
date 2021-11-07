import Phaser from "Phaser";
import WebFontFile from '../WebFontFile'


//****starting to fuck with the Horeth Orb Group settings****//
//*** that's why there is copy 2 version of this document */

class PlayScene extends Phaser.Scene {

    constructor() {
        super('PlayScene');
       
        this.background = null;
        this.player = null;

        //controls
        this.cursors = null;

        //damage group
        this.damageGroup = null;
        this.fireball = null;
        this.electricball = null;
        this.damageItemHeight = null;
        this.damageItemDistance = null;

        //collect group
        this.collectGroup = null;
        this.collectItemHeight = null;
        this.collectItemDistance = null;
        this.coins = null;

        //playerDamage Group
        this.playerDamageGroup = null;
        this.horethBall = null;
        this.horethBallTimer = 0;
        this.fireButton;
        this.maxHorethBall = 1;
        this.currentHorethBallNumber = 0;

        //score
        this.score = null;
        this.scoreText = null;

        //font
        this.fonts = null;

        //UI
        this.topUI = null;

        //enemies
        this.snake = null;
        this.enemyGroup = null;
    }

    

    //Phaser Functions
    preload() {
        this.load.image('background', 'assets/sky.png');
        this.load.image('player', 'assets/horus.png');
        this.load.image('fireball', 'assets/fireball.png');
        this.load.image('electricball', 'assets/electricball.png');
        this.load.image('coins', 'assets/coin.png');
        this.load.image('topUI', 'assets/topUI.png');
        this.load.image('horethBall','assets/horethBall.png');
        this.load.image('snake','assets/snake.png');

        const fonts = new WebFontFile(this.load, 'Abel')
		this.load.addFile(fonts);
    }

    create() {
        this.createBackground()
        this.createPlayer();
        this.createCursorAndKeyUpKeyDown()
        
        this.createFireAndElectricBall();
        this.createDamageCollider();
        this.createCoins();
        this.createCollectOverlap();

        this.topUI = this.add.image(0, 360, 'topUI').setOrigin(0, 0.5);
        this.scoreText = this.add.text(605, 16, '0', { fontSize: '40px', fill: 'white' }); 
        
        
        this.input.keyboard.on('keydown-SPACE', this.createHorethBall, this);
       // this.createHorethBallCollider();
           

        this.createSnake();
        this.moveSnake();
        
    }

    update() {
        this.background.tilePositionX += 0.5;
        this.setControls();
        
        if(this.horethBall) {
            //console.log('fasdf');
            this.removeHorethBall();
        }

        if (this.snake) {
            this.checkAndStopSnake();
        }
        
        
    }

    

    //Game Functions for Phaser function "create"
    createPlayer() {
        this.player = this.physics.add.sprite(100, 250, 'player');
        this.player.setScale(0.4);
        this.player.setCollideWorldBounds(true);
    }

    createBackground() {
        this.background = this.add.tileSprite(1950, 50,1980,720, 'background');
        this.background.setScale(2);
    }

    //------------------------------Fire and Electric Ball and Damage Group ---------------------------//
    createFireAndElectricBall() {
        this.damageGroup = this.physics.add.group();

        this.damageItemDistance = 1000;

        for (let i = 0; i < 50; i++) {

            this.damageItemDistance += 400;
            this.damageItemHeight = Math.random() * (600 - 50) + 50;
            

            this.fireball = this.damageGroup.create(this.damageItemDistance, this.damageItemHeight, 'fireball');
            this.fireball.setScale(.3);

            //set collision box
            this.fireball.body.setSize(310,310);

            this.damageItemDistance += 200;
            this.damageItemHeight = Math.random() * (600 - 50) + 50;
            this.electricball = this.damageGroup.create(this.damageItemDistance, this.damageItemHeight, 'electricball');
            this.electricball.setScale(.2);

            //set collision box
            this.electricball.body.setSize(175,175);

            this.damageItemDistance += 200;
            this.damageItemHeight = Math.random() * (600 - 50) + 50;
            this.electricball = this.damageGroup.create(this.damageItemDistance, this.damageItemHeight, 'electricball');
            this.electricball.setScale(.2);

            //set collision box
            this.electricball.body.setSize(275,275);
        }

        this.damageGroup.setVelocityX(-350);
        

    }

    createDamageCollider() {
        this.physics.add.collider(this.player, this.damageGroup, function() {
            this.physics.pause();
        });
    }


    //-----------------------------Coins and collecting-------------------------//
    createCoins() {
        this.collectGroup = this.physics.add.group();

        this.collectItemDistance = 800;

        for (let i = 0; i < 50; i++) {
            this.collectItemHeight = Math.random() * (600 - 50) + 50;
            this.collectItemDistance += 800;
            this.coins = this.collectGroup.create(this.collectItemDistance, this.collectItemHeight, 'coins');
            this.coins.setScale(.05);

            //set collision box
            this.coins.body.setSize(575,575);
        }

        this.collectGroup.setVelocityX(-350);
    }

    createCollectOverlap() {
        this.physics.add.overlap(this.player, this.collectGroup, this.collectCoin, null, this);
    }

    collectCoin(player, collectGroup) {
        collectGroup.disableBody(true, true);
        this.score += 1;
        this.scoreText.setText(this.score);
    }

    //Cursors
    createCursorAndKeyUpKeyDown() {
        this.cursors = this.input.keyboard.createCursorKeys();
        this.keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        this.keyDOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
    } 


    //---------------------------create only 1 horeth ball---------------------------//
    createHorethBall() {
        this.playerDamageGroup = this.physics.add.group();

        console.log(this.currentHorethBallNumber, this.maxHorethBall);
        if (this.currentHorethBallNumber < this.maxHorethBall) {
            this.horethBall = this.playerDamageGroup.create(this.player.x, this.player.y, 'horethBall');
            this.horethBall.setScale(.3);
            this.playerDamageGroup.setVelocityX(900); 
            this.currentHorethBallNumber += 1;
            
        } 

         this.physics.add.collider(this.enemyGroup, this.playerDamageGroup, function() {
             console.log(this.playerDamageGroup);
             console.log(this.enemyGroup);
        });
        
    }

    removeHorethBall() {
        //console.log('removeHorethBall');
        //console.log(this.maxHorethBall);

        if (this.horethBall.x > 1300 && this.horethBall.active) {
             this.horethBall.destroy();
             this.currentHorethBallNumber -= 1;
             //console.log('hey');
        }
    }


    //---------------------create enemies------------------------//
    //1 
    createSnake() {
        this.enemyGroup = this.physics.add.group();

        this.snake = this.enemyGroup.create(1380, 300, 'snake');
        this.snake.body.setSize(150,70);

        this.enemyGroup.setVelocityY(20);
    }

    createSnakeCollider() {

        console.log('collider')
        console.log(this.enemyGroup);
        console.log(this.playerDamageGroup);

        this.physics.add.collider(this.enemyGroup, this.playerDamageGroup, function() {
            
        });
    }

    // createHorethBallCollider() {
    //     this.createSnakeCollider();
    // }

    moveSnake() {
        this.enemyGroup.setVelocityX(-300);
        
    } 

    checkAndStopSnake() {

        //console.log(this.snake.y);
        
        if (this.snake.x == 1100) {
            this.snake.setVelocityX(0);
        }

        if (this.snake.x == 1100) {
            this.snake.setVelocityY(100);
        }

        if (this.snake.y > 550) {
            this.snake.setVelocityY(-100);
        }

        if (this.snake.y < 100) {
            this.snake.setVelocityY(100);
        }
        
    }


    //Game Function for Phaser function "update"
    setControls() {
        const {left, right} = this.cursors;

        if (left.isDown) {
            this.player.setVelocityX(-285);
        } 
        else if (right.isDown) {
            this.player.setVelocityX(285);
        } 
        else if (this.keyUP.isDown) {
            this.player.setVelocityY(-285);
        }
        else if (this.keyDOWN.isDown) {
            this.player.setVelocityY(285);
        }
        else {
            this.player.setVelocityX(0);
            this.player.setVelocityY(0);
        }

        if (this.keyUP.isDown && right.isDown) {
            this.player.setVelocityY(-285);
            this.player.setVelocityX(285);
        }
     
        if (this.keyDOWN.isDown && right.isDown) {
            this.player.setVelocityY(285);
            this.player.setVelocityX(285);
        }
    }


    

}

export default PlayScene;