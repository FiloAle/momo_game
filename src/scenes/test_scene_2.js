import Player from "../components/player.js"
import Flower from "../components/flower.js"
import StaticPlatformsGroup from "../components/staticPlatformsGroup.js";
import MovingPlatformsGroup from "../components/movingPlatformsGroup.js";
import Enemy from "../components/enemy.js";

export default class TestScene2 extends Phaser.Scene {

    background;         // oggetto relativo all'elemento "sfondo"
    player;             // oggetto relativo all'elemento "giocatore"
    floorHeight;        // Altezza del terreno (asse y) rispetto al riquadro di gioco
    lastFlower;         // Tempo dall'ultimo fiore lanciato
    isCameraFollowingPlayer;
    mP1;
    updates;
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
        this.updates = 0;
        this.lastLivesDecrement = 0;
        this.playerStartedMoving = false;
        this.isFlowerActive = false;
    }

    preload() {
        console.log("test_scene_2 - Executing preload()");
        // Carichiamo gli asset grafici
        this.load.image("mushroom2", "assets/images/environment_elements/mushroom_2.png");
        this.load.image("platform_verde_1", "assets/images/environment_elements/platform_verde_1.png");
        this.load.image("platform_verde_corto", "assets/images/environment_elements/platform_verde_2.png");
        this.load.image("platform_verde_lungo", "assets/images/environment_elements/platform_verde_3.png");
        this.load.image("platform_1", "assets/images/environment_elements/platform_1.png");
        this.load.image("platform_casa_1", "assets/images/environment_elements/platform_casa_1.png");
        this.load.image("platform_casa_2", "assets/images/environment_elements/platform_casa_2.png");
        this.load.image("platform_grigia_1", "assets/images/environment_elements/platform_grigia_1.png");
        this.load.image("platform_grigia_2", "assets/images/environment_elements/platform_grigia_2.png");
        this.load.image("column", "assets/images/environment_elements/column.png");
        this.load.image("punzoni", "assets/images/environment_elements/punzoni.png");
    }

    create() {
        // Qui le istruzioni su cosa creare e dove nel mondo di gioco
        console.log("test_scene_2 - Executing create()");

        //#region Impostazione sfondo scena
        this.background = this.add.tileSprite(0, this.game.config.height - this.textures.get('b1').getSourceImage().height, this.game.width, this.textures.get('b1').getSourceImage().height, "b1");
        this.background.setOrigin(0, 0);
        this.background.setScrollFactor(0, 0);
        //#endregion

        this.isCameraFollowingPlayer = false;

        //#region Pavimento
        this.floor = this.add.rectangle(-1000, this.game.config.height,
            this.worldWidth + 1000, this.game.config.height - this.floorHeight,
            0xFFFFFF, 0); // Crea un piano sul quale fermare gli oggetti soggetti alla fisica (gravità)
        this.floor.setScrollFactor(0, 0);
        this.floor.setOrigin(0, 1);
        // Aggiungi il piano alla fisica
        this.physics.add.existing(this.floor, true);    // true indica che il corpo e' statico
        //#endregion

        const columns_inizio = new StaticPlatformsGroup(this, 3, 50, 552, 100, 0, false, "column");
        const columns_banca = new StaticPlatformsGroup(this, 7, 5500, 350, 100, 0, false, "column");

        //#region Creazione player
        const thePlayer = new Player(this, 5000, this.floorHeight-400, this.worldWidth);
        // Aggiungi il player alla fisica
        this.player = this.physics.add.existing(thePlayer);
        this.physics.add.collider(this.player, this.floor);
        //#endregion
        
        const punzoni = new StaticPlatformsGroup(this, 10, 6250, this.game.config.height - 40, 95, -0, true, 'punzoni');   
        const columns_platform_1 = new StaticPlatformsGroup(this, 2, 2250, this.game.config.height - 10, 480, -0, true, 'column');
        const columns_platform_2 = new StaticPlatformsGroup(this, 2, 2505, this.game.config.height - 150, 470, -0, true, 'column');

        const pavement = new StaticPlatformsGroup(this, 2, 590, 910, this.textures.get('platform_1').getSourceImage().width, 0, true, 'platform_1');
        const pavement_1 = new StaticPlatformsGroup(this, 1, 5800, 700, 0, 0, true, 'platform_1');
        
        //platform casine
        const platforms_casa_1 = new StaticPlatformsGroup(this, 1, 840, this.game.config.height - 100, 2710, 30, true, 'platform_casa_1');
        const platform_casa_2 = new StaticPlatformsGroup(this, 1, 1240, this.game.config.height - 127, 2110, 30, true, 'platform_casa_2');
        
        //platform verdi
        const platforms_verde_alti_corto = new StaticPlatformsGroup(this, 2, 1570, this.game.config.height - 340, 450, -0, true, 'platform_verde_corto');
        const platforms_verde_bassi_corto = new StaticPlatformsGroup(this, 2, 1795, this.game.config.height - 180, 0, -300, true, 'platform_verde_corto');
        const platform_verde_lungo = new StaticPlatformsGroup(this, 1, 2530, this.game.config.height - 600, 0, -0, true, 'platform_verde_lungo');

        //platform grige
        const platforms_grigia_1 = new StaticPlatformsGroup(this, 2, 3300, this.game.config.height - 125, 790, 150, true, 'platform_grigia_1');
        const platforms_grigia_2 = new StaticPlatformsGroup(this, 2, 3900, this.game.config.height - 60, 590, -0, true, 'platform_grigia_2');

        //platform verdi piccoli
        //const platforms_3 = new StaticPlatformsGroup(this, 2, 1500, this.game.config.height - 300, 330, -0, true, 'platform');

        //#region Posizionamento camera
        this.cameras.main.setBounds(0, 0, 10000, 720);
        this.cameras.main.startFollow(this.player); // Posizione camera centrata su player, inizia follow quando arriva a metà schermata
        this.cameras.main.setFollowOffset(-this.player.width / 4, this.game.config.height / 2);
        //#endregion

        // Recuperiamo il riferimento al tasto F (sara' il tasto per sparare)
        this.keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);

        this.mP1 = new MovingPlatformsGroup(this, 1, 3598, 220, 0, -20, 'platform_verde_1', 1, 250, 100);
        this.mP2 = new MovingPlatformsGroup(this, 2, 4750, 220, 300, -0, 'platform_verde_corto', 1, 250, 100);
        this.mP3 = new MovingPlatformsGroup(this, 1, 4900, 500, 300, -20, 'platform_verde_corto', 1, -250, 100);
        this.mP4 = new MovingPlatformsGroup(this, 1, 4900, 470, 300, -20, 'punzoni', 1, -250, 100);
       

        
        //#region Creazione nemici
        this.uominiGrigi = [];
        //for(let i = 0; i < 5; i++) {
        //    this.uominiGrigi[i] = new Enemy(this, Math.floor(Math.random() * 10000) - 700, this.floorHeight);
        //    this.physics.add.existing(this.uominiGrigi[i]);
        //    this.physics.add.collider(this.uominiGrigi[i], this.floor);
        //    this.uominiGrigi[i].resize(); // Ridimensionamento hitbox
        //}

        /* for(let i = 0; i < 5; i++) {
            this.uominiGrigi.push(new Enemy(this, this.movingPlatformsList[0].list[i].x, this.movingPlatformsList[0].list[i].y));
            this.physics.add.existing(this.uominiGrigi[this.uominiGrigi.length - 1]);
            this.physics.add.collider(this.uominiGrigi[this.uominiGrigi.length - 1], this.floor);
            this.physics.add.collider(this.uominiGrigi[this.uominiGrigi.length - 1], this.movingPlatformsList[0].list[i]);
            this.uominiGrigi[this.uominiGrigi.length - 1].resize(); // Ridimensionamento hitbox
        } */

        for(let k = 0; k < this.uominiGrigi.length; k++) {
            this.uominiGrigi.forEach(enemy => {
                this.physics.add.collider(this.uominiGrigi[k], enemy);
            });
        }
        //#endregion

        this.player.resize(); // Ridimensionamento hitbox

        this.game.gameState.lives = 3;
        const styleConfig = { color: '#FFFFFF', fontSize: 36 };

        //#region Inserimento informazione vita
        const lifeMessage = "Lives: " + this.game.gameState.lives;
        this.lifeBox = this.add.text(100, 0, lifeMessage, styleConfig);
        this.lifeBox.setOrigin(0, 0);
        this.lifeBox.setScrollFactor(0, 0);
        //#endregion
    }

    update() {
        // Azioni che vengono eseguite a ogni frame del gioco
        this.player.manageMovements();
        this.animateBackground();
        this.manageFlowers();

        for(let i = 0; i < this.uominiGrigi.length; i++) {
            if(Phaser.Geom.Intersects.RectangleToRectangle(this.player.getBounds(), this.uominiGrigi[i].getBounds()) && this.uominiGrigi[i].isEvil) {
                this.updateLives();
            }
        }

        if(this.player.x != this.player.initialX && !this.playerStartedMoving) {
            this.playerStartedMoving = true;
            for(let i = 0; i < this.uominiGrigi.length; i++) {
                this.uominiGrigi[i].start();
            }
        }

        if(this.playerStartedMoving) {
            for(let i = 0; i < this.uominiGrigi.length; i++) {
                this.uominiGrigi[i].manageMovements();
            }
        }
        
        //#region Aggiornamento movimento platforms mobili
        this.updates++;
        if(this.updates % this.mP1.duration == 0) {
            this.mP1.updateMovingPlatforms();
        }

        if(this.updates % this.mP2.duration == 0) {
            this.mP2.updateMovingPlatforms();
        }

        if(this.updates % this.mP3.duration == 0) {
            this.mP3.updateMovingPlatforms();
        }

        if(this.updates % this.mP4.duration == 0) {
            this.mP4.updateMovingPlatforms();
        }

        //#endregion
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
            
            this.isFlowerActive = true;
            
            // Lo lancio
            this.flower.fire();
        }

        for(let i = 0; i < this.uominiGrigi.length; i++) {
            if(this.isFlowerActive && Phaser.Geom.Intersects.RectangleToRectangle(this.flower.getBounds(), this.uominiGrigi[i].getBounds()) && this.uominiGrigi[i].isEvil) {
                this.uominiGrigi[i].cure(this.flower);
                this.isFlowerActive = false;
            }
        }
    }

    animateBackground() {
        this.background.x = - this.cameras.main.scrollX * 0.5;
        //this.cameras.main.y = - (this.player.body.y / 2) + 250;
        //this.background.y = - (this.player.body.y / 2) * 0.005 - 280;
    }

    updateLives() {
        // Aggiorna il punteggio
        const minTimeLivesDecrement = 2000;    // Tempo minimo (in ms) tra una perdita di vita e l'altra

        const timeFromLastLivesDecrement = this.time.now - this.lastLivesDecrement;

        if(timeFromLastLivesDecrement > minTimeLivesDecrement && this.game.gameState.lives > 0) {
            // Se sono qui devo togliere una vita
            this.lastLivesDecrement = this.time.now;

            this.game.gameState.lives--;
            this.lifeBox.setText("Lives: " + this.game.gameState.lives);
        }

        if(this.game.gameState.lives == 0) {
            this.player.die();
            //schermata game over
        }
    }
}