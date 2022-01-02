class HealthBar extends Phaser.GameObjects.Image {

    constructor(scene, x, y) {
        super(scene, x, y, 'healthBar');
        scene.add.existing(this); 

        this.totalHealth = 3;  
    }


    loseHealth() {
        
   
        HealthBar.setFrame(x - 1);

    

    }

}

export default HealthBar