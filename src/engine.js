export default class Engine {
    constructor(timeStep, update, render) {
        this.timeStep = timeStep;
        this.accumulatedTime = 0;
        this.animationFrameRequest = undefined;
        this.time = undefined;
        this.updated = false;
        
        // update and render functions
        this.update = update;
        this.render = render;
        
        this.handleLoop = (timestamp) => {
            this.loop(timestamp);
        }
    }

    loop(timestamp) {
        this.accumulatedTime += timestamp - this.time;
        this.time = timestamp;

        // It is possible that the update takes longer than it takes for several frames to pass. In this case we say that if time equivalent to three full frames
        // has passed then we need to change the accumulated time so that we only call the update function once rather than allowing time to continue accumulating
        // which will then cause the update function to execute more and more times on each successive loop. This will at least prevent the time it takes the while
        // loop to execute from growing each loop
        if(this.accumulatedTime >= 3 * this.timeStep) {
            this.accumulatedTime = this.timeStep;
        }

        while(this.accumulatedTime >= this.timeStep) {
            this.accumulatedTime -= this.timeStep;
            this.update();
            this.updated = true;
        }

        if(this.updated) {
            this.updated = false;
            this.render();
        }

        this.animationFrameRequest = window.requestAnimationFrame(this.handleLoop);
    }
 
    start() {
      this.accumulatedTime = this.timeStep;
      this.time = window.performance.now();
      this.animationFrameRequest = window.requestAnimationFrame(this.handleLoop);  
    }

    stop() {
        window.cancelAnimationFrame(this.animationFrameRequest);
    }
}