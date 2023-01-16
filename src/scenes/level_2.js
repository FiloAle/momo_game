import Player from "../components/player.js"
import Flower from "../components/flower.js"
import StaticPlatformsGroup from "../components/staticPlatformsGroup.js";
import MovingPlatformsGroup from "../components/movingPlatformsGroup.js";
import Enemy from "../components/enemy.js";
import FlowersGroup from "../components/flowersGroup.js";

export default class Level2 extends Phaser.Scene {

    background;         // oggetto relativo all'elemento "sfondo"
    player;             // oggetto relativo all'elemento "giocatore"
    floorHeight;        // Altezza del terreno (asse y) rispetto al riquadro di gioco
    lastFlower;         // Tempo dall'ultimo fiore lanciato
    isCameraFollowingPlayer;
    updates;
    playerStartedMoving;
    lastLivesDecrement;
    movingPlatforms;
    collectableFlowers;

    constructor() {
        // Il costruttore della classe base Phaser.Scene prende come argomento il nome della scena
        super("level_2");
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
        this.collectableFlowers = [];
        this.movingPlatforms = [];
    }

    preload() {
        console.log("test_scene_2 - Executing preload()");
        // Carichiamo gli asset grafici
        this.load.image("bg_l1", "assets/images/background/bg_l1.png"); // carica l'immagine di sfondo
        this.load.image("nuvole", "assets/images/background/nuvole.png"); 

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
        this.load.image("column_2", "assets/images/environment_elements/column_2.png");
        this.load.image("punzoni", "assets/images/environment_elements/punzoni.png");
        this.load.image("platform_base_1", "assets/images/environment_elements/platform_base_1.png");
    }

