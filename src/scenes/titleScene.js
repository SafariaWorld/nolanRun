class TitleScene extends Phaser.Scene {

	constructor() {
		super({key:'titleScene'});
	}

	preload() {
		this.load.image('background', 'assets/newBackground.jpg');
	}

	create() {
        const { width, height } = this.sys.game.canvas;
        const bg = this.add.sprite(0,0,'background');

        bg.setOrigin(0,0);
        const text = this.add.text(width / 2, height / 2, 'START BUTTON IMAGE',
         { fill: '#000000', fontSize: '40px'})
            .setInteractive({ useHandCursor: true })
            .setOrigin(.5, 0);

        text.on('pointerdown', this.loadGame, this)
	}

    loadGame() {
        this.scene.switch('PlayScene');
    }
}

export default TitleScene;