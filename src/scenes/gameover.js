import TypeWriter from "../components/typewriter.js";

export default class GameOver extends Phaser.Scene {

    constructor() {
		super("gameover");
    }

    preload() {
        this.load.image("gameover", "assets/UI/scenes/hai_perso.jpg");
        this.load.image("home", "assets/UI/HOME.png");
        this.load.image("homeLED", "assets/UI/LED_HOME.png");
        this.load.image("retry", "assets/UI/RICOMINCIA.png");
        this.load.image("retryLED", "assets/UI/LED_RICOMINCIA.png");
    }

    create() {
        this.background = this.add.image(0, 0, "gameover").setOrigin(0, 0);

        this.homeButton = this.add.image(80, this.game.config.height - 70, "home").setOrigin(0.5, 0.5).setInteractive({ useHandCursor: true }).setScale(0.4);
        this.homeLED = this.add.image(80, this.game.config.height - 68, "homeLED").setVisible(false).setScale(0.4);

        this.retryButton = this.add.image(this.game.config.width - 80, this.game.config.height - 70, "retry").setOrigin(0.5, 0.5).setInteractive({ useHandCursor: true }).setScale(0.4);
        this.retryLED = this.add.image(this.game.config.width - 80, this.game.config.height - 70, "retryLED").setVisible(false).setScale(0.4);

        if(this.game.gameState.lives > 0 && this.game.gameState.flowersCounter < 35) {
            const styleConfig = { color: '#000000', fontFamily: 'Lacrima', fontSize: 18 };
            this.gameoverMessage = this.add.text(150, this.game.config.height - 70, styleConfig).setOrigin(0, 0.5);
            this.msg = "Non hai raccolto abbastanza fiori e non sei riuscita a salvare i tuoi amici.";

            this.typewriter = new TypeWriter(this, this.gameoverMessage);
            this.typewriter.typewrite(this.msg);
        }

        this.game.gameState.lives = 3;

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

        this.retryButton.on("pointerover", () => {
            this.retryLED.setVisible(true);
        });
        this.retryButton.on("pointerout", () => {
            this.retryLED.setVisible(false);
        });
        this.retryButton.on("pointerdown", () => {
            if(this.game.gameState.level == 1) {
                this.scene.start('level_1');
                this.game.gameState.flowersCounter = 0;
            } else if (this.game.gameState.level == 2) {
                this.game.gameState.flowersCounter -= this.scene.get('level_2').localFlowersCounter;
                this.scene.start('level_2');
            } else {
                this.scene.start('splash_screen');
            }
            this.scene.stop(this);
        });
    }
}