    create() {

        
        // Qui le istruzioni su cosa creare e dove nel mondo di gioco
        console.log("test_scene_2 - Executing create()");

         //#region Impostazione sfondo scena
         this.background = this.add.tileSprite(0, this.game.config.height -  this.textures.get('imagesbg_l1').getSourceImage().height - 700, this.game.width, this.textures.get('bg_l1').getSourceImage().height, "bg_l1");
         this.background.setOrigin(0, 0);
         this.background.setScrollFactor(0, 0);
 
        // this.nuvole = this.add.tileSprite(0, this.game.config.height - this.textures.get('nuvole').getSourceImage().height, this.game.width, this.textures.get('nuvole').getSourceImage().height, "nuvole");
        // this.nuvole.setOrigin(0, 0);
        // this.nuvole.setScrollFactor(0, 0);
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

        // const columns_inizio = new StaticPlatformsGroup(this, 3, 50, 552, 100, 0, false, "column");
        // const columns_banca = new StaticPlatformsGroup(this, 7, 5500, 350, 100, 0, false, "column");

        //#region Creazione player
        const thePlayer = new Player(this, 0, this.floorHeight, this.worldWidth);
        // Aggiungi il player alla fisica
        this.player = this.physics.add.existing(thePlayer);
        this.physics.add.collider(this.player, this.floor);
        //#endregion
       

        const columns_inizio = new StaticPlatformsGroup(this, 3, 30, 390, 116, 0, false, "column_2");
        const columns_banca = new StaticPlatformsGroup(this, 9, 5265, 210, 120, 0, false, "column_2");

        const punzoni = new StaticPlatformsGroup(this, 15, 6340, this.game.config.height-55, 95, -0, false, 'punzoni');   
        const columns_platform_1 = new StaticPlatformsGroup(this, 2, 2250, this.game.config.height - 105, 480, -0, true, 'column_2');
        const columns_platform_2 = new StaticPlatformsGroup(this, 2, 2505, this.game.config.height - 235, 470, -0, true, 'column_2');

        const punzoni_2 = new StaticPlatformsGroup(this, 2, 8305, this.game.config.height-55, 170, -0, false, 'punzoni');   
        const columns_platform_3 = new StaticPlatformsGroup(this, 2, 7400, this.game.config.height-140, 200, -40, true, 'column_2');
        
        const punzoni_3 = new StaticPlatformsGroup(this, 2, 8975, this.game.config.height-110, 260, -0, false, 'punzoni'); 
        const columns_platform_4 = new StaticPlatformsGroup(this, 2, 8530, this.game.config.height-185, 350, 0, true, 'column_2');
        const columns_platform_5 = new StaticPlatformsGroup(this, 2, 8655, this.game.config.height-205, 350, 0, true, 'column_2');
        const columns_platform_6 = new StaticPlatformsGroup(this, 2, 8765, this.game.config.height-215, 350, 0, true, 'column_2');
        

        const pavement = new StaticPlatformsGroup(this, 1, 0, this.game.config.height-30, this.textures.get('platform_base_1').getSourceImage().width, 0, true, 'platform_base_1');
        const pavement_2= new StaticPlatformsGroup(this, 3, 6400, this.game.config.height-30, this.textures.get('platform_base_1').getSourceImage().width, 0, true, 'platform_base_1');
        const entrata_banca = new StaticPlatformsGroup(this, 1, 5230, 500, 0, 0, true, 'platform_1');
        
        //platform casine
        const platforms_casa_1 = new StaticPlatformsGroup(this, 1, 840, this.game.config.height - 175, 2710, 30, true, 'platform_casa_1');
        const platform_casa_2 = new StaticPlatformsGroup(this, 1, 1240, this.game.config.height - 225, 2110, 30, true, 'platform_casa_2');
        
        //platform verdi
        const platforms_verde_alti_corto = new StaticPlatformsGroup(this, 2, 1570, this.game.config.height - 405, 470, -0, true, 'platform_verde_corto');
        const platforms_verde_bassi_corto = new StaticPlatformsGroup(this, 2, 1795, this.game.config.height - 235, 0, -360, true, 'platform_verde_corto');
        const platform_verde_lungo = new StaticPlatformsGroup(this, 1, 2530, this.game.config.height - 650, 0, -0, true, 'platform_verde_lungo');
        const platform_verde_3 = new StaticPlatformsGroup(this, 4, 7800, this.game.config.height - 250, 180, -90, true, 'platform_verde_corto');
        const platform_verde_4 = new StaticPlatformsGroup(this, 2, 8550, 100, 95, 0, true, 'platform_verde_corto');
       
        //platform grige
        const platforms_grigia_1 = new StaticPlatformsGroup(this, 2, 3300, this.game.config.height - 250, 790, 130, true, 'platform_grigia_1');
        const platforms_grigia_2 = new StaticPlatformsGroup(this, 2, 3900, this.game.config.height - 235, 590, -0, true, 'platform_grigia_2');
        
        //#region Posizionamento camera
        this.cameras.main.setBounds(0, 0, 10000, 720);
        this.cameras.main.startFollow(this.player); // Posizione camera centrata su player, inizia follow quando arriva a metà schermata
        this.cameras.main.setFollowOffset(-this.player.width / 4, this.game.config.height / 2);
        //#endregion

        // Recuperiamo il riferimento al tasto F (sara' il tasto per sparare)
        this.keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);


        //MOVING PLATFORMS
        this.movingPlatforms.push(new MovingPlatformsGroup(this, 1, 3598, 295, 0, -20, true, 'platform_verde_1', 1, 150, 100));
        this.movingPlatforms.push(new MovingPlatformsGroup(this, 2, 4750, 295, 300, -0, true, 'platform_verde_corto', 1, 150, 100));
        this.movingPlatforms.push(new MovingPlatformsGroup(this, 1, 4900, 575, 300, -20, true, 'platform_verde_corto', 1, -150, 100));
        this.movingPlatforms.push(new MovingPlatformsGroup(this, 1, 4900, 545, 300, -20, false, 'punzoni', 1, -150, 100));
        this.movingPlatforms.push(new MovingPlatformsGroup(this, 1, 6470, 575, 0, 0,true, 'platform_verde_corto', 0, 100, 100));
        this.movingPlatforms.push(new MovingPlatformsGroup(this, 1, 6900, 525, 0, 0, true,'platform_verde_corto', 0, -100, 100));
        this.movingPlatforms.push(new MovingPlatformsGroup(this, 1, 7100, 480, 0, 0, true,'platform_verde_corto', 1, 100, 60));
        
        
        //#region Creazione nemici
     /*    this.uominiGrigi = [];
        for(let i = 0; i < 5; i++) {
           this.uominiGrigi[i] = new Enemy(this, Math.floor(Math.random() * 10000) - 700, this.floorHeight);
           this.physics.add.existing(this.uominiGrigi[i]);
           this.physics.add.collider(this.uominiGrigi[i], this.floor);
           this.uominiGrigi[i].resize(); // Ridimensionamento hitbox
        } */
 
