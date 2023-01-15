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

        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.allowGravity = false;
        this.setOrigin(0, 0);
        this.body.setImmovable(true);

        if(this.velocity != 0) {
            if(this.direction == 0) {
                this.body.setVelocity(this.velocity, 0);
            } else {
                this.body.setVelocity(0, this.velocity);
            }
        } 

        if(solid) {
            scene.physics.add.collider(this, scene.player, () => {
                scene.player.isJumping = false;
            });
        }
    }

    updateMovement() {
        this.velocity = -this.velocity;
        if(this.direction == 0) {
            this.body.setVelocity(this.velocity, 0);
        } else {
            this.body.setVelocity(0, this.velocity);
        }
    }
}