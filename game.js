const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const playerImages = {
    idle: new Image(),
    run1: new Image(),
    run2: new Image(),
};

playerImages.idle.src = "mario_idle.png";
playerImages.run1.src = "mario_run1.png";
playerImages.run2.src = "mario_run2.png";

const playerWidth = 50;
const playerHeight = 50;
const playerSpeed = 10;

const player = {
    x: 375,
    y: 500,
    width: playerWidth,
    height: playerHeight,
    animationFrame: 0,
    isRunning: false,
    isFacingLeft: false,
};

const barrelImg = new Image();
barrelImg.src = "barrel.png";
const barrelWidth = 50;
const barrelHeight = 50;
const barrelSpeed = 5;
const barrelSpawnRate = 50;
const barrels = [];

let score = 0;

function updatePlayer() {
    if (keys["ArrowLeft"] && player.x > 0) {
        player.x -= playerSpeed;
        player.isRunning = true;
        player.isFacingLeft = true;
    } else if (keys["ArrowRight"] && player.x < canvas.width - playerWidth) {
        player.x += playerSpeed;
        player.isRunning = true;
        player.isFacingLeft = false;
    } else {
        player.isRunning = false;
    }

    if (player.isRunning) {
        player.animationFrame = (player.animationFrame + 1) % 2;
        let imageToUse = player.isFacingLeft ? playerImages.run1 : playerImages.run2;
        ctx.save();
        if (player.isFacingLeft) {
            ctx.scale(-1, 1);
            ctx.drawImage(imageToUse, -player.x - playerWidth, player.y, playerWidth, playerHeight);
        } else {
            ctx.drawImage(imageToUse, player.x, player.y, playerWidth, playerHeight);
        }
        ctx.restore();
    } else {
        ctx.drawImage(playerImages.idle, player.x, player.y, playerWidth, playerHeight);
    }
}

function generateBarrel() {
    const barrelX = Math.random() * (canvas.width - barrelWidth);
    const barrelY = -barrelHeight;
    barrels.push({ x: barrelX, y: barrelY });
}

function updateBarrels() {
    for (let i = 0; i < barrels.length; i++) {
        barrels[i].y += barrelSpeed;

        if (barrels[i].y + barrelHeight > player.y &&
            barrels[i].y < player.y + player.height &&
            barrels[i].x + barrelWidth > player.x &&
            barrels[i].x < player.x + player.width) {
            gameOver();
        }

        if (barrels[i].y > canvas.height) {
            barrels.splice(i, 1);
            score++;
        }
    }
}

function drawBarrels() {
    for (let i = 0; i < barrels.length; i++) {
        ctx.drawImage(barrelImg, barrels[i].x, barrels[i].y, barrelWidth, barrelHeight);
    }
}

function displayScore() {
    ctx.fillStyle = "white";
    ctx.font = "24px Arial";
    ctx.fillText("Score: " + score, 10, 30);
}

function gameOver() {
    alert("Game Over! Your score: " + score);
    document.location.reload();
}

const keys = {};

window.addEventListener("keydown", function (e) {
    keys[e.key] = true;
});

window.addEventListener("keyup", function (e) {
    delete keys[e.key];
});

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    updatePlayer();

    if (Math.random() < 1 / barrelSpawnRate) {
        generateBarrel();
    }

    updateBarrels();
    drawBarrels();

    displayScore();

    requestAnimationFrame(gameLoop);
}

gameLoop();