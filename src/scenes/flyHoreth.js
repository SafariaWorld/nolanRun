import Phaser from "phaser";
import WebFontFile from '../WebFontFile';



class PlayScene extends Phaser.Scene {

    constructor() {
        super('PlayScene');
       

        this.background = null;
        this.backgroundBuildings = null;
        this.foreground = null;
        this.sun = null;
        this.clouds = null;
        this.brightness = null;
        this.birdsRight = null;
        this.birdsLeft = null;
        this.music = null;
        this.player = null;
        this.playerVersion2 = null; //check on this to replace with original player
        this.dunes = null;

        //controls
        this.cursors = null;

        //damage group
        this.damageGroup = null;
        this.fireball = null;
        this.electricball = null;
        this.damageItemHeight = null;
        this.damageItemDistance = null;

        //collect group Coin
        this.collectGroup = null;
        this.collectItemHeight = null;
        this.collectItemDistance = null;
        this.coins = null;
        this.goldCollectSound = null;

        //collect armor group
        this.armorGroup = null;
        this.collectArmorHeight = null;
        this.collectArmorDistance = null;
        this.armor = null;
        this.armorCollectSound = null;
        this.armorCollected = false;


        //playerDamage Group
        this.playerDamageGroup = null;
        this.horethBall = null;
        this.horethBallTimer = 0;
        this.orbSound = null;
        this.fireButton;
        this.maxHorethBall = 1;
        this.currentHorethBallNumber = 0;
        this.bluntImpactSound = null;

        

        //score
        this.score = null;
        this.scoreText = null;

        //font
        this.fonts = null;

        //UI
        this.topUI = null;

        //enemies
        this.snake = null;
        this.snakeVersion2 = null;
        this.enemyGroup = null;
        this.snakeDistance = null;
        this.snakeTracker = 0;
        this.snakeBolt = null; 
        this.snakeBoltAnimation = null;
        this.snakeBoltObject = null;
        this.snakeBoltTracker = 0;
        

        //enemy Diamond
        this.patrolDiamond = null;
        this.move1 = false;
        this.move2 = false;
        this.move3 = false;
        this.move4 = false;
        this.movePicker = null;
        this.patrolDiamondMoving = false;
        this.initialMoveCheckDiamond = false;
        this.patrolDiamondMoveCheck = 0;
        this.trueDelay = 400;

        //Graphic following line 
        this.line1 = null;
        this.line2 = null;
        this.follower = null;
        this.path = null;
        this.bounds = null;
        this.graphics = null;

        //fireball Animation
        this.newFireBall = null;
        this.fireAnimation = null;

        //electricball Animation
        this.newElectricBall = null;
        this.ElectricAnimation = null;

        //camera position
        this.screenCenterX = null;
        this.screenCenterY = null;
    }

    

    //Phaser Functions
    preload() {
        this.load.audio('theme', 'assets/audio/mainMusic.wav');

        this.load.image('topUI', 'assets/topUI.png');
        this.load.image('background', 'assets/newBackground.jpg');
        this.load.image('backgroundBuildings', 'assets/backgroundBuildings.png');
        this.load.image('foreground', 'assets/foreground.png');
        this.load.image('clouds', 'assets/clouds.png');
        this.load.image('dunes', 'assets/dunes.png');
        this.load.image('brightness', 'assets/brightness.png');
        this.load.image('birdsLeft','assets/birdsLeft.png');
        this.load.image('birdsRight','assets/birdsRight.png');
        this.load.image('sun', 'assets/sun.png');
        this.load.image('player', 'assets/horus.png');
        this.load.spritesheet('playerVersion2', 'assets/horusFullSpriteSheet.png', { frameWidth: 370, frameHeight: 300 });
        this.load.spritesheet('playerArmorOne', 'assets/horethArmorOneSpriteSheet.png', { frameWidth: 222, frameHeight: 300 });
        

        this.load.image('fireball', 'assets/fireball.png');
        this.load.image('electricball', 'assets/electricball.png');

        this.load.image('coins', 'assets/coin.png');
        this.load.image('horethBall','assets/horethBall.png');
        this.load.audio('bluntImpactSound', 'assets/audio/bluntImpactSound.mp3');

        //armor
        this.load.image('armor','assets/shield.png');

        //this.load.image('snake','assets/snake.png');
    
        this.load.spritesheet('snake', 'assets/snakeSpriteSheet.png', { frameWidth: 330, frameHeight: 165 });
        this.load.image('patrolDiamond', 'assets/patrolDiamond.png');

        this.load.spritesheet("newFireBall", "assets/newFireBall.png", { frameWidth: 300, frameHeight: 300 });
        this.load.spritesheet("newElectricBall", "assets/newElectricBall.png", { frameWidth: 300, frameHeight: 300 });
        this.load.spritesheet("snakeBolt","assets/snakeBolt.png", { frameWidth: 200, frameHeight: 60});



        this.load.audio('orbSound', 'assets/audio/spell.mp3');
        this.load.audio('goldCollectSound', 'assets/audio/coinNew.wav')

        

        const fonts = new WebFontFile(this.load, 'Abel')
		this.load.addFile(fonts);
    }

