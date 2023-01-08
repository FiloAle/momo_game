import Platform from "./platform.js";

export default class MovingPlatformsGroup {
    scene;
    velocity;
    direction;
    duration;
    lastDirectionChange;
    list;

    constructor(scene, n, coordX, coordY, distX, distY, img, direction, velocity, duration) {
        this.scene = scene;
        this.velocity = 0;
        this.direction = 0;
        this.duration = 0;
        this.lastDirectionChange = 0;
        this.list = [];
        this.#createMovingPlatforms(n, coordX, coordY, distX, distY, img, direction, velocity, duration);
    }
    
    #createMovingPlatforms(n, coordX, coordY, distX, distY, img, direction, velocity, duration) {
        // Aggiungi le piattaforme come un gruppo di oggetti dinamici
        this.x = coordX;
        this.y = coordY;
        this.direction = direction;
        this.velocity = velocity;
        this.duration = duration;
    
        for(let i = 0; i < n; i++)
        {
            this.list.push(new Platform(this.scene, this.x, this.y, true, img, this.direction, this.velocity));
            this.x += distX;
            this.y += distY;
        }
    }
    
    updateMovingPlatforms() {
        this.list.forEach(platform => {
            platform.updateMovement();
        });
    }
}