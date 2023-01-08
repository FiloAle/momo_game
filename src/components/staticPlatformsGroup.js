import Platform from "./platform.js";

export default class StaticPlatformsGroup {
    scene;
    list;

    constructor(n, coordX, coordY, distX, distY, solid, img, scene) {
        this.scene = scene;
        this.list = [];
        this.#createStaticPlatforms(n, coordX, coordY, distX, distY, solid, img);
    }
    
    #createStaticPlatforms(n, coordX, coordY, distX, distY, solid, img) {
        // Aggiungi le piattaforme come un gruppo di oggetti statici
        let x = coordX;
        let y = coordY;
        for(let i = 0; i < n; i++) {
            this.list.push(new Platform(this.scene, x, y, solid, img));
            x += distX;
            y += distY;
        }
    }
}