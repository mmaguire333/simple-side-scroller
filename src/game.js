class Game {
  constructor() {
    this.world = {
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
      backgroundImage: new Image(),
      backgroundOffset: 0,
      scrollSpeed: 9,

      width: 1000,
      height: 400,

      gravity: 3,
      friction: 0.85,
      drag: 0.95,

      player: new Game.Player(300, 100),

      tileSize: 16,
      numColumns: 500,
      numRows: 25,
      tilemap: [],
      collisionMap: [],
      tilePositions: [],

      loadTilemap(data) {
        fetch(data)
        .then((response) => response.json())
        .then((json) => { 
          let visMap = json.layers[2].data;
          let colMap = json.layers[3].data;
          for(let i = 0; i < visMap.length; i++) {
            this.tilemap.push(visMap[i]);
            this.collisionMap.push(colMap[i]);
            this.tilePositions.push({x: (i % this.numColumns) * this.tileSize, y: Math.floor(i / this.numColumns) * this.tileSize});
          }
        });
      },

      detectIntersection(playerObject, tile, tileSize) {
        if(playerObject.x - this.backgroundOffset + playerObject.width <= tile.x) {
          return false;
        } else if(playerObject.x - this.backgroundOffset >= tile.x + tileSize) {
          return false;
        } else if(playerObject.y + playerObject.height <= tile.y) {
          return false;
        } else if(playerObject.y >= tile.y + tileSize) {
          return false;
        } else {
          return true;
        }
      },

      boundaryCollision(playerObject) {
        // left and right boundary
        if (playerObject.x < this.width * 0.25) {
          playerObject.x = this.width * 0.25;
          playerObject.xVelocity = 0;
        } else if (playerObject.x > this.width * 0.75 - playerObject.width) {
          playerObject.x = this.width * 0.75 - playerObject.width;
          playerObject.xVelocity = 0;
        }
        
        // reset player at the beginning if they fall through the bottom
        if (playerObject.y > this.height) {
          playerObject.x = 300;
          playerObject.xVelocity = 0;
          playerObject.y = 100;
          playerObject.yVelocity = 0;
          this.backgroundOffset = 0;
        }
      },

      updateBackgroundOffset() {
        // update offset for scrolling effect
        // if the update causes a collision undo it
        if(this.player.xVelocity > 0) {
          this.backgroundOffset -= this.scrollSpeed;

          for(let i = 0; i < this.tilePositions.length; i++) {
            if(this.collisionMap[i] !== 0) {
              if(this.detectIntersection(this.player, this.tilePositions[i], this.tileSize)) {
                this.backgroundOffset += this.scrollSpeed;
                break;
              }
            }
          }
        }
        
        if(this.player.xVelocity < 0) {
          this.backgroundOffset += this.scrollSpeed;

          for(let i = 0; i < this.tilePositions.length; i++) {
            if(this.collisionMap[i] !== 0) {
              if(this.detectIntersection(this.player, this.tilePositions[i], this.tileSize)) {
                this.backgroundOffset -= this.scrollSpeed;
                break;
              }  
            }
          }
        }

        if(this.backgroundOffset > 0) {
          this.backgroundOffset = 0;
        }

        if(this.backgroundOffset < -7000) {
          this.backgroundOffset = -7000;
        }
      },

      updateWorld() {
        // players y velocity increases continuously due to gravity, but will be 0 if not jumping due to boundary collision with floor
        this.player.yVelocity += this.gravity;

        // player velocity should decrease over time if not (actively moving i.e. friction)
        this.player.xVelocity *= this.friction;
        this.player.yVelocity *= this.drag;

        // update velocity so that players coordinates are whole numbers
        if(this.player.xVelocity > 0) {
          this.player.xVelocity = Math.floor(this.player.xVelocity);
        } else {
          this.player.xVelocity = Math.ceil(this.player.xVelocity);
        }

        if(this.player.yVelocity > 0) {
          this.player.yVelocity = Math.floor(this.player.yVelocity);
        } else {
          this.player.yVelocity = Math.ceil(this.player.yVelocity);
        }
        

        // update horizontal and vertical collision rectangles
        this.player.horizontalRect.x = this.player.x + this.player.xVelocity;
        this.player.horizontalRect.y = this.player.y;
        this.player.verticalRect.x = this.player.x;
        this.player.verticalRect.y = this.player.y + this.player.yVelocity;

        for(let i = 0; i < this.tilePositions.length; i++) {
          if(this.collisionMap[i] !== 0) {
            if(this.detectIntersection(this.player.horizontalRect, this.tilePositions[i], this.tileSize)) {
              this.player.xVelocity = 0;
            }

            if(this.detectIntersection(this.player.verticalRect, this.tilePositions[i], this.tileSize)) {
              this.player.isJumping = false;
              this.player.yVelocity = 0;
            }
          }
          
        }

        // update player position
        this.player.updatePosition();
        
        //update background offset
        this.updateBackgroundOffset();

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
    this.width = 20;
    this.height = 38;
    this.horizontalRect = {x: 0, y: 0, width: this.width, height: this.height};
    this.verticalRect = {x: 0, y: 0, width: this.width, height: this.height};
    this.isJumping = true;
  }

  jump() {
    if(!this.isJumping) {
      this.isJumping = true;
      this.yVelocity = -35;
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
