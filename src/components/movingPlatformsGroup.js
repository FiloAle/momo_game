import Platform from "./platform.js";

export default class MovingPlatformsGroup {
    scene;
    velocity;
    direction;
    duration;
    damaging;
    list;

    constructor(scene, n, coordX, coordY, distX, distY, solid, img, direction, velocity, duration, damaging) {
        this.scene = scene;
        this.velocity = 0;
        this.solid = solid;
        this.direction = 0;
        this.duration = 0;
        this.damaging = damaging;
        this.list = [];
        this.#createMovingPlatforms(n, coordX, coordY, distX, distY, img, direction, velocity, duration, damaging);
    }
    
    #createMovingPlatforms(n, coordX, coordY, distX, distY, img, direction, velocity, duration, damaging) {
        // Aggiungi le piattaforme come un gruppo di oggetti dinamici
        this.x = coordX;
        this.y = coordY;
        this.direction = direction;
        this.velocity = velocity;
        this.duration = duration;
        
        for(let i = 0; i < n; i++)
        {
            this.list.push(new Platform(this.scene, this.x, this.y, this.solid, img, this.direction, this.velocity, damaging));
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