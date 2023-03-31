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
    display.drawRectangle(game.world.player.x, game.world.player.y, game.world.player.width, game.world.player.height, 'red');
    display.render();

    // update offset for scrolling effect
    game.world.backgroundOffset -= game.world.scrollSpeed;
    if(game.world.backgroundOffset > 0) {
        game.world.backgroundOffset = 0;
    }

    if(game.world.backgroundOffset < -7000) {
        game.world.backgroundOffset = -7000;
    }
}

// function to update state of game world based on user input
const update = function() {
    if(controller.left.isDown) {
        game.world.player.moveLeft();
        game.world.scrollSpeed = -7;
    }

    if(controller.right.isDown) {
        game.world.player.moveRight();
        game.world.scrollSpeed = 7;
    }

    if(!controller.left.isDown && !controller.right.isDown) {
        game.world.scrollSpeed = 0
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


// FIXME -- find a better way to do this, right now it is just a cheap way to make sure all the images and tilemap are loaded before starting engine
setTimeout(() => {
    resize();
    engine.start();
}, 500);