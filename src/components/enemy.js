export default class Enemy extends Phaser.GameObjects.Sprite {
    floorHeight;
    initialX;
    scene;
    isEvil;

    constructor(scene, x, y) {
		super(scene, x, y, "enemy");
        this.scene = scene;
        this.isEvil = true;
        this.initialX = x;
        this.floorHeight = y;
        this.setOrigin(0, 1);   // Punto pivot in basso a sinistra
        this.setScale(0.5);       // Scala le dimensioni del nemico
        scene.add.existing(this);

        this.initAnimations();
    }

    initAnimations() {
        this.anims.create({
            key: "enemyStop",
            frames: this.anims.generateFrameNumbers("enemy", {
                start: 0,
                end: 0,
            }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: "enemyMove",
            frames: this.anims.generateFrameNumbers("enemy", {
                start: 0,
                end: 3,
            }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.play("enemyStop");
    }

    start() {
        this.anims.play("enemyMove");
    }

    resize() {
        this.body.setSize(100, 335);
    }

    manageMovements() {
        if(this.body.x >= parseInt(this.scene.player.body.x) - 2 && this.body.x <= parseInt(this.scene.player.body.x) + 2 || !this.isEvil) {
            this.body.setVelocityX(0);
        }
        else if(this.body.x < parseInt(this.scene.player.body.x)) {
            this.body.setVelocityX(150);
        }
        else if (this.body.x > parseInt(this.scene.player.body.x)) {
            this.body.setVelocityX(-150);
        }

        this.manageAnimations();
    }

    manageAnimations() {
        const curr_anim = this.anims.currentAnim.key;   // Otteniamo il nome dell'animazione corrente

        if (this.body.velocity.x == 0) {
            this.anims.play("enemyStop");
        } else {
            if (curr_anim != "enemyMove") {
                this.anims.play("enemyMove");
            }

            this.flipX = this.body.velocity.x < 0;
        }
    }

    cure(f) {
        this.isEvil = false;
        f.destroy();
    }
}