const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const boxSize = 20;
const canvasSize = 400;
const snakeColor = "lime";
const foodColor = "red";
let score = 0;

let snake = [{ x: 200, y: 200 }];
let food = {
    x: Math.floor(Math.random() * (canvasSize / boxSize)) * boxSize,
    y: Math.floor(Math.random() * (canvasSize / boxSize)) * boxSize
};

let direction = "RIGHT";
let changingDirection = false;

document.addEventListener("keydown", changeDirection);

function changeDirection(event) {
    if (changingDirection) return;
    changingDirection = true;
    const keyPressed = event.keyCode;
    const goingUp = direction === "UP";
    const goingDown = direction === "DOWN";
    const goingLeft = direction === "LEFT";
    const goingRight = direction === "RIGHT";

    if (keyPressed === 37 && !goingRight) {
        direction = "LEFT";
    } else if (keyPressed === 38 && !goingDown) {
        direction = "UP";
    } else if (keyPressed === 39 && !goingLeft) {
        direction = "RIGHT";
    } else if (keyPressed === 40 && !goingUp) {
        direction = "DOWN";
    }
}

function drawBox(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, boxSize, boxSize);
}

function drawSnake() {
    snake.forEach((segment) => drawBox(segment.x, segment.y, snakeColor));
}

function moveSnake() {
    const head = { x: snake[0].x, y: snake[0].y };

    if (direction === "LEFT") head.x -= boxSize;
    if (direction === "UP") head.y -= boxSize;
    if (direction === "RIGHT") head.x += boxSize;
    if (direction === "DOWN") head.y += boxSize;

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score += 10;
        document.getElementById("score").innerText = `Score: ${score}`;
        generateFood();
    } else {
        snake.pop();
    }
}

function generateFood() {
    food.x = Math.floor(Math.random() * (canvasSize / boxSize)) * boxSize;
    food.y = Math.floor(Math.random() * (canvasSize / boxSize)) * boxSize;
    snake.forEach((segment) => {
        if (segment.x === food.x && segment.y === food.y) {
            generateFood();
        }
    });
}

function checkCollision() {
    const head = snake[0];

    if (head.x < 0 || head.x >= canvasSize || head.y < 0 || head.y >= canvasSize) {
        return true;
    }

    for (let i = 4; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true;
        }
    }

    return false;
}

function gameLoop() {
    if (checkCollision()) {
        alert("Game Over!");
        document.location.reload();
        return;
    }

    changingDirection = false;
    ctx.clearRect(0, 0, canvasSize, canvasSize);
    drawBox(food.x, food.y, foodColor);
    moveSnake();
    drawSnake();
    setTimeout(gameLoop, 100);
}

gameLoop();
