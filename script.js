// تحديد العناصر الأساسية
const initialImage = document.getElementById('initialImage');
// Get canvas and set dimensions
const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 600;

// Define game variables
const box = 32;
let snake = [{ x: 9 * box, y: 10 * box }];
let food = generateFood();
let direction = "RIGHT";
let gameSpeed = 150;
let game;

// Load sounds
const moveSound = new Audio('Move Snake Game.mp3');
const gameOverSound = new Audio('Game Over Snake Game.mp3');
const foodSound = new Audio('Food Snake Game.mp3');

// Event listener for keyboard input
document.addEventListener("keydown", changeDirection);

// Function to start the game
function startGame() {
    game = setInterval(draw, gameSpeed);
}

// Function to generate food at a random position
function generateFood() {
    return {
        x: Math.floor(Math.random() * (canvas.width / box)) * box,
        y: Math.floor(Math.random() * (canvas.height / box)) * box
    };
}

// Function to change direction
function changeDirection(event) {
    const keyDirectionMap = {
        37: 'LEFT',
        38: 'UP',
        39: 'RIGHT',
        40: 'DOWN'
    };
    const newDirection = keyDirectionMap[event.keyCode];
    if (newDirection && newDirection !== getOppositeDirection(direction)) {
        direction = newDirection;
        moveSound.play();
    }
}

// Function to draw the game
function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Draw food
    context.fillStyle = "red";
    context.fillRect(food.x, food.y, box, box);

    // Draw snake
    snake.forEach((segment, index) => {
        context.fillStyle = index === 0 ? "darkgreen" : "lightgreen";
        context.fillRect(segment.x, segment.y, box, box);
        context.strokeStyle = "darkgreen";
        context.strokeRect(segment.x, segment.y, box, box);
    });

    // Move snake
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (direction === "LEFT") snakeX -= box;
    if (direction === "UP") snakeY -= box;
    if (direction === "RIGHT") snakeX += box;
    if (direction === "DOWN") snakeY += box;

    // Check if snake eats food
    if (snakeX === food.x && snakeY === food.y) {
        foodSound.play();
        food = generateFood();
    } else {
        snake.pop();
    }

    // New head
    const newHead = { x: snakeX, y: snakeY };

    // Check collisions
    if (isCollision(newHead) || isOutOfBound(newHead)) {
        endGame();
    } else {
        snake.unshift(newHead);
    }
}

// Function to check for collisions
function isCollision(head) {
    return snake.some(segment => head.x === segment.x && head.y === segment.y);
}

// Function to check if snake goes out of bounds
function isOutOfBound(head) {
    return head.x < 0 || head.y < 0 || head.x >= canvas.width || head.y >= canvas.height;
}

// Function to end game
function endGame() {
    clearInterval(game);
    gameOverSound.play();
    setTimeout(() => {
        window.location.href = "gameover.html";
    }, 1500);
}

// Function to get the opposite direction
function getOppositeDirection(direction) {
    const opposites = { "LEFT": "RIGHT", "RIGHT": "LEFT", "UP": "DOWN", "DOWN": "UP" };
    return opposites[direction];
}

// Start game when page loads
window.onload = function() {
    startGame();
};