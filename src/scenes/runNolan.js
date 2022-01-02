import Phaser from "phaser";
import PreloadScene from "./preloader";
import WebFontFile from '../WebFontFile';
import structureColliders from "./structureColliders";
import test1 from "./structureColliders";
import Player from "./player/player";
import HealthBar from "./player/healthBar";


class PlayScene extends Phaser.Scene {

    constructor() {
        super('PlayScene');
    
        this.flip = true;

        this.background = null;
        this.backgroundBuildings = null;
        this.foreground = null;
        this.sun = null;
        this.clouds = null;
        this.brightness = null;
        this.ground = null;

        //**player**
        this.player = null;
        this.newPlayer = null;
        this.playerModel2 = null;
        this.playerState = 'still';

        //healthbar
        this.healthBar = null;
        this.currentHealth = 0;
        
        //playerStand
        this.playerStandRightAnimation = null;
        this.playerStandSpriteSheet= null;

        //playerRun
        this.playerRunRightAnimation = null;
        this.playerRunLeftAnimation = null;
        this.playerRunSpriteSheet = null;

        //playerAttack
        this.playerWhipAnimation = null;

        //slime
        this.slime = null;
        this.slimeIdleAnimation = null;
        this.slimeSpriteSheet = null;
        this.slimeGroup = null;
        this.slimeCollider = null;

        //controls
        this.cursors = null;

        //playerDamage Group
        this.playerDamageGroup = null;

        //colliderLevel
        this.platforms = null;
        this.platformCollider = null;
        
        //score
        this.score = null;
        this.scoreText = null;

        //font
        this.fonts = null;

        //UI
        this.topUI = null;

        //camera position
        this.screenCenterX = null;
        this.screenCenterY = null;
        this.testBackground = null;
    }

    

    //Phaser Functions
    preload() {
        
    }

    create() {
        this.music = this.sound.add('theme', {volume: 0.2});
        //this.music.play();
        this.createBackground();
        this.createPlatforms();
        this.createPlayer();
        this.createPlatformColliders();
        this.createCursorAndKeyUpKeyDown();
        this.initiateWhipSwing();
        
        //slime
        this.createSlime();

        //healthbar
        this.createHealthBar();

        //UI
        //this.topUI = this.add.image(0, 360, 'topUI').setOrigin(0, 0.5);

        //create screen positions
        this.screenCenterX = (this.cameras.main.worldView.x + this.cameras.main.width / 2) - 13;
        this.screenCenterY = this.cameras.main.worldView.y + 20;
        this.scoreText = this.add.text(this.screenCenterX, this.screenCenterY, '0', { fontSize: '40px', fill: 'white' });
        

          
        //let idea = this.playerStandRightAnimation.getLastFrame;
    }

    update() {
    
        this.setControls();
        
    }

    //Nolan Attacks
    initiateWhipSwing() {
        console.log('test');
        this.input.keyboard.on('keydown-SPACE', this.swingWhip, this);
    }

    swingWhip() {
        console.log('whip swing');
        this.newPlayer.anims.play('playerWhip');  
    }  
 
    //Game Functions for Phaser function "create"
    createPlayer() {
       
        this.playerDamageGroup = this.physics.add.group();
        this.createPlayerAnimation();

        this.newPlayer = new Player(this, 300, 300)
            .play('playerStandRight');
        this.newPlayer.body.setSize(44,145);
        this.newPlayer.body.setOffset(225, 110);
        


        console.log(this.newPlayer, '-is newPlayer');
       
    }



    createPlayerAnimation() {

        //stand Facing Right
        console.log('test1');
        this.playerStandRightAnimation = {
            key: 'playerStandRight',
            frames: this.anims.generateFrameNumbers('nolanRunRightSpriteSheet', {start: 9, end: 9, first: 9}),
            frameRate: 12,
            repeat: -1
        }

        this.anims.create(this.playerStandRightAnimation);

        //run Right
        console.log('test2');
        this.playerRunRightAnimation = {
            key: 'playerRunRight',
            frames: this.anims.generateFrameNumbers('nolanRunRightSpriteSheet', {start: 0, end: 5, first: 0}),
            frameRate: 8,
            repeat: false
        }

        this.anims.create(this.playerRunRightAnimation);
        
        //run Left 
        console.log('test 3');
        this.playerRunLeftAnimation = {
            key: 'playerRunLeft',
            frames: this.anims.generateFrameNumbers('nolanRunRightSpriteSheet', {start: 23, end: 27, first: 22}),
            frameRate: 8,
            repeat: false
        }

        this.anims.create(this.playerRunLeftAnimation);

        this.playerWhipAnimation = {
            key: 'playerWhip',
            frames: this.anims.generateFrameNumbers('nolanRunRightSpriteSheet', {start: 9, end: 12, first: 9}),
            frameRate: 18,
            repeat: false
        }

        this.anims.create(this.playerWhipAnimation);
    }

    createSlime() {
        this.createSlimeAnimation();
        
        this.slimeGroup = this.physics.add.group();
        console.log('slime group created!');
        this.slime = this.slimeGroup.create(1100,100, 'slime').play('slimeIdle');
        this.slime.setSize(90, 45);
        console.log('slime created!');

        this.physics.add.collider(this.slimeGroup, this.platforms, this.slowSlime, null, this);
        this.slimeCollider = this.physics.add.overlap(this.slimeGroup, this.newPlayer, this.loseHealth, null, this);



        //this.physics.add.overlap(this.slimeGroup, this.platforms, );
        this.time.addEvent({delay: 1500, callback: this.moveSlime, callbackScope: this});
        this.slime.setBounce(0, 0.3);
        this.slime.setOffset(0, 50);

        //add physics via extended sprite
    }

