export default class GameOver extends Phaser.Scene {

    constructor(){
        // Il costruttore della classe base Phaser.Scene prende come argomento il nome della scena
		super("gameover");
    }

    preload() {
        this.load.image("gameover", "assets/UI/hai_perso.jpg");
        this.load.image("home", "assets/UI/HOME.png");
        this.load.image("homeLED", "assets/UI/LED_HOME.png");
    }

    create() {
        this.game.gameState.lives = 3;
        this.game.gameState.flowersCounter = 0;
        this.game.gameState.level = 1;

        const styleConfig = { color: '#FFFFFF', fontSize: 36 };

        this.background = this.add.image(0, 0, "gameover").setOrigin(0, 0);

        this.homeButton = this.add.image(100, this.game.config.height - 85, "home").setOrigin(0.5, 0.5).setInteractive({ useHandCursor: true }).setScale(0.7);
        this.homeLED = this.add.image(100, this.game.config.height - 83, "homeLED").setVisible(false).setScale(0.7);

        this.homeButton.on("pointerover", () => {
            this.homeLED.setVisible(true);
        });

        this.homeButton.on("pointerout", () => {
            this.homeLED.setVisible(false);
        });

        this.homeButton.on("pointerdown", () => {
            this.scene.start('splash_screen');
            this.scene.stop(this);
        });
    }

};
