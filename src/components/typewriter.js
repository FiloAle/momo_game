export default class TypeWriter {

    scene;
    label;

    constructor(scene, label) {
        this.scene = scene;
        this.label = label;
    }

    typewrite(message) {
        this.label.text = "";
        this.scene.time.removeEvent(this.scene.typing);
        const length = message.length;
        let i = 0;
        this.scene.typing = this.scene.time.addEvent({
            callback: () => {
                this.label.text += message[i++];
            },
            repeat: length - 1,
            delay: 20
        });
    }
}