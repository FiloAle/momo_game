import Player from "../components/player.js"
import Flower from "../components/flower.js"
import StaticPlatformsGroup from "../components/staticPlatformsGroup.js";
import MovingPlatformsGroup from "../components/movingPlatformsGroup.js";
import Enemy from "../components/enemy.js";
import FlowersGroup from "../components/flowersGroup.js";
import PauseMenu from "../components/pauseMenu.js";
import Vault from "../components/vault.js";

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
    localFlowersCounter;

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
        this.game.gameState.level = 2;
        this.localFlowersCounter = 0;
    }

    preload() {
        console.log("test_scene_2 - Executing preload()");
        // Carichiamo gli asset grafici
        this.load.image("bg", "assets/images/background/bg_level2.png"); // carica l'immagine di sfondo
        this.load.image("stars", "assets/images/background/bg_star.png"); 
        this.load.image("bg_finestra_down", "assets/images/background/bg_finestra_down.png"); 
        this.load.image("bg_parete_banca", "assets/images/background/bg_parete_banca.png"); 

        this.load.image("platform_verde_1", "assets/images/environment_elements/old/platform_verde_1.png");
        this.load.image("platform_verde_lungo", "assets/images/environment_elements/old/platform_verde_3.png");
        this.load.image("platform_1", "assets/images/environment_elements/old/platform_1.png");
        this.load.image("platform_grigia_1", "assets/images/environment_elements/old/platform_grigia_1.png");
        this.load.image("platform_grigia_2", "assets/images/environment_elements/old/platform_grigia_2.png");
        this.load.image("platform_base_1", "assets/images/environment_elements/pavement.png");

        //DEFINITIVE
        this.load.image("bg_tree", "assets/images/background/bg_tree.png"); 
        this.load.image("p_tree", "assets/images/environment_elements/platform/p_tree.png");
        this.load.image("p_tree_2", "assets/images/environment_elements/platform/p_tree_2.png");
        this.load.image("p_tree_3", "assets/images/environment_elements/platform/p_tree_3.png");

        this.load.image("p_marrone_lego_albero", "assets/images/environment_elements/platform/p_marrone_lego_albero.png");
        this.load.image("p_marrone_lego_albero_2", "assets/images/environment_elements/platform/p_marrone_lego_albero_2.png");
        this.load.image("ringhiera", "assets/images/environment_elements/platform/ringhiera.png");
        
        this.load.image("p_cassetto", "assets/images/environment_elements/platform/level_2/p_cassetto.png");
        this.load.image("p.dune_1", "assets/images/environment_elements/platform/level_2/dune.2.png");
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
        this.load.image("p_marroncino", "assets/images/environment_elements/platform/level_2/p_marroncino.png"); 

        this.load.image("punzoni", "assets/images/environment_elements/platform/level_2/punzoni.png");
        this.load.image("p_verde_punzoni", "assets/images/environment_elements/platform/level_2/p_2verde_punzoni.png"); 
        this.load.image("p_pilastro_punzoni", "assets/images/environment_elements/platform/level_2/p_pilastro_punzoni.png"); 

        this.load.image("p_grigio_lego", "assets/images/environment_elements/platform/p_grigio_lego.png");
        this.load.image("p_entrata_banca", "assets/images/environment_elements/platform/level_2/p_entrata_banca.png");
        this.load.image("p_base_banca", "assets/images/environment_elements/platform/level_2/p_base_banca.png");
        this.load.image("p_base_interno", "assets/images/environment_elements/platform/level_2/p_base_interno.png");

        this.load.image("p_balaustra_hidden", "assets/images/environment_elements/platform/level_2/p_balaustra_hidden.png");
        this.load.image("p_balaustra_scala_hidden", "assets/images/environment_elements/platform/level_2/p_balaustra_scala_hidden.png");
        this.load.image("p_balaustra_scala", "assets/images/environment_elements/platform/level_2/p_balaustra_scala.png");
        this.load.image("p_balaustra", "assets/images/environment_elements/platform/level_2/p_balaustra.png");

        this.load.image("p_pilastro", "assets/images/environment_elements/platform/level_2/p_pilastro.png");
        
        this.load.image("pause", "assets/UI/pause_button.png");
        this.load.image("pauseLED", "assets/UI/pause_button_LED.png");
        this.load.image("flowers_box", "assets/UI/flowers_box.png");
        this.load.image("flowers_icon", "assets/UI/flower.png");
    }

    create() {

        // Qui le istruzioni su cosa creare e dove nel mondo di gioco
        console.log("test_scene_2 - Executing create()");

         //#region Impostazione sfondo scena
        this.background = this.add.image(0, 0, "bg");
        this.background.setOrigin(0, 0);
        this.background.setScale(0.75,1);
        this.background.setScrollFactor(0, 0);

        this.background = this.add.image(0, 0, "stars");
        this.background.setOrigin(0, 0);
        this.background.setScrollFactor(0, 0);

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
        const thePlayer = new Player(this, 12000, this.floorHeight, this.worldWidth);
        // Aggiungi il player alla fisica
        this.player = this.physics.add.existing(new Player(this, 100, this.game.config.height-220, this.worldWidth));
        this.physics.add.collider(this.player, this.floor);
        //#endregion

        //Alberlo e platform
        this.staticPlatforms.push(new StaticPlatformsGroup(this, 1, -150, 0, 0 , 0, false, "bg_tree"));
        this.staticPlatforms[this.staticPlatforms.length-1].list.forEach(platform => {
            platform.setFlipX(true);
            platform.setDepth(2);
        });
        this.staticPlatforms.push(new StaticPlatformsGroup(this, 2, -142, this.game.config.height-220, 300 , 0, true, "p_hidden"));
        this.staticPlatforms.push(new StaticPlatformsGroup(this, 1, 0, this.game.config.height-320, 0 , 0, false, "ringhiera"));
        this.staticPlatforms[this.staticPlatforms.length-1].list.forEach(platform => {
            platform.setScale(0.5, 0.5)
            platform.setDepth(2);
        });  
        this.staticPlatforms.push(new StaticPlatformsGroup(this, 1, 900, this.game.config.height-210, 0 , 0, true, "p_tree_2")); 
        this.staticPlatforms[this.staticPlatforms.length-1].list.forEach(platform => {
            platform.setScale(1.2,1.2);
            //platform.setFlipX(true);
        });

        this.staticPlatforms.push(new StaticPlatformsGroup(this, 2, 1410, this.game.config.height - 230, 300, -100, true, 'p_marrone_lego_albero'));
        //this.staticPlatforms.push(new StaticPlatformsGroup(this, 1, 630, this.game.config.height - 350, 300, -100, true, 'p_marrone_lego_albero'));
        this.movingPlatforms.push(new MovingPlatformsGroup(this, 1, 630, this.game.config.height-230, 0, 0, true, "p_marrone_lego_albero", 1, -100, 80));

        //platform verdi dune
        this.staticPlatforms.push(new StaticPlatformsGroup(this, 2, 2040, this.game.config.height - 375, 485, -0, true, 'p_marroncino'));
        this.staticPlatforms.push(new StaticPlatformsGroup(this, 2, 2285, this.game.config.height - 233, 0, -336, true, 'p_marroncino'));
       
       //DUNA GRANDE DOPO LE 4
       this.staticPlatforms.push(new StaticPlatformsGroup(this, 1, 2775, this.game.config.height - 560, 0, -0, true, 'p_hidden'));
       this.staticPlatforms[this.staticPlatforms.length-1].list.forEach(platform => {
        platform.setScale(2.2, 1);
        });
       this.staticPlatforms.push(new StaticPlatformsGroup(this, 1, 2640, this.game.config.height - 570, 0, -0, false, 'p_torre_lunga'));
       this.player.setDepth(2); 
        
        //4 DUNE
        this.staticPlatforms.push(new StaticPlatformsGroup(this, 1, 1920, 180, 0, 0, false, 'p.dune_1'));
        /* this.staticPlatforms.push(new StaticPlatformsGroup(this, 2, 1900, this.game.config.height - 335, 475, 0, false, 'p_torre_media'));
        this.staticPlatforms.push(new StaticPlatformsGroup(this, 1, 1956, this.game.config.height - 205, 0, 0, false, 'p_torre_basso')); */

        //torrette verdi come colonne
        this.staticPlatforms.push(new StaticPlatformsGroup(this, 2, 2800, this.game.config.height - 90, 430, 0, true, 'p_torretta'));
        this.staticPlatforms.push(new StaticPlatformsGroup(this, 2, 2780, this.game.config.height - 128, 430, 0, true, 'p_2verde_lego'));
        this.staticPlatforms.push(new StaticPlatformsGroup(this, 2, 3000, this.game.config.height - 220, 430, 0, true, 'p_torretta'));
        this.staticPlatforms.push(new StaticPlatformsGroup(this, 2, 2980, this.game.config.height - 258, 430, 0, true, 'p_2verde_lego'));

        //platform torrette gialle 
        this.staticPlatforms.push(new StaticPlatformsGroup(this, 1, 4050, this.game.config.height - 450, 490, -0, false, 'p_torre2'));
        this.staticPlatforms[this.staticPlatforms.length-1].list.forEach(platform => {
            platform.setDepth(2);
        });
        this.staticPlatforms.push(new StaticPlatformsGroup(this, 1, 4050, this.game.config.height - 205, 490, -0, true, 'p_hidden_2'));
        this.staticPlatforms[this.staticPlatforms.length-1].list.forEach(platform => {
            platform.setScale(0.70, 0.70);
        });

        this.movingPlatforms.push(new MovingPlatformsGroup(this, 1, 3600, this.game.config.height - 350, 0, 0, false, 'p_torretta_double',0, 200, 80));
        this.movingPlatforms.push(new MovingPlatformsGroup(this, 2, 3607, this.game.config.height - 360, 0, 0, true, 'p_2verde_lego',0, 200, 80));
  
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

        this.movingPlatforms.push(new MovingPlatformsGroup(this, 2, 5905, 200, 305, -0, false, 'punzoni', 1, 250, 100, true));
        this.movingPlatforms.push(new MovingPlatformsGroup(this, 2, 5900, 230, 304, -0, true, 'p_verde_punzoni', 1, 250, 100));
        this.movingPlatforms.push(new MovingPlatformsGroup(this, 1, 6560, 520, 0, 0, false, 'punzoni', 1, -250, 90, true));
        this.movingPlatforms.push(new MovingPlatformsGroup(this, 1, 6555, 550, 0, 0, true, 'p_verde_punzoni', 1, -250, 90));
        this.movingPlatforms.push(new MovingPlatformsGroup(this, 1, 6900, 550, 0, 0, true, 'p_grigio_lego', 0, 250, 50));

        //INGRESSO BANCA
        this.staticPlatforms.push(new StaticPlatformsGroup(this, 1, 4100, 0, 0, -0, false, 'bg_finestra_down'));
        this.staticPlatforms.push(new StaticPlatformsGroup(this, 1, 4098, 0, 0, -0, false, 'bg_parete_banca'));
        
        this.staticPlatforms.push(new StaticPlatformsGroup(this, 2, 7500, 340, 250, -160, true, 'p_balaustra_scala_hidden'));
        this.staticPlatforms[this.staticPlatforms.length-1].list.forEach(platform => {
            platform.setScale(0.88, 0.88);
        });
        this.staticPlatforms.push(new StaticPlatformsGroup(this, 1, 7238, 0, 0, 0, false, "p_entrata_banca"));
        this.staticPlatforms[this.staticPlatforms.length-1].list.forEach(platform => {
            platform.setScale(0.88, 0.88);
            platform.setDepth(2);

        });
        this.staticPlatforms.push(new StaticPlatformsGroup(this, 1, 7238, 540, 0, 0, true, 'p_base_banca'));
        this.staticPlatforms[this.staticPlatforms.length-1].list.forEach(platform => {
            platform.setScale(0.88, 3);
            platform.setDepth(1);

        });
        //pavimento banca
        this.staticPlatforms.push(new StaticPlatformsGroup(this, 8, 8270, this.game.config.height-30, 1055, 0, true, 'p_base_interno'));

        //punzoni parte difficile
        this.staticPlatforms.push(new StaticPlatformsGroup(this, 10, 8270, this.game.config.height-55, 106, -0, false, 'punzoni', true));
        this.staticPlatforms.push(new StaticPlatformsGroup(this, 14, 9700, this.game.config.height-55, 106, -0, false, 'punzoni', true));

        this.movingPlatforms.push(new MovingPlatformsGroup(this, 1, 8750, 575, 0, 0,true, 'p_cassetto', 0, -180, 150));
        this.movingPlatforms.push(new MovingPlatformsGroup(this, 1, 8750, 525, 0, 0, true,'p_cassetto', 0, 180, 150));
        
        //SCALETTA BANCA con 2 colonne prima
        //this.staticPlatforms.push(new StaticPlatformsGroup(this, 2, 9450, this.game.config.height-140, 230, -40, true, 'p_pilastro'));
        this.movingPlatforms.push(new MovingPlatformsGroup(this, 1, 9380, 400, 0, 0, true,'p_pilastro', 1, 200, 50));
        this.movingPlatforms.push(new MovingPlatformsGroup(this, 1, 9550, 600, 0, 0, true,'p_pilastro', 1, -200, 50));

        this.staticPlatforms.push(new StaticPlatformsGroup(this, 3, 9800, this.game.config.height - 247, 240, -90, true, 'p_balaustra_scala_hidden'));
        this.staticPlatforms[this.staticPlatforms.length-1].list.forEach(platform => {
            platform.setScale(0.75, 0.75);
        });
        this.staticPlatforms.push(new StaticPlatformsGroup(this, 3, 9800, this.game.config.height - 330, 240, -90, false, 'p_balaustra_scala'));
        this.staticPlatforms[this.staticPlatforms.length-1].list.forEach(platform => {
            platform.setScale(0.75, 0.75);
            platform.setDepth(2);
        });
        this.staticPlatforms.push(new StaticPlatformsGroup(this, 1, 10600, 238, 100, 0, true, 'p_balaustra_hidden'));
        this.staticPlatforms[this.staticPlatforms.length-1].list.forEach(platform => {
            platform.setScale(0.72, 0.75);
        });
        this.staticPlatforms.push(new StaticPlatformsGroup(this, 1, 10600, 155, 100, 0, false, 'p_balaustra'));
        this.staticPlatforms[this.staticPlatforms.length-1].list.forEach(platform => {
            platform.setScale(0.75, 0.75);
            platform.setDepth(2);
        });

        //COLONNE FINALI 
        this.staticPlatforms.push(new StaticPlatformsGroup(this, 2, 11543, this.game.config.height-243, 450, -0, false, 'punzoni', true));
        this.staticPlatforms[this.staticPlatforms.length-1].list.forEach(platform => {
            platform.setScale(0.80, 0.80);
        });
        this.staticPlatforms.push(new StaticPlatformsGroup(this, 2, 11230, this.game.config.height-185, 470, 0, true, 'p_pilastro'));
        this.staticPlatforms.push(new StaticPlatformsGroup(this, 2, 11380, this.game.config.height-305, 450, 0, true, 'p_pilastro'));
        this.staticPlatforms.push(new StaticPlatformsGroup(this, 2, 11540, this.game.config.height-215, 450, 0, true, 'p_pilastro_punzoni'));
        
        //#region Posizionamento camera
        this.cameras.main.setBounds(0, 0, 14000, 720);
        this.cameras.main.startFollow(this.player); // Posizione camera centrata su player, inizia follow quando arriva a metà schermata
        this.cameras.main.setFollowOffset(-this.player.width / 4, this.game.config.height / 2);
        //#endregion
        

        // Recuperiamo il riferimento al tasto F (sara' il tasto per sparare)
        this.keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);

        this.player.resize(); // Ridimensionamento hitbox

        this.flowersContainerBox = this.add.image(20, 15, "flowers_box").setOrigin(0, 0).setScrollFactor(0, 0).setDepth(4);
        this.flowersIcon = this.add.image(8, 6, "flowers_icon").setOrigin(0, 0).setScale(0.85).setScrollFactor(0, 0).setDepth(4);

        const styleConfig = { color: '#FFFFFF', fontFamily: 'Montserrat', fontSize: 36 };

        this.lifeBox = this.add.text(this.game.config.width / 2, 46, "Lives: " + this.game.gameState.lives, styleConfig).setOrigin(0.5, 0).setScrollFactor(0, 0).setDepth(4);

        this.flowersBox = this.add.text(150, 46, (this.game.gameState.flowersCounter), styleConfig).setOrigin(0, 0).setScrollFactor(0, 0).setDepth(5);

        this.pauseButton = this.add.image(this.game.config.width - 70, 60, "pause").setOrigin(0.5, 0.5).setScrollFactor(0, 0).setScale(0.5).setDepth(4);
        this.pauseButton.setInteractive({ useHandCursor: true });

        this.pauseLED = this.add.image(this.game.config.width - 70, 60, "pauseLED").setOrigin(0.5, 0.5).setScrollFactor(0, 0).setScale(0.5).setVisible(false).setDepth(4);

        this.pauseButton.on("pointerover", () => {
            this.pauseLED.setVisible(true);
        });
        this.pauseButton.on("pointerout", () => {
            this.pauseLED.setVisible(false);
        });

        this.pauseButton.on("pointerdown", () => { //quando viene clickato il bottone succedono cose
            this.pauseMenu = new PauseMenu(this);
            this.scene.pause(this);
            this.scene.add('pause_menu', this.pauseMenu, true);
        });

        //collecting flowers
         this.createFlowers();     
    
        //TIMER 
         this.initialTime = 400;
        this.timer = this.add.text(this.game.config.width / 2, 90, 'Countdown: ' + this.formatTime(this.initialTime), styleConfig).setOrigin(0.5, 0).setScrollFactor(0, 0).setDepth(4);
        // Each 1000 ms call onEvent
        this.timerEvent = this.time.addEvent({ delay: 1000, callback: this.onTimerEvent, callbackScope: this, loop: true });


        //cassaforte
        this.cassaforte= new Vault (this, 126000, this.floorHeight, this.worldWidth);
        

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
            //console.warn("HAI PERSO!");
            this.updateLives();
            this.time.removeEvent(this.timerEvent);
        }
    }


    update() {
        // Azioni che vengono eseguite a ogni frame del gioco
        this.player.manageMovements(this.movingPlatforms);
        this.animateBackground();
        this.updateMovingPlatforms();
        this.manageFlowersOverlap();
        this.managePlatformsOverlap();

        if(this.player.body.y > this.game.config.height) {
            this.player.die();
            this.updateLives();
        }

        if(this.updates % 60 == 0) {
            console.log(this.player.x + " " + this.player.y);
        }

        //apertura portellone
        if(this.player. x > 12000 && this.player.x < 12002) { 
            this.cassaforte.openVault(); 
        }
    }

    createFlowers() {
        
       //platform albero
       this.collectableFlowers.push(new FlowersGroup(this, 2, 985, 450, 170, 0, "animated_flower"));

       //marrone lego
       this.collectableFlowers.push(new FlowersGroup(this, 2, 1460, 350, 312, -90, "animated_flower"));

       //rombo platform
       this.collectableFlowers.push(new FlowersGroup(this, 2, 2100, this.game.config.height - 430, 485, -0, "animated_flower"));
       this.collectableFlowers.push(new FlowersGroup(this, 2, 2350, this.game.config.height - 275, 0, -345, "animated_flower"))
       
        
        //platform lungo
        this.collectableFlowers.push(new FlowersGroup(this, 3, 2870, this.game.config.height - 630, 250, -0, "animated_flower"));

        //double per 2
        this.collectableFlowers.push(new FlowersGroup(this, 2, 3035, 350, 423, 0, "animated_flower"));

        //torretta
        this.collectableFlowers.push(new FlowersGroup(this, 1, 4145, 400, 0, 0, "animated_flower"));

        //lego beige
        this.collectableFlowers.push(new FlowersGroup(this, 2, 4730, 250, 452, 0, "animated_flower"));

        //double x1
        this.collectableFlowers.push(new FlowersGroup(this, 1, 6100, 150, 100, 0, "animated_flower"));

        //basic x2
        this.collectableFlowers.push(new FlowersGroup(this, 2, 6440, 250, 346, -30, "animated_flower"));

        //ingresso banca
        this.collectableFlowers.push(new FlowersGroup(this, 2, 7565, 270, 255, -160, "animated_flower"));

        //2 colonne e balaustra
        this.collectableFlowers.push(new FlowersGroup(this, 2, 9415, 200, 205, -60, "animated_flower"));

        this.collectableFlowers.push(new FlowersGroup(this, 3, 10700, 210, 195, 0, "animated_flower"));
        this.collectableFlowers.push(new FlowersGroup(this, 2, 11280, 380, 600, -100, "animated_flower"));
        
        for(let i = 0; i < this.collectableFlowers.length; i++) {
            for(let k = 0; k < this.collectableFlowers[i].list.length; k++) {
                this.collectableFlowers[i].list[k].body.setAllowGravity(false);
            }
        }
    }

    manageFlowersOverlap() {
        for(let i = 0; i < this.collectableFlowers.length; i++) {
            for(let k = 0; k < this.collectableFlowers[i].list.length; k++) {
                if(Phaser.Geom.Intersects.RectangleToRectangle(this.collectableFlowers[i].list[k].body, this.player.body)) {
                    this.collectableFlowers[i].list[k].destroy(true);
                    this.collectableFlowers[i].list.splice(k, 1);
                    this.game.gameState.flowersCounter++;
                    this.localFlowersCounter++;
                    this.flowersBox.setText(this.game.gameState.flowersCounter);
                }
            }
        }
    }

    managePlatformsOverlap() {
        for(let i = 0; i < this.staticPlatforms.length; i++) {
            if(this.staticPlatforms[i].damaging) {
                for(let k = 0; k < this.staticPlatforms[i].list.length; k++) {
                    if(Phaser.Geom.Intersects.RectangleToRectangle(this.staticPlatforms[i].list[k].body, this.player.body)) {
                        this.updateLives();
                    }
                }
            }
        }

        for(let i = 0; i < this.movingPlatforms.length; i++) {
            if(this.movingPlatforms[i].damaging) {
                for(let k = 0; k < this.movingPlatforms[i].list.length; k++) {
                    if(Phaser.Geom.Intersects.RectangleToRectangle(this.movingPlatforms[i].list[k].body, this.player.body)) {
                        this.updateLives();
                    }
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
        if(this.game.gameState.lives == 0 || this.initialTime == 0) {
            this.game.gameState.lives = 0;
            this.lifeBox.setText("Lives: " + this.game.gameState.lives);
            this.scene.start("gameover");
            this.scene.stop(this);
        }

        // Aggiorna il punteggio
        const minTimeLivesDecrement = 2000;    // Tempo minimo (in ms) tra una perdita di vita e l'altra

        const timeFromLastLivesDecrement = this.time.now - this.lastLivesDecrement;

        if(timeFromLastLivesDecrement > minTimeLivesDecrement && this.game.gameState.lives > 0) {
            // Se sono qui devo togliere una vita
            this.lastLivesDecrement = this.time.now;

            this.game.gameState.lives--;
            this.lifeBox.setText("Lives: " + this.game.gameState.lives);
        }    
        
    }
}