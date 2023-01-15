import Player from "../components/player.js"

export default class TestScene1 extends Phaser.Scene {

    background;       // oggetto relativo all'elemento "sfondo"
    player;           // oggetto relativo all'elemento "giocatore"
    floorHeight;      // Altezza del terreno (asse y) rispetto al riquadro di gioco

    constructor() {
        // Il costruttore della classe base Phaser.Scene prende come argomento il nome della scena
        super("test_scene_1");
    }

    init() {
        console.log("test_scene_1 - Executing init()");
        // Definiamo l'altezza del terreno pari all'altezza del riquadro
        // di gioco, per posizionare il giocatore sul fondo della schermata.
        this.floorHeight = this.game.config.height - 30;
        this.worldWidth = 10000;
    }

    preload() {
        console.log("test_scene_1 - Executing preload()");
        // Carichiamo gli asset grafici
        this.load.image("platform", "assets/images/environment_elements/platform.png");
        this.load.image("mushroom", "assets/images/environment_elements/mushroom_1.png");
    }

    create() {
        // Qui le istruzioni su cosa creare e dove nel mondo di gioco
        console.log("test_scene_1 - Executing create()");
        // Sfondo
        this.background = this.add.tileSprite(0, -280, 6000, 1000, "background_base");
        this.background.setOrigin(0, 0);
        this.background.setScrollFactor(0, 0);

        // Crea un piano sul quale fermare gli oggetti soggetti alla fisica (gravità)
        this.floor = this.add.rectangle(0, this.game.config.height,
            this.worldWidth, this.game.config.height - this.floorHeight,
            0xFFFFFF, 0);
        this.floor.setOrigin(0, 1);
        // Aggiungi il piano alla fisica (e rendiamolo statico mettendo a 'true' il secondo parametro)
        this.physics.add.existing(this.floor, true);

        // Player
        const thePlayer = new Player(this, 0, this.floorHeight, 10000);
        // Aggiungi il player alla fisica
        this.player = this.physics.add.existing(thePlayer);
        this.physics.add.collider(this.player, this.floor);

        // Imposta la camera per seguire i movimenti del giocatore lungo l'asse x
        this.cameras.main.setBounds(0, 0, 10000, 720);
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setFollowOffset(-this.player.width / 4, this.game.config.height / 2);

        // Inserisci delle piattaforme
        this.createStaticPlatforms();
        this.createMovingPlatforms();

        // Inserisci gli elementi dell'interfaccia utente
        this.createUI();

    }

    createUI() {
        const styleConfig = { color: '#FFFFFF', fontSize: 36 };

        // Inserisci il testo con il punteggio corrente
        const scoreMessage = "Score: " + this.game.gameState.score;
        this.scoreBox = this.add.text(700, 0, scoreMessage, styleConfig);
        this.scoreBox.setOrigin(0, 0);
        this.scoreBox.setScrollFactor(0, 0);

        // Inserisci il testo con il punteggio corrente
        const lifeMessage = "Lives: " + this.game.gameState.lives;
        this.lifeBox = this.add.text(400, 0, lifeMessage, styleConfig);
        this.lifeBox.setOrigin(0, 0);
        this.lifeBox.setScrollFactor(0, 0);

    }

    createStaticPlatforms() {
        // Aggiungi le piattaforme come un gruppo di oggetti statici
        this.platforms = this.physics.add.staticGroup({
            key: 'platform',
            repeat: 3,
            setXY: { x: 1500, y: this.game.config.height - 300, stepX: 1000, stepY: 50}
        });

        // Rendi le piattaforme "solide". Se il giocatore è su una piattaforma
        // allora il suo stato è "non sta saltando" (questo per riprodurre l'animazione
        // del giocatore fermo).
        this.physics.add.collider(this.platforms, this.player, () => {
            this.player.isJumping = false;
        });
    }

    createMovingPlatforms() {
        // Aggiungi le piattaforme come un gruppo di oggetti dinamici
        this.movingPlatforms = this.physics.add.group();
        this.movingPlatforms.create(4800, Phaser.Math.Between(this.game.config.height - 100, this.game.config.height - 400), 'platform');
        this.movingPlatforms.create(6600, Phaser.Math.Between(this.game.config.height - 100, this.game.config.height - 400), 'platform');
        this.movingPlatforms.create(7200, Phaser.Math.Between(this.game.config.height - 100, this.game.config.height - 400), 'platform');
        // ...sottrai le piattaforme all'effetto della gravità!
        this.movingPlatforms.children.iterate( function (platform) {
                platform.setImmovable(true);
                platform.body.allowGravity = false;
                platform.body.setVelocityX(Phaser.Math.Between(-100, 100));
        });

        // Rendi le piattaforme "solide". Se il giocatore è su una piattaforma
        // allora il suo stato è "non sta saltando" (questo per riprodurre l'animazione
        // del giocatore fermo).
        this.physics.add.collider(this.movingPlatforms, this.player, () => {
            this.player.isJumping = false;
        });
    }

    update() {
        // Azioni che vengono eseguite a ogni frame del gioco
        this.player.manageMovements();
        this.animateBackground();
        this.randomPlatformsMovementChange();
    }

    animateBackground() {
        this.background.tilePositionX = this.cameras.main.scrollX * 0.5;
        this.cameras.main.followOffset.y = this.player.body.y + this.player.height/2 - this.game.config.height / 2;
    }

    randomPlatformsMovementChange() {
        this.movingPlatforms.children.iterate( function (platform) {
            // Genera un cambio di velocità casuale (destra o sinistra) con una probabilità
            // 1 su 100 (ricordiamo che la update() viene invocata diverse volte al secondo).
            // Cosa accadrebbe se variassiamo velocità ad ogni frame, quindi N volte al secondo?
            if (Phaser.Math.Between(0, 100) == 50) {
                const updatedSpeed = Phaser.Math.Between(-100, 100);
                platform.body.setVelocityX(updatedSpeed);
            }
        });
    }

    updateScore(player, mushroom) {
        // Rimuove il funghetto dalla scena
        mushroom.destroy();
        // Aggiorna il punteggio
        this.game.gameState.score += 10;
        this.scoreBox.setText("Score: " + this.game.gameState.score);
    }
}