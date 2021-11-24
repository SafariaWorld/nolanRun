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
        this.player = null;
        this.ground = null;

        this.playerAnimation = null;
        this.playerVersion2 = null;
        
        //controls
        this.cursors = null;

        //playerDamage Group
        this.playerDamageGroup = null;
        

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
    }

    

    //Phaser Functions
    preload() {
        
    }

    create() {
        this.music = this.sound.add('theme', {volume: 0.2});
        //this.music.play();
        this.createBackground();
        this.createPlayer();
        this.createCursorAndKeyUpKeyDown();

        //UI
        //this.topUI = this.add.image(0, 360, 'topUI').setOrigin(0, 0.5);

        //create screen positions
        this.screenCenterX = (this.cameras.main.worldView.x + this.cameras.main.width / 2) - 13;
        this.screenCenterY = this.cameras.main.worldView.y + 20;
        this.scoreText = this.add.text(this.screenCenterX, this.screenCenterY, '0', { fontSize: '40px', fill: 'white' }); 
    }

    update() {
    
        this.setControls();
    }
 

    //Game Functions for Phaser function "create"
    createPlayer() {

        this.playerDamageGroup = this.physics.add.group();

        this.playerAnimation = {
            key: 'playerStandAnimation',
            frames: this.anims.generateFrameNumbers('playerVersion2', {start: 0, end: 6, first: 0}),
            frameRate: 3,
            repeat: -1
        }

        this.anims.create(this.playerAnimation);

        this.player = this.playerDamageGroup.create(100, 250, 'playerAnimation').play('playerStandAnimation');
        this.player.setFrame(1);
        this.player.setScale(1.1);
        this.player.setCollideWorldBounds(true);
        this.player.body.setSize(120,45);
        this.player.body.x += 20;

    }

    createBackground() {
        this.background = this.add.tileSprite(1550, 340, 2540, 720, 'background');
        this.background.setScale(.8);

        this.sun = this.add.tileSprite(422, 238, 1200, 600, 'sun');
        this.sun.setScale(4);

        this.background = this.add.tileSprite(1250, 360, 2540, 720, 'backgroundBuildings');
        this.background.setScale(1);
        this.background.setAlpha(0.95);
        this.dunes = this.add.tileSprite(1050, 220, 2540, 720, 'dunes');
        this.dunes.setScale(1.4);
        
        this.brightness = this.add.tileSprite(1250, 360, 2540, 720, 'brightness');
        this.brightness.setAlpha(0.6);
        this.clouds = this.add.tileSprite(1250, 360, 2540, 720, 'clouds');
        this.ground = this.add.tileSprite(1500, 720, -1780,-500, 'ground').setOrigin(0,0);    
    }
    
    //Cursors
    createCursorAndKeyUpKeyDown() {
        this.cursors = this.input.keyboard.createCursorKeys();
        this.keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        this.keyDOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
    } 


    //---------------------------create only 1 horeth ball---------------------------//
    
    

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
        } }
        else if (right.isDown) {
            this.player.setVelocityX(625);            
        } 
        else if (this.keyUP.isDown) {
            console.log(this.armorCollected);
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
            console.log(this.armorCollected);
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