import Phaser from "Phaser";
import WebFontFile from '../WebFontFile';



//****starting to fuck with the Horeth Orb Group settings****//
//*** that's why there is copy 2 version of this document *//
//*** Now adding movement to electric ball**/

class PlayScene extends Phaser.Scene {

    constructor() {
        super('PlayScene');
       

        this.background = null;
        this.backgroundBuildings = null;
        this.foreground = null;
        this.sun = null;
        this.clouds = null;
        this.music = null;
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
        this.goldCollectSound = null;

        //playerDamage Group
        this.playerDamageGroup = null;
        this.horethBall = null;
        this.horethBallTimer = 0;
        this.orbSound = null;
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
        this.snakeDistance = null;

        //fireball Animation
        this.newFireBall = null;
        this.fireAnimation = null;

        //electricball Animation
        this.newElectricBall = null;
        this.ElectricAnimation = null;
    }

    

    //Phaser Functions
    preload() {
        this.load.audio('theme', 'assets/audio/mainMusic.wav');

        this.load.image('background', 'assets/newBackground.jpg');
        this.load.image('backgroundBuildings', 'assets/backgroundBuildings.png');
        this.load.image('foreground', 'assets/foreground.png');
        this.load.image('clouds', 'assets/clouds.png');
        this.load.image('sun', 'assets/sun.png');
        this.load.image('player', 'assets/horus.png');
        this.load.image('fireball', 'assets/fireball.png');
        this.load.image('electricball', 'assets/electricball.png');
        this.load.image('coins', 'assets/coin.png');
        this.load.image('topUI', 'assets/topUI.png');
        this.load.image('horethBall','assets/horethBall.png');
        this.load.image('snake','assets/snake.png');

        this.load.spritesheet("newFireBall", "assets/newFireBall.png", { frameWidth: 300, frameHeight: 300 });
        this.load.spritesheet("newElectricBall", "assets/newElectricBall.png", { frameWidth: 300, frameHeight: 300 });



        this.load.audio('orbSound', 'assets/audio/spell.mp3');
        this.load.audio('goldCollectSound', 'assets/audio/goldCollectSound.mp3')

        

        const fonts = new WebFontFile(this.load, 'Abel')
		this.load.addFile(fonts);
    }

    create() {
        this.music = this.sound.add('theme', {volume: 0.2});
        this.music.play();
        this.createBackground()
        this.createPlayer();
        this.createCursorAndKeyUpKeyDown()
        
        this.createFireAndElectricBall();
        this.createDamageCollider();
        this.createElectricCollider();
        this.createCoins();
        this.createCollectOverlap();

        this.orbSound = this.sound.add('orbSound', {volume: 0.8});
        this.goldCollectSound = this.sound.add('goldCollectSound');

        this.topUI = this.add.image(0, 360, 'topUI').setOrigin(0, 0.5);
        this.scoreText = this.add.text(605, 16, '0', { fontSize: '40px', fill: 'white' }); 
        
        
        this.input.keyboard.on('keydown-SPACE', this.createHorethBall, this);
       // this.createHorethBallCollider();
           

        this.createSnake();
        this.moveSnake();

       
        


    
        
    }

    update() {
        this.background.tilePositionX += 0.5;
        this.foreground.tilePositionX += 8.8;
        this.sun.tilePositionX += 0.05;
        this.clouds.tilePositionX += 1;
        this.setControls();
        
        if(this.horethBall) {
            //console.log('fasdf');
            this.removeHorethBall();
        }

        if (this.snake) {
            this.checkAndStopSnake();
        }
        
        if (this.electricball) {
            //console.log('check position');
            this.checkElectricBallPositionAndMove()
        
        }
        
    }

    

    //Game Functions for Phaser function "create"
    createPlayer() {
        this.player = this.physics.add.sprite(100, 250, 'player');
        this.player.setScale(0.4);
        this.player.setCollideWorldBounds(true);
        this.player.body.setSize(255,45);

    }

    createBackground() {
        this.background = this.add.tileSprite(1250, 340, 2540, 720, 'background');
        this.background.setScale(1);


        this.sun = this.add.tileSprite(800, 450, 2500, 1000, 'sun');
        this.background = this.add.tileSprite(1250, 340, 2540, 720, 'backgroundBuildings');
        this.background.setScale(1);
        this.sun.setScale(.8);
        this.foreground = this.add.tileSprite(1250, 360, 2540, 720, 'foreground');

        this.clouds = this.add.tileSprite(1250, 360, 2540, 720, 'clouds');
    }

