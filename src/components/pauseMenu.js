export default class PauseMenu extends Phaser.Scene {

    originScene;

    constructor(scene) {
        super("pause_menu");
        this.originScene = scene;
    }

    init() {
        
    }

    preload() {
        this.load.image("pauseBG", "assets/UI/pausa.png");
        this.load.image("home", "assets/UI/HOME.png")
        this.load.image("resume", "assets/UI/RIPRENDI.png");
        this.load.image("restart", "assets/UI/RICOMINCIA.png");
        this.load.image("homeLED", "assets/UI/LED_HOME.png")
        this.load.image("resumeLED", "assets/UI/LED_RIPRENDI.png");
        this.load.image("restartLED", "assets/UI/LED_RICOMINCIA.png");
    }

    create() {
        // Posizioniamo gli elementi nella scena
        this.background = this.add.image(0, 0, "pauseBG");
        this.background.setOrigin(0,0);

        //creo una immagine per il bottone
        this.homeButton = this.add.image(this.game.config.width / 2, this.game.config.height / 2 - 100, "home");
        this.homeButton.setOrigin(0.5, 0.5);
        this.homeButton.setInteractive({ useHandCursor: true }); //imposta l'immagine in modo che possa essere cliccata

        this.homeLED = this.add.image(this.game.config.width / 2, this.game.config.height / 2 - 100, "homeLED").setVisible(false);
        this.homeLED.setOrigin(0.5, 0.5);


        this.resumeButton = this.add.image(this.game.config.width / 2, this.game.config.height / 2, "resume");
        this.resumeButton.setOrigin(0.5, 0.5);
        this.resumeButton.setInteractive({ useHandCursor: true }); //imposta l'immagine in modo che possa essere cliccata

        this.resumeLED = this.add.image(this.game.config.width / 2, this.game.config.height / 2, "resumeLED").setVisible(false);
        this.resumeLED.setOrigin(0.5, 0.5);


        this.restartButton = this.add.image(this.game.config.width / 2, this.game.config.height / 2 + 100, "restart");
        this.restartButton.setOrigin(0.5, 0.5);
        this.restartButton.setInteractive({ useHandCursor: true }); //imposta l'immagine in modo che possa essere cliccata

        this.restartLED = this.add.image(this.game.config.width / 2, this.game.config.height / 2 + 100, "restartLED").setVisible(false);
        this.restartLED.setOrigin(0.5, 0.5);



        //creo una immagine per il bottone

        this.homeButton.on("pointerover", () => { 
            this.homeLED.setVisible(true);
        });
        this.homeButton.on("pointerout", () => { 
            this.homeLED.setVisible(false);
        });

        this.resumeButton.on("pointerover", () => {
            this.resumeLED.setVisible(true);
        });
        this.resumeButton.on("pointerout", () => { 
            this.resumeLED.setVisible(false);
        });

        this.restartButton.on("pointerover", () => {
            this.restartLED.setVisible(true);
        });
        this.restartButton.on("pointerout", () => { 
            this.restartLED.setVisible(false);
        });


        this.homeButton.on("pointerdown", () => { 
            this.scene.stop(this.originScene);
            this.scene.start("splash_screen");
            this.scene.remove(this);
        });

        this.resumeButton.on("pointerdown", () => { 
            this.scene.resume(this.originScene);
            this.scene.remove(this);
        });

        this.restartButton.on("pointerdown", () => { 
            this.scene.stop(this.originScene);
            this.scene.start(this.originScene);
            this.scene.remove(this);
        });
    }

    update() {

    }

}