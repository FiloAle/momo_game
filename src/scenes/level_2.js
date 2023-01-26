import Player from "../components/player.js"
import Flower from "../components/flower.js"
import StaticPlatformsGroup from "../components/staticPlatformsGroup.js";
import MovingPlatformsGroup from "../components/movingPlatformsGroup.js";
import Enemy from "../components/enemy.js";
import FlowersGroup from "../components/flowersGroup.js";
import PauseMenu from "../components/pauseMenu.js";
import PopUp from "../components/popup.js";
import Vault from "../components/vault.js";

export default class Level2 extends Phaser.Scene {

    background;
    player;
    floorHeight;
    lastFlower;
    isCameraFollowingPlayer;
    updates;
    playerStartedMoving;
    lastLivesDecrement;
    movingPlatforms;
    staticPlatforms;
    collectableFlowers;
    localFlowersCounter;
    checkpoints;
    lastCheckpoint;

    constructor() {
        // Il costruttore della classe base Phaser.Scene prende come argomento il nome della scena
        super("level_2");
    }

    init() {
        this.floorHeight = this.game.config.height - 30; //altezza pavimento
        this.worldWidth = 14000; //lunghezza livello
        this.lastFlower = 0;
        this.updates = 0;
        this.lastLivesDecrement = 0;
        this.playerStartedMoving = false;
        this.isFlowerActive = false;
        this.collectableFlowers = [];
        this.movingPlatforms = [];
        this.staticPlatforms = [];
        this.game.gameState.level = 2; //salvo il numero del livello corrente
        this.localFlowersCounter = 0; //contatore fiori locale
    }

    preload() {
        //carico asset grafici
        this.load.image("bg", "assets/images/background/bg_level2.png"); // carica l'immagine di sfondo
        this.load.image("stars", "assets/images/background/bg_star.png"); 
        this.load.image("bg_finestra_down", "assets/images/background/bg_finestra_down.png"); 
        this.load.image("bg_parete_banca", "assets/images/background/bg_parete_banca.png"); 

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
        this.load.image("pauseLED", "assets/UI/pause_button_led.png");
        this.load.image("flowers_box", "assets/UI/flowers_box.png");
        this.load.image("flowers_icon", "assets/UI/flower.png");

        this.load.image("cassiopea", "assets/images/characters/cassiopea.png");
    }

