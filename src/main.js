import SplashScreen from "./scenes/splash_screen.js"
import Level1 from "./scenes/level_1.js";
import Level2 from "./scenes/level_2.js";
import GameOver from "./scenes/gameover.js";
import Win from "./scenes/win.js";
import Credits from "./scenes/credits.js";
import Story from "./scenes/story.js";

// Definiamo la configurazione di lancio del gioco
const config = {
    type: Phaser.AUTO,
    width: 1280,
    height: 720,
    autoRound: true,
    backgroundColor: 0x000000, // sfondo nero
    scene: [ SplashScreen, Credits, Story, Level1, Level2, GameOver, Win ],
    pixelArt: true,
    parent: "game_area", // Specifica il div contenitore
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {
                y: 980,
            },
            debug: false
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
    lives: 3,
    necessaryFlowers: 35
}