    create() {
        this.music = this.sound.add('theme', {volume: 0.2});
        //this.music.play();
        this.createBackground();
        this.createPlayer();
        this.createCursorAndKeyUpKeyDown();
        
        this.createFireAndElectricBall();
        this.createDamageCollider();
        this.createElectricCollider();
        this.createCoins();
        this.createCollectOverlap();

        this.createArmor();
        this.createCollectArmorOverlap();

        this.orbSound = this.sound.add('orbSound', {volume: 0.8});
        this.goldCollectSound = this.sound.add('goldCollectSound');

        //UI
        this.topUI = this.add.image(0, 360, 'topUI').setOrigin(0, 0.5);
        //console.log(this.width);

        //create screen positions
        this.screenCenterX = (this.cameras.main.worldView.x + this.cameras.main.width / 2) - 13;
        this.screenCenterY = this.cameras.main.worldView.y + 20;
        this.scoreText = this.add.text(this.screenCenterX, this.screenCenterY, '0', { fontSize: '40px', fill: 'white' }); 
        
        this.bluntImpactSound = this.sound.add('bluntImpactSound');
        this.input.keyboard.on('keydown-SPACE', this.createHorethBall, this);

        // this.createHorethBallCollider();       
        this.createPatrolDiamond();
        
        
    }

    

    update() {
        this.background.tilePositionX += .5;
        this.foreground.tilePositionX += 3.8;
        this.sun.tilePositionX += 0.05;
        this.clouds.tilePositionX += 1;
        this.dunes.tilePositionX += .7;
       
        this.setControls();
        
        if(this.horethBall) {
            //console.log('fasdf');
            this.removeHorethBall();
        }

        if (this.snake) {
            this.checkAndStopSnake();
        }

        //checking for initial move and then setting boundaries after first move
        if (this.patrolDiamond) {
            
            if (this.initialMoveCheckDiamond == false) {
                this.initialPatrolDiamondStop();
            }
            
            if (this.initialMoveCheckDiamond == true) {
                // this.secondDiamondMove();
                // this.thirdDiamondMove();
                this.afterPatrolDiamondMove();
           
            }
            
        }
        
        if (this.electricball) {
            //console.log('check position');
            this.checkElectricBallPositionAndMove();
        }
        
        let tracker = 0;

        if (!this.snake) {
                this.createSnake();
                this.moveSnake();   
        }

     
        if (this.snakeBoltObject) {
            
            if (this.snakeBoltObject.x < 0) {
                this.destroySnakeBolt();
            }
            
        }

        if (!this.snakeBoltObject) {
            this.snakeBoltTracker = 0;
        }

        //tracks for snakebolt and if a snake exists to shoot a snakebolt
        if (this.snakeBoltTracker < 1 && this.snakeTracker > 0) {
            this.snakeBolt = this.createSnakeBolt();
        }


  
        
    }

    //*********************after update**************************//

    //testing new methods for pathing

  



    

    //***********************************WORK IN PROGRESS***********************************//
    //Patrol Diamond Functions
    createPatrolDiamond() {
        this.patrolDiamond = this.damageGroup.create(1400,550, 'patrolDiamond');
        this.patrolDiamond.setScale(.7);     
        this.movePatrolDiamond(); 
    }

    movePatrolDiamond() {
        this.patrolDiamond.setVelocityX(-300);
        this.patrolDiamondMoving = true;
    } 

    initialPatrolDiamondStop() {
        if (this.patrolDiamond.x < 899 & this.move1 == false) {
            this.patrolDiamond.setVelocityX(0);
            this.patrolDiamond.setVelocityY(0);
            this.move1 = true;
            this.initialMoveCheckDiamond = true;
            
            this.time.addEvent({
                delay: 1800,
                callback: ()=>{
                    this.patrolDiamondMoving = false;
                },
                loop: false
            })
        }
    }

    

