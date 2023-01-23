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
    updates;
    playerStartedMoving;
    lastLivesDecrement;
    movingPlatforms;

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
        this.movingPlatforms = [];
    }

    preload() {
        console.log("test_scene_2 - Executing preload()");
        // Carichiamo gli asset grafici
        this.load.image("mushroom2", "assets/images/environment_elements/mushroom_2.png");
        this.load.image("platform", "assets/images/environment_elements/platform.png");
        this.load.image("platform_1", "assets/images/environment_elements/platform_1.png");
        this.load.image("column", "assets/images/environment_elements/column.png");

        this.load.image("city_l2", "assets/images/background/bg_city_l2.jpg");
    }

    create() {
        // Qui le istruzioni su cosa creare e dove nel mondo di gioco
        console.log("test_scene_2 - Executing create()");

        //#region Impostazione sfondo scena
        this.background = this.add.tileSprite(0, this.game.config.height - this.textures.get('b1').getSourceImage().height, this.game.width, this.textures.get('b1').getSourceImage().height, "b1");
        this.background.setOrigin(0, 0);
        this.background.setScrollFactor(0, 0);
        this.background.setDepth(-2);
        //#endregion

        this.isCameraFollowingPlayer = false;

        //#region Creazione player
        // Aggiungi il player alla fisica
        this.player = this.physics.add.existing(new Player(this, 0, this.floorHeight, this.worldWidth));
        //#endregion

        const pavement = new StaticPlatformsGroup(this, 2, 0, 690, this.textures.get('platform_1').getSourceImage().width, 0, true, 'platform_1');
        const pavement_1 = new StaticPlatformsGroup(this, 1, pavement.list[pavement.list.length - 1].x + pavement.list[pavement.list.length - 1].width, 600, 0, 0, true, 'platform_1');
        const columns = new StaticPlatformsGroup(this, 3, 20, pavement.list[0].y - this.textures.get('column').getSourceImage().height + 20, 100, 0, false, "column");
        for(let i = 0; i < columns.list.length; i++) {
            columns.list[i].setDepth(-1);
        }

        this.pavements = [];
        this.pavements.push(pavement);
        this.pavements.push(pavement_1);

        this.player.setDepth(1);
        
        //#region Posizionamento camera
        this.cameras.main.setBounds(0, 0, 10000, 720);
        this.cameras.main.startFollow(this.player); // Posizione camera centrata su player, inizia follow quando arriva a metà schermata
        this.cameras.main.setFollowOffset(-this.player.width / 4, this.game.config.height / 2);
        //#endregion
        
        // Creiamo un fungo
        this.big_mushroom = this.physics.add.image(600, this.floorHeight, "mushroom2");
        this.big_mushroom.setOrigin(0, 1);
        this.big_mushroom.setScale(1, 1);

        // Imposto il fungo come immovable e senza gravità, perchè voglio che
        // l'oggetto non sia spostabile dal giocatore
        this.big_mushroom.setImmovable(true);
        this.big_mushroom.body.allowGravity = false;

        //TODO: Sostituire TUTTI i this.floor !!!

        // Aggiungo i collider necessari
        this.physics.add.collider(this.big_mushroom, this.floor);
        this.physics.add.collider(this.big_mushroom, this.player);

        // Recuperiamo il riferimento al tasto F (sara' il tasto per sparare)
        this.keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);

        this.movingPlatforms.push(new MovingPlatformsGroup(this, 3, 200, 600, 400, -60, 'platform', 1, 200, 60));

        //#region Creazione nemici
        this.uominiGrigi = [];
        for(let i = 0; i < 1; i++) {
            this.uominiGrigi.push(this.physics.add.existing(new Enemy(this, this.player.x + 600, this.floorHeight, "grigi")));
            this.uominiGrigi[i].body.allowGravity = true;
            this.uominiGrigi[i].resize(); // Ridimensionamento hitbox
        }

        /* for(let i = 0; i < 5; i++) {
            this.uominiGrigi.push(new Enemy(this, this.movingPlatformsList[0].list[i].x, this.movingPlatformsList[0].list[i].y));
            this.physics.add.existing(this.uominiGrigi[this.uominiGrigi.length - 1]);
            this.physics.add.collider(this.uominiGrigi[this.uominiGrigi.length - 1], this.movingPlatformsList[0].list[i]);
            this.uominiGrigi[this.uominiGrigi.length - 1].resize(); // Ridimensionamento hitbox
        } */

        this.pavements.forEach(pavement => {
            this.uominiGrigi.forEach(enemy => {
                pavement.list.forEach(platform => {
                    this.physics.add.collider(enemy, platform);
                });
            });
        });

        for(let k = 0; k < this.uominiGrigi.length; k++) {
            this.uominiGrigi.forEach(enemy => {
                this.physics.add.collider(this.uominiGrigi[k], enemy);
            });
        }
        //#endregion

        this.player.resize(); // Ridimensionamento hitbox

        this.game.gameState.lives = 3;
        const styleConfig = { color: '#FFFFFF', fontFamily: 'Montserrat', fontSize: 36 };

        //#region Inserimento informazione vita
        const lifeMessage = "Lives: " + this.game.gameState.lives;
        this.lifeBox = this.add.text(50, 40, lifeMessage, styleConfig);
        this.lifeBox.setOrigin(0, 0);
        this.lifeBox.setScrollFactor(0, 0);
        //#endregion
    }

    update() {
        // Azioni che vengono eseguite a ogni frame del gioco
        this.player.manageMovements(this.movingPlatforms);
        this.animateBackground();
        this.manageFlowers();
        this.manageEnemies();
        this.updateMovingPlatforms();

        if(this.player.body.y > this.game.config.height) {
            this.player.die();
            this.updateLives();
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
            this.flower = new Flower(this, this.player.x + this.player.body.width * 2, this.player.y - this.player.body.height / 2, 10, this.player.flipX);
            this.flower.setDepth(0);
            this.isFlowerActive = true;
            
            // Lo lancio
            this.flower.fire();
        }

        for(let i = 0; i < this.uominiGrigi.length; i++) {
            if(this.isFlowerActive && Phaser.Geom.Intersects.RectangleToRectangle(this.flower.body, this.uominiGrigi[i].body) && this.uominiGrigi[i].isEvil) {
                this.uominiGrigi[i].cure(this.flower);
                this.isFlowerActive = false;
            }
        }
    }

    updateMovingPlatforms() {
        this.updates++;
        for(let i = 0; i < this.movingPlatforms.length; i++)
        {
            for(let k = 0; k < this.movingPlatforms[i].list.length; k++) {
                if(this.updates % this.movingPlatforms[i].duration == 0) {
                    this.movingPlatforms[i].updateMovingPlatforms();
                }
            }
        }
    }

    manageEnemies() {
        for(let i = 0; i < this.uominiGrigi.length; i++) {
            if(Phaser.Geom.Intersects.RectangleToRectangle(this.player.body, this.uominiGrigi[i].body) && this.uominiGrigi[i].isEvil) {
                //this.updateLives();
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
    }

    animateBackground() {
        this.background.x = - this.cameras.main.scrollX * 0.5;
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