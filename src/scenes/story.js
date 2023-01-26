import TypeWriter from "../components/typewriter.js";

export default class Story extends Phaser.Scene {

    constructor() {
        super('story');
    }

    init() {
        this.currentImage = 1;
    }

    preload() {
        this.load.image("credits", "assets/UI/scenes/crediti.jpg");
        this.load.image("home", "assets/UI/HOME.png");
        this.load.image("homeLED", "assets/UI/LED_HOME.png");
        this.load.image("arrow",  "assets/UI/ARROW.png");
        this.load.image("arrowLED",  "assets/UI/LED_ARROW.png");
        this.load.image("shadow", "assets/UI/scenes/shadow.png");

        this.load.image("scene_1", "assets/UI/scenes/scene_1.jpg");
        this.load.image("scene_2", "assets/UI/scenes/scene_2.jpg");
        this.load.image("scene_3", "assets/UI/scenes/scene_3.jpg");
        this.load.image("scene_4", "assets/UI/scenes/scene_4.jpg");
        this.load.image("scene_5", "assets/UI/scenes/scene_5.jpg");
        this.load.image("scene_6", "assets/UI/scenes/scene_6.jpg");
    }

    create() {
        this.scene1Image = this.add.image(0, 0, "scene_1").setOrigin(0, 0).setVisible(true);
        this.scene2Image = this.add.image(0, 0, "scene_2").setOrigin(0, 0).setVisible(false);
        this.scene3Image = this.add.image(0, 0, "scene_3").setOrigin(0, 0).setVisible(false);
        this.scene4Image = this.add.image(0, 0, "scene_4").setOrigin(0, 0).setVisible(false);
        this.scene5Image = this.add.image(0, 0, "scene_5").setOrigin(0, 0).setVisible(false);
        this.scene6Image = this.add.image(0, 0, "scene_6").setOrigin(0, 0).setVisible(false);
        this.shadow = this.add.image(0, 0, "shadow").setOrigin(0, 0).setAlpha(0.8).setVisible(true);

        const styleConfig = { color: '#000000', fontFamily: 'Lacrima', fontSize: 18 };
        this.storyText = this.add.text(150, this.game.config.height - 70, styleConfig).setOrigin(0, 0.5);

        this.scene1Text = "In un paese non molto lontano, abita una bambina di nome Momo.\nTra le piccole vie del suo paesino si respirano tranquillità e benessere. Le persone sono felici\ne i bambini giocano spensierati: non si potrebbe sperare di vivere in un posto migliore.";
        this.scene2Text = "Un giorno, all’improvviso, arrivano i Signori Grigi: degli uomini orribili che convincono\nil popolo a lavorare fino allo sfinimento in modo da risparmiare il proprio tempo e conservarlo\nnella Banca del Tempo. Le persone diventano esauste e infelici, sempre al lavoro: anche riposare\nper loro diventa difficile e il paese di Momo viene avvolto da un’atmosfera grigia e triste."
        this.scene3Text = "Presto, però, Momo scopre che i sigari che i Signori Grigi fumano, e senza i quali non possono\nsopravvivere, sono fatti di Orefiori: petali di tempo, il tempo che le persone\nstanno risparmiando! ";
        this.scene4Text = "Momo, con l’aiuto di Cassiopea, una tartaruga magica, dovrà dirigersi verso il Grande Albero.\nSolo così la bambina potrà cogliere un Orafiore e fermare il tempo per tutti.";
        this.scene5Text = "Il fiore darà a Momo il tempo necessario per raggiungere la banca e liberare gli Orafiori\ndelle persone senza essere fermata dai Signori Grigi.";
        
        this.typewriter = new TypeWriter(this, this.storyText);
        this.typewriter.typewrite(this.scene1Text);

        this.homeButton = this.add.image(80, this.game.config.height - 70, "home").setOrigin(0.5, 0.5).setInteractive({ useHandCursor: true }).setScale(0.4);
        this.homeLED = this.add.image(80, this.game.config.height - 68, "homeLED").setVisible(false).setScale(0.4);

        this.leftArrow = this.add.image(this.game.config.width - 130, this.game.config.height - 70, "arrow").setOrigin(0.5, 0.5).setInteractive({ useHandCursor: true }).setScale(0.4).setVisible(false);
        this.leftArrowLED = this.add.image(this.game.config.width - 130, this.game.config.height - 70, "arrowLED").setOrigin(0.5, 0.5).setVisible(false).setScale(0.4);
        this.leftArrow.flipX = true;
        this.leftArrowLED.flipX = true;

        this.rightArrow = this.add.image(this.game.config.width - 80, this.game.config.height - 70, "arrow").setOrigin(0.5, 0.5).setInteractive({ useHandCursor: true }).setScale(0.4);
        this.rightArrowLED = this.add.image(this.game.config.width - 80, this.game.config.height - 70, "arrowLED").setOrigin(0.5, 0.5).setVisible(false).setScale(0.4);
        

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

        this.leftArrow.on("pointerover", () => {
            this.leftArrowLED.setVisible(true);
        });
        this.leftArrow.on("pointerout", () => {
            this.leftArrowLED.setVisible(false);
        });
        this.leftArrow.on("pointerdown", () => {
            switch(this.currentImage) {
                case 1:
                    break;
                case 2:
                    this.currentImage = 1;
                    this.leftArrow.setVisible(false);
                    this.scene1Image.setVisible(true);
                    this.scene2Image.setVisible(false);
                    this.typewriter.typewrite(this.scene1Text);
                    break;
                case 3:
                    this.currentImage = 2;
                    this.scene2Image.setVisible(true);
                    this.scene3Image.setVisible(false);
                    this.typewriter.typewrite(this.scene2Text);
                    break;
                case 4:
                    this.currentImage = 3;
                    this.scene3Image.setVisible(true);
                    this.scene4Image.setVisible(false);
                    this.typewriter.typewrite(this.scene3Text);
                    break;
                case 5:
                    this.currentImage = 4;
                    this.scene4Image.setVisible(true);
                    this.scene5Image.setVisible(false);
                    this.typewriter.typewrite(this.scene4Text);
                    break;
                case 6:
                    this.currentImage = 5;
                    this.rightArrow.setVisible(true);
                    this.scene5Image.setVisible(true);
                    this.scene6Image.setVisible(false);
                    this.typewriter.typewrite(this.scene5Text);
                    break;
                default:
                    break;
            }
        });

        this.rightArrow.on("pointerover", () => {
            this.rightArrowLED.setVisible(true);
        });
        this.rightArrow.on("pointerout", () => {
            this.rightArrowLED.setVisible(false);
        });
        this.rightArrow.on("pointerdown", () => {
            switch(this.currentImage) {
                case 1:
                    this.currentImage = 2;
                    this.leftArrow.setVisible(true);
                    this.scene2Image.setVisible(true);
                    this.scene1Image.setVisible(false);
                    this.typewriter.typewrite(this.scene2Text);
                    break;
                case 2:
                    this.currentImage = 3;
                    this.scene3Image.setVisible(true);
                    this.scene2Image.setVisible(false);
                    this.typewriter.typewrite(this.scene3Text);
                    break;
                case 3:
                    this.currentImage = 4;
                    this.scene4Image.setVisible(true);
                    this.scene3Image.setVisible(false);
                    this.typewriter.typewrite(this.scene4Text);
                    break;
                case 4:
                    this.currentImage = 5;
                    this.scene5Image.setVisible(true);
                    this.scene4Image.setVisible(false);
                    this.typewriter.typewrite(this.scene5Text);
                    break;
                case 5:
                    this.currentImage = 6;
                    this.rightArrow.setVisible(false);
                    this.scene6Image.setVisible(true);
                    this.scene5Image.setVisible(false);
                    this.time.removeEvent(this.typing);
                    this.storyText.setText("");
                    break;
                case 6:
                    break;
                default:
                    break;
            }
        });
    }
}