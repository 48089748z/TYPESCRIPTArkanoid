var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="phaser/phaser.d.ts"/>
var Point = Phaser.Point;
var mainState = (function (_super) {
    __extends(mainState, _super);
    function mainState() {
        _super.apply(this, arguments);
        this.score = 0;
        this.lives = 3;
        this.BALL_START_SPEED = 250;
        this.BALL_MAX_SPEED = 800;
        this.HORIZONTAL_SPACE_BETWEEN_ELEMENTS = 100;
        this.VERTICAL_SPACE_BETWEEN_ELEMENTS = 60;
        this.SPACE_UNDER_PADDLE = 15;
        this.SCORE_FOR_POWER_UP = 100;
    }
    mainState.prototype.preload = function () {
        _super.prototype.preload.call(this);
        this.load.image('paddle', 'assets/png/paddleRed.png');
        this.load.image('blue_element', 'assets/png/element_blue_rectangle_glossy.png');
        this.load.image('red_element', 'assets/png/element_red_rectangle_glossy.png');
        this.load.image('ball', 'assets/png/ballBlue.png');
        this.load.image('star', 'assets/png/particleStar.png');
        this.physics.startSystem(Phaser.Physics.ARCADE);
    };
    mainState.prototype.create = function () {
        _super.prototype.create.call(this);
        this.configMAP();
        this.configELEMENTS();
        this.configPADDLE();
        this.configBALL();
    };
    mainState.prototype.update = function () {
        _super.prototype.update.call(this);
        this.physics.arcade.collide(this.paddle, this.ball, this.speedUpBall, null, this);
        this.physics.arcade.collide(this.ball, this.elements, this.killElement, null, this);
        this.paddle.position.x = this.game.input.x;
        if (this.elements.countLiving() == 0) {
            this.information.setText(' YOU HAVE WON THE GAME!\n You get extra 100 score/live\n YOUR FINAL SCORE IS: ' + this.score + this.lives * 100 + "\n\n CLICK ANYWHERE TO RESTART");
            this.input.onTap.addOnce(this.restart);
        }
        if (this.score <= this.SCORE_FOR_POWER_UP) {
            this.input.onTap.addOnce(this.shoot, this);
        }
    };
    mainState.prototype.shoot = function () {
        //this.star = this.add.sprite(this.world.centerX, this.world.centerY, 'star');
        //this.physics.enable(this.star);
    };
    mainState.prototype.killElement = function (ball, element) {
        element.kill();
        this.score = this.score + 10;
        this.score_text.setText("SCORE: " + this.score);
    };
    mainState.prototype.speedUpBall = function (playerPaddle, ball) {
        if (this.ball.body.velocity.x < this.BALL_MAX_SPEED) {
            this.ball.body.velocity.x = this.ball.body.velocity.x + 25;
            this.ball.body.velocity.y = this.ball.body.velocity.y + 25;
        }
    };
    mainState.prototype.configMAP = function () {
        this.physics.arcade.checkCollision.down = false;
        this.game.stage.backgroundColor = "#6E6E6E";
        this.information = this.add.text(this.world.centerX - 300, this.world.centerY, '', { font: "40px Arial", fill: "#ffffff" });
        this.information.fixedToCamera = true;
        this.lives_text = this.add.text(0, 0, '  LIVES: ' + this.lives, { font: "40px Arial", fill: "#ffffff" });
        this.lives_text.fixedToCamera = true;
        this.score_text = this.add.text(this.world.centerX, 0, 'SCORE: ' + this.score, { font: "40px Arial", fill: "#ffffff" });
        this.score_text.fixedToCamera = true;
    };
    mainState.prototype.configELEMENTS = function () {
        this.elements = this.add.group();
        this.elements.enableBody = true;
        for (var line = 0; line < 5; line++) {
            for (var column = 0; column < 10; column++) {
                var COLOUR;
                if (line % 2 == 0) {
                    COLOUR = 'red_element';
                }
                else {
                    COLOUR = 'blue_element';
                }
                var newElement = new Elemento(this.game, this.HORIZONTAL_SPACE_BETWEEN_ELEMENTS * column, line * this.VERTICAL_SPACE_BETWEEN_ELEMENTS + 50, COLOUR, 0);
                this.add.existing(newElement);
                this.elements.add(newElement);
            }
        }
    };
    mainState.prototype.configPADDLE = function () {
        this.paddle = this.add.sprite(this.world.centerX, 0, 'paddle');
        this.physics.enable(this.paddle);
        this.paddle.y = this.world.height - this.paddle.height - this.SPACE_UNDER_PADDLE;
        this.paddle.body.immovable = true;
    };
    mainState.prototype.configBALL = function () {
        this.ball = this.add.sprite(this.world.centerX, 500, 'ball');
        this.physics.enable(this.ball);
        this.ball.x = this.world.centerX;
        this.ball.y = this.world.centerY;
        this.ball.body.collideWorldBounds = true;
        this.ball.body.velocity.x = this.BALL_START_SPEED;
        this.ball.body.velocity.y = this.BALL_START_SPEED;
        this.ball.body.bounce.setTo(1);
        this.ball.checkWorldBounds = true;
        this.ball.events.onOutOfBounds.add(this.killBall, this);
    };
    mainState.prototype.killBall = function (ball) {
        ball.kill();
        this.lives = this.lives - 1;
        this.lives_text.setText('  LIVES: ' + this.lives);
        if (this.lives == 0) {
            this.information.setText(' GAME OVER! \nCLICK ANYWHERE TO RESTART');
            this.input.onTap.addOnce(this.restart, this);
        }
        else {
            this.configBALL();
        }
    };
    mainState.prototype.restart = function () {
        this.lives = 3;
        this.score = 0;
        this.game.state.restart();
    };
    return mainState;
})(Phaser.State);
var Elemento = (function (_super) {
    __extends(Elemento, _super);
    function Elemento(game, x, y, key, frame) {
        _super.call(this, game, x, y, key, frame);
        this.game.physics.enable(this, Phaser.Physics.ARCADE);
        this.body.immovable = true;
    }
    return Elemento;
})(Phaser.Sprite);
var Arkanoid = (function () {
    function Arkanoid() {
        this.game = new Phaser.Game(980, 700, Phaser.AUTO, 'gameDiv');
        this.game.state.add('main', mainState);
        this.game.state.start('main');
    }
    return Arkanoid;
})();
window.onload = function () {
    var game = new Arkanoid();
};
//# sourceMappingURL=main.js.map