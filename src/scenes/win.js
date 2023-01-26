import TypeWriter from "../components/typewriter.js";

export default class Win extends Phaser.Scene {

    constructor() {
		super("win");
    }

    preload() {
        this.load.image("win", "assets/UI/scenes/hai_vinto.jpg");
        this.load.image("home", "assets/UI/HOME.png");
        this.load.image("homeLED", "assets/UI/LED_HOME.png");
        this.load.image("shadow", "assets/UI/scenes/shadow.png");
    }

    create() {
        this.game.gameState.lives = 3;

        this.background = this.add.image(0, 0, "win").setOrigin(0, 0);
        this.shadow = this.add.image(0, 0, "shadow").setOrigin(0, 0).setAlpha(0.5);
        const styleConfig = { color: '#000000', fontFamily: 'Lacrima', fontSize: 18 };
        this.winMessage = this.add.text(150, this.game.config.height - 70, styleConfig).setOrigin(0, 0.5);
        this.msg = "Gli amici di Momo sono liberi e le persone possono avere finalmente\nun lavoro dignitoso ed una vita felice.";

        this.typewriter = new TypeWriter(this, this.winMessage);
        this.typewriter.typewrite(this.msg);

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