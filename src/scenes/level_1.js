import Player from "../components/player.js"
import Flower from "../components/flower.js"
import FlowersGroup from "../components/flowersGroup.js";
import StaticPlatformsGroup from "../components/staticPlatformsGroup.js";
import MovingPlatformsGroup from "../components/movingPlatformsGroup.js";
import Enemy from "../components/enemy.js";
import PopUp from "../components/popup.js";
import PauseMenu from "../components/pauseMenu.js";

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
    flowersCounter;
    checkpoints;
    lastCheckpoint;

    constructor() {
        // Il costruttore della classe base Phaser.Scene prende come argomento il nome della scena
        super("level_1");
    }

    init() {
        console.log("test_scene_2 - Executing init()");
        // Definiamo l'altezza del terreno pari all'altezza del riquadro di gioco, per posizionare il giocatore sul fondo della schermata.
        this.floorHeight = this.game.config.height - 30;
        this.worldWidth = 14000;
        this.lastFlower = 0;
        this.updates = 0;
        this.lastLivesDecrement = 0;
        this.isFlowerActive = false;
        this.collectableFlowers = [];
        this.movingPlatforms = [];
        this.staticPlatforms = [];
        this.flowersCounter = -2;
    }

    preload() {
        //#region loading screen
        var width = this.cameras.main.width;
        var height = this.cameras.main.height;

        var progressBar = this.add.graphics();
        var progressBox = this.add.graphics();
        var flowerLoading = this.add.tileSprite(width - 100, height - 70, 150, 150, "animated_flower");
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(width / 2 - 160, 270, 320, 50);
        
        var percentText = this.make.text({
            x: width / 2,
            y: height / 2 - 20,
            text: '0%',
            style: {
                fontFamily: 'Montserrat',
                fontSize: 18,
                fill: '#ffffff'
            }
        });
        percentText.setOrigin(0.5, 0.5);
        
        var assetText = this.make.text({
            x: width / 2,
            y: height / 2 + 20,
            text: '',
            style: {
                fontFamily: 'Montserrat',
                fontSize: 18,
                fill: '#ffffff'
            }
        });
        assetText.setOrigin(0.5, 0.5);
        
        this.load.on('progress', function (value) {
            percentText.setText("Loading: " + parseInt(value * 100) + '%');
            progressBar.clear();
            progressBar.fillStyle(0xffffff, 1);
            progressBar.fillRect(width / 2 - 160 + 10, 280, 300 * value, 30);
        });
        
        this.load.on('fileprogress', function (file) {
            assetText.setText('Loading asset: ' + file.key);
        });
        this.load.on('complete', function () {
            progressBar.destroy();
            progressBox.destroy();
            percentText.destroy();
            assetText.destroy();
        });
        //#endregion

        console.log("test_scene_2 - Executing preload()");
       
        //BACKGROUND, CLOUDS, CITY, TREE
        this.load.image("sky", "assets/images/background/bg_sky.jpg");
        this.load.image("clouds", "assets/images/background/bg_clouds.png");
        this.load.image("city", "assets/images/background/bg_city.png"); 
        this.load.image("hill_2", "assets/images/background/bg_hill.1-1.png"); 
        this.load.image("hill", "assets/images/background/bg_hill_new.png"); 
        this.load.image("hill_3", "assets/images/background/bg_hill_3.png"); 
        this.load.image("bg_tree", "assets/images/background/bg_tree.png"); 
        

        //pavimento verde
        this.load.image("platform_1", "assets/images/environment_elements/pavement_up.png");
        this.load.image("platform_1_2", "assets/images/environment_elements/pavement.png");

        //colonne
        this.load.image("column", "assets/images/environment_elements/column.png");

        //platform cemento
        this.load.image("p_grigio_lego_cemento", "assets/images/environment_elements/platform/p_grigio_lego_cemento.png");
        
        //platform
        //this.load.image("p_grey_big", "assets/images/environment_elements/platform/p_grey_big.png");

        //platform semplice 3D marrone
        this.load.image("p_marrone_lego", "assets/images/environment_elements/platform/p_marrone_lego.png");
        this.load.image("platform_3d_4_2", "assets/images/environment_elements/platform/4_2.png");
        
        //platform_3d_bordeaux e hidden 1
        this.load.image("p_rossa_lego_2", "assets/images/environment_elements/platform/p_rossa_lego.png");
        this.load.image("p_hidden", "assets/images/environment_elements/platform/p_hidden.png");

        //hidden 2
        this.load.image("p_hidden_2", "assets/images/environment_elements/platform/p_hidden_2.png");

        //camini
        this.load.image("platform_3d_6", "assets/images/environment_elements/platform/7.png");
        this.load.image("platform_3d_7", "assets/images/environment_elements/platform/8-9.png");
        this.load.image("p_grigio_lego", "assets/images/environment_elements/platform/p_grigio_lego.png");

        //pezzo di gru gialla
        this.load.image("platform_3d_8", "assets/images/environment_elements/platform/10.png");
        //this.load.image("platform_3d_15", "assets/images/environment_elements/platform/base_giallo_grande.png");

        //gru gialla intera
        this.load.image("p_gru", "assets/images/environment_elements/platform/p_gru.png");
        this.load.image("p_giallo_lego", "assets/images/environment_elements/platform/p_giallo_lego.png");

        //torretta
        this.load.image("p_torre", "assets/images/environment_elements/platform/p_torre.png");
        this.load.image("p_torre_bg", "assets/images/environment_elements/platform/15_bg.png");

        this.load.image("p_beige_lego", "assets/images/environment_elements/platform/p_beige_lego.png");
        this.load.image("p_beige_lego_2", "assets/images/environment_elements/platform/beige_lego_2.png");

        //rami albero
        this.load.image("p_tree", "assets/images/environment_elements/platform/p_tree.png");
        this.load.image("p_tree_2", "assets/images/environment_elements/platform/p_tree_2.png");
        this.load.image("p_tree_3", "assets/images/environment_elements/platform/p_tree_3.png");

        this.load.image("p_marrone_lego_albero", "assets/images/environment_elements/platform/p_marrone_lego_albero.png");
        this.load.image("p_marrone_lego_albero_2", "assets/images/environment_elements/platform/p_marrone_lego_albero_2.png");
        this.load.image("ringhiera", "assets/images/environment_elements/platform/ringhiera.png");
        
        //sfondi platform
        this.load.image("sfondo_1", "assets/images/environment_elements/buildings/bld_1.png");
        this.load.image("sfondo_2", "assets/images/environment_elements/buildings/bld_2.png");
        this.load.image("sfondo_3", "assets/images/environment_elements/buildings/building_3.png");
        this.load.image("sfondo_4", "assets/images/environment_elements/buildings/bld_4.png");

        this.load.image("pause", "assets/UI/pause_button.png");
    }

    create() {
        // Qui le istruzioni su cosa creare e dove nel mondo di gioco
        console.log("test_scene_2 - Executing create()");

        //#region Impostazione sfondo scena
        this.background = this.add.image(0, 0, "sky");
        this.background.setScale(0.75, 1);
        this.background.setOrigin(0, 0);
        this.background.setScrollFactor(0, 0);

       
        this.hill_3 = this.add.image(0, 0.5, "hill_3");
        this.hill_3.setOrigin(0, 0);
        this.hill_3.setScrollFactor(0, 0);

        this.hill = this.add.image(0, 0.5, "hill");
        this.hill.setOrigin(0, 0);
        this.hill.setScrollFactor(0, 0);

        this.hill_2 = this.add.image(0, 0.5, "hill_2");
        this.hill_2.setOrigin(0, 0);
        this.hill_2.setScrollFactor(0, 0);

        this.city = this.add.image(0, 0.5, "city");
        this.city.setOrigin(0, 0);
        this.city.setScrollFactor(0, 0);
        
        this.nuvole = this.add.image(0, 0, "clouds");
        this.nuvole.setOrigin(0, 0);
        this.nuvole.setScrollFactor(0, 0);

        /*  this.tree = this.add.image(0, 0, "bg_tree");
        this.tree.setOrigin(7000, 0);
        this.tree.setScrollFactor(0, 0); */
    
        //#endregion

        this.pauseButton = this.add.image(this.game.config.width / 2, 20, "pause");
        this.pauseButton.setOrigin(0.5, 0);
        this.pauseButton.setScrollFactor(0, 0);
        this.pauseButton.setInteractive({ useHandCursor: true });

        this.pauseButton.on("pointerdown", () => { //quando viene clickato il bottone succedono cose
            this.pauseMenu = new PauseMenu(this);
            this.scene.pause(this);
            this.scene.add('pause_menu', this.pauseMenu, true);
        });

        this.isCameraFollowingPlayer = false;

        //#region Creazione player
        // Aggiungi il player alla fisica
        this.player = this.physics.add.existing(new Player(this, 0, this.floorHeight-500, this.worldWidth));
        //#endregion

        this.checkpoints = [{x: 0, y: this.floorHeight}, {x: 500, y: this.floorHeight}, {x: 4600, y: 320}];
        this.lastCheckpoint = this.checkpoints[0];

        //colonne inizio 
        this.staticPlatforms.push(new StaticPlatformsGroup(this, 3, 0, 400, 116, 0, false, "column"));

        //platform 1 e 2 + sfondo 1 (giallo)
        this.staticPlatforms.push(new StaticPlatformsGroup(this, 1, 1700, 66, 0, 0, false, "sfondo_1"));
        this.staticPlatforms.push(new StaticPlatformsGroup(this, 2, 1570, this.game.config.height-185, 250, -40, true, "p_grigio_lego_cemento"));
        //this.staticPlatforms.push(new StaticPlatformsGroup(this, 1, 1838, this.game.config.height-300, 0, 0, true, "p_grey_big"));
        
        //platform marrone piccola + sfondo 2 (marrone) + platform bordeaux
        this.staticPlatforms.push(new StaticPlatformsGroup(this, 2, 3436, this.game.config.height-220, 250, 0, true, "p_hidden")); 
        this.staticPlatforms.push(new StaticPlatformsGroup(this, 1, 3400, 310, 0, 0, false, "sfondo_2"));
        this.staticPlatforms.push(new StaticPlatformsGroup(this, 1, 3610, this.game.config.height-428, 0, 0, true, "p_rossa_lego_2"));
        
        //platform mobile prima del ponte
        this.movingPlatforms.push(new MovingPlatformsGroup(this, 1, 4150, this.game.config.height-180, 0, 0, true, "p_marrone_lego",1, -180, 150));
        
        //gru e platform grigia lunga dietro
        this.staticPlatforms.push(new StaticPlatformsGroup(this, 4, 4366, this.game.config.height-400, 100, 0, true, "p_hidden_2"));
        this.staticPlatforms.push(new StaticPlatformsGroup(this, 1, 4350, 220, 0, 0, false, "sfondo_3"));
        this.staticPlatforms[this.staticPlatforms.length - 1].list[0].setDepth(2);

        //casa con camini
        this.movingPlatforms.push(new MovingPlatformsGroup(this, 1, 5123, this.game.config.height-230, 0, 0, true, "platform_3d_7", 1, -100, 80));
        this.movingPlatforms.push(new MovingPlatformsGroup(this, 1, 5098, this.game.config.height-260, 0, 0, true, "p_grigio_lego", 1, -100, 80));

        this.movingPlatforms.push(new MovingPlatformsGroup(this, 1, 5345, this.game.config.height-380, 0, 0, true, "platform_3d_6",1, 120, 80));
        this.movingPlatforms.push(new MovingPlatformsGroup(this, 1, 5334, this.game.config.height-390, 0, 0, true, "p_grigio_lego",1, 120, 80));

        this.movingPlatforms.push(new MovingPlatformsGroup(this, 1, 5552, this.game.config.height-230, 0, 0, true, "platform_3d_7", 1, -100, 80));
        this.movingPlatforms.push(new MovingPlatformsGroup(this, 1, 5528, this.game.config.height-260, 0, 0, true, "p_grigio_lego", 1, -100, 80));
        
        this.staticPlatforms.push(new StaticPlatformsGroup(this, 1, 5050, 535, 0, 0, false, "sfondo_4"));

        //gru che va su e giù e gru gialla statica
        this.movingPlatforms.push(new MovingPlatformsGroup(this, 1, 5800, this.game.config.height-570, 0, 0, true, "p_marrone_lego", 1, 130, 200));
        this.staticPlatforms.push(new StaticPlatformsGroup(this, 4, 6115, this.game.config.height-125, 100, 0, true, "p_hidden_2"));
        this.staticPlatforms[this.staticPlatforms.length-1].list.forEach(platform => {
            platform.setScale(1.25,1.25)
        });
        this.staticPlatforms.push(new StaticPlatformsGroup(this, 1, 5900, this.game.config.height-200, 0, 0, false, "p_gru"));
        this.staticPlatforms[this.staticPlatforms.length - 1].list[0].setDepth(2);

        this.staticPlatforms.push(new StaticPlatformsGroup(this, 2, 6250, 170, 400, 0, true, "p_giallo_lego"));
        this.staticPlatforms.push(new StaticPlatformsGroup(this, 2, 6050, 320, 400, 0, true, "p_giallo_lego"));

        //torretta
        this.staticPlatforms.push(new StaticPlatformsGroup(this, 1, 7605, this.game.config.height-10, 0, 0, true, "platform_3d_4_2")); 
        this.staticPlatforms.push(new StaticPlatformsGroup(this, 1, 7620, this.game.config.height-360, 0, 0, false, "p_torre_bg")); 
        this.staticPlatforms.push(new StaticPlatformsGroup(this, 1, 7600, this.game.config.height-380, 0, 0, false, "p_torre"));
        this.staticPlatforms[this.staticPlatforms.length - 1].list[0].setDepth(2);

        this.movingPlatforms.push(new MovingPlatformsGroup(this, 1, 6800, this.game.config.height-150, 300, 0, true, "p_beige_lego_2", 0, 130, 260));

        this.staticPlatforms.push(new StaticPlatformsGroup(this, 30, 7600, this.game.config.height, 200 , 0, true, "p_beige_lego_2")); 

        //piattaforme albero
        this.staticPlatforms.push(new StaticPlatformsGroup(this, 1, 11000, this.game.config.height-200, 200 , 0, true, "p_tree")); 
        this.staticPlatforms[this.staticPlatforms.length-1].list.forEach(platform => {
            platform.setScale(1.5,1.5)
        });

        this.staticPlatforms.push(new StaticPlatformsGroup(this, 1, 11000, 0, 0 , 0, false, "p_tree_3"));
        this.staticPlatforms[this.staticPlatforms.length-1].list.forEach(platform => {
            platform.setScale(1.5,1.5);
            platform.setDepth(2);
        }); 
    
        this.movingPlatforms.push(new MovingPlatformsGroup(this, 1, 11900, this.game.config.height-120, 0 , 0, true, "p_marrone_lego_albero_2", 0, 100, 100)); 
        this.staticPlatforms.push(new StaticPlatformsGroup(this, 1, 12400, this.game.config.height-120, 0 , 0, true, "p_tree_2")); 
        this.staticPlatforms[this.staticPlatforms.length-1].list.forEach(platform => {
            platform.setScale(1.2,1.2)
        });

        //ringhiera con gradini
        this.staticPlatforms.push(new StaticPlatformsGroup(this, 2, 13260, this.game.config.height-220, 300 , 0, true, "p_hidden"));
        this.staticPlatforms.push(new StaticPlatformsGroup(this, 1, 13250, this.game.config.height-320, 700 , 0, false, "ringhiera")); 
        this.staticPlatforms[this.staticPlatforms.length-1].list.forEach(platform => {
            platform.setScale(0.5, 0.5)
            platform.setDepth(2);
        });  

        this.staticPlatforms.push(new StaticPlatformsGroup(this, 2, 12850, this.game.config.height-150, 200, -70, true, "p_marrone_lego_albero")); 

        //albero
        this.staticPlatforms.push(new StaticPlatformsGroup(this, 1, 12730, 0, 0 , 0, false, "bg_tree"));
        this.staticPlatforms[this.staticPlatforms.length - 1].list[0].setDepth(2); 

         

        //platform vecchie
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

        //pavimento 2D
        this.staticPlatforms.push(new StaticPlatformsGroup(this, 4, 0, 697, this.textures.get('platform_1').getSourceImage().width, 0, true, 'platform_1'));
        this.staticPlatforms.push(new StaticPlatformsGroup(this, 4, 0, 690, this.textures.get('platform_1_2').getSourceImage().width, 0, false, 'platform_1_2'));

        this.pavements = [];
        this.pavements.push(this.staticPlatforms[this.staticPlatforms.length - 2]);

        this.player.setDepth(1);
        this.staticPlatforms[this.staticPlatforms.length-1].list.forEach(platform => {
            platform.setDepth(2);
        });
        
        //#region Posizionamento camera
        this.cameras.main.setBounds(0, 0, 14000, 720);
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
            this.uominiGrigi.push(this.physics.add.existing(new Enemy(this, this.player.x + 600, this.player.y, 0, "grigi")));
            this.uominiGrigi[i].body.allowGravity = true;
            this.uominiGrigi[i].resize(); // Ridimensionamento hitbox
            for(let k = 0; k < this.pavements.length; k++) {
                this.physics.add.collider(this.uominiGrigi[i], this.pavements[k].list);
            }   
        }
        //#endregion

        //Creazione fiori
        this.createFlowers(); 

        this.player.resize(); // Ridimensionamento hitbox

        this.game.gameState.lives = 3;
        const styleConfig = { color: '#FFFFFF', fontFamily: 'Montserrat', fontSize: 36 };

        //#region Inserimento informazione vita
        this.lifeBox = this.add.text(50, 40, "Lives: " + this.game.gameState.lives, styleConfig);
        this.lifeBox.setOrigin(0, 0);
        this.lifeBox.setScrollFactor(0, 0);
        //#endregion

        this.flowersBox = this.add.text(this.cameras.main.width - 50, 40, "Flowers: " + (this.flowersCounter + 2) + "/11", styleConfig);
        this.flowersBox.setOrigin(1, 0);
        this.flowersBox.setScrollFactor(0, 0);

        this.popup1 = new PopUp(this, "Ciao Momo, sono qui per aiutarti!   \nPer raggiungere la dimora di Mastro Hora dovrai fare un lungo viaggio.   \n\nEsplora ciò che ti circonda e trova la strada più sicura.", 0);
    }

    update() {
        // Azioni che vengono eseguite a ogni frame del gioco
        this.player.manageMovements(this.movingPlatforms);
        this.animateBackground();
        this.manageFlowersLaunch();
        this.manageFlowersOverlap();
        this.manageEnemies();
        this.updateMovingPlatforms();
        this.managePlatformsOverlap();
        
        if(this.updates % 60 == 0) {
            console.log(this.player.x + " " + this.player.y);
        }

        for(let i = 0; this.checkpoints.length > 0 && i < this.checkpoints.length; i++) {
            if(this.player.x > this.checkpoints[i].x) {
                this.lastCheckpoint = this.checkpoints[i];
                this.checkpoints.splice(i, 1);
            }
        }
        
        if(this.player.y > this.game.config.height) {
            this.updateLives();
        }

        if(this.player.body.x > 300 && this.player.body.x < 302 && !this.popup1.hasBeenDisplayed) {
            this.scene.pause(this);
            this.scene.add('popup1', this.popup1, true);
        }

        if(this.player.x > 13765) {
            this.scene.start('level_2');
            this.scene.stop(this);
        }
    }
    

    createFlowers() {
        this.collectableFlowers.push(new FlowersGroup(this, 2, 1800, this.floorHeight - 330, 220, -80, "animated_flower"));
        this.collectableFlowers.push(new FlowersGroup(this, 2, 3680, this.floorHeight - 500, 100, 0, "animated_flower"));
        this.collectableFlowers.push(new FlowersGroup(this, 1, 4655, this.game.config.height-510, 0, 0, "animated_flower"));
        this.collectableFlowers.push(new FlowersGroup(this, 3, 5160, 80, 230, 0, "animated_flower"));
        this.collectableFlowers.push(new FlowersGroup(this, 1, 7753, this.game.config.height-115, 0, 0, "animated_flower"));

        //albero doppio punzoni
        this.collectableFlowers.push(new FlowersGroup(this, 2, 11150, this.game.config.height-500, 400, 0, "animated_flower"));
        this.collectableFlowers.push(new FlowersGroup(this, 1, 11350, this.game.config.height-245, 0, 0, "animated_flower"));

        this.collectableFlowers.push(new FlowersGroup(this, 1, 12540, this.game.config.height-200, 0, 0, "animated_flower"));
        this.collectableFlowers.push(new FlowersGroup(this, 2, 12910, this.game.config.height-200, 200, -60, "animated_flower"));

        //To do: sposta setAllowGravity(false) 
        for(let i = 0; i < this.collectableFlowers.length; i++) {
            for(let k = 0; k < this.collectableFlowers[i].list.length; k++) {
                this.collectableFlowers[i].list[k].body.setAllowGravity(false);
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

    manageFlowersOverlap() {
        for(let i = 0; i < this.collectableFlowers.length; i++) {
            for(let k = 0; k < this.collectableFlowers[i].list.length; k++) {
                if(Phaser.Geom.Intersects.RectangleToRectangle(this.collectableFlowers[i].list[k].body, this.player.body)) {
                    this.collectableFlowers[i].list[k].destroy(true);
                    this.collectableFlowers[i].list.splice(k, 1);
                    if(this.flowersCounter < 0) {
                        this.flowersCounter = 0;
                    }
                    this.flowersCounter++;
                    this.flowersBox.setText("Flowers: " + this.flowersCounter + "/11");
                }
            }
        }
    }

    manageFlowersLaunch() {
        const minTimeBetweenFlowers = 500;    // Tempo minimo (in ms) tra un fiore e l'altro
        const timeFromPreviousFlower = this.time.now - this.lastFlower;

        if(this.keyF.isDown && timeFromPreviousFlower > minTimeBetweenFlowers) {
            if(this.flowersCounter != 0) {
                if(this.flowersCounter < 0) {
                    this.flowersCounter++;
                } else if(this.flowersCounter > 0) {
                    this.flowersCounter--;
                    this.flowersBox.setText("Flowers: " + this.flowersCounter + "/11");
                } 
                this.lastFlower = this.time.now; // Salvo il tempo in cui è stato lanciato l'ultimo fiore

                // Creo un fiore
                this.flower = new Flower(this, this.player.x + this.player.body.width * (3/2), this.player.y - this.player.body.height / 2,"animated_flower", 10, this.player.flipX);
                this.flower.setDepth(0);
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

        //gestione movimenti uomini grigi da secondo (id: 1) in poi
        for(let i = 1; i < this.uominiGrigi.length; i++) {
            if(this.uominiGrigi[i] != undefined) {
                this.uominiGrigi[i].manageMovements();
            }
        }

        //gestione movimenti primo uomo grigio (id: 0)
        if(this.player.x != this.player.initialX && this.uominiGrigi[0] != undefined) {
            this.uominiGrigi[0].followPlayer();
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
        this.city.x = - this.cameras.main.scrollX * 0.6;
        this.hill_2.x = - this.cameras.main.scrollX * 0.65;
        this.hill_3.x = - this.cameras.main.scrollX * 0.6;
        this.hill.x = - this.cameras.main.scrollX * 0.7;
        
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

            this.player.x = this.lastCheckpoint.x;
            this.player.y = this.lastCheckpoint.y - 20;
        }

        if(this.game.gameState.lives == 0) {
            this.player.die();
            //schermata game over
        }
    }
}