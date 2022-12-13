import Player from "../components/player.js"
import Flower from "../components/flower.js"
import StaticPlatformsGroup from "../components/staticPlatformsGroup.js";
import MovingPlatformsGroup from "../components/movingPlatformsGroup.js";
import Enemy from "../components/enemy.js";

export default class TestScene2 extends Phaser.Scene {

    background;         // oggetto relativo all'elemento "sfondo"
    player;             // oggetto relativo all'elemento "giocatore"
    floorHeight;        // Altezza del terreno (asse y) rispetto al riquadro di gioco
    lastFlower;         // Tempo dell'ultimo fiore lanciato
    isCameraFollowingPlayer;
    mP1;
    updates = 0;
    playerStartedMoving;
    lastLivesDecrement;


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
        this.lastLivesDecrement = 0;
        this.playerStartedMoving = false;
        this.isFlowerActive = false;
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
        this.floor = this.add.rectangle(-250, this.game.config.height,
            this.worldWidth + 250, this.game.config.height - this.floorHeight,
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

        const sP1 = new StaticPlatformsGroup(this);
        sP1.createStaticPlatforms(5, 850, this.game.config.height - 150, 500, -50, 'platform');

        this.mP1 = new MovingPlatformsGroup(this);
        this.mP1.createMovingPlatforms(3, 200, 100, 250, -50, 'platform', 1, 200, 100);

        this.uomogrigio = new Enemy(this, -250, this.floorHeight);
        this.physics.add.existing(this.uomogrigio);
        this.physics.add.collider(this.uomogrigio, this.floor);


        this.player.resize();
        this.uomogrigio.resize();

        this.game.gameState.lives = 3;
        const styleConfig = { color: '#FFFFFF', fontSize: 36 };

        // Inserisci il testo con il punteggio corrente
        const lifeMessage = "Lives: " + this.game.gameState.lives;
        this.lifeBox = this.add.text(100, 0, lifeMessage, styleConfig);
        this.lifeBox.setOrigin(0, 0);
        this.lifeBox.setScrollFactor(0, 0);
    }

    update() {
        // Azioni che vengono eseguite a ogni frame del gioco
        this.player.manageMovements();
        this.animateBackground();
        this.manageFlowers();

        // Rimosso overlap a favore di un controllo di sovrapposizione "manuale" che risolve indirettamente problema di istruzione bloccante
        if(Phaser.Geom.Intersects.RectangleToRectangle(this.player.getBounds(), this.uomogrigio.getBounds()) && this.uomogrigio.isEvil) {
            this.updateLives();
        }

        if(this.player.x != this.player.initialX && !this.playerStartedMoving) {
            this.playerStartedMoving = true;
            this.uomogrigio.start();
        }

        if(this.playerStartedMoving) {
            this.uomogrigio.manageMovements();
        }
        
        this.updates++;
        if(this.updates % 60 == 0) {
            console.log(this.time.now);
            this.mP1.updateMovingPlatforms();
        }
    }

    manageFlowers() {
        const minTimeBetweenFlowers = 500;    // Tempo minimo (in ms) tra un fiore e l'altro

        const timeFromPreviousFlower = this.time.now - this.lastFlower;

        // Se F e' premuto ed e' passato abbastanza tempo tra il fiore precedente
        // e adesso...

        this.flower;
        if(this.keyF.isDown && timeFromPreviousFlower > minTimeBetweenFlowers) {
            // Se sono qui devo creare e lanciare un fiore
            this.lastFlower = this.time.now;      // Setto il tempo per il prossimo giro

            // Creo un fiore
            this.flower = new Flower(this, this.player.x + this.player.body.width / 2, this.player.y - 50, 10, this.player.flipX);
            // Aggiungo la collisione
            this.isFlowerActive = true;
            
            // Lo lancio
            this.flower.fire();
        }

        if(this.isFlowerActive && Phaser.Geom.Intersects.RectangleToRectangle(this.flower.getBounds(), this.uomogrigio.getBounds()) && this.uomogrigio.isEvil) {
            this.cureEnemy(this.uomogrigio, this.flower);
            this.isFlowerActive = false;
        }
    }

    animateBackground() {
        this.background.x = - this.cameras.main.scrollX * 0.5;
        //this.cameras.main.y = - (this.player.body.y / 2) + 250;
        //this.background.y = - (this.player.body.y / 2) * 0.005 - 280;
    }

    cureEnemy(enemy, f) {
        enemy.isEvil = false;
        f.destroy();
    }

    updateLives() {
        // Aggiorna il punteggio
        const minTimeLivesDecrement = 2000;    // Tempo minimo (in ms) tra una perdita di vita e l'altra

        const timeFromLastLivesDecrement = this.time.now - this.lastLivesDecrement;

        if(timeFromLastLivesDecrement > minTimeLivesDecrement) {
            // Se sono qui devo togliere una vita
            this.lastLivesDecrement = this.time.now;

            this.game.gameState.lives--;
            this.lifeBox.setText("Lives: " + this.game.gameState.lives);
        }
    }
 
}