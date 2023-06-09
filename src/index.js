import Game from './game';
import Display from './display';
import Controller from './controller';
import Engine from './engine';

// function to resize on screen canvas
const resize = function() {
    let margin = 0;
    if(document.body.clientWidth > 1650) {
        margin = 250
    } else {
        margin = 40;
    }

    display.resize(document.body.clientWidth - margin, document.body.clientHeight - margin, game.world.height / game.world.width);
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
    display.drawNextLevel(7645 + game.world.backgroundOffset, 300);
    
    let state = 'idle';
    let sheet = game.world.player.idleSpriteSheet;

    if(game.world.player.isJumping) {
        if(game.world.player.xVelocity >= 0) {
            state = 'jump';
            sheet = game.world.player.jumpSpriteSheet;
        } else {
            state = 'jump backwards';
            sheet = game.world.player.jumpBackwardsSpriteSheet;
        }
    } else {
        if(controller.right.isDown) {
            state = 'run';
            sheet = game.world.player.runSpriteSheet;
        } else if(controller.left.isDown) {
            state = 'run backwards';
            sheet = game.world.player.runBackwardsSpriteSheet;
        } else {
            state = 'idle';
            sheet = game.world.player.idleSpriteSheet;
        }
    }


    let position = Math.floor(display.gameFrame / display.staggerFrames) % game.world.player.spriteAnimations[state].loc.length;
    let frameX = game.world.player.spriteAnimations[state].loc[position].x;
    let frameY = game.world.player.spriteAnimations[state].loc[position].y;

    // the backwards sprite sheets are mirrored, but the order of the images is not reversed. Therefore, we must animate the mirrored sheets in reverse order.
    if(state === 'run backwards' || state === 'jump backward' || state === 'idle backwards') {
        display.drawPlayer(sheet, -20 + (120 * game.world.player.spriteAnimations[state].loc.length) - frameX, frameY, 30, 40, game.world.player.x, game.world.player.y, game.world.player.width, game.world.player.height);
    } else {
        display.drawPlayer(sheet, frameX, frameY, 30, 40, game.world.player.x, game.world.player.y, game.world.player.width, game.world.player.height);
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

window.addEventListener('resize', () => {
    resize();
});

// sets background image src once image is loaded
game.world.backgroundImage.src = './platform-sidescroller-background.png';

// sets the tileset image src
display.tiles.image.src = './tilesets/SET1_Mainlev_build.png';

// sets player spritesheet images
game.world.player.idleSpriteSheet.src = './character_spritesheets/Idle.png';
game.world.player.idleBackwardsSpriteSheet.src = './character_spritesheets/Idle_mirrored.png';
game.world.player.runSpriteSheet.src = './character_spritesheets/Run.png';
game.world.player.runBackwardsSpriteSheet.src = './character_spritesheets/Run_mirrored.png'; 
game.world.player.jumpSpriteSheet.src = './character_spritesheets/Jump.png';
game.world.player.jumpBackwardsSpriteSheet.src = './character_spritesheets/Jump_mirrored.png';
game.world.player.jumpFallTransitionSpriteSheet.src = './character_spritesheets/JumpFallInbetween.png';
game.world.player.jumpFallTransitionBackwardsSpriteSheet.src = './character_spritesheets/JumpFallInbetween_mirrored.png';

// loads data about the sprite sheets into the players spriteAnimations array
game.world.player.populateSpriteAnimations();

// loads tilemap into game.world tilemap variable and tileset image into display.tileset src
// this is done asyncronously (loadMaps is async function), so we resolve the promise before starting game engine
game.world.loadMaps('./tilemaps/platform-sidescroller.json').then(() => {
    resize();
    engine.start();
});