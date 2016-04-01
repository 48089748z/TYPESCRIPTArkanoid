/// <reference path="phaser/phaser.d.ts"/>
import Point = Phaser.Point;
class mainState extends Phaser.State
{
    private playerPaddle:Phaser.Sprite;
    private ball:Phaser.Sprite;
    private elements:Phaser.Group;

    private score = 0;
    private score_text:Phaser.Text;
    private lives = 3;
    private lives_text:Phaser.Text;

    private BALL_CONSTANT_SPEED = 250;
    private HORIZONTAL_SPACE_BETWEEN_ELEMENTS = 100;
    private VERTICAL_SPACE_BETWEEN_ELEMENTS = 60;
    preload():void
    {
        super.preload();
        this.load.image('playerPaddle', 'assets/png/paddleRed.png');
        this.load.image('blue_element', 'assets/png/element_blue_rectangle_glossy.png');
        this.load.image('red_element',  'assets/png/element_red_rectangle_glossy.png');
        this.load.image('ball',         'assets/png/ballBlue.png');
        this.physics.startSystem(Phaser.Physics.ARCADE);
    }

    create():void
    {
        super.create();
        this.configMAP();
        this.configELEMENTS();
        this.configPADDLEBALL();
    }
    update():void
    {
        super.update();
        this.physics.arcade.collide(this.playerPaddle, this.ball);
        this.physics.arcade.collide(this.ball, this.elements, this.killElement, null, this);
        this.playerPaddle.position.x = this.game.input.x;
    }
    private killElement(ball:Phaser.Sprite, element:Phaser.Sprite)
    {
        element.kill();
        this.score = this.score + 10;
        this.score_text.setText("SCORE: "+this.score);
    }
    configMAP()
    {
        this.game.stage.backgroundColor = "#6E6E6E";
        this.lives_text = this.add.text(0, 0, 'LIVES: ' + this.lives, {font: "40px Arial", fill: "#ffffff"});
        this.score_text = this.add.text(this.world.centerX,0, 'SCORE: ' + this.score, {font: "40px Arial", fill: "#ffffff"});
        this.lives_text.fixedToCamera = true;
        this.score_text.fixedToCamera = true;
    }
    configELEMENTS()
    {
        this.elements = this.add.group();
        this.elements.enableBody = true;
        for (var line = 0; line < 5; line++) //CREAMOS 5 LINEAS
        {
            for (var column = 0; column < 10; column++) //Y 10 COLUMNAS
            {
                var colour;
                if (line % 2 == 0){colour = 'red_element'}
                else{colour = 'blue_element'}
                var newElement = new Elemento(this.game, this.HORIZONTAL_SPACE_BETWEEN_ELEMENTS*column, line*this.VERTICAL_SPACE_BETWEEN_ELEMENTS+50, colour, 0);
                this.add.existing(newElement);
                this.elements.add(newElement);
            }
        }
    }
    configPADDLEBALL()
    {
        this.playerPaddle = this.add.sprite(this.world.centerX, 0, 'playerPaddle');
        this.physics.enable(this.playerPaddle);
        this.playerPaddle.x = this.world.centerX;
        this.playerPaddle.y = this.world.height - this.playerPaddle.height;
        this.playerPaddle.body.collideWorldBounds = true;
        this.playerPaddle.body.bounce.setTo(0);
        this.playerPaddle.body.immovable = true;


        this.ball = this.add.sprite(this.world.centerX, 500, 'ball');
        this.physics.enable(this.ball);
        this.ball.x =this.world.centerX;
        this.ball.y =  this.world.centerY;
        this.ball.body.collideWorldBounds = true;
        this.ball.body.velocity.x = this.BALL_CONSTANT_SPEED;
        this.ball.body.velocity.y = this.BALL_CONSTANT_SPEED;
        this.ball.body.bounce.setTo(1);
    }
}

class Elemento extends Phaser.Sprite
{
    constructor(game:Phaser.Game, x:number, y:number, key:string|Phaser.RenderTexture|Phaser.BitmapData|PIXI.Texture, frame:string|number)
    {
        super(game, x, y, key, frame);
        this.game.physics.enable(this, Phaser.Physics.ARCADE);
        this.body.immovable = true;
    }
}
class Arkanoid {
    game:Phaser.Game;
    constructor() {
        this.game = new Phaser.Game(1000, 700, Phaser.AUTO, 'gameDiv');
        this.game.state.add('main', mainState);
        this.game.state.start('main');
    }
}
window.onload = () => {
    var game = new Arkanoid();
};
