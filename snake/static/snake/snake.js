const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const box = 20;  // размер одной клетки


function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}


const CSRF_TOKEN = getCookie('csrftoken');


let score;
let snake;
let food;
let dir;
let last_move_direction;


function init_game() {
	score = 0;

	snake = [];
	snake[0] = { x: 9 * box, y: 10 * box };

	food = {
		x: Math.floor(Math.random() * 19 + 1) * box,
		y: Math.floor(Math.random() * 19 + 1) * box
	};

	dir = '';
	last_move_direction = '';
}


function set_direction(new_direction) {
	if (new_direction === "UP" && last_move_direction !== "DOWN"
		|| new_direction === "DOWN" && last_move_direction !== "UP"
		|| new_direction === "LEFT" && last_move_direction !== "RIGHT"
		|| new_direction === "RIGHT" && last_move_direction !== "LEFT"
		) dir = new_direction;
}


document.addEventListener("keydown", direction);

/*function direction(event) {
    if (event.key === "ArrowLeft" && dir !== "RIGHT") dir = "LEFT";
    else if (event.key === "ArrowUp" && dir !== "DOWN") dir = "UP";
    else if (event.key === "ArrowRight" && dir !== "LEFT") dir = "RIGHT";
    else if (event.key === "ArrowDown" && dir !== "UP") dir = "DOWN";
}*/

function direction(event) {
    if (event.key === "ArrowLeft") set_direction("LEFT");
    else if (event.key === "ArrowUp") set_direction("UP");
    else if (event.key === "ArrowRight") set_direction("RIGHT");
    else if (event.key === "ArrowDown") set_direction("DOWN");
}


try {
	/*
	document.getElementById("up_button").onclick = function () { if (dir !== "DOWN") dir = "UP"; };
	document.getElementById("down_button").onclick = function () { if (dir !== "UP") dir = "DOWN"; };
	document.getElementById("left_button").onclick = function () { if (dir !== "RIGHT") dir = "LEFT"; };
	document.getElementById("right_button").onclick = function () { if (dir !== "LEFT") dir = "RIGHT"; };
	*/
	document.getElementById("up_button").onclick = function () { set_direction("UP"); };
	document.getElementById("down_button").onclick = function () { set_direction("DOWN"); };
	document.getElementById("left_button").onclick = function () { set_direction("LEFT"); };
	document.getElementById("right_button").onclick = function () { set_direction("RIGHT"); };
}
catch (error) {}


document.getElementById("game").onclick = restart_game;


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
		return '0';
	}
	if (player_id_ls_value === null) {
		return '0';
	}
	return player_id_ls_value;
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
/*
function get_player_id() {
	let cookie_string = document.cookie;
	let start_i = cookie_string.indexOf('id=');
	if (start_i == -1) {
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
	return id_string;
}*/


function get_player_id() {
	const player_id = getCookie('id');
	if (player_id === null){
		return '0';
	}
	return player_id;
}


const COOKIE_EXPIRATION_DATE = "Thu, 1 Jan 2026 00:00:00 UTC";//Tue, 1 Jan 2030 00:00:00 UTC;";

function set_player_id(player_id) {
	cookie_string = "id=" + player_id + "; expires=" + COOKIE_EXPIRATION_DATE + ";";
	document.cookie = cookie_string;
}


function send_score_to_server(score) {
	let player_id = get_player_id();
	
	fetch("/save_score/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
			"X-CSRFToken": CSRF_TOKEN,
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


function get_saved_score_from_server() {
	let player_id = get_player_id();
	
	fetch("/json_request/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
			id: player_id,
			command: 'get_score',
		})
    })
	.then(response => response.json())
    .then(data => {
		document.getElementById("saved_score").innerText = "Сохранённые очки: " + data.score;
	})
	.catch(error => console.error(error));
}


let game_is_running = false;


function draw() {
    ctx.fillStyle = "#111";
    ctx.fillRect(0, 0, 400, 400);

    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = (i === 0) ? "#0f0" : "#0a0";
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
    }

    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, box, box);
}


function mainloop_itaration() {
    let headX = snake[0].x;
    let headY = snake[0].y;

    if (dir === "LEFT") headX -= box;
    if (dir === "UP") headY -= box;
    if (dir === "RIGHT") headX += box;
    if (dir === "DOWN") headY += box;
	
	last_move_direction = dir

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
        //alert("Игра окончена! Ваш счёт: " + score);
		send_score_to_server(score);
		game_is_running = false;
        return;
    }

    snake.unshift(newHead);
	
	draw();
}


document.getElementById("user_id").innerText = "ID: " + get_player_id();

get_saved_score_from_server();


let game;


function start_game() {
	game_is_running = true;
	init_game();
	document.getElementById("score").innerText = "Очки: 0";
	get_saved_score_from_server();
	game = setInterval(mainloop_itaration, 100);
}


function restart_game() {
	console.log(game_is_running);
	if (!game_is_running) {
		start_game();
	}
}


start_game();
