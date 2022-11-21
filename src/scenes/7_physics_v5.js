import Player from "../components/player.js"
import Shuriken from "../components/shuriken.js"

export default class Physics_v5 extends Phaser.Scene {

    background;       // oggetto relativo all'elemento "sfondo"
    player;           // oggetto relativo all'elemento "giocatore"
    floorHeight;      // Altezza del terreno (asse y) rispetto al riquadro di gioco
    lastShuriken;     // Tempo dell'ultimo Shuriken lanciato

    constructor() {
        // Il costruttore della classe base Phaser.Scene prende come argomento il nome della scena
        super("physics_v5");
    }

    init() {
        console.log("physics_v5 - Executing init()");
        // Definiamo l'altezza del terreno pari all'altezza del riquadro
        // di gioco, per posizionare il giocatore sul fondo della schermata.
        this.floorHeight = this.game.config.height - 30;
        this.worldWidth = 10000;
        this.lastShuriken = 0;

    }

    preload() {
        console.log("physics_v5 - Executing preload()");
        // Carichiamo gli asset grafici
        this.load.image("mushroom2", "assets/images/environment_elements/mushroom_2.png");
    }

    create() {
        // Qui le istruzioni su cosa creare e dove nel mondo di gioco
        console.log("physics_v5 - Executing create()");
        // Sfondo
        this.background = this.add.tileSprite(0, 0, 6000, 720, "background_base");
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
        const thePlayer = new Player(this, 0, this.floorHeight, this.worldWidth)
        // Aggiungi il player alla fisica
        this.player = this.physics.add.existing(thePlayer);
        this.physics.add.collider(this.player, this.floor);

        // Imposta la camera per seguire i movimenti del giocatore lungo l'asse x
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setFollowOffset(-this.game.config.width / 2, this.game.config.height / 2); // Abbassiamo la telecamera

        // Creiamo un fungo enorme che sia così grande da essere non saltabile
        this.big_mushroom = this.physics.add.image(600, this.floorHeight, "mushroom2");
        this.big_mushroom.setOrigin(0, 1);
        this.big_mushroom.setScale(3,3);

        // Imposto il fungo come immovable e senza gravità, perchè voglio che
        // l'oggetto non sia spostabile dal giocatore
        this.big_mushroom.setImmovable(true);
        this.big_mushroom.body.allowGravity = false;

        // Aggiungi il fungo alla fisica
        this.physics.add.existing(this.big_mushroom);

        // Aggiungo i collider necessari
        this.physics.add.collider(this.big_mushroom, this.floor);
        this.physics.add.collider(this.big_mushroom, this.player);

        // Recuperiamo il riferimento al tasto F (sara' il tasto per sparare)
        this.keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);

    }

    update() {
        // Azioni che vengono eseguite a ogni frame del gioco
        this.player.manageMovements();
        this.animateBackground();
        this.manageShurikens();
    }

    manageShurikens() {
        const minTimeBetweenShurikens = 500;    // Tempo minimo (in ms) tra uno shuriken e l'altro

        const timeFromPreviousShuriken = this.time.now-this.lastShuriken;

        // Se F e' premuto ed e' passato abbastanza tempo tra lo shuriken precedente
        // e adesso...
        if(this.keyF.isDown && timeFromPreviousShuriken > minTimeBetweenShurikens) {
            // Se sono qui devo creare e lanciare uno shuriken
            this.lastShuriken = this.time.now;      // Setto il tempo per il prossimo giro
            const player_dir = this.player.flipX;   // Prendo la direzione del player
                                                    // (che sara' la direzione dello Shuriken)

            // Creo uno shuriken
            const s = new Shuriken(this, this.player.x+20, this.player.y-60, 10, player_dir);
            // Aggiungo la colisione
            this.physics.add.collider(this.big_mushroom, s, this.destroyMushroom, null, this);
            // Lo lancio
            s.fire();
        } 
    }

    animateBackground() {
        this.background.tilePositionX = this.cameras.main.scrollX * 0.5;
        this.cameras.main.followOffset.y = this.player.body.y + this.player.height/2 - this.game.config.height / 2;
    }

    destroyMushroom(mushroom, s) {
        mushroom.destroy();
        s.destroy();
    }
 
}