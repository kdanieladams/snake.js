/**
 * Global Variables
 */
var appleX = 15,
    appleY = 15,
    canvas, 
    ctx,
    fps = 15,
    playerX = 10,
    playerY = 10,
    tileSize = 20,
    tileCount = 30,
    trail = new Array(),
    tailLength = 5,
    velocityX = 0,
    velocityY = 0;

/**
 * Global Functions
 */
function draw() {
    playerX += velocityX;
    playerY += velocityY;

    // wrap the game boundaries
    // if(playerX < 0) {
    //     playerX = tileCount - 1;
    // }
    // if(playerX > tileCount - 1) {
    //     playerX = 0;
    // }
    // if(playerY < 0) {
    //     playerY = tileCount - 1;
    // }
    // if(playerY > tileCount - 1) {
    //     playerY = 0;
    // }

    // don't wrap the game boundaries
    if(playerX < -1 
        || playerX > tileCount
        || playerY < -1
        || playerY > tileCount)
    {
        reset();
    }

    // draw the background
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // draw the snake
    ctx.fillStyle = 'lime';
    for(var i = 0; i < trail.length; i++) {
        var segmentX = trail[i].x,
            segmentY = trail[i].y;
        
        ctx.fillRect(segmentX * tileSize, segmentY * tileSize, 
            tileSize - 2, tileSize - 2);
        
        // detect collision with player
        if(segmentX == playerX && segmentY == playerY) {
            tailLength = 5;
            if(velocityY != 0 || velocityX != 0) reset();
        }

        // detect collision with apple
        if(segmentX == appleX && segmentY == appleY) {
            appleX = randomTileIndex();
            appleY = randomTileIndex();
        }
    }

    // determine snake length
    trail.push({ x: playerX, y: playerY });
    while(trail.length > tailLength) {
        trail.shift();
    }

    // detect collision with apple
    if(appleX == playerX && appleY == playerY) {
        tailLength++;
        appleX = randomTileIndex();
        appleY = randomTileIndex();
    }

    // draw the apple
    ctx.fillStyle = 'red';
    ctx.fillRect(appleX * tileSize, appleY * tileSize, 
        tileSize - 2, tileSize - 2);
}

function keyPush(event) {
    switch(event.code) {
        case "ArrowLeft":
        case "KeyA":
            velocityX = -1;
            velocityY = 0;
            break;
        case "ArrowUp":
        case "KeyW":
            velocityX = 0;
            velocityY = -1;
            break;
        case "ArrowRight":
        case "KeyD":
            velocityX = 1;
            velocityY = 0;
            break;
        case "ArrowDown":
        case "KeyS":
            velocityX = 0;
            velocityY = 1;
            break;
    }
}

function randomTileIndex() {
    // return within a margin of two tiles from the edge
    var margin = 2;
    var result = Math.floor(Math.random() * (tileCount - margin));

    return result < margin ? margin : result;
}

function reset() {
    appleX = randomTileIndex();
    appleY = randomTileIndex();
    playerX = randomTileIndex();
    playerY = randomTileIndex();
    velocityX = 0;
    velocityY = 0;
    trail = new Array();
}

/**
 * Start
 */
window.addEventListener('load', function(event){
    canvas = document.getElementById('snake_canvas');
    ctx = canvas.getContext('2d');

    document.addEventListener('keydown', keyPush);
    setInterval(draw, 1000 / fps);
});
