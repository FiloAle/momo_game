import Player from "../components/player.js"

export default class Physics_v2 extends Phaser.Scene {

    background;       // oggetto relativo all'elemento "sfondo"
    player;           // oggetto relativo all'elemento "giocatore"
    floorHeight;      // Altezza del terreno (asse y) rispetto al riquadro di gioco

    constructor() {
        // Il costruttore della classe base Phaser.Scene prende come argomento il nome della scena
        super("physics_v2");
    }

    init() {
        console.log("physics_v2 - Executing init()");
        // Definiamo l'altezza del terreno pari all'altezza del riquadro
        // di gioco, per posizionare il giocatore sul fondo della schermata.
        this.floorHeight = this.game.config.height - 30;
        this.worldWidth = 10000;
    }

    preload() {
        console.log("physics_v2- Executing preload()");
        // Carichiamo gli asset grafici
        this.load.image("mushroom", "assets/images/environment_elements/mushroom_1.png");
    }

    create() {
        // Qui le istruzioni su cosa creare e dove nel mondo di gioco
        console.log("physics_v2 - Executing create()");
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
        this.physics.add.existing(this.floor, true);    // true indica che il corpo e' statico

        // Player
        const thePlayer = new Player(this, 200, this.floorHeight, this.worldWidth)
        // Aggiungi il player alla fisica
        this.player = this.physics.add.existing(thePlayer);

        // Il player deve collidere con il suolo
        this.physics.add.collider(this.player, this.floor);

        // Imposta la camera per seguire i movimenti del giocatore lungo l'asse x
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setFollowOffset(0, this.game.config.height / 2); // Abbassiamo la telecamera

        // Inserisci gli elementi dell'interfaccia utente
        this.createUI();

        // Inserisci i funghetti nella scena
        this.mushrooms = [];
        for (let i = 0; i < 10; i++) {
            const mushroom = this.add.image(400 + 400 * i, this.floorHeight, "mushroom");
            mushroom.setOrigin(0, 1);
            this.mushrooms.push(mushroom);
        }
        // Aggiungi i funghetti alla fisica
        this.mushroomsGroup = this.physics.add.group(this.mushrooms);
        this.physics.add.collider(this.mushroomsGroup, this.floor);
        // Gestisci la raccolta dei funghi attraverso la fisica
        this.physics.add.overlap(this.player, this.mushroomsGroup, this.updateScore, null, this);
    }

    createUI() {

        const styleConfig = { color: '#FFFFFF', fontSize: 36 };

        // Inserisci il testo con il punteggio corrente
        const scoreMessage2 = "Score: " + this.game.gameState.score;
        const textPosX2 = 700;
        const textPosY2 = 0;
        this.scoreBox = this.add.text(textPosX2, textPosY2, scoreMessage2, styleConfig);
        this.scoreBox.setOrigin(0, 0);
        this.scoreBox.setScrollFactor(0, 0);

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

    updateScore(player, mushroom) {
        // Rimuove il funghetto dalla scena
        mushroom.destroy();
        // Aggiorna il punteggio
        this.game.gameState.score += 10;
        this.scoreBox.setText("Score: " + this.game.gameState.score);
    }

}