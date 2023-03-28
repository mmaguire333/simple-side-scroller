class Game {
  constructor() {
    this.world = {
      backgroundColor: 'lightblue',

      width: 1000,
      height: 400,

      gravity: 10,
      friction: 0.9,

      player: new Game.Player(200, 100),

      boundaryCollision(playerObject) {
        if (playerObject.x < 0) {
          playerObject.x = 0;
          playerObject.xVelocity = 0;
        }

        if (playerObject.x > this.width - playerObject.width) {
          playerObject.x = this.width - playerObject.width;
          playerObject.xVelocity = 0;
        }

        if (playerObject.y < 0) {
          playerObject.y = 0;
          playerObject.yVelocity = 0;
        }

        if (playerObject > this.height - playerObject.height) {
          playerObject.y = this.height - playerObject.height;
          playerObject.yVelocity = 0;
        }
      },

      updateWorld() {
        // players y velocity increases continuously due to gravity, but will be 0 if not jumping due to boundary collision with floor
        this.player.yVelocity += this.gravity;
        this.player.updatePosition();

        // player velocity should decrease over time if not (actively moving i.e. friction)
        this.player.xVelocity *= this.friction;
        this.player.yVelocity *= this.friction;

        // check if hitting boundary and adjust position and velocity accordingly
        this.boundaryCollision(this.player);
      },
    };
  }

  // allow the function that updates the world to be called from a game object
  updateGame() {
    this.world.updateWorld();
  }
}

Game.Player = class {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.xVelocity = 0;
    this.yVelocity = 0;
    this.width = 50;
    this.height = 50;
    this.isJumping = false;
  }

  jump() {
    this.isJumping = true;
    this.yVelocity = -50;
  }

  moveLeft() {
    this.xVelocity -= 5;
  }

  moveRight() {
    this.yVelocity += 5;
  }

  updatePosition() {
    this.x += this.xVelocity;
    this.y += this.yVelocity;
  }
};