    afterPatrolDiamondMove() {

        //move diamond up 375 pixels
        if (this.patrolDiamondMoveCheck < 1) {

            console.log("patrolDiamondMoveCeck");
            for (let i = 0; i <= 750; i++) {
                this.time.addEvent({
                    delay: this.trueDelay += 2, //changes speed of change
                    callback: ()=>{
                        this.patrolDiamond.y -= .5; //distance per move

                        if (i == 750) {
                            this.move1 = true;
                            this.trueDelay = 500;
                        }
                    },
                    loop: false
                })
            }

            this.patrolDiamondMoveCheck += 1;
        }

        if (this.patrolDiamondMoveCheck == 1 && this.move1 == true && this.patrolDiamond.y == 174.5 && this.move2 == false) {
            

        
                this.time.addEvent({
                    delay: 400, //changes speed of change
                    callback: ()=>{
                        this.patrolDiamond.setVelocityX(100); //distance per move
                        this.move2 = true;
                    },
                    loop: false
                })
            
        }
        
        
    }

    // secondDiamondMove() {

    //     if (this.patrolDiamond.y < 200 && this.move2 == false) {
    //         this.patrolDiamond.y += 0;
    //         this.patrolDiamondMoving = true;
    //         this.move2 = true;
    //         this.time.addEvent({
    //             delay: 1800,
    //             callback: ()=>{
    //                 this.patrolDiamondMoving = false;
    //             },
    //             loop: false
    //         })
    //     }
    //     if (this.patrolDiamond.x > 889 && this.patrolDiamondMoving == false) {
    //         this.patrolDiamond.y -= 5;
    //         this.patrolDiamond.x += 1.5;
    //         console.log("secondDiamons");
    //     }
    // }

    // thirdDiamondMove() {
    //     if ( this.patrolDiamond.y < 200 && this.patrolDiamondMoving == false && this.patrolDiamond.x < 1150) {
    //         //this.patrolDiamond.x += 5;
    //         console.log('third move');
    //     }

    // }
    //***********************************WORK IN PROGRESS END***********************************//

    
    //Game Functions for Phaser function "create"
    createPlayer() {

        this.player = this.physics.add.sprite(100, 250, 'playerVersion2');
        this.player.setFrame(1);
        this.player.setScale(.55);
        this.player.setCollideWorldBounds(true);
        this.player.body.setSize(120,45);
        this.player.body.x += 20;

    }

    createBackground() {
        this.background = this.add.tileSprite(1550, 340, 2540, 720, 'background');
        this.background.setScale(.8);

        this.sun = this.add.tileSprite(800, 450, 2500, 1000, 'sun');
        this.sun.setScale(.8);

        this.background = this.add.tileSprite(1250, 360, 2540, 720, 'backgroundBuildings');
        this.background.setScale(1);
        this.background.setAlpha(0.95);
        this.dunes = this.add.tileSprite(1050, 220, 2540, 720, 'dunes');
        this.dunes.setScale(1.4);
        
        
        this.brightness = this.add.tileSprite(1250, 360, 2540, 720, 'brightness');
        this.brightness.setAlpha(0.6);
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

        if (this.score >= 10) {
            this.scoreText.x = this.screenCenterX - 8;
        }

        this.goldCollectSound.play();
    }

    //-------------------------------Create armor and collect--------------------------------//

    createArmor() {
        this.collectArmorGroup = this.physics.add.group();

        this.collectArmorDistance = 800;

        for (let i = 0; i < 50; i++) {
            this.collectArmorHeight = Math.random() * (600 - 50) + 50;
            this.collectArmorDistance += 800;
            this.armor = this.collectArmorGroup.create(this.collectArmorDistance, this.collectArmorHeight, 'armor');
            this.armor.setScale(.5);
            

            //set collision box
            this.armor.body.setSize(100,100);
        }



        this.collectArmorGroup.setVelocityX(-350);
    }

    createCollectArmorOverlap() {
        this.physics.add.overlap(this.player, this.collectArmorGroup, this.collectArmor, null, this);
    }

    collectArmor(player, collectArmorGroup) {
        collectArmorGroup.disableBody(true,true);
        this.armorCollected = true;
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
        
        if (this.snake) {
            console.log(this.playerDamageGroup, 'and', this.enemyGroup, "line");
            this.physics.add.overlap(this.playerDamageGroup, this.enemyGroup, this.destroySnake, null, this);
        }
    } 

        

