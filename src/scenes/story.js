export default class Story extends Phaser.Scene {

    constructor() {
        super('story');
    }

    init() {

    }

    preload() {
        this.load.image("credits", "assets/UI/crediti.jpg");
        this.load.image("home", "assets/UI/HOME.png");
        this.load.image("homeLED", "assets/UI/LED_HOME.png");
    }

    create() {
        this.creditsImage = this.add.image(0, 0, "credits").setOrigin(0, 0);
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
}