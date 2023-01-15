import Player from "../components/player.js"
import Flower from "../components/flower.js"
import StaticPlatformsGroup from "../components/staticPlatformsGroup.js";
import MovingPlatformsGroup from "../components/movingPlatformsGroup.js";
import Enemy from "../components/enemy.js";

export default class Level1 extends Phaser.Scene {

    background;         // oggetto relativo all'elemento "sfondo"
    player;             // oggetto relativo all'elemento "giocatore"
    floorHeight;        // Altezza del terreno (asse y) rispetto al riquadro di gioco
    lastFlower;         // Tempo dall'ultimo fiore lanciato
    isCameraFollowingPlayer;
    mP1;
    updates;
    playerStartedMoving;
    lastLivesDecrement;
    nuvole;
    flowers;
    movingPlatforms;

    constructor() {
        // Il costruttore della classe base Phaser.Scene prende come argomento il nome della scena
        super("level_1");
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

        this.load.image("platform_2", "assets/images/environment_elements/platform_2.png");
        this.load.image("column", "assets/images/environment_elements/column.png");
        this.load.image("platform_verde_2", "assets/images/environment_elements/platform_verde_2.png");
        this.load.image("punzoni", "assets/images/environment_elements/punzoni.png");
        this.load.image("platform_3", "assets/images/environment_elements/platform_3.png");
        this.load.image("platform_verde_3", "assets/images/environment_elements/platform_verde_3.png");
        this.load.image("flowers", "assets/images/environment_elements/mushroom_1.png");

    }