    createHealthBar() {

        this.healthBar = new HealthBar(this, 255, 85);
        this.healthBar.setFrame(this.currentHealth);

    }

    loseHealth() {

        this.currentHealth = this.currentHealth + 1;
        this.healthBar.setFrame(this.currentHealth);
        this.slimeCollider.active = false;

        this.newPlayer.setAlpha(0.5);

        this.time.addEvent({
            delay: 300,
            callback: ()=>{
                this.newPlayer.setAlpha(1);
            },
            loop: false
        })

        this.time.addEvent({
            delay: 600,
            callback: ()=>{
                this.newPlayer.setAlpha(.5);
            },
            loop: false
        })

        this.time.addEvent({
            delay: 900,
            callback: ()=>{
                this.newPlayer.setAlpha(1);
            },
            loop: false
        })

        this.time.addEvent({
            delay: 1200,
            callback: ()=>{
                this.newPlayer.setAlpha(.5);
            },
            loop: false
        })

        this.time.addEvent({
            delay: 1500,
            callback: ()=>{
                this.slimeCollider.active = true;
                this.newPlayer.setAlpha(1);
            },
            loop: false
        })


        if (this.currentHealth === 3) {
            this.newPlayer.killPlayer();
        }
    }


    

    moveSlime() {
        this.slime.setVelocityX(-350)
        this.slime.setVelocityY(-1070);
        console.log(this.slime); 
    }

    createSlimeAnimation() {
        console.log('slime animation function!');
        this.slimeIdleAnimation = {
            key: 'slimeIdle',
            frames: this.anims.generateFrameNumbers('slime', {start: 0, end: 4, first: 1}),
            frameRate: 5,
            repeat: -1
        }

        console.log('slime create animation!');
        this.anims.create(this.slimeIdleAnimation);
    }

    slowSlime() {

        if (this.slime.x > this.newPlayer.x) {
            this.slime.setVelocityX(-40);
            this.slime.flipX = false;
        } else {
            this.slime.setVelocityX(40);
            this.slime.flipX = true;
        }
        
    }

    playerRunningRightAnimated() {
        
        this.newPlayer.anims.play('playerRunRight', true);
        
    }

    playerRunningLeftAnimated() {
        this.newPlayer.anims.play('playerRunLeft', true);
    }

    playerStandingRightAnimated() {
        this.newPlayer.anims.play('playerStandRight', true);

    }

    createBackground() {
        
         this.sun = this.add.tileSprite(422, 238, 1200, 600, 'sun');
         this.sun.setScale(4);

         this.dunes = this.add.tileSprite(1050, 220, 2540, 720, 'dunes');
         this.dunes.setScale(1.4);
        
         this.brightness = this.add.tileSprite(1250, 360, 2540, 720, 'brightness');
         this.brightness.setAlpha(0.6);
         this.clouds = this.add.tileSprite(1250, 360, 2540, 720, 'clouds'); 
         
         //this.testBackground = this.add.tileSprite(300, 300, 1280, 720, 'testBackground'));
         this.background = this.add.tileSprite(640, 360, 1280, 720, 'newTestBackground');
        this.background.setScale(1);
    }

    createPlatforms() {
        this.platforms = this.physics.add.staticGroup(); 
        this.ground = this.platforms.create(640,620, 'ground');
       // this.ground.setAlpha(0);
        this.ground.setSize(1500, 100)
        this.ground.setScale(1);
        //this.ground.body.setOffset(0, -5)
        console.log(this.ground.x, '-x  ', this.ground.y, '-y  ');
        console.log(this.platforms);    
    }
    

    createPlatformColliders() {
      this.physics.add.collider(this.newPlayer, this.platforms);
    }
    
    flipHim() {

        if (this.flip == true) {
            this.flip = false;
        } else {
            this.flip = true;
        }

        return this.flip;
    }

    //Game Function for Phaser function "update"
    setControls() {
        const {left, right} = this.cursors;

        let velocityStopper = false;


        if (this.keyUP.isDown) { 
            this.newPlayer.setVelocityY(-815);
            
            console.log('up press');
        } else if (this.keyDOWN.isDown) {
            console.log('press down')
            this.newPlayer.anims.play('playerWhip', true);
        } else if (left.isDown) {
            this.newPlayer.setVelocityX(-315);
            console.log('left is down');
            this.playerRunningRightAnimated();
            this.newPlayer.flipX = true;
        } else if (right.isDown) {
            console.log('right is down');
            this.newPlayer.setVelocityX(315)
            this.playerRunningRightAnimated();
            this.newPlayer.flipX = false;
            
            
        }
        else {
            this.newPlayer.setVelocityX(0);
            this.playerStandingRightAnimated();
        }
 
    }

    createCursorAndKeyUpKeyDown() {
        this.cursors = this.input.keyboard.createCursorKeys();
        this.keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        this.keyDOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        this.keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    } 

    resetVariables() {
      console.log('reset variables');
    }

    endScreen() {

        this.resetVariables();
        
        const { width, height } = this.sys.game.canvas;

        this.add.text(width / 2, height / 2 - 150, 'Your Score: ' + this.score, 
        { fill: '#000000', fontSize: '60px'})
            .setInteractive()
            .setOrigin(.5, 0);

        this.add.text(width / 2, height / 2, 'PLAY AGAIN BUTTON IMAGE', 
        { fill: '#000000', fontSize: '30px'})
            .setInteractive()
            .setOrigin(.5, 0)
            .on('pointerdown', () => this.restart(), this);
    }

    restart(event) {
        this.score = 0;
        this.scene.restart();
    }

}

export default PlayScene;