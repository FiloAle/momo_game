export default class Obstacles {
    _scene;

    constructor(scene) {
        this._scene = scene;
    }
    
    createStaticPlatforms(coordX, coordY, distX, distY, img, n) {
        // Aggiungi le piattaforme come un gruppo di oggetti statici
        this._scene.platforms = this._scene.physics.add.staticGroup({
            key: img,
            repeat: n,
            setXY: { x: coordX, y: coordY, stepX: distX, stepY: distY}
        });

        // Rendi le piattaforme "solide". Se il giocatore è su una piattaforma
        // allora il suo stato è "non sta saltando" (questo per riprodurre l'animazione
        // del giocatore fermo).
        this._scene.physics.add.collider(this._scene.platforms, this._scene.player, () => {
            this._scene.player.isJumping = false;
        });
    }
}