    create() {
        //#region Impostazione sfondo scena
        this.background = this.add.image(0, 0, "bg").setOrigin(0, 0).setScale(0.75,1).setScrollFactor(0, 0);
        this.starts = this.add.image(0, 0, "stars").setOrigin(0, 0).setScrollFactor(0, 0);
        //#endregion

        this.isCameraFollowingPlayer = false;
        this.player = this.physics.add.existing(new Player(this, 100, 500, this.worldWidth)); //creazione player

        this.checkpoints = [{x: 100, y: 500}, {x: 4600, y: 320}, {x: 9400, y: this.floorHeight}]; //elenco checkpoint del livello
        this.lastCheckpoint = this.checkpoints[0]; //setto ultimo checkpoint salvato

        this.add.image(1080, 437, "cassiopea").setOrigin(0, 0).setDepth(3);
        
        //#region creazione platform statiche e dinamiche
        //Alberlo e platform
        this.staticPlatforms.push(new StaticPlatformsGroup(this, 1, -150, 0, 0 , 0, false, "bg_tree"));
        this.staticPlatforms[this.staticPlatforms.length-1].list.forEach(platform => {
            platform.setFlipX(true);
            platform.setDepth(3);
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
       
        
        //4 DUNE
        this.staticPlatforms.push(new StaticPlatformsGroup(this, 1, 1920, 180, 0, 0, false, 'p.dune_1'));

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
        this.staticPlatforms.push(new StaticPlatformsGroup(this, 2, 4670, this.game.config.height - 320, 460, 0, true, 'p_2beige_lego'));
        this.movingPlatforms.push(new MovingPlatformsGroup(this, 1, 4600, this.game.config.height - 450, 450, 0, true, 'p_2beige_lego',0, 400, 150)); 

        this.staticPlatforms.push(new StaticPlatformsGroup(this, 1, 5700, this.game.config.height - 220, 0, 0, true, 'p_neutral_beige'));

        this.staticPlatforms.push(new StaticPlatformsGroup(this, 1, 6050, this.game.config.height - 357, 0, 0, true, 'p_torretta_double'));
        this.staticPlatforms.push(new StaticPlatformsGroup(this, 2, 6370, this.game.config.height - 240, 330, -50, true, 'p_neutral_beige'));

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
        //#endregion

        this.player.setDepth(2); 
        
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

        this.popup_2 = new PopUp(this, "Complimenti Momo! Sei riuscita superare la prima fase.   \nAdesso dovrai raggiungere la banca del tempo per liberare tutti gli OraFiori che i signori grigi hanno rubato ai tuoi amici.    \nMa attenta, il percorso è lungo e insidioso e il tempo a tua disposizione è limitato…   \nÈ ora di andare, lascia il Grande albero alle tue spalle e buona fortuna!", 0);

        this.uominiGrigi = [];
        this.uominiGrigi.push(this.physics.add.existing(new Enemy(this, 12150, this.player.y, 12550, "grigi")));
        this.uominiGrigi.push(this.physics.add.existing(new Enemy(this, 12600, this.player.y, 13000, "grigi")));
        this.uominiGrigi.push(this.physics.add.existing(new Enemy(this, 13000, this.player.y, 13500, "grigi")));

        for(let i = 0; i < this.uominiGrigi.length; i++) {
            this.uominiGrigi[i].body.allowGravity = true;
            this.uominiGrigi[i].resize(); // Ridimensionamento hitbox
            for(let k = 0; k < this.staticPlatforms.length; k++) {
                this.physics.add.collider(this.uominiGrigi[i], this.staticPlatforms[k].list);
            }   
        }

        //collecting flowers
        this.createFlowers();     
    
        //TIMER 
        this.initialTime = 400;
        this.timer = this.add.text(this.game.config.width / 2, 90, 'Countdown: ' + this.formatTime(this.initialTime), styleConfig).setOrigin(0.5, 0).setScrollFactor(0, 0).setDepth(4);
        // Each 1000 ms call onEvent
        this.timerEvent = this.time.addEvent({ delay: 1000, callback: this.onTimerEvent, callbackScope: this, loop: true });


        //cassaforte
        this.cassaforte = new Vault(this, 14000, this.floorHeight).setDepth(4);
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
        this.manageFlowersLaunch();
        this.managePlatformsOverlap();
        this.manageEnemies();

        for(let i = 0; this.checkpoints.length > 0 && i < this.checkpoints.length; i++) {
            if(this.player.x > this.checkpoints[i].x) {
                this.lastCheckpoint = this.checkpoints[i];
                this.checkpoints.splice(i, 1);
            }
        }

        if(this.player.y > this.game.config.height) {
            this.updateLives();
        }

        if(this.updates % 60 == 0) {
            console.log(this.player.x + " " + this.player.y);
        }

        //apertura portellone
        if(this.player. x > 13400 && this.player.x < 13402) { 
            this.cassaforte.openVault(); 
        }

        //popup
        if(this.player.body.x > 980 && this.player.body.x < 982 && !this.popup_2.hasBeenDisplayed) {
            this.scene.pause(this);
            this.scene.add('popup_2', this.popup_2, true);
        } 
    }

    createFlowers() {
        
        //platform albero
        this.collectableFlowers.push(new FlowersGroup(this, 1, 985, 450, 0, 0, "animated_flower"));

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

    manageFlowersLaunch() {
        const minTimeBetweenFlowers = 500;    // Tempo minimo (in ms) tra un fiore e l'altro
        const timeFromPreviousFlower = this.time.now - this.lastFlower;

        if(this.keyF.isDown && timeFromPreviousFlower > minTimeBetweenFlowers) {
            if(this.game.gameState.flowersCounter > 0) {
                this.game.gameState.flowersCounter--;
                this.flowersBox.setText(this.game.gameState.flowersCounter);
                this.lastFlower = this.time.now; // Salvo il tempo in cui è stato lanciato l'ultimo fiore

                // Creo un fiore
                this.flower = new Flower(this, this.player.x + this.player.body.width * (3/2), this.player.y - this.player.body.height / 2, "animated_flower", 10, this.player.flipX);
                this.isFlowerActive = true;
                
                this.flower.fire(); // Lo lancio
            } 
        }

        for(let i = 0; i < this.uominiGrigi.length; i++) {
            if(this.uominiGrigi[i] != undefined) {
                if(this.isFlowerActive && Phaser.Geom.Intersects.RectangleToRectangle(this.flower.body, this.uominiGrigi[i].body) && this.uominiGrigi[i].isEvil) {
                    this.uominiGrigi[i].cure(this.flower);
                    this.isFlowerActive = false;
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

    manageEnemies() {
        //gestione collisione player (-1 vita o uccisione uomo grigio)
        for(let i = 0; i < this.uominiGrigi.length; i++) {
            if(this.uominiGrigi[i] != undefined) {
                if(Phaser.Geom.Intersects.RectangleToRectangle(this.player.body, this.uominiGrigi[i].body) && this.uominiGrigi[i].isEvil) {
                    if(this.player.body.velocity.y > 0 && this.player.y < (this.uominiGrigi[i].y + this.uominiGrigi[i].height)) {
                        this.player.body.setVelocityY(-300);
                        this.uominiGrigi[i].destroy(true);
                        this.uominiGrigi[i] = undefined;
                    } else {
                        this.updateLives();
                    }
                }
            } 
        }

        for(let i = 0; i < this.uominiGrigi.length; i++) {
            if(this.uominiGrigi[i] != undefined) {
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
        this.starts.x = - this.cameras.main.scrollX * 0.3;
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

            this.player.x = this.lastCheckpoint.x;
            this.player.y = this.lastCheckpoint.y - 30;
        }

        if(this.game.gameState.lives == 0) {
            this.scene.start("gameover");
            this.scene.stop(this);
            //schermata game over
        }
    }
}