        /* for(let i = 0; i < 5; i++) {
            this.uominiGrigi.push(new Enemy(this, this.movingPlatformsList[0].list[i].x, this.movingPlatformsList[0].list[i].y));
            this.physics.add.existing(this.uominiGrigi[this.uominiGrigi.length - 1]);
            this.physics.add.collider(this.uominiGrigi[this.uominiGrigi.length - 1], this.floor);
            this.physics.add.collider(this.uominiGrigi[this.uominiGrigi.length - 1], this.movingPlatformsList[0].list[i]);
            this.uominiGrigi[this.uominiGrigi.length - 1].resize(); // Ridimensionamento hitbox
        } */

       /*  for(let k = 0; k < this.uominiGrigi.length; k++) {
            this.uominiGrigi.forEach(enemy => {
                this.physics.add.collider(this.uominiGrigi[k], enemy);
            });
        } */
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
    


    /*      //timer
         this.startTime = new Date();
         this.totalTime = 120;
         this.timeElapsed = 0;
         this.createTimer();
         this.gameTimer = game.time.events.loop(100, function(){
             this.updateTimer();
         }); */

    }


    update() {
        // Azioni che vengono eseguite a ogni frame del gioco
        this.player.manageMovements(this.movingPlatforms);
        this.animateBackground();
        this.updateMovingPlatforms();
        this.manageFlowersOverlap();
        //this.createTimer();
        //this.updateTimer();

        if(this.player.body.y > this.game.config.height) {
            this.player.die();
            this.updateLives();
        }

        // if (me.timeElapsed >= me.totalTime) {
        //     //Do what you need to do
        //   }
    }

    createFlowers() {
        /* for(let i = 0; i < 10; i++) {
            this.collectableFlowers.push(new Flower(this, i * 160 + 160, this.floorHeight - 100, "animated_flower"));
        } */

        this.collectableFlowers.push(new FlowersGroup(this, 5, 200, this.floorHeight - 50, 160, 0, "animated_flower"));

        for(let i = 0; i < this.collectableFlowers.length; i++) {
            for(let k = 0; k < this.collectableFlowers[i].list.length; k++) {
                this.collectableFlowers[i].list[k].body.setAllowGravity(false);
            }
        }

        /* this.collectableFlowers.forEach(flowersGroup => {
            flowersGroup.list.foreach(flower => {
                flower.body.setAllowGravity(false);
            })
            //flower.body.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        }); */

        //this.physics.add.collider(this.flowers, this.player);

        /* for(let i = 0; i < this.collectableFlowers.length; i++) {
            for(let k = 0; k < this.movingPlatforms.length; k++) {
                this.physics.add.collider(this.collectableFlowers[i], this.movingPlatforms[k].list);
            }
            
            for(let k = 0; k < this.staticPlatforms.length; k++) {
                if(this.staticPlatforms[k].solid) {
                    this.physics.add.collider(this.collectableFlowers[i], this.staticPlatforms[k].list);
                }
            }
        } */
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

/*     createTimer() {
        this.timeLabel = this.add.text(100, 100, "00:00", {fontSize: 36});
        //this.timeLabel.anchor.setTo(0.5, 0);
        //this.timeLabel.align = 'center';
    }

    updateTimer() {
        var currentTime = new Date();
        var timeDifference = this.startTime.getTime() - currentTime.getTime();
        //Time elapsed in seconds
        this.timeElapsed = Math.abs(timeDifference / 1000);
        //Time remaining in seconds
        var timeRemaining = this.totalTime - this.timeElapsed;
        //Convert seconds into minutes and seconds
        var minutes = Math.floor(timeRemaining / 60);
        var seconds = Math.floor(timeRemaining) - (60 * minutes);
        //Display minutes, add a 0 to the start if less than 10
        var result = (minutes < 10) ? "0" + minutes : minutes;
        //Display seconds, add a 0 to the start if less than 10
        result += (seconds < 10) ? ":0" + seconds : ":" + seconds;
        this.timeLabel.text = result;
    } */

}