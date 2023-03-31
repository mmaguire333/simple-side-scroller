class Game {
  constructor() {
    this.world = {
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
      backgroundImage: new Image(),
      backgroundOffset: 0,
      scrollSpeed: 0,

      width: 1000,
      height: 400,

      gravity: 3,
      friction: 0.85,
      drag: 0.95,

      player: new Game.Player(400, 100),

      tilemap: undefined,

      loadTilemap(data) {
        fetch(data)
        .then((response) => response.json())
        .then((json) => { 
          this.tilemap = json.layers[2].data;
        });
      },

      boundaryCollision(playerObject) {
        if (playerObject.x < this.width * 0.25) {
          playerObject.x = this.width * 0.25;
          playerObject.xVelocity = 0;
        } else if (playerObject.x > this.width * 0.75 - playerObject.width) {
          playerObject.x = this.width * 0.75 - playerObject.width;
          playerObject.xVelocity = 0;
        }

        if (playerObject.y < 0) {
          playerObject.y = 0;
          playerObject.yVelocity = 0;
        } else if (playerObject.y > this.height - playerObject.height) {
          playerObject.isJumping = false;
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
        this.player.yVelocity *= this.drag;

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
    if(!this.isJumping) {
      this.isJumping = true;
      this.yVelocity = -40;
    }
  }

  moveLeft() {
    this.xVelocity -= 2;
  }

  moveRight() {
    this.xVelocity += 2;
  }

  updatePosition() {
    this.x += this.xVelocity;
    this.y += this.yVelocity;
  }
};
