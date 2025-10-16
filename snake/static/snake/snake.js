const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const box = 20;  // размер одной клетки
let score = 0;

let snake = [];
snake[0] = { x: 9 * box, y: 10 * box };

let food = {
    x: Math.floor(Math.random() * 19 + 1) * box,
    y: Math.floor(Math.random() * 19 + 1) * box
};

let dir;

document.addEventListener("keydown", direction);

function direction(event) {
    if (event.key === "ArrowLeft" && dir !== "RIGHT") dir = "LEFT";
    else if (event.key === "ArrowUp" && dir !== "DOWN") dir = "UP";
    else if (event.key === "ArrowRight" && dir !== "LEFT") dir = "RIGHT";
    else if (event.key === "ArrowDown" && dir !== "UP") dir = "DOWN";
}

function collision(head, arr) {
    for (let i = 0; i < arr.length; i++) {
        if (head.x === arr[i].x && head.y === arr[i].y) return true;
    }
    return false;
}

function draw() {
    ctx.fillStyle = "#111";
    ctx.fillRect(0, 0, 400, 400);

    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = (i === 0) ? "#0f0" : "#0a0";
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
    }

    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, box, box);

    let headX = snake[0].x;
    let headY = snake[0].y;

    if (dir === "LEFT") headX -= box;
    if (dir === "UP") headY -= box;
    if (dir === "RIGHT") headX += box;
    if (dir === "DOWN") headY += box;

    if (headX === food.x && headY === food.y) {
        score++;
        document.getElementById("score").innerText = "Очки: " + score;
        food = {
            x: Math.floor(Math.random() * 19 + 1) * box,
            y: Math.floor(Math.random() * 19 + 1) * box
        };
    } else {
        snake.pop();
    }

    let newHead = { x: headX, y: headY };

    // проверка на столкновение
    if (
        headX < 0 || headX >= 400 ||
        headY < 0 || headY >= 400 ||
        collision(newHead, snake)
    ) {
        clearInterval(game);
        alert("Игра окончена! Ваш счёт: " + score);
        return;
    }

    snake.unshift(newHead);
}

let game = setInterval(draw, 100);
