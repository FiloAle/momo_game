export default class Flower extends Phaser.GameObjects.Sprite {

    floorHeight;
    goingRight;
    initialX;
    stepLength;
    movementSemiLength;

    constructor(scene, x, y, img, stepLength, goingRight) {
        // Il costruttore della classe base Phaser.Scene prende come argomento la scena
		super(scene, x, y, img);
        scene.add.existing(this);
        this.img = img;
        this.initialX = x;
        this.goingRight = goingRight;
        this.stepLength = stepLength;
        this.floorHeight = y;
        this.setScale(0.6);   // Scala le dimensioni del fiore
        scene.physics.add.existing(this);
        this.body.setAllowGravity(false);
        this.body.setSize(120, 120);

        this.initAnimations();
    }

    initAnimations() {
        this.anims.create({
            key: "flowerLaunch",
            frames: this.anims.generateFrameNumbers(this.img, {
                start: 19,
                end: 37,
            }),
            frameRate: 30,
            repeat: -1
        });

        this.anims.create({
            key: "flowerFluttuating",
            frames: this.anims.generateFrameNumbers(this.img, {
                start: 50,
                end: 109,
            }),
            frameRate: 40,
            repeat: -1
        });

        this.anims.play("flowerFluttuating");
    }

    fire() {
        this.anims.play("flowerLaunch");
        if (this.goingRight) {
            this.body.setVelocityX(-500);
        } else {
            this.body.setVelocityX(500);
        }
    }
}