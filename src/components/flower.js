export default class Flower extends Phaser.GameObjects.Sprite {

    floorHeight;
    goingRight;
    initialX;
    stepLength;
    movementSemiLength;

    constructor(scene, x, y, stepLength, goingRight) {
        // Il costruttore della classe base Phaser.Scene prende come argomento la scena
		super(scene, x, y, "flower");
        scene.add.existing(this);
        this.initialX = x;
        this.goingRight = goingRight;
        this.stepLength = stepLength;
        this.floorHeight = y;
        this.setScale(1);   // Scala le dimensioni del fiore
        scene.physics.add.existing(this);
        this.body.setAllowGravity(false);
        this.body.setSize(50, 50);
    }

    fire() {
        if (this.goingRight) {
            this.body.setVelocityX(-500);
        } else {
            this.body.setVelocityX(500);
        }
    }
}