    //  this.physics.add.collider(this.enemyGroup, this.playerDamageGroup, function() {
    //      console.log(this.playerDamageGroup);
    //      console.log(this.enemyGroup);
    // });
    
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


    //---------------------Snake functionality------------------------//
    //1 


    createSnake() {
        this.enemyGroup = this.physics.add.group();

        //if (this.snakeDistance == null) {
            this.snakeDistance = 1380;
       // } 
        

        //for (let i = 0; i <= 5; i++) {
            
            
            this.snake = {
                key: 'snakeVersion2',
                frames: this.anims.generateFrameNumbers('snake', {start: 0, end: 5, first: 0}),
                frameRate: 3,
                repeat: -1
            }
            
            this.anims.create(this.snake);
            
            this.snake = this.enemyGroup.create(this.snakeDistance, 300, 'snake').play('snakeVersion2');;
            console.log('end');
            this.snake.setScale(.8);
            this.snake.setSize(280,75);
            
           // this.snake.body.setSize(150,70);
            this.snakeDistance += 100;
            this.snakeTracker += 1;
            
            
        //}
        
        this.enemyGroup.setVelocityY(20);
    }

    destroySnake(playerDamage, enemy) {
        enemy.disableBody(true, true);
        playerDamage.disableBody(true, true);
        console.log('fhsadf');
        this.bluntImpactSound.play();
        //this.goldCollectSound.play();

        //Horethball also destroyed
        playerDamage.disableBody(true, true);
        this.currentHorethBallNumber -= 1;
        this.snakeTracker -= 1;

        this.score += 1;
        
        this.scoreText.setText(this.score);
        if (this.score >= 10) {
            this.scoreText.x = this.screenCenterX - 8;
        }

        
        this.time.addEvent({
            delay: 15500,
            callback: ()=>{
                this.snake = false;
            },
            loop: false
        })
        
        
    }

    createSnakeBolt() {
        this.snakeBoltTracker += 1;
        console.log(this.snakeBoltTracker);
        console.log('check 1');
        this.snakeBolt = {
            key: 'snakeBoltAnimation',
            frames: this.anims.generateFrameNumbers('snakeBolt', {start:0, end:2, first:0}),
            frameRate: 2,
            repeat: -1
        }

        console.log('check 2');
        this.anims.create(this.snakeBolt);
        console.log('check 3');
        this.snakeBoltObject = this.damageGroup.create(this.snake.x - 180, this.snake.y, 'snakeBolt').play('snakeBoltAnimation');
        this.snakeBoltObject.setScale(.5);
        this.snakeBoltObject.setSize(140,30);
        this.snakeBoltObject.setVelocityX(-400);
        
    }

    destroySnakeBolt() {
        this.snakeBoltObject.destroy();
        this.snakeBoltTracker = 0;
    }

    bluntImpactTrigger() {
        console.log('trigger');
        this.bluntImpactSound.play();
    }


    moveSnake() {
        this.enemyGroup.setVelocityX(-300);
    } 

    checkAndStopSnake() {
        //console.log(this.snake.y);
        
        if (this.snake.x < 1100) {
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

            if (this.armorCollected == false) {
                this.player.setFrame(3);
            }
            if (this.armorCollected == true) {
                this.player.setFrame(7);
            }
            
            
            
            // if (velocityStopper == true) {
            //     this.player.setVelocityX(0);
            // }
        } 
        else if (right.isDown) {
            this.player.setVelocityX(625);            
        } 
        else if (this.keyUP.isDown) {
            this.player.setVelocityY(-325);
            if (this.armorCollected == false) {
                this.player.setFrame(0);
            }
            if (this.armorCollected == true) {
                this.player.setFrame(4);
            }

        }
        else if (this.keyDOWN.isDown) {
            this.player.setVelocityY(325);
            
            if (this.armorCollected == false) {
                this.player.setFrame(2);
            }
            if (this.armorCollected == true) {
                this.player.setFrame(6);
            }
        }
        else {
            this.player.setVelocityY(0);
            this.player.setDrag(1000);
            if (velocityStopper == true) {
                this.player.setVelocityX(0);
                velocityStopper == false;
            }
            if (this.armorCollected == false) {
                this.player.setFrame(1);
            }
            if (this.armorCollected == true) {
                this.player.setFrame(5);
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