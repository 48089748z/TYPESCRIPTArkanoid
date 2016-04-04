/// <reference path="phaser/phaser.d.ts"/>
import Point = Phaser.Point;
class mainState extends Phaser.State
{
    private paddle:Phaser.Sprite;
    private ball:Phaser.Sprite;
    private elements:Phaser.Group;
    private star: Phaser.Sprite;

    private information:Phaser.Text;
    private score = 0;
    private score_text:Phaser.Text;
    private lives = 3;
    private lives_text:Phaser.Text;

    private BALL_START_SPEED = 250;
    private BALL_MAX_SPEED = 800;
    private HORIZONTAL_SPACE_BETWEEN_ELEMENTS = 100;
    private VERTICAL_SPACE_BETWEEN_ELEMENTS = 60;
    private SPACE_UNDER_PADDLE = 15;
    private SCORE_FOR_POWER_UP = 100;

    preload():void
    {
        super.preload();
        this.load.image('paddle', 'assets/png/paddleRed.png');
        this.load.image('blue_element', 'assets/png/element_blue_rectangle_glossy.png');
        this.load.image('red_element',  'assets/png/element_red_rectangle_glossy.png');
        this.load.image('ball',         'assets/png/ballBlue.png');
        this.load.image('star',         'assets/png/particleStar.png');
        this.physics.startSystem(Phaser.Physics.ARCADE);
    }
    create():void
    {
        super.create();
        this.configMAP();
        this.configELEMENTS();
        this.configPADDLE();
        this.configBALL();
    }
    update():void
    {
        super.update();
        this.physics.arcade.collide(this.paddle, this.ball, this.speedUpBall, null, this);
        this.physics.arcade.collide(this.ball, this.elements, this.killElement, null, this);
        this.paddle.position.x = this.game.input.x;
        if (this.elements.countLiving()==0)
        {
            this.information.setText(' YOU HAVE WON THE GAME!\n You get extra 100 score/live\n YOUR FINAL SCORE IS: '+this.score+this.lives*100+"\n\n CLICK ANYWHERE TO RESTART");
            this.input.onTap.addOnce(this.restart);
        }
        if (this.score<=this.SCORE_FOR_POWER_UP)
        {
            this.input.onTap.addOnce(this.shoot, this);
        }
    }
    private shoot()
    {
        //this.star = this.add.sprite(this.world.centerX, this.world.centerY, 'star');
        //this.physics.enable(this.star);
        this.information.setText('asdfgsdg');
    }
    private killElement(ball:Phaser.Sprite, element:Phaser.Sprite)
    {
        element.kill();
        this.score = this.score + 10;
        this.score_text.setText("SCORE: "+this.score);
    }
    private speedUpBall(playerPaddle:Phaser.Sprite, ball:Phaser.Sprite)
    {
        if (this.ball.body.velocity.x<this.BALL_MAX_SPEED)
        {
            this.ball.body.velocity.x = this.ball.body.velocity.x+25;
            this.ball.body.velocity.y = this.ball.body.velocity.y+25;
        }
    }
    configMAP()
    {
        this.physics.arcade.checkCollision.down = false;
        this.game.stage.backgroundColor = "#6E6E6E";
        this.information = this.add.text(this.world.centerX-300, this.world.centerY, '', {font: "40px Arial", fill: "#ffffff"});
        this.information.fixedToCamera = true;
        this.lives_text = this.add.text(0, 0, '  LIVES: ' + this.lives, {font: "40px Arial", fill: "#ffffff"});
        this.lives_text.fixedToCamera = true;
        this.score_text = this.add.text(this.world.centerX,0, 'SCORE: ' + this.score, {font: "40px Arial", fill: "#ffffff"});
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
                var COLOUR;
                if (line % 2 == 0){COLOUR = 'red_element'} else{COLOUR = 'blue_element'}
                var newElement = new Elemento(this.game, this.HORIZONTAL_SPACE_BETWEEN_ELEMENTS*column, line*this.VERTICAL_SPACE_BETWEEN_ELEMENTS+50, COLOUR, 0);
                this.add.existing(newElement);
                this.elements.add(newElement);
            }
        }
    }
    configPADDLE()
    {
        this.paddle = this.add.sprite(this.world.centerX, 0, 'paddle');
        this.physics.enable(this.paddle);
        this.paddle.y = this.world.height - this.paddle.height - this.SPACE_UNDER_PADDLE;
        this.paddle.body.immovable = true;
    }
    configBALL()
    {
        this.ball = this.add.sprite(this.world.centerX, 500, 'ball');
        this.physics.enable(this.ball);
        this.ball.x =this.world.centerX;
        this.ball.y =  this.world.centerY;
        this.ball.body.collideWorldBounds = true;
        this.ball.body.velocity.x = this.BALL_START_SPEED;
        this.ball.body.velocity.y = this.BALL_START_SPEED;
        this.ball.body.bounce.setTo(1);
        this.ball.checkWorldBounds = true;
        this.ball.events.onOutOfBounds.add(this.killBall, this);
    }
    killBall(ball:Phaser.Sprite)
    {
        ball.kill();
        this.lives = this.lives - 1;
        this.lives_text.setText('  LIVES: ' + this.lives);
        if (this.lives == 0)
        {
            this.information.setText(' GAME OVER! \nCLICK ANYWHERE TO RESTART');
            this.input.onTap.addOnce(this.restart, this);
        }
        else {this.configBALL();}
    }
    restart()
    {
        this.lives = 3;
        this.score = 0;
        this.game.state.restart();
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
        this.game = new Phaser.Game(980, 700, Phaser.AUTO, 'gameDiv');
        this.game.state.add('main', mainState);
        this.game.state.start('main');
    }
}
window.onload = () => {
    var game = new Arkanoid();
};
