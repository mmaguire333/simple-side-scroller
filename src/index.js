//import Game from './game'


// function to resize on screen canvas
const resize = function(event) {
    display.resize(document.documentElement.clientWidth - 32, document.documentElement.clientHeight - 32, game.world.height / game.world.width);
    display.render()
}

// function to render game world on screen
const render = function() {
    display.fill(game.world.backgroundColor);
    display.drawRectangle(game.world.player.x, game.world.player.y, game.world.player.width, game.world.player.height, 'red');
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

resize();

engine.start();