export default class MovingPlatformsGroup {
    _scene;
    _velocity;
    _direction;
    _duration;
    _lastDirectionChange;

    constructor(scene) {
        this._scene = scene;
        this._velocity = 0;
        this._direction = 0;
        this._duration = 0;
        this._lastDirectionChange = 0;
    }
    
    createMovingPlatforms(n, coordX, coordY, distX, distY, img, direction, velocity, duration) {
        // Aggiungi le piattaforme come un gruppo di oggetti dinamici
        this.x = coordX;
        this.y = coordY;
        this._direction = direction;
        this._velocity = velocity;
        this._duration = duration;
        this._scene.movingPlatforms = this._scene.physics.add.group();
    
        for(let i = 0; i < n; i++)
        {
            this._scene.movingPlatforms.create(this.x, this.y, img);
            this.x += distX;
            this.y += distY;
        }

        if(direction == 0)
        {
            this._scene.movingPlatforms.children.iterate( function (platform) {
                platform.setImmovable(true);
                platform.body.allowGravity = false;
                platform.body.setVelocityX(velocity);
            });
        }
        else {
            this._scene.movingPlatforms.children.iterate( function (platform) {
                platform.setImmovable(true);
                platform.body.allowGravity = false;
                platform.body.setVelocityY(velocity);
            });
        }

        this._scene.physics.add.collider(this._scene.movingPlatforms, this._scene.player, () => {
            this._scene.player.isJumping = false;
        });
    }
    
    updateMovingPlatforms() {
        this._velocity = -this._velocity;
        console.log(this._velocity);

        this._scene.movingPlatforms.children.iterate((platform) => {
            if(this._direction == 0)
            {
                platform.body.setVelocityX(this._velocity);
            }
            else
            {
                platform.body.setVelocityY(this._velocity);
            }
        });
    }
}