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

/*
function get_player_id() {
	let player_id_ls_value;
	try {
		player_id_ls_value = localStorage.getItem('player_id');
	}
	catch (e) {
		return 0;
	}
	if ((player_id_ls_value === null) || (player_id_ls_value === "undefined")) {
		return 0;
	}
	return Number(player_id_ls_value);
}


function set_player_id(player_id) {
	try {
		localStorage.setItem('player_id', player_id);
	}
	catch (e) {
		return false;
	}
	return true;
}
*/

function get_player_id() {
	let cookie_string = document.cookie;
	let start_i = cookie_string.indexOf('id=');
	if (start_i == -1) {
		console.log('"id" key not found');
		return '0';
	}
	start_i += 3;
	let end_i = cookie_string.indexOf(';', start_i);
	let id_string;
	if (end_i !== -1) {
		id_string = cookie_string.slice(start_i, end_i);
	}
	else {
		id_string = cookie_string.slice(start_i);
	}
	if (id_string.toLowerCase() === 'undefined'){
		console.log('id=undefined');
		console.log(document.cookie);
		return '0';
	}
	return id_string;
}


function set_player_id(player_id) {
	cookie_string = "id=" + player_id + "; expires=Tue, 21 Oct 2025 00:00:00 UTC;";//Tue, 1 Jan 2030 00:00:00 UTC;";
	console.log(cookie_string);
	document.cookie = cookie_string;
	console.log(document.cookie);
}


function send_score_to_server(score) {
	let player_id = get_player_id();
	
	fetch("/save_score/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
			id: player_id,
			score: score,
		})
    })
	.then(response => response.json())
    .then(data => {
		let new_player_id = data.player_id;
		if (new_player_id !== '0') {
			set_player_id(new_player_id);
		}
	})
	.catch(error => console.error("Ошибка:", error));
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
		send_score_to_server(score)
        return;
    }

    snake.unshift(newHead);
}


let game = setInterval(draw, 100);
