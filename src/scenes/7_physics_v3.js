import Player from "../components/player.js"

export default class Physics_v3 extends Phaser.Scene {

    background;       // oggetto relativo all'elemento "sfondo"
    player;           // oggetto relativo all'elemento "giocatore"
    floorHeight;      // Altezza del terreno (asse y) rispetto al riquadro di gioco

    constructor() {
        // Il costruttore della classe base Phaser.Scene prende come argomento il nome della scena
        super("physics_v3");
    }

    init() {
        console.log("physics_v3 - Executing init()");
        // Definiamo l'altezza del terreno pari all'altezza del riquadro
        // di gioco, per posizionare il giocatore sul fondo della schermata.
        this.floorHeight = this.game.config.height - 30;
        this.worldWidth = 10000;
    }

    preload() {
        console.log("physics_v3 - Executing preload()");
    }

    create() {
        // Qui le istruzioni su cosa creare e dove nel mondo di gioco
        console.log("physics_v3 - Executing create()");
        // Sfondo
        this.background = this.add.tileSprite(0, 0, 1280, 720, "background_base");
        this.background.setOrigin(0, 0);
        this.background.setScrollFactor(0, 0);

        // Crea un piano sul quale fermare gli oggetti soggetti alla fisica (gravità)
        this.floor = this.add.rectangle(0, this.game.config.height,
            this.worldWidth, this.game.config.height - this.floorHeight,
            0xFFFFFF, 0);
        this.floor.setScrollFactor(0, 0);
        this.floor.setOrigin(0, 1);
        // Aggiungi il piano alla fisica
        this.physics.add.existing(this.floor, true);

        // Player
        const thePlayer = new Player(this, 0, this.floorHeight, 10000);
        // Aggiungi il player alla fisica
        this.player = this.physics.add.existing(thePlayer);
        this.physics.add.collider(this.player, this.floor);

        // Imposta la camera per seguire i movimenti del giocatore lungo l'asse x
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setFollowOffset(0, this.game.config.height / 2); // Abbassiamo la telecamera

        // Inserisci gli elementi dell'interfaccia utente
        this.createUI();

    }


    createUI() {
        const styleConfig = { color: '#FFFFFF', fontSize: 36 };

        // Inserisci il testo con il punteggio corrente
        const lifeMessage = "Lives: " + this.game.gameState.lives;
        this.lifeBox = this.add.text(400, 0, lifeMessage, styleConfig);
        this.lifeBox.setOrigin(0, 0);
        this.lifeBox.setScrollFactor(0, 0);
    }

    update() {
        // Azioni che vengono eseguite a ogni frame del gioco
        this.player.manageMovements();
        this.animateBackground();

    }

    animateBackground() {
        this.background.tilePositionX = this.cameras.main.scrollX * 0.5;
        this.cameras.main.followOffset.y = this.player.body.y + this.player.height/2 - this.game.config.height / 2;
    }


}