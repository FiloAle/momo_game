// Importiamo le scene (ne usiamo una diversa per ogni esempio)
import SceneWelcomeMenu from "./scenes/0_welcome_mouse.js"
import Physics_v1 from "./scenes/7_physics_v1.js";
import Physics_v2 from "./scenes/7_physics_v2.js";
import Physics_v3 from "./scenes/7_physics_v3.js";
import Physics_v4 from "./scenes/7_physics_v4.js";
import Physics_v5 from "./scenes/7_physics_v5.js";
import SceneGameOver from "./scenes/G_gameover.js";

// Definiamo la configurazione di lancio del gioco
const config = {
    type: Phaser.AUTO,
    width: 1280,
    height: 720,
    backgroundColor: 0x000000, // sfondo nero
    scene: [ SceneWelcomeMenu, Physics_v1, Physics_v2, Physics_v3, Physics_v4, Physics_v5, SceneGameOver ],
    pixelArt: true,
    parent: "game_area", // Specifica il div contenitore
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {
                y: 900,
            },
            debug: true
        }
    }
};



//creiamo il gioco a partire dalla configurazione iniziale
let game = new Phaser.Game(config);

game.gameState = {
    playTime: 30,
    score: 0,
    lives: 3
}

// Carichiamo la scena corrispondente all'esercizio scelto
// (se non eseguiamo questa istruzione viene creata una
// scena a partire dalla prima specificata nell'array "scene"
// della configurazione di gioco)
//game.scene.start("scene_platforms");
