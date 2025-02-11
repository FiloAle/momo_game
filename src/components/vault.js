export default class Vault extends Phaser.GameObjects.Sprite {

    hasBeenOpened;

    constructor(scene, x, y) {
		super(scene, x, y, "vault");
        this.lives = 2;
        this.img = "vault";
        this.scene = scene;
        this.initialX = x;
        this.y = y;
        this.setOrigin(1, 1);   // Punto pivot in basso a destra
        scene.add.existing(this);
        this.hasBeenOpened = false;

        this.initAnimations();
    }

    initAnimations() {
        this.anims.create({
            key: "closedVault",
            frames: this.anims.generateFrameNumbers(this.img, {
                start: 0,
                end: 0,
            }),
            frameRate: 1,
            repeat: -1
        });

        this.anims.create({
            key: "openingVault",
            frames: this.anims.generateFrameNumbers(this.img, {
                start: 1,
                end: 79,
            }),
            frameRate: 35,
            repeat: 0
        });

        this.anims.play("closedVault");
    }

    openVault() {
        this.anims.play("openingVault");
        this.hasBeenOpened = true;
    }
}