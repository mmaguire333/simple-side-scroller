 class Controller {
    constructor() {
        this.left = new Controller.ButtonInput();
        this.right = new Controller.ButtonInput();
        this.up = new Controller.ButtonInput();
    }

    // function that is passed an event, if it's a keydown event the is down property on the corresponding key (up, left, right) will be set true
    // if its not a keydown event (then it will be key up event) the iskeydown property on corresponding key will be set false
    keyDownOrUp(event) {
        let isKeyDown;
        if(event.type === 'keydown') {
            isKeyDown = true;
        } else {
            isKeyDown = false;
        }

        if(event.key === 'ArrowLeft') {
            this.left.getInput(isKeyDown);
        } else if(event.key === 'ArrowUp') {
            this.up.getInput(isKeyDown);
        } else if(event.key === 'ArrowRight') {
            this.right.getInput(isKeyDown);
        }
    }
 }


 Controller.ButtonInput = class {
    constructor() {
        this.isDown = false;
    }

    // method to change isDown property of ButtonInput object (or leave it the same if input matches the current value)
    getInput(isDown) {
        if(this.isDown != isDown) {
            this.isDown = isDown;
        }
    }
 }