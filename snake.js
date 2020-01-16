/**
 * Global Variables
 */
var appleX = 15,
    appleY = 15,
    canvas, 
    ctx,
    fps = 15,
    lives = 3,
    playerX = 10,
    playerY = 10,
    score = 0,
    tileSize = 20,
    tileCount = 30,
    trail = new Array(),
    tailLength = 5,
    velocityX = 0,
    velocityY = 0;

/**
 * Global Functions
 */
function decrementLives() {
    lives--;
    if(lives == 0) gameOver();
}

function draw() {
    playerX += velocityX;
    playerY += velocityY;

    // wrap the game boundaries
    /*
    if(playerX < 0) {
        playerX = tileCount - 1;
    }
    if(playerX > tileCount - 1) {
        playerX = 0;
    }
    if(playerY < 0) {
        playerY = tileCount - 1;
    }
    if(playerY > tileCount - 1) {
        playerY = 0;
    }
    */

    // don't wrap the game boundaries
    if(playerX < -1 
        || playerX > tileCount
        || playerY < -1
        || playerY > tileCount)
    {
        decrementLives();
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
        
        // detect segment-collision with player
        if(segmentX == playerX && segmentY == playerY) {
            tailLength = 5;
            if(velocityY != 0 || velocityX != 0) {
                decrementLives();
                reset();
            }
        }

        // relocate the apple if it's covered by a tail segment
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
        if(tailLength % 5 == 0) lives++;

        score += Math.floor(100 * (tailLength / 5));
        appleX = randomTileIndex();
        appleY = randomTileIndex();
    }

    // draw the apple
    ctx.fillStyle = 'red';
    ctx.fillRect(appleX * tileSize, appleY * tileSize, 
        tileSize - 2, tileSize - 2);

    // display score and lives
    ctx.fillStyle = 'white';
    ctx.font = '16px sans-serif';
    ctx.fillText('Score: ' + score, 15, 20);
    var livesTxt = 'Lives: ';
    if(lives <= 4) {
        for(i = 0; i < lives; i++) {
            livesTxt += '$ ';
        }
    }
    else {
        livesTxt += lives;
    }
    ctx.fillText(livesTxt, 490, 20);
}

function gameOver() {
    alert("Game Over!");
    lives = 3;
    score = 0;
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
