let play = document.getElementById("play_mode");
let home = window.location.origin + "/";
let playerPos = {x: 0, y: 0};
let map;


document.getElementById("login_play").addEventListener("click", () => {
document.getElementById("login_id").style.display = 'none';
document.getElementById("header").style.display = 'none';
play.style.display = 'block';

fetch('/has_played') // fetch the data
.then(response => response.json())
.then(data => { // data can be any name
    play.innerHTML = '';
    if (data.played) {
        let continueButton = document.createElement("button");
        continueButton.id = "continue_button";
        continueButton.textContent = "Continue";
        play.appendChild(continueButton);
        
        continueButton.addEventListener("click", (event) => {
            event.target.remove();
            homeButton.remove();
            startGame("continue");
        });

    } else {
        // play.innerHTML += '<button id="start_button">Start</button>'; // dont use
        let startButton = document.createElement("button");
        startButton.id = "start_button";
        startButton.textContent = "Start"
        play.appendChild(startButton);
        
        startButton.addEventListener("click", (event) => {
            event.target.remove();
            homeButton.remove();
            startGame("start");
        });
    }

    let homeButton = document.createElement("button");
    homeButton.textContent = "Home";
    // homeButton.id = "home_button";

    homeButton.addEventListener("click", () => {
        window.location.href = home;
    });

    play.appendChild(homeButton);

    
    })
    .catch(error => {
        showError(error);
        console.error('Error:', error);
    });
});

// player movement

document.addEventListener("keydown", (e) => {
    if (e.key === "a") {
        move(-1, 0)
    }
    else if (e.key === "d") {
        move(1, 0)
    }
    else if (e.key === "s") {
        move(0, 1)
    }
    else if (e.key === "w") {
        move(0, -1)
    }
    
});

function showError(error) {
    let divs = document.querySelectorAll("div");
    divs.forEach(div => {
        div.style.display = "none";

    });
    error_div = document.getElementById("error");
    error_div.style.display = 'block';
    error_div.innerHTML = `<p>${error.message}</p>`;
};

function startGame(mode) {
    if (mode == "start") {
        // titleScreen("first", "A Hidden City");
        homeMode(0);
    }
    
    if (mode == "continue") {
        console.log("continue");
    }
}

function titleScreen(mode, text = null, depth = 0) {
    if (depth >= 2) {
        return;
    }
    if (mode == "first") {
        let Name = document.createElement("p");
        Name.textContent = `${text}`;
        play.append(Name);
        let trigger = () => {
            play.classList.add('animate');
        }
        setTimeout(trigger, 100);
        play.classList.remove('animate');

        setTimeout(() => {
            play.innerText = "";
            titleScreen(mode, "By Arnav Gupta", depth + 1);
        }, 2500);
        
    }
}

function homeMode(mode = 1) {
    // this is the building div
    building = document.createElement('div');
    building.classList.add("building"); 
    play.appendChild(building);

    sprite = document.createElement("div");
    sprite.classList.add("sprite");
    play.appendChild(sprite);

    // for the dialogue in the game
    dialogue = document.createElement('div');
    dialogue.classList.add('dialogue');
    play.appendChild(dialogue);

    // setTimeout(() => {
    //     building.style.backgroundColor = "black";
    // }, 100); 
    
    if (mode == 0) {
        clear();
        generateMap();
    }
}

function clear() {
    divs = document.querySelectorAll("div");
    divs.forEach(div => {
        if (div.id != "play_mode") {
            div.remove();
        }
    });
}

function generateMap() {
    map = [
        ['grass', 'grass', 'enemy', 'mountain'],
        ['grass', 'player', 'grass', 'grass'],
        ['grass', 'grass', 'grass', 'enemy'],
    ];

    let tileWidth = 50; // Width of each tile in pixels
    let tileHeight = 50; // Height of each tile in pixels


    for (let r = 0; r < map.length; r++) {
        for (let c = 0; c < map[r].length; c++) {
            if (map[r][c] === "player") {
                playerPos = {x:r , y:c};
                console.log(playerPos);
                break;
            }
        }
    }
    renderMap();
}

function renderMap() {
    clear()
    mapDiv = document.createElement("div");
    mapDiv.id = "map";
    play.appendChild(mapDiv);

    map.forEach(row => {
        let rowDiv = document.createElement("div");
        rowDiv.classList.add("row");
        row.forEach(cell => {
            let cellDiv = document.createElement("div");
            cellDiv.classList.add("cell", cell);
            rowDiv.appendChild(cellDiv);
        });
        mapDiv.appendChild(rowDiv)
    });
}

function move(dx, dy) {
    let newX = playerPos.x + dx;
    let newY = playerPos.y + dy;

    if (newY >= 0 && newY < map.length && newX >= 0 && newX < map[0].length) {
        map[playerPos.y][playerPos.x] = 'grass'; 
        playerPos = {x: newX, y: newY};
        map[playerPos.y][playerPos.x] = 'player'

    }
    renderMap();

}
