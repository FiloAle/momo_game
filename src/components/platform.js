export default class Platform extends Phaser.GameObjects.Sprite {
    x;
    y;
    img;
    velocity;
    direction;
    width;

    constructor(scene, x, y, solid, img, direction, velocity) {
        super(scene, x, y, img);
        this.solid = solid;
        this.x = x;
        this.y = y;
        this.img = img;
        this.direction = direction;
        this.velocity = velocity;
        this.width = scene.textures.get(img).getSourceImage().width;

        this.platform = this.scene.physics.add.image(x, y, img);
        this.platform.body.allowGravity = false;
        this.platform.setOrigin(0, 0);
        this.platform.setImmovable(true);

        if(this.velocity != 0) {
            if(this.direction == 0) {
                this.platform.body.setVelocity(this.velocity, 0);
            } else {
                this.platform.body.setVelocity(0, this.velocity);
            }
        } 

        if(solid) {
            this.scene.physics.add.collider(this.platform, this.scene.player, () => {
                this.scene.player.isJumping = false;
            });
        }
    }

    updateMovement() {
        if(this.velocity != 0) {
            this.velocity = -this.velocity;
            if(this.direction == 0) {
                this.platform.body.setVelocity(this.velocity, 0);
            } else {
                this.platform.body.setVelocity(0, this.velocity);
            }
        }
    }
}