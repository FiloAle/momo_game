import Player from "../components/player.js"
import Flower from "../components/flower.js"
import StaticPlatformsGroup from "../components/staticPlatformsGroup.js";
import MovingPlatformsGroup from "../components/movingPlatformsGroup.js";
import Enemy from "../components/enemy.js";
import FlowersGroup from "../components/flowersGroup.js";
import Platform from "../components/platform.js";

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
    staticPlatforms;
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
        this.worldWidth = 14000;
        this.lastFlower = 0;
        this.updates = 0;
        this.lastLivesDecrement = 0;
        this.playerStartedMoving = false;
        this.isFlowerActive = false;
        this.collectableFlowers = [];
        this.movingPlatforms = [];
        this.staticPlatforms = [];
    }

    preload() {
        console.log("test_scene_2 - Executing preload()");
        // Carichiamo gli asset grafici
        this.load.image("bg_city_l2", "assets/images/background/bg_city_l2.jpg"); // carica l'immagine di sfondo
        this.load.image("nuvole", "assets/images/background/nuvole.png"); 

        this.load.image("platform_verde_1", "assets/images/environment_elements/old/platform_verde_1.png");
        this.load.image("platform_verde_corto", "assets/images/environment_elements/platform/level_2/p_cassetto.png");
        this.load.image("platform_verde_lungo", "assets/images/environment_elements/old/platform_verde_3.png");
        this.load.image("platform_1", "assets/images/environment_elements/old/platform_1.png");
        this.load.image("platform_grigia_1", "assets/images/environment_elements/old/platform_grigia_1.png");
        this.load.image("platform_grigia_2", "assets/images/environment_elements/old/platform_grigia_2.png");
        this.load.image("punzoni", "assets/images/environment_elements/old/punzoni.png");
        this.load.image("platform_base_1", "assets/images/environment_elements/pavement.png");

        //DEFINITIVE
        this.load.image("p.dune_1", "assets/images/environment_elements/platform/level_2/dune.2.png");
        //this.load.image("p_torre_basso", "assets/images/environment_elements/platform/level_2/p_torre_basso.png");
        //this.load.image("p_torre_media", "assets/images/environment_elements/platform/level_2/p_torre_media.png");
        this.load.image("p_torre_lunga", "assets/images/environment_elements/platform/level_2/p_dune.grande.png");
        this.load.image("p_torretta", "assets/images/environment_elements/platform/level_2/p_torretta.png");
        this.load.image("p_2verde_lego", "assets/images/environment_elements/platform/level_2/p_2verde_lego.png");
        this.load.image("p_torre2", "assets/images/environment_elements/platform/level_2/p_torre2.png");
        this.load.image("p_torretta_double", "assets/images/environment_elements/platform/level_2/p_torretta_double.png");
        this.load.image("p_hidden_2", "assets/images/environment_elements/platform/p_hidden_2.png");
        this.load.image("p_hidden", "assets/images/environment_elements/platform/p_hidden.png");
        this.load.image("p_column_hora", "assets/images/environment_elements/platform/level_2/p_column_hora.png");
        this.load.image("p_column_hora_2", "assets/images/environment_elements/platform/level_2/p_column_hora_2.png");
        this.load.image("p_2beige_lego", "assets/images/environment_elements/platform/level_2/p_2beige_lego.png");
        this.load.image("p_neutral_beige", "assets/images/environment_elements/platform/level_2/p_neutral_beige.png"); 
        this.load.image("p_2neutre_lego", "assets/images/environment_elements/platform/level_2/p_2neutre_lego.png"); 

        this.load.image("p_grigio_lego", "assets/images/environment_elements/platform/p_grigio_lego.png");
        this.load.image("p_entrata_banca", "assets/images/environment_elements/platform/level_2/p_entrata_banca.png");
        this.load.image("p_base_banca", "assets/images/environment_elements/platform/level_2/p_base_banca.png");

        this.load.image("p_balaustra_hidden", "assets/images/environment_elements/platform/level_2/p_balaustra_hidden.png");
        this.load.image("p_balaustra_scala_hidden", "assets/images/environment_elements/platform/level_2/p_balaustra_scala_hidden.png");
        this.load.image("p_balaustra_scala", "assets/images/environment_elements/platform/level_2/p_balaustra_scala.png");
        this.load.image("p_balaustra", "assets/images/environment_elements/platform/level_2/p_balaustra.png");

        
        this.load.image("b_finestre", "assets/images/environment_elements/platform/level_2/b_finestre.png");
        this.load.image("p_pilastro", "assets/images/environment_elements/platform/level_2/p_pilastro.png");
        

        this.load.image("p_mattoncini", "assets/images/environment_elements/platform/level_2/mattoncini.png");
        
    }

    create() {

        
        // Qui le istruzioni su cosa creare e dove nel mondo di gioco
        console.log("test_scene_2 - Executing create()");

         //#region Impostazione sfondo scena
        this.background = this.add.image(0, 0, "bg_city_l2");
        this.background.setOrigin(0, 0);
        this.background.setScale(0.75,1);
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
        this.physics.add.existing(this.floor, true);  
        //#endregion
        
        //#region Creazione player
        const thePlayer = new Player(this, 0, this.floorHeight, this.worldWidth);
        // Aggiungi il player alla fisica
        this.player = this.physics.add.existing(new Player(this, 2800, this.floorHeight, this.worldWidth));
        this.physics.add.collider(this.player, this.floor);
        //#endregion

        //platform verdi dune
        this.staticPlatforms.push(new StaticPlatformsGroup(this, 2, 2060, this.game.config.height - 360, 470, -0, true, 'platform_verde_corto'));
        this.staticPlatforms.push(new StaticPlatformsGroup(this, 2, 2295, this.game.config.height - 220, 0, -350, true, 'platform_verde_corto'));
       
       //DUNA GRANDE DOPO LE 4
       this.staticPlatforms.push(new StaticPlatformsGroup(this, 1, 2775, this.game.config.height - 560, 0, -0, true, 'p_hidden'));
       this.staticPlatforms[this.staticPlatforms.length-1].list.forEach(platform => {
        platform.setScale(1.9, 1);
        });
       this.staticPlatforms.push(new StaticPlatformsGroup(this, 1, 2645, this.game.config.height - 570, 0, -0, false, 'p_torre_lunga'));
       this.player.setDepth(2); 
        
        //4 DUNE
        this.staticPlatforms.push(new StaticPlatformsGroup(this, 1, 1920, 180, 0, 0, false, 'p.dune_1'));
        /* this.staticPlatforms.push(new StaticPlatformsGroup(this, 2, 1900, this.game.config.height - 335, 475, 0, false, 'p_torre_media'));
        this.staticPlatforms.push(new StaticPlatformsGroup(this, 1, 1956, this.game.config.height - 205, 0, 0, false, 'p_torre_basso')); */

        //torrette verdi come colonne
        this.staticPlatforms.push(new StaticPlatformsGroup(this, 2, 2770, this.game.config.height - 90, 440, 0, true, 'p_torretta'));
        this.staticPlatforms.push(new StaticPlatformsGroup(this, 2, 2750, this.game.config.height - 130, 440, 0, true, 'p_2verde_lego'));
        this.staticPlatforms.push(new StaticPlatformsGroup(this, 2, 3000, this.game.config.height - 220, 430, 0, true, 'p_torretta'));
        this.staticPlatforms.push(new StaticPlatformsGroup(this, 2, 2980, this.game.config.height - 260, 430, 0, true, 'p_2verde_lego'));

        //platform torrette gialle 
        this.staticPlatforms.push(new StaticPlatformsGroup(this, 2, 3610, this.game.config.height - 370, 490, -85, false, 'p_torre2'));
        this.staticPlatforms[this.staticPlatforms.length-1].list.forEach(platform => {
            platform.setDepth(2);
        });
        this.staticPlatforms.push(new StaticPlatformsGroup(this, 2, 3610, this.game.config.height - 105, 490, -85, true, 'p_hidden_2'));
        this.staticPlatforms[this.staticPlatforms.length-1].list.forEach(platform => {
            platform.setScale(0.70, 0.70);
        });

        this.movingPlatforms.push(new MovingPlatformsGroup(this, 1, 3880, this.game.config.height - 220, 0, 0, false, 'p_torretta_double',1, 60, 100));
        this.movingPlatforms.push(new MovingPlatformsGroup(this, 2, 3887, this.game.config.height - 250, 0, 0, true, 'p_2verde_lego',1, 60, 100));
  
        //colonne dopo torretta
        this.staticPlatforms.push(new StaticPlatformsGroup(this, 3, 4446, this.game.config.height - 130, 460, 0, true, 'p_column_hora'));
        //this.staticPlatforms.push(new StaticPlatformsGroup(this, 8, 4390, this.game.config.height - 170, 155, 0, true, 'p_2beige_lego'));

        //this.staticPlatforms.push(new StaticPlatformsGroup(this, 3, 4446, this.game.config.height - 450, 460, 0, true, 'p_column_hora_2'));
        this.staticPlatforms.push(new StaticPlatformsGroup(this, 2, 4670, this.game.config.height - 320, 460, 0, true, 'p_2beige_lego'));
        
       //this.staticPlatforms.push(new StaticPlatformsGroup(this, 2, 4700, this.game.config.height - 550, 450, 0, true, 'p_column_hora_2'));
        this.movingPlatforms.push(new MovingPlatformsGroup(this, 1, 4600, this.game.config.height - 450, 450, 0, true, 'p_2beige_lego',0, 400, 150)); 

        //
        this.staticPlatforms.push(new StaticPlatformsGroup(this, 1, 5700, this.game.config.height - 220, 0, 0, true, 'p_neutral_beige'));
        //this.staticPlatforms.push(new StaticPlatformsGroup(this, 1, 5700, this.game.config.height - 250, 0, 0, true, 'p_2neutre_lego'));

        this.staticPlatforms.push(new StaticPlatformsGroup(this, 1, 6050, this.game.config.height - 357, 0, 0, true, 'p_torretta_double'));
        this.staticPlatforms.push(new StaticPlatformsGroup(this, 2, 6370, this.game.config.height - 240, 330, -50, true, 'p_neutral_beige'));
        //this.staticPlatforms.push(new StaticPlatformsGroup(this, 1, 5700, this.game.config.height - 250, 0, 0, true, 'p_2neutre_lego'));

        this.movingPlatforms.push(new MovingPlatformsGroup(this, 2, 5890, 265, 340, -0, false, 'punzoni', 1, 150, 100));
        this.movingPlatforms.push(new MovingPlatformsGroup(this, 2, 5900, 295, 320, -0, true, 'p_2verde_lego', 1, 150, 100));
        this.movingPlatforms.push(new MovingPlatformsGroup(this, 1, 6540, 545, 0, 0, false, 'punzoni', 1, -150, 100));
        this.movingPlatforms.push(new MovingPlatformsGroup(this, 1, 6555, 575, 0, 0, true, 'p_2verde_lego', 1, -150, 100));
        this.movingPlatforms.push(new MovingPlatformsGroup(this, 1, 6935, 550, 0, 0, true, 'p_grigio_lego', 0, 100, 80));

        //PAVIMENTO (X 40 per allungare il livello, poi sarà da spostare)
       /*  this.staticPlatforms.push(new StaticPlatformsGroup(this, 40, 0, this.game.config.height-30, this.textures.get('platform_base_1').getSourceImage().width, 0, true, 'platform_base_1'));
        this.staticPlatforms.push(new StaticPlatformsGroup(this, 3, 6400, this.game.config.height-30, this.textures.get('platform_base_1').getSourceImage().width, 0, true, 'platform_base_1'));
         */
        //INGRESSO BANCA
        this.staticPlatforms.push(new StaticPlatformsGroup(this, 2, 7500, 348, 250, -160, true, 'p_balaustra_scala_hidden'));
        this.staticPlatforms[this.staticPlatforms.length-1].list.forEach(platform => {
            platform.setScale(0.88, 0.88);
        });
        this.staticPlatforms.push(new StaticPlatformsGroup(this, 1, 7238, 0, 0, 0, false, "p_entrata_banca"));
        this.staticPlatforms[this.staticPlatforms.length-1].list.forEach(platform => {
            platform.setScale(0.88, 0.88);
            platform.setDepth(2);

        });
        this.staticPlatforms.push(new StaticPlatformsGroup(this, 1, 7238, 550, 0, 0, true, 'p_base_banca'));
        this.staticPlatforms[this.staticPlatforms.length-1].list.forEach(platform => {
            platform.setScale(0.88, 1);
            platform.setDepth(1);

        });
        //pavimento banca
        this.staticPlatforms.push(new StaticPlatformsGroup(this, 8, 8280, this.game.config.height-30, 1055, 0, true, 'p_base_banca'));

        //punzoni parte difficile
        this.staticPlatforms.push(new StaticPlatformsGroup(this, 16, 8250, this.game.config.height-55, 95, -0, false, 'punzoni'));
        
        //SCALETTA BANCA con 2 colonne prima
        this.staticPlatforms.push(new StaticPlatformsGroup(this, 2, 9300, this.game.config.height-140, 230, -40, true, 'p_pilastro'));

        this.staticPlatforms.push(new StaticPlatformsGroup(this, 3, 9750, this.game.config.height - 240, 210, -90, true, 'p_balaustra_scala_hidden'));
        this.staticPlatforms[this.staticPlatforms.length-1].list.forEach(platform => {
            platform.setScale(0.75, 0.75);
        });
        this.staticPlatforms.push(new StaticPlatformsGroup(this, 3, 9750, this.game.config.height - 330, 210, -90, false, 'p_balaustra_scala'));
        this.staticPlatforms[this.staticPlatforms.length-1].list.forEach(platform => {
            platform.setScale(0.75, 0.75);
            platform.setDepth(2);
        });
        this.staticPlatforms.push(new StaticPlatformsGroup(this, 1, 10400, 250, 100, 0, true, 'p_balaustra_hidden'));
        this.staticPlatforms[this.staticPlatforms.length-1].list.forEach(platform => {
            platform.setScale(0.75, 0.75);
        });
        this.staticPlatforms.push(new StaticPlatformsGroup(this, 1, 10400, 155, 100, 0, false, 'p_balaustra'));
        this.staticPlatforms[this.staticPlatforms.length-1].list.forEach(platform => {
            platform.setScale(0.75, 0.75);
            platform.setDepth(2);
        });

        //COLONNE FINALI 
        this.staticPlatforms.push(new StaticPlatformsGroup(this, 2, 11338, this.game.config.height-235, 450, -0, false, 'punzoni'));
        this.staticPlatforms.push(new StaticPlatformsGroup(this, 2, 11030, this.game.config.height-185, 470, 0, true, 'p_pilastro'));
        this.staticPlatforms.push(new StaticPlatformsGroup(this, 2, 11180, this.game.config.height-305, 450, 0, true, 'p_pilastro'));
        this.staticPlatforms.push(new StaticPlatformsGroup(this, 2, 11340, this.game.config.height-215, 450, 0, true, 'p_pilastro'));

        //MATTONCINI BANCA DEL TEMPO
        //this.staticPlatforms.push(new StaticPlatformsGroup(this, 3, 8410, 0, 6100, 0, false, 'p_mattoncini'));
         //finestra
      /*    this.staticPlatforms.push(new StaticPlatformsGroup(this, 2, 10970, 0, 0, 0, false, 'b_finestre'));

        this.player.setDepth(1); */
        
        //#region Posizionamento camera
        this.cameras.main.setBounds(0, 0, 14000, 720);
        this.cameras.main.startFollow(this.player); // Posizione camera centrata su player, inizia follow quando arriva a metà schermata
        this.cameras.main.setFollowOffset(-this.player.width / 4, this.game.config.height / 2);
        //#endregion

        // Recuperiamo il riferimento al tasto F (sara' il tasto per sparare)
        this.keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);

        this.movingPlatforms.push(new MovingPlatformsGroup(this, 1, 8470, 575, 0, 0,true, 'platform_verde_corto', 0, 100, 100));
        this.movingPlatforms.push(new MovingPlatformsGroup(this, 1, 8900, 525, 0, 0, true,'platform_verde_corto', 0, -100, 100));
        this.movingPlatforms.push(new MovingPlatformsGroup(this, 1, 9100, 480, 0, 0, true,'platform_verde_corto', 1, 100, 60));
        
        
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
    
        this.initialTime = 90;
        this.timer = this.add.text(this.game.config.width / 2, 40, 'Countdown: ' + this.formatTime(this.initialTime), styleConfig).setOrigin(0.5, 0).setScrollFactor(0, 0);
        // Each 1000 ms call onEvent
        this.timerEvent = this.time.addEvent({ delay: 1000, callback: this.onTimerEvent, callbackScope: this, loop: true });
    }


    formatTime(seconds) {
        // Minutes
        let minutes = Math.floor(seconds / 60);
        // Seconds
        let partInSeconds = seconds % 60;
        // Adds left zeros to seconds
        partInSeconds = partInSeconds.toString().padStart(2, '0');
        // Returns formated time
        return `${minutes}:${partInSeconds}`;
    }
    
    onTimerEvent() {
        if(this.initialTime > 0) {
            this.initialTime -= 1; // One second
            this.timer.setText('Countdown: ' + this.formatTime(this.initialTime));
        } else {
            console.warn("HAI PERSO!");
            this.time.removeEvent(this.timerEvent);
        }
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

        this.collectableFlowers.push(new FlowersGroup(this, 2, 1535, this.floorHeight - 35, 100, 0, "animated_flower"));
        
        //rombo platform
        this.collectableFlowers.push(new FlowersGroup(this, 2, 2115, this.game.config.height - 430, 470, -0, "animated_flower"));
        this.collectableFlowers.push(new FlowersGroup(this, 2, 2350, this.game.config.height - 260, 0, -360, "animated_flower"));

        //platform lungo
        this.collectableFlowers.push(new FlowersGroup(this, 3, 2820, this.game.config.height - 630, 250, -0, "animated_flower"));
        //verde double 
        this.collectableFlowers.push(new FlowersGroup(this, 1, 3950, this.game.config.height - 530, 0, 0, "animated_flower"));



        //ingresso banca
        this.collectableFlowers.push(new FlowersGroup(this, 2, 7570, 270, 250, -160, "animated_flower"));

        //2 colonne e balaustra
        this.collectableFlowers.push(new FlowersGroup(this, 1, 9450, 400, 250, -160, "animated_flower"));
        this.collectableFlowers.push(new FlowersGroup(this, 3, 10500, 210, 200, 0, "animated_flower"));
        this.collectableFlowers.push(new FlowersGroup(this, 2, 11150, 350, 400, 0, "animated_flower"));
        

        //colonne alternate
       /*  this.collectableFlowers.push(new FlowersGroup( this, 2, 3450, this.game.config.height - 225, 480, -0, "animated_flower"));
        this.collectableFlowers.push(new FlowersGroup(  this, 2, 3755, this.game.config.height - 325, 470, -0, "animated_flower")); */
    

        //To do: sposta setAllowGravity(false) 
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