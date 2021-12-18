import WebFontFile from '../WebFontFile';
import Phaser from "phaser";

class PreloadScene extends Phaser.Scene {

	constructor() {
		super({key : 'preloadScene'});
	}

  preload() {

    const { width, height} = this.sys.game.canvas;
		this.graphics = this.add.graphics();
		this.newGraphics = this.add.graphics();
		var progressBar = new Phaser.Geom.Rectangle(width / 4, height / 2, width / 2, 50);
		var progressBarFill = new Phaser.Geom.Rectangle(width / 4 + 5, height / 2 + 5, width / 2 - 10, 40);

		this.graphics.fillStyle(0xffffff, 1);
		this.graphics.fillRectShape(progressBar);

		this.newGraphics.fillStyle(0x3587e2, 1);
		this.newGraphics.fillRectShape(progressBarFill);

		var loadingText = this.add.text(width / 2 , height / 2 + 80,"Loading: ", { fontSize: '32px', fill: '#FFF' }).setOrigin(0.5);

    //ALL LOADS BETWEEN COMMENTS
    this.load.audio('theme', 'assets/audio/mainMusic.wav');

        this.load.image('newTestBackground', 'assets/testBackgroundv3.png');
        this.load.image('topUI', 'assets/topUI.png');
        this.load.image('background', 'assets/testBackground.png');
        this.load.image('backgroundBuildings', 'assets/backgroundBuildings.png');
        this.load.image('foreground', 'assets/foreground.png');
        this.load.image('clouds', 'assets/clouds.png');
        this.load.image('dunes', 'assets/dunes.png');
        this.load.image('brightness', 'assets/brightness.png');
        this.load.image('sun', 'assets/sun.png');
        this.load.spritesheet('playerSpriteSheet', 'assets/nolanSpriteFull400Percent.png', { frameWidth: 480, frameHeight: 320 });
        this.load.spritesheet('nolanRunRightSpriteSheet', 'assets/nolanSpriteFull400Percent.png', { frameWidth: 480, frameHeight: 320});
        this.load.audio('orbSound', 'assets/audio/spell.mp3');
        this.load.audio('goldCollectSound', 'assets/audio/coinNew.wav');
        this.load.image('ground', 'assets/exampleGround1.png');

        

        const fonts = new WebFontFile(this.load, 'Abel');
		    this.load.addFile(fonts);
    //ALL LOADS BETWEEN COMMENTS


    this.load.on('progress', this.updateBar, {newGraphics:this.newGraphics,loadingText:loadingText, width: width, height: height});
    this.load.on('complete', this.complete, {scene:this.scene});
	}

  updateBar(percentage) {
    this.newGraphics.clear();
    this.newGraphics.fillStyle(0x3587e2, 1);
    this.newGraphics.fillRectShape(new Phaser.Geom.Rectangle(this.width / 4 + 5, this.height / 2 + 5, percentage* (this.width / 2 - 10), 40));
        
    percentage = percentage * 100;
    this.loadingText.setText("Loading: " + percentage.toFixed(2) + "%");
  }

	complete() {
    //Change to first scene
    this.scene.start("titleScene");
	}

  printWords() {
    console.log('printWords');
  }

}

export default PreloadScene;