class SceneMain extends Phaser.Scene {
    constructor() {
        super('SceneMain');
    }
    preload() {}
    create() {
        this.score = 0;

        this.platGroup = this.physics.add.group();
        this.coinGroup = this.physics.add.group();

        this.aGrid = new AlignGrid({
            scene: this,
            rows: 11,
            cols: 11
        });
        //this.aGrid.showNumbers();

        this.ball = this.physics.add.sprite(0, 0, 'ball');

        this.aGrid.placeAtIndex(16, this.ball);
        Align.scaleToGameW(this.ball, 0.05);

        this.ball.setGravity(0, 400);
        this.ball.setBounce(0.5);

        this.time.addEvent({
            delay: 2000,
            callback: this.makePlat,
            callbackScope: this,
            loop: true
        });

        this.time.addEvent({
            delay: 3100,
            callback: this.addCoin,
            callbackScope: this,
            loop: true
        });

        this.setColliders();

        this.input.on('pointerdown', this.moveBall, this);
        // create initial platform
        this.makePlat();

        this.scoreText = this.add
            .text(0, 0, 'Score: 0', {
                color: '#ffffff',
                fontSize: game.config.width / 15
            })
            .setOrigin(0.5);
        this.aGrid.placeAtIndex(16, this.scoreText);
        //textfield default origin 0,0, image or sprite is .5
    }

    setColliders() {
        this.physics.add.collider(this.ball, this.platGroup, this.hitPlat);
        this.physics.add.collider(
            this.ball,
            this.coinGroup,
            this.takeCoin,
            null,
            this
        );
    }

    //  if player clicks right of ball, move right, otherwise left
    moveBall(pointer) {
        if (pointer.x > this.ball.x) {
            this.ball.setVelocityX(100);
        } else {
            this.ball.setVelocityX(-100);
        }
    }

    addCoin() {
        var xx = Phaser.Math.Between(0, game.config.width);
        var yy = game.config.height * 0.95;

        var coin = this.physics.add.sprite(xx, yy, 'coin');
        Align.scaleToGameW(coin, 0.05);
        this.coinGroup.add(coin);
        coin.setImmovable();
        coin.setVelocityY(-100);
    }

    makePlat() {
        var xx = Phaser.Math.Between(0, game.config.width);
        var ww = Phaser.Math.Between(1, 3);
        if (this.platGroup.children.entries.length == 0) {
            xx = game.config.width / 2;
            ww = 3;
        }
        var yy = game.config.height * 0.95;

        var plat = this.physics.add.sprite(0, 0, 'block');
        // add to group immediately or physics properties will be destroyed
        this.platGroup.add(plat);
        plat.setImmovable();
        plat.x = xx;
        plat.y = yy;

        plat.displayHeight = game.config.height * 0.05;

        plat.displayWidth *= ww;

        plat.setVelocityY(-100);
    }

    takeCoin(ball, coin) {
        coin.destroy();
        this.score += 100;
        this.scoreText.setText('Score: ' + this.score);
    }

    update() {
        this.platGroup.children.iterate(
            function(child) {
                if (child) {
                    if (child.y < 0) {
                        child.destroy();
                    }
                }
            }.bind(this)
        );

        if (
            this.ball.x > game.config.width ||
            this.ball.x < 0 ||
            this.ball.y < 0 ||
            this.ball.y > game.config.height
        ) {
            this.scene.start('SceneOver');
        }
    }
}
