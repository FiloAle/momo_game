import Player from "../components/player.js"
import Flower from "../components/flower.js"

export default class TestScene2 extends Phaser.Scene {

    background;         // oggetto relativo all'elemento "sfondo"
    player;             // oggetto relativo all'elemento "giocatore"
    floorHeight;        // Altezza del terreno (asse y) rispetto al riquadro di gioco
    lastFlower;         // Tempo dell'ultimo fiore lanciato
    isCameraFollowingPlayer;
    


    constructor() {
        // Il costruttore della classe base Phaser.Scene prende come argomento il nome della scena
        super("test_scene_2");
    }

    init() {
        console.log("test_scene_2 - Executing init()");
        // Definiamo l'altezza del terreno pari all'altezza del riquadro
        // di gioco, per posizionare il giocatore sul fondo della schermata.
        this.floorHeight = this.game.config.height - 30;
        this.worldWidth = 10000;
        this.lastFlower = 0;

    }

    preload() {
        console.log("test_scene_2 - Executing preload()");
        // Carichiamo gli asset grafici
        this.load.image("mushroom2", "assets/images/environment_elements/mushroom_2.png");
        this.load.image("platform", "assets/images/environment_elements/platform.png");
    }

    create() {
        // Qui le istruzioni su cosa creare e dove nel mondo di gioco
        console.log("test_scene_2 - Executing create()");
        // Sfondo
        this.background = this.add.tileSprite(0, -280, 6000, 1000, "background_base");
        this.background.setOrigin(0, 0);
        this.background.setScrollFactor(0, 0);

        this.isCameraFollowingPlayer = false;

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

        // Posizione camera centrata su player, inizia follow quando arriva a metà schermata
        this.cameras.main.setBounds(0, 0, 10000, 720);
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setFollowOffset(-this.player.width / 4, this.game.config.height / 2);
        

        // Creiamo un fungo enorme che sia così grande da essere non saltabile
        this.big_mushroom = this.physics.add.image(600, this.floorHeight, "mushroom2");
        this.big_mushroom.setOrigin(0, 1);
        this.big_mushroom.setScale(1, 1);

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

        this.createStaticPlatforms();

    }

    update() {
        // Azioni che vengono eseguite a ogni frame del gioco
        this.player.manageMovements();
        this.animateBackground();
        this.manageFlowers();
    }

    createStaticPlatforms() {
        // Aggiungi le piattaforme come un gruppo di oggetti statici
        this.platforms = this.physics.add.staticGroup({
            key: 'platform',
            repeat: 3,
            setXY: { x: 1024, y: this.game.config.height - 150, stepX: 512, stepY: -50}
        });

        // Rende le piattaforme "solide"
        this.physics.add.collider(this.platforms, this.player, () => {
            this.player.isJumping = false;
        });
    }

    manageFlowers() {
        const minTimeBetweenFlowers = 500;    // Tempo minimo (in ms) tra un fiore e l'altro

        const timeFromPreviousFlower = this.time.now - this.lastFlower;

        // Se F e' premuto ed e' passato abbastanza tempo tra il fiore precedente
        // e adesso...
        if(this.keyF.isDown && timeFromPreviousFlower > minTimeBetweenFlowers) {
            // Se sono qui devo creare e lanciare un fiore
            this.lastFlower = this.time.now;      // Setto il tempo per il prossimo giro
            const player_dir = this.player.flipX;   // Prendo la direzione del player
                                                    // (che sara' la direzione del fiore)

            // Creo un fiore
            const s = new Flower(this, this.player.x + this.player.body.width / 2, this.player.y-60, 10, player_dir);
            // Aggiungo la colisione
            this.physics.add.collider(this.big_mushroom, s, this.destroyMushroom, null, this);
            // Lo lancio
            s.fire();
        } 
    }

    animateBackground() {
        this.background.x = - this.cameras.main.scrollX * 0.5;
        //this.cameras.main.y = - (this.player.body.y / 2) + 250;
        //this.background.y = - (this.player.body.y / 2) * 0.005 - 280;
    }

    destroyMushroom(mushroom, s) {
        mushroom.destroy();
        s.destroy();
    }
 
}