    //------------------------------Fire and Electric Ball and Damage Group ---------------------------//
    createFireAndElectricBall() {
        this.damageGroup = this.physics.add.group();
        this.electricGroup = this.physics.add.group();

        this.damageItemDistance = 1000;

        for (let i = 0; i < 50; i++) {

            this.damageItemDistance += 400;
            this.damageItemHeight = Math.random() * (600 - 50) + 50;
            
            this.newFireBall = {
                key: 'fireBallAnimation',
                frames: this.anims.generateFrameNumbers('newFireBall', {start: 0, end: 16, first: 0}),
                frameRate: 13,
                repeat: -1
            }
    
            this.anims.create(this.newFireBall);
           

            this.fireball = this.damageGroup.create(this.damageItemDistance, this.damageItemHeight, 'newFireBall').play('fireBallAnimation');
            this.fireball.setScale(.8);

            //set collision box
            this.fireball.body.setSize(80,80);

            this.damageItemDistance += 200;
            this.damageItemHeight = Math.random() * (600 - 50) + 50;

            

            this.newElectricBall = {
                key: 'electricBallAnimation',
                frames: this.anims.generateFrameNumbers('newElectricBall', {start:4, end:8, first:4}),
                frameRate: 10,
                repeat: -1
            }

            this.anims.create(this.newElectricBall);

            this.electricball = this.electricGroup.create(this.damageItemDistance, this.damageItemHeight, 'newElectricBall').play('electricBallAnimation');
            this.electricball.setScale(.5);
            this.createElectricballMovement(this.electricball.y);



            //set collision box
            this.electricball.body.setSize(100,100);

            this.damageItemDistance += 200;
            this.damageItemHeight = Math.random() * (600 - 50) + 50;
            this.electricball = this.electricGroup.create(this.damageItemDistance, this.damageItemHeight, 'newElectricBall').play('electricBallAnimation');
            this.electricball.setScale(.5);
            this.createElectricballMovement(this.electricball.y);

            //set collision box
            this.electricball.body.setSize(100,100);
        }

        this.damageGroup.setVelocityX(-350);
        this.electricGroup.setVelocityX(-350);
        

    }

    createElectricballMovement() {

       console.log('fsadf');

        if (this.electricball.y > 600) {
            this.electricball.setVelocityY(200);
        } else {
            this.electricball.setVelocityY(-200);
        }
        
    }

    checkElectricBallPositionAndMove() {

        
        //console.log(this.electricball.y);

        //console.log(this.damageGroup.getChildren().length);

        for (let i = 0; i < this.electricGroup.getChildren().length; i++) {
            //console.log(i)
            //console.log(this.electricGroup.getChildren()[i].y, "hfas");
           
                if (this.electricGroup.getChildren()[i].y < 55) {
                    this.electricGroup.getChildren()[i].setVelocityY(200);
                } 
        
                if (this.electricGroup.getChildren()[i].y > 680) {
                    this.electricGroup.getChildren()[i].setVelocityY(-200);
                }
        }

    }

    createDamageCollider() {
        this.physics.add.collider(this.player, this.damageGroup, function() {
            this.physics.pause();
        });
    }

    createElectricCollider() {
        this.physics.add.collider(this.player, this.electricGroup, function() {
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
            this.coins.body.setSize(675,675);
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
        this.goldCollectSound.play();
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
        this.orbSound.play();
        
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

        //if (this.snakeDistance == null) {
            this.snakeDistance = 1380;
       // } 
        
        
        
        //for (let i = 0; i <= 5; i++) {
            this.snake = this.enemyGroup.create(this.snakeDistance, 300, 'snake');
            this.snake.body.setSize(150,70);
            this.snakeDistance += 100;
        //}
        
        this.enemyGroup.setVelocityY(20);
        
    }

    createSnakeCollider() {

        console.log('collider')
        console.log(this.enemyGroup);
        console.log(this.playerDamageGroup);

            this.physics.add.collider(this.enemyGroup, this.playerDamageGroup, function() {
            
        });
    }


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

        let velocityStopper = false;


        

        if (left.isDown) {
            this.player.setVelocityX(-295);
            velocityStopper = true;
            
            
            // if (velocityStopper == true) {
            //     this.player.setVelocityX(0);
            // }
        } 
        else if (right.isDown) {
            this.player.setVelocityX(625);            
        } 
        else if (this.keyUP.isDown) {
            this.player.setVelocityY(-325);
        }
        else if (this.keyDOWN.isDown) {
            this.player.setVelocityY(325);
        }
        else {
            this.player.setVelocityY(0);
            this.player.setDrag(1000);
            if (velocityStopper == true) {
                this.player.setVelocityX(0);
                velocityStopper == false;
            }
            
        }

        if (this.keyUP.isDown && right.isDown) {
            this.player.setVelocityY(-425);
            this.player.setVelocityX(425);
        }
     
        if (this.keyDOWN.isDown && right.isDown) {
            this.player.setVelocityY(425);
            this.player.setVelocityX(425);
        }
    }


    

}

export default PlayScene;