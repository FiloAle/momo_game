import Platform from "./platform.js";

export default class StaticPlatformsGroup {
    scene;
    list;
    solid;
    damaging;

    constructor(scene, n, coordX, coordY, distX, distY, solid, img, damaging) {
        this.scene = scene;
        this.solid = solid;
        this.damaging = damaging;
        this.list = [];
        this.#createStaticPlatforms(n, coordX, coordY, distX, distY, solid, img, damaging);
    }
    
    #createStaticPlatforms(n, coordX, coordY, distX, distY, solid, img, damaging) {
        // Aggiungi le piattaforme come un gruppo di oggetti statici
        let x = coordX;
        let y = coordY;
        for(let i = 0; i < n; i++) {
            this.list.push(new Platform(this.scene, x, y, solid, img, 0, 0, damaging));
            x += distX;
            y += distY;
        }
    }
}