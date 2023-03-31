class Display {
    constructor(canvas) {
        this.buffer = document.createElement('canvas').getContext('2d');
        this.context = canvas.getContext('2d');
        this.tiles = new Display.Tileset(16, 34);
    }

    drawMap(map, numCols, mapTileSize, offset) {
        for(let i = 0; i < map.length; i++) {
            // the tileset were using to draw the platforms is the third tileset used when creating the background in tiled
            // checking the platform-sidescroller.json shows this tileset has a firstgid of 4740
            // therefore we substract 4740 to get the true index of the correct tile in the tileset
            let tileIndex = map[i] - 4740;

            let sx = (tileIndex % this.tiles.columns) * this.tiles.tileSize;
            let sy = Math.floor(tileIndex / this.tiles.columns) * this.tiles.tileSize;
            let dx = (i % numCols) * mapTileSize;
            let dy = Math.floor(i / numCols) * mapTileSize;

            this.buffer.drawImage(this.tiles.image, sx, sy, this.tiles.tileSize, this.tiles.tileSize, dx + offset, dy, mapTileSize, mapTileSize);
        }
    }

    drawBackground(image, offset) {
        this.buffer.drawImage(image, offset, 0);
    }

    drawRectangle(x, y, width, height, color) {
        this.buffer.fillStyle = color;
        this.buffer.fillRect(x, y, width, height);
    }

    fill(color) {
        this.buffer.fillStyle = color;
        this.buffer.fillRect(0, 0, this.buffer.canvas.width, this.buffer.canvas.height);
    }

    render() {
        this.context.drawImage(this.buffer.canvas, 0, 0, this.buffer.canvas.width, this.buffer.canvas.height, 0, 0, this.context.canvas.width, this.context.canvas.height);
    }

    resize(width, height, heightWidthRatio) {
        if(height / width > heightWidthRatio) {
            this.context.canvas.height = width * heightWidthRatio;
            this.context.canvas.width = width;
        } else {
            this.context.canvas.height = height;
            this.context.canvas.width = height / heightWidthRatio;
        }
    }
}

Display.Tileset = class {
    constructor(tileSize, columns) {
        this.image = new Image();
        this.tileSize = tileSize;
        this.columns = columns;
    }
}