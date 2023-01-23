// Importiamo le scene (ne usiamo una diversa per ogni esempio)
import SplashScreen from "./scenes/splash_screen.js"
import Level1 from "./scenes/level_1.js";
import Level2 from "./scenes/level_2.js";
import TestScene2 from "./scenes/test_scene_2.js";
import TestScene1 from "./scenes/test_scene_1.js";
import GameOver from "./scenes/gameover.js";

// Definiamo la configurazione di lancio del gioco
const config = {
    type: Phaser.AUTO,
    width: 1280,
    height: 720,
    autoRound: true,
    backgroundColor: 0x000000, // sfondo nero
    scene: [ SplashScreen, Level1, Level2, TestScene2, TestScene1, GameOver ],
    pixelArt: true,
    parent: "game_area", // Specifica il div contenitore
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {
                y: 980,
            },
            debug: true
        }
    },
    render: {
        roundPixels: true,
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
