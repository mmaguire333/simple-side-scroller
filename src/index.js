//import Game from './game'

// function to resize on screen canvas
const resize = function(event) {
    display.resize(document.documentElement.clientWidth - 32, document.documentElement.clientHeight - 32, game.world.height / game.world.width);
    display.render()
}

// function to render game world on screen
const render = function() {
    // clear content from previous frame
    display.buffer.clearRect(0, 0, display.buffer.canvas.width, display.buffer.canvas.height);
    display.context.clearRect(0, 0, display.context.canvas.width, display.context.canvas.height);

    // draw content for next frame
    display.drawBackground(game.world.backgroundImage, game.world.backgroundOffset);
    display.drawMap(game.world.tilemap, 500, 16, game.world.backgroundOffset);

    let currentSprite = game.world.player.jumpSpriteSheet;
    let frameCount = 0;
    if(game.world.player.isJumping) {
        frameCount = 3;
        if(game.world.player.xVelocity >= 0) {
            currentSprite = game.world.player.jumpSpriteSheet; 
        } else {
            currentSprite = game.world.player.jumpBackwardsSpriteSheet;
        }
    } else {
        frameCount = 10;
        if(controller.right.isDown) {
            currentSprite = game.world.player.runSpriteSheet;
        } else if(controller.left.isDown) {
            currentSprite = game.world.player.runBackwardsSpriteSheet;
        } else {
            currentSprite = game.world.player.idleSpriteSheet;
        }
    }

    if(currentSprite === game.world.player.runBackwardsSpriteSheet || currentSprite === game.world.player.jumpBackwardsSpriteSheet || currentSprite === game.world.player.idleBackwardsSpriteSheet) {
        display.drawPlayer(currentSprite, 48 + (120 * (frameCount - 1 - display.frameX)), 40, 30, 40, game.world.player.x, game.world.player.y, game.world.player.width, game.world.player.height);
    } else {
        display.drawPlayer(currentSprite, 40 + (120 * display.frameX), 40, 30, 40, game.world.player.x, game.world.player.y, game.world.player.width, game.world.player.height);
    }
   
    

    if(display.gameFrame % display.staggerFrames === 0) {
        if(display.frameX < frameCount - 1) {
            display.frameX++;
        } else {
            display.frameX = 0; 
        }
    }

    display.gameFrame++;

    display.render();
}

// function to update state of game world based on user input
const update = function() {
    if(controller.left.isDown) {
        game.world.player.moveLeft();
    }

    if(controller.right.isDown) {
        game.world.player.moveRight();
    }

    if(controller.up.isDown) {
        game.world.player.jump();
        controller.up.isDown = false;
    }

    game.updateGame();
}

// objects
const game = new Game();
const controller = new Controller();
const display = new Display(document.querySelector('canvas'));
const engine = new Engine(1000/30, update, render);

// sets the buffer canvas to the same width and height as game world
display.buffer.canvas.height = game.world.height;
display.buffer.canvas.width = game.world.width;

// event listeners

// sets isDown property for controller up, right, or left variable to true when up, right, or left key is down
window.addEventListener('keydown', (event) => {
    controller.keyDownOrUp(event);
});

// sets isDown property for controller up, right, or left variable to false when up, right, or left key is released
window.addEventListener('keyup', (event) => {
    controller.keyDownOrUp(event);
});

window.addEventListener('resize', (event) => {
    resize(event);
});

// loads tilemap into game.world tilemap variable and tileset image into display.tileset src
game.world.loadTilemap('../tilemaps/platform-sidescroller.json');

// sets background image src once image is loaded
game.world.backgroundImage.src = 'platform-sidescroller-background.png';

// sets the tileset image src
display.tiles.image.src = '../tilesets/SET1_Mainlev_build.png';

// sets player spritesheet images
game.world.player.idleSpriteSheet.src = '../character_spritesheets/_Idle.png';
game.world.player.idleBackwardsSpriteSheet.src = '../character_spritesheets/_Idle_mirrored.png';
game.world.player.runSpriteSheet.src = '../character_spritesheets/_Run.png';
game.world.player.runBackwardsSpriteSheet.src = '../character_spritesheets/_Run_mirrored.png'; 
game.world.player.jumpSpriteSheet.src = '../character_spritesheets/_Jump.png';
game.world.player.jumpBackwardsSpriteSheet.src = '../character_spritesheets/_Jump_mirrored.png';


// FIXME -- find a better way to do this, right now it is just a cheap way to make sure all the images and tilemap are loaded before starting engine
setTimeout(() => {
    resize();
    engine.start();
}, 500);