    create() {
        // Qui le istruzioni su cosa creare e dove nel mondo di gioco
        console.log("test_scene_2 - Executing create()");

        //#region Impostazione sfondo scena
        this.background = this.add.tileSprite(0, this.game.config.height - this.textures.get('b1').getSourceImage().height, this.game.width, this.textures.get('b1').getSourceImage().height, "b1");
        this.background.setOrigin(0, 0);
        this.background.setScrollFactor(0, 0);

        this.nuvole = this.add.tileSprite(0, this.game.config.height - this.textures.get('nuvole').getSourceImage().height, this.game.width, this.textures.get('nuvole').getSourceImage().height, "nuvole");
        this.nuvole.setOrigin(0, 0);
        this.nuvole.setScrollFactor(0, 0);
        //#endregion

        this.isCameraFollowingPlayer = false;

        //#region Pavimento
        //this.floor = this.add.rectangle(-1000, this.game.config.height, this.worldWidth + 1000, this.game.config.height - this.floorHeight, 0xFFFFFF, 0); // Crea un piano sul quale fermare gli oggetti soggetti alla fisica (gravità)
        //this.floor.setScrollFactor(0, 0);
        //this.floor.setOrigin(0, 1);
        // Aggiungi il piano alla fisica
        //this.physics.add.existing(this.floor, true);    // true indica che il corpo e' statico
        //#endregion


        const columns_inizio = new StaticPlatformsGroup(this, 3, 50, 552, 100, 0, false, "column");
        const columns_banca = new StaticPlatformsGroup(this, 7, 5500, 350, 100, 0, false, "column");


        //#region Creazione player
        // Aggiungi il player alla fisica
        this.player = this.physics.add.existing(new Player(this, 0, this.floorHeight, this.worldWidth));
        //this.physics.add.collider(this.player, this.floor);
        //#endregion

    
        const pavement = new StaticPlatformsGroup(this, 2, 0, 690, this.textures.get('platform_1').getSourceImage().width, 0, true, 'platform_1');
        const pavement_1 = new StaticPlatformsGroup(this, 2, pavement.list[pavement.list.length - 1].x + pavement.list[pavement.list.length - 1].width, 500, 1000, 100, true, 'platform_3');
        const columns = new StaticPlatformsGroup(this, 3, 20, pavement.list[0].y - this.textures.get('column').getSourceImage().height, 100, 0, false, "column");
        const platform_verde_2 = new StaticPlatformsGroup(this, 2, 700, pavement.list[0].y -120, 180, -70, true, "platform_verde_2");
        const platform_2 = new StaticPlatformsGroup(this, 2, 1070, 500, 200, 0, true, "platform_2");
        const punzoni = new StaticPlatformsGroup(this, 2, 2550, this.game.config.height-250, 90, 0, false, "punzoni");
        const platform_verde_3 = new StaticPlatformsGroup(this, 2, 2200, pavement.list[0].y -120, 400, -160, true, "platform_verde_2");
        const platform_verde_4 = new StaticPlatformsGroup(this, 1, 3600, pavement.list[0].y -230, 250, 0, true, "platform_verde_2");
        const columns_2 = new StaticPlatformsGroup(this, 3, 4060, this.game.config.height-130, 220, -30, true, "column");
        const pavement_2 = new StaticPlatformsGroup(this, 1, 5200, 600, 0, 0, true, 'platform_3');
        const platform_3 = new StaticPlatformsGroup(this, 2, 6550, 400, 0, 100, true, "platform_2");
        const platform_verde_5 = new StaticPlatformsGroup(this, 3, 7000, this.game.config.height-150, 200, 0, true, "platform_verde_2");
        const platform_verde_6 = new StaticPlatformsGroup(this, 2, 7600, this.game.config.height-500, 0, 310, true, "platform_verde_3");
        const punzoni_2 = new StaticPlatformsGroup(this, 3, 7640, this.game.config.height-490, 400, 0, false, "punzoni");
        const punzoni_3 = new StaticPlatformsGroup(this, 2, 7900, this.game.config.height-215, 400, 0, false, "punzoni");
        const platform_verde_7 = new StaticPlatformsGroup(this, 3, 8650, this.game.config.height-190, 220, -40, true, "platform_verde_2");
        const platform_verde_8 = new StaticPlatformsGroup(this, 1, 9300, this.game.config.height-280, 0, 0, true, "platform_verde_3");

        for(let i = 0; i < punzoni_2.list.length; i++) {
            punzoni_2.list[i].flipY = true;
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

        // Recuperiamo il riferimento al tasto F (sara' il tasto per sparare)
        this.keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        
        //MOVING PLATFORMS
        this.movingPlatforms.push(new MovingPlatformsGroup(this, 2, 3060, 220, 95, 0, 'platform_verde_2', 1, 250, 100));
        //this.movingPlatforms.push(new MovingPlatformsGroup(this, 2, 4600, 450, 95, 0, 'platform_verde_2', 0, 250, 80));
        this.movingPlatforms.push(new MovingPlatformsGroup(this, 3, 5890, 500, 230, -20, 'column', 1, 100, 100));
        this.movingPlatforms.push(new MovingPlatformsGroup(this, 2, 7100, 510, 200, 0, 'platform_verde_2', 1, 150, 50));
        this.movingPlatforms.push(new MovingPlatformsGroup(this, 2, 7100, 480, 200, 0, 'punzoni', 1, 150, 50));
        this.movingPlatforms.push(new MovingPlatformsGroup(this, 2, 6800, this.game.config.height-460, 95, 0, 'platform_verde_2', 0, 200, 170));
       
        //#region Creazione nemici
        this.uominiGrigi = [];
        for(let i = 0; i < 1; i++) {
            this.uominiGrigi.push(this.physics.add.existing(new Enemy(this, this.player.x + 600, this.player.y, "grigi")));
            this.uominiGrigi[i].body.allowGravity = true;
            this.uominiGrigi[i].resize(); // Ridimensionamento hitbox
            this.physics.add.collider(this.uominiGrigi[i], pavement.list);
        }


       /*  this.uominiGrigi = [];
        for(let i = 0; i < 5; i++) {
            this.uominiGrigi.push(this.physics.add.existing(new Enemy(this, Math.floor(Math.random() * (pavement.list[1].x + pavement.list[1].width)), this.floorHeight)));
            this.uominiGrigi[i].body.allowGravity = true;
            this.uominiGrigi[i].resize(); // Ridimensionamento hitbox
        } */
 

        /* for(let i = 0; i < 5; i++) {
            this.uominiGrigi.push(new Enemy(this, this.movingPlatformsList[0].list[i].x, this.movingPlatformsList[0].list[i].y));
            this.physics.add.existing(this.uominiGrigi[this.uominiGrigi.length - 1]);
            this.physics.add.collider(this.uominiGrigi[this.uominiGrigi.length - 1], this.floor);
            this.physics.add.collider(this.uominiGrigi[this.uominiGrigi.length - 1], this.movingPlatformsList[0].list[i]);
            this.uominiGrigi[this.uominiGrigi.length - 1].resize(); // Ridimensionamento hitbox
        } */

        /* this.pavements.forEach(pavement => {
            this.uominiGrigi.forEach(enemy => {
                pavement.list.forEach(platform => {
                    this.physics.add.collider(enemy, platform.platform);
                });
            });
        });

        for(let k = 0; k < this.uominiGrigi.length; k++) {
            this.uominiGrigi.forEach(enemy => {
                this.physics.add.collider(this.uominiGrigi[k], enemy);
            });
        }  */
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

        //collecting flowers
        this.createflowers();     
    }

    createflowers() {
        this.flowers = this.physics.add.group({
            key: 'flower',
            repeat: 11,
            setXY: { x: 12, y: 0, stepX: 70 }
        });
    
        this.flowers.children.iterate((child) => {
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        });
        
        this.physics.add.collider(this.flowers, this.player);
        this.physics.add.collider(this.flowers, this.movingPlatforms);
        //this.physics.add.collider(this.flowers, this.StaticPlatformsGroup);
        //this.physics.add.collider(this.flowers, this.platform);

        this.physics.add.overlap(this.player, this.flowers, collectFlowers, null, this);

        function collectFlowers (player, flower)
        {
            flower.disableBody(true, true);
        }
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

        if(this.keyF.isDown && timeFromPreviousFlower > minTimeBetweenFlowers) {
            this.lastFlower = this.time.now; // Salvo il tempo in cui è stato lanciato l'ultimo fiore

            // Creo un fiore
            this.flower = new Flower(this, this.player.x + this.player.body.width * 2, this.player.y - this.player.body.height / 2, 10, this.player.flipX);
            this.flower.setDepth(0);
            this.isFlowerActive = true;
            
            this.flower.fire(); // Lo lancio
        }

        for(let i = 0; i < this.uominiGrigi.length; i++) {
            if(this.isFlowerActive && Phaser.Geom.Intersects.RectangleToRectangle(this.flower.body, this.uominiGrigi[i].body) && this.uominiGrigi[i].isEvil) {
                this.uominiGrigi[i].cure(this.flower);
                this.isFlowerActive = false;
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

    animateBackground() {
        this.background.x = - this.cameras.main.scrollX * 0.5;
        this.nuvole.x = - this.cameras.main.scrollX * 0.7;
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