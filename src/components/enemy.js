export default class Enemy extends Phaser.GameObjects.Sprite {
    floorHeight;
    initialX;
    scene;
    isEvil;
    img;

    constructor(scene, x, y, img) {
		super(scene, x, y, img);
        this.lives = 2;
        this.velocity = 150;
        this.img = img;
        this.scene = scene;
        this.isEvil = true;
        this.initialX = x;
        this.floorHeight = y;
        this.setOrigin(0, 1);   // Punto pivot in basso a sinistra
        this.setScale(0.65);       // Scala le dimensioni del nemico
        scene.add.existing(this);

        this.initAnimations();
    }

    initAnimations() {
        this.anims.create({
            key: "enemyStop",
            frames: this.anims.generateFrameNumbers(this.img, {
                start: 0,
                end: 0,
            }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: "enemyMove",
            frames: this.anims.generateFrameNumbers(this.img, {
                start: 0,
                end: 19,
            }),
            frameRate: 35,
            repeat: -1
        });

        this.anims.play("enemyStop");
    }

    start() {
        this.anims.play("enemyMove");
    }

    resize() {
        this.body.setSize(100, 258);
        this.body.setGravityY(100000);
    }

    manageMovements() {
        if(this.body.x >= parseInt(this.scene.player.body.x) - 2 && this.body.x <= parseInt(this.scene.player.body.x) + 2 || !this.isEvil) {
            this.body.setVelocityX(0);
        }
        else if(this.body.x < parseInt(this.scene.player.body.x)) {
            this.body.setVelocityX(this.velocity);
        }
        else if (this.body.x > parseInt(this.scene.player.body.x)) {
            this.body.setVelocityX(-this.velocity);
        }

        this.manageAnimations();
    }

    manageAnimations() {
        if(this.velocity == 75) {
            this.anims.msPerFrame = 60;
        }

        const curr_anim = this.anims.currentAnim.key;   // Otteniamo il nome dell'animazione corrente

        if (this.body.velocity.x == 0 || this.body.touching.left || this.body.touching.right) {
            this.anims.play("enemyStop");
        } else {
            if (curr_anim != "enemyMove") {
                this.anims.play("enemyMove");
            }

            this.flipX = this.body.velocity.x < 0;
        }
    }

    cure(f) {
        if(--this.lives == 0) {
            this.isEvil = false;
        }
        this.velocity = 75;
        f.destroy();
    }
}