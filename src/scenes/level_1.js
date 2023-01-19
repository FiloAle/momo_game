import Player from "../components/player.js"
import Flower from "../components/flower.js"
import FlowersGroup from "../components/flowersGroup.js";
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
    lastLivesDecrement;
    nuvole;
    collectableFlowers;
    movingPlatforms;
    staticPlatforms;

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
        this.isFlowerActive = false;
        this.collectableFlowers = [];
        this.movingPlatforms = [];
        this.staticPlatforms = [];
    }

    preload() {
        console.log("test_scene_2 - Executing preload()");
        // Carichiamo gli asset grafici
        this.load.image("bg_l1", "assets/images/background/sfondo1-colore.jpg"); // carica l'immagine di sfondo
        this.load.image("nuvole", "assets/images/background/bg_2.png"); 

        this.load.image("mushroom2", "assets/images/environment_elements/mushroom_2.png");
        this.load.image("platform_verde_1", "assets/images/environment_elements/platform_verde_1.png");
        this.load.image("platform_verde_corto", "assets/images/environment_elements/platform_verde_2.png");
        this.load.image("platform_verde_lungo", "assets/images/environment_elements/platform_verde_3.png");
        this.load.image("platform_1", "assets/images/environment_elements/platform_1.png");

        this.load.image("platform_casa_1", "assets/images/environment_elements/platform_casa_1.png");
        this.load.image("platform_casa_2", "assets/images/environment_elements/platform_casa_2.png");
        this.load.image("platform_grigia_1", "assets/images/environment_elements/platform_grigia_1.png");
        this.load.image("platform_grigia_2", "assets/images/environment_elements/platform_grigia_2.png");
        this.load.image("column", "assets/images/environment_elements/column_2.png");
        this.load.image("punzoni", "assets/images/environment_elements/punzone_2.png");

        this.load.image("platform_2", "assets/images/environment_elements/platform_2.png");
        this.load.image("column", "assets/images/environment_elements/column.png");
        
        //platform semplice 3D grigia
        this.load.image("platform_3d_1", "assets/images/environment_elements/platform/1.png");
        
        //platforl 
        this.load.image("platform_3d_3", "assets/images/environment_elements/platform/3.png");

        //platform semplice 3D marrone
        this.load.image("platform_3d_4", "assets/images/environment_elements/platform/4.png");



        this.load.image("punzoni", "assets/images/environment_elements/punzoni.png");
        this.load.image("platform_3", "assets/images/environment_elements/platform_3.png");
        this.load.image("platform_verde_3", "assets/images/environment_elements/platform_verde_3.png");
        this.load.image("flowers", "assets/images/environment_elements/mushroom_1.png");


        //sfondi platform
        this.load.image("sfondo_1", "assets/images/environment_elements/sfondi_platform/sfondo_1.png");
        this.load.image("sfondo_2", "assets/images/environment_elements/sfondi_platform/sfondo_2.png");
        this.load.image("sfondo_3", "assets/images/environment_elements/sfondi_platform/sfondo_3.png");

    }

    create() {
        // Qui le istruzioni su cosa creare e dove nel mondo di gioco
        console.log("test_scene_2 - Executing create()");

        //#region Impostazione sfondo scena
        this.background = this.add.image(0, 0, "bg_l1");
        this.background.setScale(0.75, 1);
        this.background.setOrigin(0, 0);
        this.background.setScrollFactor(0, 0);

        this.nuvole = this.add.image(0, 0, "nuvole");
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

        //#region Creazione player
        // Aggiungi il player alla fisica
        this.player = this.physics.add.existing(new Player(this, 4000, this.floorHeight, this.worldWidth));
        //this.physics.add.collider(this.player, this.floor);
        //#endregion
        
       
        //pavimento 2D
        this.staticPlatforms.push(new StaticPlatformsGroup(this, 18, 0, 690, this.textures.get('platform_1').getSourceImage().width, 0, true, 'platform_1'));

        //colonne inizio 
        this.staticPlatforms.push(new StaticPlatformsGroup(this, 3, 20, this.staticPlatforms[0].list[0].y - this.textures.get('column').getSourceImage().height, 116, 0, false, "column"));

        //platform tutorial
        this.staticPlatforms.push(new StaticPlatformsGroup(this, 1, 900, this.game.config.height-170, 250, 0, true, "platform_3d_1"));


        //platform 1 e 2 + sfondo 1 (giallo)
        this.staticPlatforms.push(new StaticPlatformsGroup(this, 1, 1700, 60, 0, 0, false, "sfondo_1"));
        this.staticPlatforms.push(new StaticPlatformsGroup(this, 2, 1570, this.game.config.height-180, 250, -40, true, "platform_3d_1"));
        this.staticPlatforms.push(new StaticPlatformsGroup(this, 1, 2038, this.game.config.height-243, 250, -40, true, "platform_3d_3"));
        
        //platform marrone piccola + sfondo 2 (marrone) + platform bordeaux
        this.staticPlatforms.push(new StaticPlatformsGroup(this, 1, 3250, this.game.config.height-220, 0, 0, true, "platform_3d_4"));
        this.staticPlatforms.push(new StaticPlatformsGroup(this, 1, 3400, 306, 0, 0, false, "sfondo_2"));

        //platform doppia marrone
        this.staticPlatforms.push(new StaticPlatformsGroup(this, 2, 4150, this.game.config.height-230, 80, 0, true, "platform_3d_4"));
        
        //gru, platform grigia base e platform grigia lunga dietro
        this.staticPlatforms.push(new StaticPlatformsGroup(this, 1, 4400, 285, 0, 0, false, "sfondo_3"));
        this.staticPlatforms.push(new StaticPlatformsGroup(this, 2, 4670, this.game.config.height-600, 0, 0, true, "platform_3d_1"));


        //this.staticPlatforms.push(new StaticPlatformsGroup(this, 2, this.staticPlatforms[0].list[this.staticPlatforms[0].list.length - 1].x + this.staticPlatforms[0].list[this.staticPlatforms[0].list.length - 1].width, 500, 1000, 100, true, 'platform_3'));
        // this.staticPlatforms.push(new StaticPlatformsGroup(this, 2, 1070, 500, 200, 0, true, "platform_2"));
        // this.staticPlatforms.push(new StaticPlatformsGroup(this, 2, 2550, this.game.config.height-250, 90, 0, false, "punzoni"));
        // this.staticPlatforms.push(new StaticPlatformsGroup(this, 2, 2200, this.staticPlatforms[0].list[0].y -120, 400, -160, true, "platform_verde_2"));
        // this.staticPlatforms.push(new StaticPlatformsGroup(this, 1, 3600, this.staticPlatforms[0].list[0].y -230, 250, 0, true, "platform_verde_2"));
        // this.staticPlatforms.push(new StaticPlatformsGroup(this, 3, 4060, this.game.config.height-130, 220, -30, true, "column"));
        // this.staticPlatforms.push(new StaticPlatformsGroup(this, 1, 5200, 600, 0, 0, true, 'platform_3'));
        // this.staticPlatforms.push(new StaticPlatformsGroup(this, 2, 6550, 400, 0, 100, true, "platform_2"));
        // this.staticPlatforms.push(new StaticPlatformsGroup(this, 3, 7000, this.game.config.height-150, 200, 0, true, "platform_verde_2"));
        // this.staticPlatforms.push(new StaticPlatformsGroup(this, 2, 7600, this.game.config.height-500, 0, 310, true, "platform_verde_3"));
        // this.staticPlatforms.push(new StaticPlatformsGroup(this, 3, 7640, this.game.config.height-490, 400, 0, false, "punzoni"));
        // this.staticPlatforms.push(new StaticPlatformsGroup(this, 2, 7900, this.game.config.height-215, 400, 0, false, "punzoni"));
        // this.staticPlatforms.push(new StaticPlatformsGroup(this, 3, 8650, this.game.config.height-190, 220, -40, true, "platform_verde_2"));
        // this.staticPlatforms.push(new StaticPlatformsGroup(this, 1, 9300, this.game.config.height-280, 0, 0, true, "platform_verde_3"));

        // for(let i = 0; i < this.staticPlatforms[1].list.length; i++) {
        //     this.staticPlatforms[1].list[i].flipY = true;
        // }

        this.pavements = [];
        this.pavements.push(this.staticPlatforms[0]);
        this.pavements.push(this.staticPlatforms[1]);

        this.player.setDepth(1);
        
        //#region Posizionamento camera
        this.cameras.main.setBounds(0, 0, 15000, 720);
        this.cameras.main.startFollow(this.player); // Posizione camera centrata su player, inizia follow quando arriva a metà schermata
        this.cameras.main.setFollowOffset(-this.player.width / 4, this.game.config.height / 2);
        //#endregion

        // Recuperiamo il riferimento al tasto F (sara' il tasto per sparare)
        this.keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        
        //MOVING PLATFORMS
        /* this.movingPlatforms.push(new MovingPlatformsGroup(this, 2, 3060, 100, 95, 0, true, 'platform_verde_2', 1, 250, 100));
        this.movingPlatforms.push(new MovingPlatformsGroup(this, 2, 4600, 450, 95, 0, true, 'platform_verde_2', 0, 250, 80));
        this.movingPlatforms.push(new MovingPlatformsGroup(this, 3, 5890, 500, 230, -20, true, 'column', 1, 100, 100));
        this.movingPlatforms.push(new MovingPlatformsGroup(this, 2, 7100, 510, 200, 0, true, 'platform_verde_2', 1, 150, 50));
        this.movingPlatforms.push(new MovingPlatformsGroup(this, 2, 7100, 480, 200, 0, false, 'punzoni', 1, 150, 50));
        this.movingPlatforms.push(new MovingPlatformsGroup(this, 2, 6800, this.game.config.height-460, 95, 0, true, 'platform_verde_2', 0, 200, 170)); */
       
        //#region Creazione nemici
        this.uominiGrigi = [];
        for(let i = 0; i < 1; i++) {
            this.uominiGrigi.push(this.physics.add.existing(new Enemy(this, this.player.x + 600, this.player.y, "grigi")));
            this.uominiGrigi[i].body.allowGravity = true;
            this.uominiGrigi[i].resize(); // Ridimensionamento hitbox
            for(let k = 0; k < this.pavements.length; k++) {
                this.physics.add.collider(this.uominiGrigi[i], this.pavements[k].list);
            }   
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
        this.createFlowers();     
    }

    update() {
        // Azioni che vengono eseguite a ogni frame del gioco
        this.player.manageMovements(this.movingPlatforms);
        this.animateBackground();
        this.manageFlowersLaunch();
        this.manageFlowersOverlap();
        this.manageEnemies();
        this.updateMovingPlatforms();

        //console.log(this.player.body.angle);
        
        if(this.player.body.y > this.game.config.height) {
            console.log(this.player.x);
            this.player.die();
            this.updateLives();
        }
    }

    createFlowers() {
        /* for(let i = 0; i < 10; i++) {
            this.collectableFlowers.push(new Flower(this, i * 160 + 160, this.floorHeight - 100, "animated_flower"));
        } */

        this.collectableFlowers.push(new FlowersGroup(this, 3, 1100, this.floorHeight - 70, 150, 0, "animated_flower"));

        //To do: sposta setAllowGravity(false) 
        for(let i = 0; i < this.collectableFlowers.length; i++) {
            for(let k = 0; k < this.collectableFlowers[i].list.length; k++) {
                this.collectableFlowers[i].list[k].body.setAllowGravity(false);
            }
        }
        //this.physics.add.collider(this.flowers, this.platform);
    }

    manageFlowersOverlap() {
        for(let i = 0; i < this.collectableFlowers.length; i++) {
            for(let k = 0; k < this.collectableFlowers[i].list.length; k++) {
                if(Phaser.Geom.Intersects.RectangleToRectangle(this.collectableFlowers[i].list[k].body, this.player.body)) {
                    this.collectableFlowers[i].list[k].destroy(true);
                    this.collectableFlowers[i].list.splice(k, 1);
                }
            }
        }
    }

    manageFlowersLaunch() {
        const minTimeBetweenFlowers = 500;    // Tempo minimo (in ms) tra un fiore e l'altro
        const timeFromPreviousFlower = this.time.now - this.lastFlower;

        if(this.keyF.isDown && timeFromPreviousFlower > minTimeBetweenFlowers) {
            this.lastFlower = this.time.now; // Salvo il tempo in cui è stato lanciato l'ultimo fiore

            // Creo un fiore
            this.flower = new Flower(this, this.player.x + this.player.body.width * (3/2), this.player.y - this.player.body.height / 2,"animated_flower", 10, this.player.flipX);
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

        if(this.player.x != this.player.initialX) {
            for(let i = 0; i < this.uominiGrigi.length; i++) {
                this.uominiGrigi[i].manageMovements();
            }
        }
    }

    updateMovingPlatforms() {
        this.updates++;
        for(let i = 0; i < this.movingPlatforms.length; i++)
        {
            if(this.updates % this.movingPlatforms[i].duration == 0) {
                this.movingPlatforms[i].updateMovingPlatforms();
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