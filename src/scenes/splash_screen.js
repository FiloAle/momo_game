export default class SplashScreen extends Phaser.Scene {

    background;        // oggetto relativo all'elemento "sfondo"

    constructor() {
        // Il costruttore della classe base Phaser.Scene prende come argomento il nome della scena
		super("splash_screen");
    }

    init() {
        console.log("splash_screen - Executing init()");
    }

    preload() {
        console.log("splash_screen - Executing preload()");
        // Carichiamo gli asset grafici
        this.load.image("background_splash_screen", "assets/images/background/splash_screen.jpg"); // carica l'immagine di sfondo

        // Carichiamo l'immagine del giocatore in formato spritesheet (ci servirà nelle prossime scene)
        const player_spritesheet_config = {
            frameWidth:  252,
            frameHeight: 288,
        };
        this.load.spritesheet("playerrun", "assets/images/characters/momo.png", player_spritesheet_config);

        const enemy_spritesheet_config = {
            frameWidth:  280,
            frameHeight: 335,
        };
        this.load.spritesheet("enemy", "assets/images/characters/enemy.png", enemy_spritesheet_config);

        const grigi_spritesheet_config = {
            frameWidth:  280,
            frameHeight: 258,
        };
        this.load.spritesheet("grigi", "assets/images/characters/grigi.png", grigi_spritesheet_config);

        const flower_spritesheet_config = {
            frameWidth:  150,
            frameHeight: 150,
        }
        this.load.spritesheet("animated_flower", "assets/images/weapons/animated_flower.png", flower_spritesheet_config);

        // Carichiamo gli asset grafici
        //this.load.image("pauseButton", "assets/UI/pause_button.png"); //caricamento bottone menu di pausa
        //this.load.image("menuBkg", "assets/UI/menu_block.png"); //caricamento pannello del menu di pausa
        this.load.image("playButton", "assets/UI/play_button.png");
        this.load.image("storyButton", "assets/UI/story_button.png");
        this.load.image("creditsButton", "assets/UI/credits_button.png");
        this.load.image("flower", "assets/images/weapons/flower.png");
    }

    create() {
        console.log("splash_screen - Executing create()");

        // Posizioniamo gli elementi nella scena
        this.background = this.add.image(0, 0, "background_splash_screen");
        this.background.setOrigin(0,0);

        //creo una immagine per il bottone
        this.playButton = this.add.image(128, this.game.config.height / 2 + 256, "playButton");
        this.playButton.setOrigin(0.5, 0.5);
        this.playButton.setInteractive(); //imposta l'immagine in modo che possa essere cliccata

        this.storyButton = this.add.image(320, this.game.config.height / 2 + 256, "storyButton");
        this.storyButton.setOrigin(0.5, 0.5);
        this.storyButton.setInteractive(); //imposta l'immagine in modo che possa essere cliccata

        this.creditsButton = this.add.image(512, this.game.config.height / 2 + 256, "creditsButton");
        this.creditsButton.setOrigin(0.5, 0.5);
        this.creditsButton.setInteractive(); //imposta l'immagine in modo che possa essere cliccata

        this.playButton.on("pointerdown", () => { //quando viene clickato il bottone succedono cose
            this.scene.start("level_1");
        });
    }

    update() {
    }
};
