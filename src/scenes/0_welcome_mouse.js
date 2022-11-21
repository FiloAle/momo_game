export default class SceneWelcomeMenu extends Phaser.Scene {

    background;        // oggetto relativo all'elemento "sfondo"

    constructor(){
        // Il costruttore della classe base Phaser.Scene prende come argomento il nome della scena
		super("scene_welcome_menu");
    }

    init(){
        console.log("scene_welcome - Executing init()");
    }

    preload() {
        console.log("scene_welcome - Executing preload()");
        // Carichiamo gli asset grafici
        this.load.image("background_base", "assets/images/background/background.jpg"); // carica l'immagine di sfondo

        // Carichiamo l'immagine del giocatore in formato spritesheet (ci servirà nelle prossime scene)
        const player_spritesheet_config = {
            frameWidth:  280,
            frameHeight: 335,
        };
        this.load.spritesheet("playerrun", "assets/images/characters/playerrunandjump.png", player_spritesheet_config);

        const monster_spritesheet_config = {
            frameWidth:  72,
            frameHeight: 72,
        };
        this.load.spritesheet("monster", "assets/images/characters/enemy.png", monster_spritesheet_config);

        // Carichiamo gli asset grafici
        this.load.image("pauseButton", "assets/UI/pause_button.png"); //caricamento bottone menu di pausa
        this.load.image("menuBkg", "assets/UI/menu_block.png"); //caricamento pannello del menu di pausa
        this.load.image("playButton", "assets/UI/play_button.png");
        this.load.image("shuriken", "assets/images/weapons/shuriken.png");
    }

    create() {
        console.log("scene_welcome - Executing create()");

        // Posizioniamo gli elementi nella scena
        this.background = this.add.image(0, 0, "background_base");
        this.background.setOrigin(0,0);

        //creo una immagine per il bottone. NB NON SEGUITE I TUTORIAL PER PHASER2, è stata completamente cambiata e non funzionano più
        this.playbutton = this.add.image(this.game.config.width/2, this.game.config.height/2, "playButton");
        this.playbutton.setOrigin(0.5, 0.5);
        this.playbutton.setInteractive(); //imposta l'immagine in modo che possa essere cliccata

        this.playbutton.on("pointerdown", ()=>{ //quando viene clickato il bottone succedono cose
            this.scene.start("physics_v5");
        });
    }

    update(){
    }
};
