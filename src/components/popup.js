export default class PopUp extends Phaser.Scene {

    originScene;
    message;
    hasBeenDisplayed;

    constructor(originScene, message, id) {
        super("popup_" + id);
        this.originScene = originScene;
        this.message = message + "\n\nPremi [ESC] o [I] per continuare.";
        this.hasBeenDisplayed = false;
    }

    init() {

    }

    preload() {
        this.load.image("popup", "assets/UI/popup.png");
        this.load.image("cassiopea_popup", "assets/UI/cassiopea_popup.png");
    }

    create() {
        this.img = this.add.image(0, -20, "popup").setOrigin(0, 0);
        this.add.image(122, 96, "cassiopea_popup");
        this.img.flipX = true;
        this.keyI = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.I);
        this.keyESC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

        const styleConfig = { color: '#000000', fontFamily: 'Montserrat', fontSize: 18 };

        this.textMessage = this.add.text(220, 38, "", styleConfig);
        this.typewriteText(this.message);
        this.hasBeenDisplayed = true;
    }

    update() {
        if(this.keyESC.isDown || this.keyI.isDown) {
            this.scene.resume(this.originScene);
            this.scene.remove(this);
        }
    }

    typewriteText(text) {
        const length = text.length;
        let i = 0;
        this.time.addEvent({
            callback: () => {
                this.textMessage.text += text[i++];
            },
            repeat: length - 1,
            delay: 20
        });
    }
} 