const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const gameOverElement = document.getElementById('gameOver');

const gridSize = 20; // Size of each grid square in pixels
const tileCount = canvas.width / gridSize; // Number of tiles horizontally/vertically

let snake = [
    { x: 10, y: 10 } // Initial position (grid coordinates)
];
let dx = 0; // Horizontal velocity
let dy = 0; // Vertical velocity
let food = { x: 15, y: 15 }; // Initial food position
let score = 0;
let changingDirection = false; // Prevent rapid direction changes
let gameRunning = true;
let gameSpeed = 120; // Milliseconds between updates (lower is faster)
let gameLoopTimeout;

// --- Game Initialization ---
function initializeGame() {
    snake = [{ x: 10, y: 10 }];
    dx = 0;
    dy = 0;
    score = 0;
    scoreElement.textContent = score;
    gameOverElement.style.display = 'none';
    spawnFood();
    gameRunning = true;
    changingDirection = false;
    clearTimeout(gameLoopTimeout); // Clear any existing loop
    main(); // Start the game loop
}

// --- Main Game Loop ---
function main() {
    if (!gameRunning) return;

    changingDirection = false; // Allow direction change for next input

    gameLoopTimeout = setTimeout(() => {
        clearCanvas();
        moveSnake();
        drawFood();
        drawSnake();
        main(); // Repeat the loop
    }, gameSpeed);
}

// --- Drawing Functions ---
function clearCanvas() {
    context.fillStyle = 'white';
    context.fillRect(0, 0, canvas.width, canvas.height);
    // Optional: Draw grid lines
    // context.strokeStyle = '#eee';
    // for (let i = 0; i < tileCount; i++) {
    //     context.beginPath();
    //     context.moveTo(i * gridSize, 0);
    //     context.lineTo(i * gridSize, canvas.height);
    //     context.stroke();
    //     context.beginPath();
    //     context.moveTo(0, i * gridSize);
    //     context.lineTo(canvas.width, i * gridSize);
    //     context.stroke();
    // }
}

function drawSnakePart(part) {
    context.fillStyle = 'lightgreen';
    context.strokeStyle = 'darkgreen';
    context.fillRect(part.x * gridSize, part.y * gridSize, gridSize, gridSize);
    context.strokeRect(part.x * gridSize, part.y * gridSize, gridSize, gridSize);
}

function drawSnake() {
    snake.forEach(drawSnakePart);
}

function drawFood() {
    context.fillStyle = 'red';
    context.strokeStyle = 'darkred';
    context.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
    context.strokeRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
}

// --- Movement and Logic ---
function moveSnake() {
    // Calculate new head position
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };

    // Check for collisions
    if (checkCollision(head)) {
        endGame();
        return;
    }

    // Add new head
    snake.unshift(head);

    // Check if food is eaten
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreElement.textContent = score;
        spawnFood();
        // Increase speed slightly (optional)
        // if (gameSpeed > 50) gameSpeed -= 2;
    } else {
        // Remove tail if no food eaten
        snake.pop();
    }
}

function spawnFood() {
    while (true) {
        food.x = Math.floor(Math.random() * tileCount);
        food.y = Math.floor(Math.random() * tileCount);
        // Ensure food doesn't spawn on the snake
        let collision = false;
        for (let i = 0; i < snake.length; i++) {
            if (snake[i].x === food.x && snake[i].y === food.y) {
                collision = true;
                break;
            }
        }
        if (!collision) break; // Found an empty spot
    }
}

function changeDirection(event) {
    if (changingDirection) return; // Prevent changing direction twice before next move
    changingDirection = true;

    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;
    const R_KEY = 82; // For restarting

    const keyPressed = event.keyCode;

    const goingUp = dy === -1;
    const goingDown = dy === 1;
    const goingRight = dx === 1;
    const goingLeft = dx === -1;

    if (keyPressed === LEFT_KEY && !goingRight) { dx = -1; dy = 0; }
    if (keyPressed === UP_KEY && !goingDown) { dx = 0; dy = -1; }
    if (keyPressed === RIGHT_KEY && !goingLeft) { dx = 1; dy = 0; }
    if (keyPressed === DOWN_KEY && !goingUp) { dx = 0; dy = 1; }

    if (!gameRunning && keyPressed === R_KEY) {
        initializeGame();
    }
}

// --- Collision Detection ---
function checkCollision(head) {
    // Check wall collision
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        return true;
    }
    // Check self collision (ignore comparing head to itself)
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true;
        }
    }
    return false;
}

// --- Game State ---
function endGame() {
    gameRunning = false;
    clearTimeout(gameLoopTimeout);
    gameOverElement.style.display = 'block'; // Show game over message
}

// --- Event Listener ---
document.addEventListener('keydown', changeDirection);

// --- Start the game ---
initializeGame(); // Start everything when script loads
