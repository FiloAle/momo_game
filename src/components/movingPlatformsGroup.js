export default class MovingPlatformsGroup {
    scene;
    velocity;
    direction;
    duration;
    lastDirectionChange;

    constructor(scene) {
        this.scene = scene;
        this.velocity = 0;
        this.direction = 0;
        this.duration = 0;
        this.lastDirectionChange = 0;
    }
    
    createMovingPlatforms(n, coordX, coordY, distX, distY, img, direction, velocity, duration) {
        // Aggiungi le piattaforme come un gruppo di oggetti dinamici
        this.x = coordX;
        this.y = coordY;
        this.direction = direction;
        this.velocity = velocity;
        this.duration = duration;
        this.scene.movingPlatforms = this.scene.physics.add.group();
    
        for(let i = 0; i < n; i++)
        {
            this.scene.movingPlatforms.create(this.x, this.y, img);
            this.x += distX;
            this.y += distY;
        }

        if(direction == 0)
        {
            this.scene.movingPlatforms.children.iterate( function (platform) {
                platform.setImmovable(true);
                platform.body.allowGravity = false;
                platform.body.setVelocityX(velocity);
            });
        }
        else {
            this.scene.movingPlatforms.children.iterate( function (platform) {
                platform.setImmovable(true);
                platform.body.allowGravity = false;
                platform.body.setVelocityY(velocity);
            });
        }

        this.scene.physics.add.collider(this.scene.movingPlatforms, this.scene.player, () => {
            this.scene.player.isJumping = false;
        });
    }
    
    updateMovingPlatforms() {
        this.velocity = - this.velocity;

        this.scene.movingPlatforms.children.iterate((platform) => {
            if(this.direction == 0)
            {
                platform.body.setVelocityX(this.velocity);
            }
            else
            {
                platform.body.setVelocityY(this.velocity);
            }
        });
    }
}