export default class Credits extends Phaser.Scene {

    constructor() {
        super('credits');
    }

    init() {

    }

    preload() {
        this.load.image("credits", "assets/UI/scenes/crediti.jpg");
        this.load.image("home", "assets/UI/HOME.png");
        this.load.image("homeLED", "assets/UI/LED_HOME.png");
    }

    create() {
        this.creditsImage = this.add.image(0, 0, "credits").setOrigin(0, 0);
        this.homeButton = this.add.image(80, this.game.config.height - 70, "home").setOrigin(0.5, 0.5).setInteractive({ useHandCursor: true }).setScale(0.4);
        this.homeLED = this.add.image(80, this.game.config.height - 68, "homeLED").setVisible(false).setScale(0.4);

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
}