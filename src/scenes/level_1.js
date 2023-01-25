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
        this.game.gameState.level = 1;
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
        this.load.image("platform_enorme", "assets/images/environment_elements/platform/platform_enorme.png");
        
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

        //clouds
        this.load.image("p_cloud_orange", "assets/images/environment_elements/platform/p_cloud_orange.png");
        this.load.image("p_cloud_pink", "assets/images/environment_elements/platform/p_cloud_pink.png");
        this.load.image("p_cloud_white", "assets/images/environment_elements/platform/p_cloud_white.png");
        this.load.image("p_cloud_yellow", "assets/images/environment_elements/platform/p_cloud_yellow.png");
        this.load.image("hidden_3", "assets/images/environment_elements/platform/hidden_3.png");

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
        this.load.image("pauseLED", "assets/UI/pause_button_LED.png");
        this.load.image("flowers_box", "assets/UI/flowers_box.png");
        this.load.image("flowers_icon", "assets/UI/flower.png");

        this.load.image("punzoni", "assets/images/environment_elements/platform/level_2/punzoni.png");

        this.load.image("cassiopea", "assets/images/characters/cassiopea.png");
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

        this.isCameraFollowingPlayer = false;

        //#region Creazione player
        // Aggiungi il player alla fisica
        this.player = this.physics.add.existing(new Player(this, 0, this.floorHeight, this.worldWidth));
        //#endregion

        this.checkpoints = [{x: 0, y: this.floorHeight}, {x: 4600, y: 320}, {x: 9400, y: this.floorHeight}];
        this.lastCheckpoint = this.checkpoints[0];

        this.add.image(230, this.floorHeight - 72, "cassiopea").setOrigin(0, 0).setDepth(1);

        //colonne inizio 
        this.staticPlatforms.push(new StaticPlatformsGroup(this, 3, 0, 400, 116, 0, false, "column"));

        //platform 1 e 2 + sfondo 1 (giallo)
        this.staticPlatforms.push(new StaticPlatformsGroup(this, 1, 1700, 66, 0, 0, false, "sfondo_1"));
        this.staticPlatforms.push(new StaticPlatformsGroup(this, 2, 1570, this.game.config.height-125, 250, -40, true, "p_grigio_lego_cemento"));
        this.staticPlatforms.push(new StaticPlatformsGroup(this, 1, 2060, this.game.config.height-250, 0, 0, true, "platform_enorme"));
        
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

        this.movingPlatforms.push(new MovingPlatformsGroup(this, 1, 6800, this.game.config.height-150, 300, 0, true, "p_beige_lego_2", 0, 200, 150));

        this.staticPlatforms.push(new StaticPlatformsGroup(this, 30, 7600, this.game.config.height, 200 , 0, true, "p_beige_lego_2")); 

        //
        this.movingPlatforms.push(new MovingPlatformsGroup(this, 1, 8300, this.game.config.height-164, 0, 0, true, "hidden_3",0, -15, 450));
        this.movingPlatforms.push(new MovingPlatformsGroup(this, 1, 8300, this.game.config.height-300, 0, 0, false, "p_cloud_white",0, -15, 450));
        this.movingPlatforms[this.movingPlatforms.length-1].list.forEach(platform => {
            platform.setDepth(2);
        }); 
        this.movingPlatforms.push(new MovingPlatformsGroup(this, 2, 8050, this.game.config.height-463, 750,400, true, "hidden_3", 0, 10, 600)); 
        this.movingPlatforms.push(new MovingPlatformsGroup(this, 2, 8050, this.game.config.height-600, 750, 400, false, "p_cloud_orange", 0, 10, 600)); 
        this.movingPlatforms[this.movingPlatforms.length-1].list.forEach(platform => {
            platform.setDepth(2);
        }); 
        this.staticPlatforms.push(new StaticPlatformsGroup(this, 2, 8850, this.game.config.height-465, 700, 80, true, "hidden_3")); 
        this.staticPlatforms.push(new StaticPlatformsGroup(this, 2, 8850, this.game.config.height-600, 700, 80, false, "p_cloud_pink")); 
        this.staticPlatforms[this.staticPlatforms.length-1].list.forEach(platform => {
            platform.setDepth(2);
        });
        this.staticPlatforms.push(new StaticPlatformsGroup (this, 2, 8000, this.game.config.height-64, 550, -200, true, "hidden_3"));
        this.staticPlatforms.push(new StaticPlatformsGroup (this, 2, 8000, this.game.config.height-200, 550, -200, false, "p_cloud_yellow")); 
        this.staticPlatforms[this.staticPlatforms.length-1].list.forEach(platform => {
            platform.setDepth(2);
        });
        
        this.movingPlatforms.push(new MovingPlatformsGroup(this, 1, 9700, this.game.config.height-264, 0, 0, true, "hidden_3",0, 25, 500));
        this.movingPlatforms.push(new MovingPlatformsGroup(this, 1, 9700, this.game.config.height-400, 0, 0, false, "p_cloud_white",0, 25, 500));
        this.movingPlatforms[this.movingPlatforms.length-1].list.forEach(platform => {
            platform.setDepth(2);
        }); 
        
        this.movingPlatforms.push(new MovingPlatformsGroup(this, 2, 9200, this.game.config.height-514, 1000, 50, true, "hidden_3", 0, -10, 300)); 
        this.movingPlatforms.push(new MovingPlatformsGroup(this, 2, 9200, this.game.config.height-650, 1000, 50, false, "p_cloud_orange", 0, -10, 300));
        this.movingPlatforms[this.movingPlatforms.length-1].list.forEach(platform => {
            platform.setDepth(2);
        }); 
        this.staticPlatforms.push(new StaticPlatformsGroup(this, 2, 9200, this.game.config.height-200, 700, 120, true, "p_torre"));

        this.staticPlatforms.push(new StaticPlatformsGroup(this, 2, 10450, this.game.config.height-100, 300, -55, true, "p_marrone_lego_albero")); 
      
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
        this.staticPlatforms.push(new StaticPlatformsGroup(this, 2, 11100, 490, 400 , 0, true, "punzoni", true));
        this.staticPlatforms.push(new StaticPlatformsGroup(this, 1, 11300, 190, 400 , 0, true, "punzoni", true));
        this.staticPlatforms[this.staticPlatforms.length-1].list.forEach(platform => {
            platform.setFlipY(true);
        });

    
        this.movingPlatforms.push(new MovingPlatformsGroup(this, 1, 11850, this.game.config.height-120, 0 , 0, true, "p_marrone_lego_albero_2", 0, 150, 100)); 
        this.staticPlatforms.push(new StaticPlatformsGroup(this, 1, 12400, this.game.config.height-120, 0 , 0, true, "p_tree_2")); 
        this.staticPlatforms[this.staticPlatforms.length-1].list.forEach(platform => {
            platform.setScale(1.2,1.2)
        });

        //ringhiera con gradini
        this.staticPlatforms.push(new StaticPlatformsGroup(this, 2, 13305, this.game.config.height-220, 300 , 0, true, "p_hidden"));
        this.staticPlatforms.push(new StaticPlatformsGroup(this, 1, 13300, this.game.config.height-320, 700 , 0, false, "ringhiera")); 
        this.staticPlatforms[this.staticPlatforms.length-1].list.forEach(platform => {
            platform.setScale(0.5, 0.5)
            platform.setDepth(2);
        });  

        this.staticPlatforms.push(new StaticPlatformsGroup(this, 2, 12850, this.game.config.height-150, 200, -70, true, "p_marrone_lego_albero")); 

        //albero
        this.staticPlatforms.push(new StaticPlatformsGroup(this, 1, 12730, 0, 0 , 0, false, "bg_tree"));
        this.staticPlatforms[this.staticPlatforms.length - 1].list[0].setDepth(2); 

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
        
        //#region Creazione nemici
        this.uominiGrigi = [];
        this.uominiGrigi.push(this.physics.add.existing(new Enemy(this, 1300, this.floorHeight, 0, "grigi")));
        this.uominiGrigi.push(this.physics.add.existing(new Enemy(this, 2500, this.floorHeight, 2800, "grigi")));
        this.uominiGrigi.push(this.physics.add.existing(new Enemy(this, 3400, this.floorHeight, 4000, "grigi")));
        this.uominiGrigi.push(this.physics.add.existing(new Enemy(this, 4400, 300, 4850, "grigi")));
        this.uominiGrigi.push(this.physics.add.existing(new Enemy(this, 6150, 595, 6600, "grigi")));
        this.uominiGrigi.push(this.physics.add.existing(new Enemy(this, 9205, 520, 9400, "grigi")));
        this.uominiGrigi.push(this.physics.add.existing(new Enemy(this, 12450, 600, 12750, "grigi")));

        this.uominiGrigi[0].flipX = true;

        for(let i = 0; i < this.uominiGrigi.length; i++) {
            this.uominiGrigi[i].body.allowGravity = true;
            this.uominiGrigi[i].resize(); // Ridimensionamento hitbox
            for(let k = 0; k < this.staticPlatforms.length; k++) {
                if(this.staticPlatforms[k].solid) {
                    this.physics.add.collider(this.uominiGrigi[i], this.staticPlatforms[k].list);
                }  
            }   
        }
        //#endregion

        //Creazione fiori
        this.createFlowers(); 

        this.player.resize(); // Ridimensionamento hitbox

        this.flowersContainerBox = this.add.image(20, 15, "flowers_box").setOrigin(0, 0).setScrollFactor(0, 0).setDepth(4);
        this.flowersIcon = this.add.image(8, 6, "flowers_icon").setOrigin(0, 0).setScale(0.85).setScrollFactor(0, 0).setDepth(4);

        this.game.gameState.lives = 3;
        this.game.gameState.flowersCounter = 0;
        const styleConfig = { color: '#FFFFFF', fontFamily: 'Montserrat', fontSize: 36 };

        this.lifeBox = this.add.text(this.game.config.width / 2, 46, "Lives: " + this.game.gameState.lives, styleConfig).setOrigin(0.5, 0).setScrollFactor(0, 0).setDepth(4);

        this.flowersBox = this.add.text(150, 46, (this.game.gameState.flowersCounter), styleConfig).setOrigin(0, 0).setScrollFactor(0, 0).setDepth(4);

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

        this.popup_movimento = new PopUp(this, "Ciao! Ecco alcuni suggerimenti prima di iniziare la tua avventura:   \n\nPremi ⇦ e ⇨ o [A] e [D] per muoverti, \n⇧ o [W] o [BARRA SPAZIATRICE] per saltare.", 0);
        this.popup_spiegazione = new PopUp(this, "Ciao Momo, sono Cassiopea e sono qui per aiutarti!   \nPer salvare i tuoi amici dovrai raggiungere la dimora di Mastro Hora.  \nTi aspetta un lungo viaggio: esplora ciò che ti circonda e trova la strada più sicura.", 1);
        this.popup_spiegazione2 = new PopUp(this, "Ehi Momo, dove scappi? Non ti ho ancora detto dei pericoli che puoi incontrare...\nDovrai stare molto attenta perché i Signori Grigi hanno scoperto il nostro piano e stanno cercando di fermarti!   \nTrova un modo per sconfiggerli o per liberarli dalla loro condizione facendoli tornare buoni.", 2);
        this.popup_uccisione = new PopUp(this, "Ecco un Signore Grigio. Attenta, ti sta inseguendo! Se ti raggiunge perderai una vita.   \nGli OraFiori che raccoglierai durante il percorso ti aiuteranno a salvarli.   \nPremi [F] per lanciarli, ma attenta perché non te ne basterà uno solo... \nEccotene due per provare.", 3);
        this.popup_uccisione_2 = new PopUp(this, "Attenta a non utilizzare troppi fiori, perché te ne serviranno almeno X per salvare i tuoi amici.   \nIl modo più semplice, ma anche il più rischioso, per sconfiggere i Signori Grigi è con un salto sulla loro testa.", 4);
        this.popup_checkpoint = new PopUp(this, "Forte! Hai appena superato il primo checkpoint: questo significa che se dovessi perdere una delle\ntue 3 vite a disposizione, verrai riportata qui. Nella mappa sono presenti diversi checkpoint,\nraggiungili tutti!", 5);

        this.scene.pause(this);
        this.scene.add('popup_movimento', this.popup_movimento, true);
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

        if(this.player.body.x > 200 && this.player.body.x < 202 && !this.popup_spiegazione.hasBeenDisplayed) {
            this.scene.pause(this);
            this.scene.add('popup_spiegazione', this.popup_spiegazione, true);
        }

        if(this.player.body.x > 550 && this.player.body.x < 552 && !this.popup_spiegazione2.hasBeenDisplayed && this.popup_spiegazione.hasBeenDisplayed) {
            this.scene.pause(this);
            this.scene.add('popup_spiegazione2', this.popup_spiegazione2, true);
        }

        if(this.player.body.x > 840 && this.player.body.x < 842 && !this.popup_uccisione.hasBeenDisplayed ) {
            this.scene.pause(this);
            this.scene.add('popup_uccisione', this.popup_uccisione, true);
            this.game.gameState.flowersCounter = 2;
            this.flowersBox.setText(this.game.gameState.flowersCounter);
        }

        if(this.player.body.x > 2180 && this.player.body.x < 2182 && !this.popup_uccisione_2.hasBeenDisplayed ) {
            this.scene.pause(this);
            this.scene.add('popup_uccisione_2', this.popup_uccisione_2, true);
        }

        if(this.player.body.x > 4600 && this.player.body.x < 4602 && !this.popup_checkpoint.hasBeenDisplayed ) {
            this.scene.pause(this);
            this.scene.add('popup_checkpoint', this.popup_checkpoint, true);
        }

        if(this.player.x > 13765) {
            this.scene.start('level_2');
            this.scene.stop(this);
        }
    }

    createFlowers() {
        this.collectableFlowers.push(new FlowersGroup(this, 2, 1800, this.floorHeight - 250, 220, -80, "animated_flower"));
        this.collectableFlowers.push(new FlowersGroup(this, 2, 3680, this.floorHeight - 500, 100, 0, "animated_flower"));
        this.collectableFlowers.push(new FlowersGroup(this, 1, 4655, this.game.config.height-510, 0, 0, "animated_flower"));
        this.collectableFlowers.push(new FlowersGroup(this, 3, 5160, 80, 230, 0, "animated_flower"));
        this.collectableFlowers.push(new FlowersGroup(this, 1, 7753, this.game.config.height-115, 0, 0, "animated_flower"));
        this.collectableFlowers.push(new FlowersGroup(this, 1, 8950, this.game.config.height-500, 700, 80, "animated_flower"));
        this.collectableFlowers.push(new FlowersGroup(this, 1, 8360, this.game.config.height-240, 700, 80, "animated_flower"));
        this.collectableFlowers.push(new FlowersGroup(this, 1, 9900, this.game.config.height-350, 700, 80, "animated_flower"));
        
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
                    this.game.gameState.flowersCounter++;
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
        if(this.player.x > 650 && this.uominiGrigi[0] != undefined) {
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