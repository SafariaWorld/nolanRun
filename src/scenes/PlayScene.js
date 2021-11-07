import Phaser from "Phaser";

class PlayScene extends Phaser.Scene {

    constructor() {
        super('PlayScene');
        
        this.bird = null;
        this.birdMove = null;
        this.upperPipe = null;
        this.lowerPipe = null;
        this.pipes = null;
    }

    

    preload() {
        this.load.image('sky', 'assets/sky.png');
        this.load.image('bird', 'assets/bird.png');
        this.load.image('pipe', 'assets/pipe.png');
    }

    create() {

    this.add.image(400, 300, 'sky');
    this.bird = this.physics.add.sprite(100, 250, 'bird');

    let topMax = 100;
    let topMin = -100;

    let pipeHorizontalDistance = 500;
    let topPipeVerticalDistance = Math.floor(Math.random() * (topMax - topMin + 1) + topMin);;
    let bottomPipeVerticalDistance = null;

    this.pipes = this.physics.add.group();

    for (let i = 0; i < 9; i++) {
        bottomPipeVerticalDistance = this.calculatePipeSeperation(topPipeVerticalDistance);
        this.upperPipe = this.pipes.create(pipeHorizontalDistance, topPipeVerticalDistance, 'pipe').setImmovable(true);
        this.lowerPipe = this.pipes.create(pipeHorizontalDistance, bottomPipeVerticalDistance, 'pipe').setImmovable(true);
        
        
        this.addPipe(this.upperPipe, this.lowerPipe);

        pipeHorizontalDistance += 350;
    }

    this.pipes.setVelocityX(-200);
    this.physics.add.collider(this.pipes)

    this.input.on('pointerdown', this.flap, this);
    this.input.keyboard.on('keydown_SPACE', this.flap, this);

    }

    update() {
        this.bird.body.velocity.x = this.birdMove;
    }

    calculatePipeSeperation(topPipeVerticalDistance) {
        let max = 700;
        let minimum = 600; 
        
        let distance = Math.floor(Math.random() * (max - minimum + 1) + minimum);
        console.log(distance);
      
        return topPipeVerticalDistance + distance;
      }
      
    flap() {
        this.bird.body.velocity.y = -230; 
      }
      
    addPipe(upperP, lowerP) {
        upperP.body.setAllowGravity(false);
        // upperP.body.velocity.x = -150;
      
        lowerP.body.setAllowGravity(false);
        // lowerP.body.velocity.x = -150;
      }
      
    turnRight() {
        birdMove = 25
      }
      
    turnLeft() {
        birdMove = -25
      }
      
      
      

}

export default PlayScene;