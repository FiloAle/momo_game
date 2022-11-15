import Player from "../components/player.js"

export default class Physics_v1 extends Phaser.Scene {

    background;       // oggetto relativo all'elemento "sfondo"
    player;           // oggetto relativo all'elemento "giocatore"
    floorHeight;      // Altezza del terreno (asse y) rispetto al riquadro di gioco

    constructor() {
        // Il costruttore della classe base Phaser.Scene prende come argomento il nome della scena
        super("physics_v1");
    }

    init() {
        console.log("physics_v1 - Executing init()");
        // Definiamo l'altezza del terreno pari all'altezza del riquadro
        // di gioco, per posizionare il giocatore sul fondo della schermata.
        this.floorHeight = this.game.config.height - 30;
        this.worldWidth = 10000;
    }

    preload() {
        console.log("physics_v1- Executing preload()");
    }

    create() {
        // Qui le istruzioni su cosa creare e dove nel mondo di gioco
        console.log("physics_v1 - Executing create()");
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
        const thePlayer = new Player(this, 0, this.floorHeight, 10000);
        // Aggiungi il player alla fisica
        this.player = this.physics.add.existing(thePlayer);

        // Il player deve collidere con il suolo
        this.physics.add.collider(this.player, this.floor);

        // Imposta la camera per seguire i movimenti del giocatore lungo l'asse x
        this.cameras.main.startFollow(this.player);

    }

    update() {
        // Azioni che vengono eseguite a ogni frame del gioco
        this.player.manageMovements();
        this.animateBackground();
    }

    animateBackground() {
        this.background.tilePositionX = this.cameras.main.scrollX * 0.5;

        // Qui c'e' una modifica: per funzionare correttamente la camera,
        // Phaser non gradisce l'uso di this.player.y nel calcolo della
        // posizione della camera. Dobbiamo usare this.player.body.y che
        // però non è influenzato dal Pivot e quindi dobbiamo manualmente
        // sommare l'altezza del giocatore, ovvero al posto di this.player.y,
        // diventa this.player.body.y + this.player.height/2
        this.cameras.main.followOffset.y = this.player.body.y + this.player.height/2 - this.game.config.height / 2;
    }


}