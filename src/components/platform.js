export default class Platform extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, solid, img) {
        super(scene, x, y, img);
        this.solid = solid;
        this.platform = this.scene.physics.add.image(x, y, img);
        this.platform.body.allowGravity = false;
        this.platform.setImmovable(true);

        if(solid) {
            this.scene.physics.add.collider(this.platform, this.scene.player, () => {
                this.scene.player.isJumping = false;
            });
        }
    }
}