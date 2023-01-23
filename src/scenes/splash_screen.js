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
        this.load.image("background_splash_screen", "assets/images/background/HOME.jpg"); // carica l'immagine di sfondo

        // Carichiamo l'immagine del giocatore in formato spritesheet (ci servirà nelle prossime scene)
        const player_spritesheet_config = {
            frameWidth:  252,
            frameHeight: 288,
        };
        this.load.spritesheet("playerrun", "assets/images/characters/momo.png", player_spritesheet_config);

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
        this.load.image("playButton", "assets/UI/GIOCA.png");
        this.load.image("storyButton", "assets/UI/STORIA.png");
        this.load.image("creditsButton", "assets/UI/CREDITI.png");
        this.load.image("playLED", "assets/UI/LED_GIOCA.png");
        this.load.image("storyLED", "assets/UI/LED_STORIA.png");
        this.load.image("creditsLED", "assets/UI/LED_CREDITI.png");
        this.load.image("flower", "assets/images/weapons/flower.png");
    }

    create() {
        console.log("splash_screen - Executing create()");

        // Posizioniamo gli elementi nella scena
        this.background = this.add.image(0, 0, "background_splash_screen");
        this.background.setOrigin(0,0);



        //creo una immagine per il bottone
        this.playButton = this.add.image(160, this.game.config.height / 2 + 100, "playButton");
        this.playButton.setOrigin(0.5, 0.5);
        this.playButton.setInteractive({ useHandCursor: true }); //imposta l'immagine in modo che possa essere cliccata

        this.storyButton = this.add.image(360, this.game.config.height / 2 + 100, "storyButton");
        this.storyButton.setOrigin(0.5, 0.5);
        this.storyButton.setInteractive({ useHandCursor: true }); //imposta l'immagine in modo che possa essere cliccata

        this.creditsButton = this.add.image(560, this.game.config.height / 2 + 100, "creditsButton");
        this.creditsButton.setOrigin(0.5, 0.5);
        this.creditsButton.setInteractive({ useHandCursor: true }); //imposta l'immagine in modo che possa essere cliccata



        //creo una immagine per il bottone


        this.playButton.on("pointerover", () => { //quando viene clickato il bottone succedono cose
            this.playLED = this.add.image(160, this.game.config.height / 2 + 100, "playLED");
            this.playButton.setOrigin(0.5, 0.5);
        });
        this.playButton.on("pointerout", () => { //quando viene clickato il bottone succedono cose
            this.playLED.destroy(true);
        });

        this.storyButton.on("pointerover", () => {
            this.storyLED = this.add.image(360, this.game.config.height / 2 + 100, "storyLED");
            this.storyButton.setOrigin(0.5, 0.5);
        });
        this.storyButton.on("pointerout", () => { //quando viene clickato il bottone succedono cose
            this.storyLED.destroy(true);
        });

        this.creditsButton.on("pointerover", () => {
            this.creditsLED = this.add.image(560, this.game.config.height / 2 + 100, "creditsLED");
            this.creditsLED.setOrigin(0.5, 0.5);
        });
        this.creditsButton.on("pointerout", () => { //quando viene clickato il bottone succedono cose
            this.creditsLED.destroy(true);
        });


        this.playButton.on("pointerdown", () => { //quando viene clickato il bottone succedono cose
            this.scene.start("level_2");
        });
    }

    update() {
    }
};
