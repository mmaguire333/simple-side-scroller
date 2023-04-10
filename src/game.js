export default class Game {
  constructor() {
    this.world = {
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
      backgroundImage: new Image(),
      backgroundOffset: 0,
      scrollSpeed: 8,

      width: 1000,
      height: 400,

      gravity: 2.75,
      friction: 0.85,
      drag: 0.9,

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

      getAdjacentIndices(x, y) {
        let indices = [];
        let col = Math.floor(x / this.tileSize);
        let row = Math.floor(y / this.tileSize);

        // adds all indices of tiles within 16px to the left of x, 48px to the right of x, 16px above y, and 64px below y
        indices.push((col - 1) + ((row - 1) * this.numColumns));
        indices.push(col + ((row - 1) * this.numColumns));
        indices.push((col + 1) + ((row - 1) * this.numColumns));
        indices.push((col + 2) + ((row - 1) * this.numColumns));
        indices.push((col + 3) + ((row - 1) * this.numColumns));
        indices.push((col + 4) + ((row - 1) * this.numColumns));

        indices.push((col - 1) + (row * this.numColumns));
        indices.push(col + (row * this.numColumns));
        indices.push((col + 1) + (row * this.numColumns));
        indices.push((col + 2) + (row  * this.numColumns));
        indices.push((col + 3) + (row  * this.numColumns));
        indices.push((col + 4) + (row * this.numColumns));

        indices.push((col - 1) + ((row + 1) * this.numColumns));
        indices.push(col + ((row + 1) * this.numColumns));
        indices.push((col + 1) + ((row + 1) * this.numColumns));
        indices.push((col + 2) + ((row + 1) * this.numColumns));
        indices.push((col + 3) + ((row + 1) * this.numColumns));
        indices.push((col + 4) + ((row + 1) * this.numColumns));

        indices.push((col - 1) + ((row + 2) * this.numColumns));
        indices.push(col + ((row + 2) * this.numColumns));
        indices.push((col + 1) + ((row + 2) * this.numColumns));
        indices.push((col + 2) + ((row + 2) * this.numColumns));
        indices.push((col + 3) + ((row + 2) * this.numColumns));
        indices.push((col + 4) + ((row + 2) * this.numColumns));

        indices.push((col - 1) + ((row + 3) * this.numColumns));
        indices.push(col + ((row + 3) * this.numColumns));
        indices.push((col + 1) + ((row + 3) * this.numColumns));
        indices.push((col + 2) + ((row + 3) * this.numColumns));
        indices.push((col + 3) + ((row + 3) * this.numColumns));
        indices.push((col + 4) + ((row + 3) * this.numColumns));

        indices.push((col - 1) + ((row + 4) * this.numColumns));
        indices.push(col + ((row + 4) * this.numColumns));
        indices.push((col + 1) + ((row + 4) * this.numColumns));
        indices.push((col + 2) + ((row + 4) * this.numColumns));
        indices.push((col + 3) + ((row + 4) * this.numColumns));
        indices.push((col + 4) + ((row + 4) * this.numColumns));

        indices.push((col - 1) + ((row + 5) * this.numColumns));
        indices.push(col + ((row + 5) * this.numColumns));
        indices.push((col + 1) + ((row + 5) * this.numColumns));
        indices.push((col + 2) + ((row + 5) * this.numColumns));
        indices.push((col + 3) + ((row + 5) * this.numColumns));
        indices.push((col + 4) + ((row + 5) * this.numColumns));

        // filter out invalid indices
        indices = indices.filter(index => (index >= 0 && index < this.numColumns * this.numRows));
        return indices;
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
        let adjIndices = this.getAdjacentIndices(this.player.x - this.backgroundOffset, this.player.y);

        if(this.player.xVelocity > 0) {
          this.backgroundOffset -= this.scrollSpeed;

          for(let i = 0; i < adjIndices.length; i++) {
            if(this.collisionMap[adjIndices[i]] !== 0) {
              if(this.detectIntersection(this.player, this.tilePositions[adjIndices[i]], this.tileSize)) {
                this.backgroundOffset += this.scrollSpeed;
                break;
              }
            }
          }
        }
        
        if(this.player.xVelocity < 0) {
          this.backgroundOffset += this.scrollSpeed;

          for(let i = 0; i < adjIndices.length; i++) {
            if(this.collisionMap[adjIndices[i]] !== 0) {
              if(this.detectIntersection(this.player, this.tilePositions[adjIndices[i]], this.tileSize)) {
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

        // check for collisions only on adjacent tiles instead of all tiles in tilemap
        let adjIndices = this.getAdjacentIndices(this.player.x - this.backgroundOffset, this.player.y);

        for(let i = 0; i < adjIndices.length; i++) {
          if(this.collisionMap[adjIndices[i]] !== 0) {
            if(this.detectIntersection(this.player.horizontalRect, this.tilePositions[adjIndices[i]], this.tileSize)) {
              this.player.xVelocity = 0;
            }

            if(this.detectIntersection(this.player.verticalRect, this.tilePositions[adjIndices[i]], this.tileSize)) {
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
    this.width = 40;
    this.height = 60;
    this.horizontalRect = {x: 0, y: 0, width: this.width, height: this.height};
    this.verticalRect = {x: 0, y: 0, width: this.width, height: this.height};
    this.isJumping = true;
    this.idleSpriteSheet = new Image();
    this.idleBackwardsSpriteSheet = new Image();
    this.runSpriteSheet = new Image();
    this.runBackwardsSpriteSheet = new Image();
    this.jumpSpriteSheet = new Image();
    this.jumpBackwardsSpriteSheet = new Image();
    this.jumpFallTransitionSpriteSheet = new Image();
    this.jumpFallTransitionBackwardsSpriteSheet = new Image();
    this.spriteAnimations = {};
    this.animationStates = [
      {
        name: 'idle',
        frames: 10
      },
      {
        name: 'idle backwards',
        frames: 10
      },
      {
        name: 'jump',
        frames: 3
      },
      {
        name: 'jump backwards',
        frames: 3
      },
      {
        name: 'run',
        frames: 10
      },
      {
        name: 'run backwards',
        frames: 10,
      },
      {
        name: 'jump fall transition',
        frames: 2
      },
      {
        name: 'jump fall transition backwards',
        frames: 2
      }
    ];
  }

  populateSpriteAnimations() {
    this.animationStates.forEach((state, index) => {
      let frames = {
        loc: []
      }

      for(let i = 0; i < state.frames; i++) {
        let positionX = -1;
        let positionY = -1;

        if(index % 2 === 0) {
          positionX = i * 120 + 40;
          positionY = 40;
        } else {
          positionX = i * 120 + 48;
          positionY = 40;
        }
        
        frames.loc.push({x: positionX, y: positionY});
      }

      this.spriteAnimations[state.name] = frames;
    });
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
