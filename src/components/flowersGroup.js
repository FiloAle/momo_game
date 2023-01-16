import Flower from "./flower.js";

export default class FlowersGroup {

    list;

    constructor(scene, n, coordX, coordY, distX, distY, img) {
        this.list = [];
        this.#createFlowers(scene, n, coordX, coordY, distX, distY, img);
    }

    #createFlowers(scene, n, coordX, coordY, distX, distY, img) {
        let x = coordX;
        let y = coordY;
        for(let i = 0; i < n; i++) {
            this.list.push(new Flower(scene, x, y, img));
            x += distX;
            y += distY;
        }
    }
}