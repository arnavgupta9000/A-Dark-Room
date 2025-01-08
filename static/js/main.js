
let play = document.getElementById("play_mode");
let home = window.location.origin + "/";

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

// player movement


// Initial draw
function generateMap() {
    clear();
    mapContainer = document.createElement("div");
    mapContainer.classList.add("map");
    play.appendChild(mapContainer);

    const map = [
        [0, 0, 0, 1],
        [0, 0, 0, 1],
        [0, 0, 0, 1],
        [0, 0, 0, 1]
    ];
    
    let playerPosition = { x: 0, y: 0 };

    function drawMap() {
        mapContainer.innerHTML = ""; // Clear the container
    
        for (let row = 0; row < map.length; row++) {
            for (let col = 0; col < map[row].length; col++) {
                const tile = document.createElement("div");
                tile.classList.add("tile");
    
                if (row === playerPosition.y && col === playerPosition.x) {
                    tile.classList.add("player");
                } else if (map[row][col] === 0) {
                    tile.classList.add("grass");
                } else {
                    tile.classList.add("wall");
                }
    
                mapContainer.appendChild(tile);
            }
        }
    }
    
    drawMap();

    document.addEventListener("keydown", (event) => {
        const { x, y } = playerPosition;
    
        if (event.key === "ArrowUp" && y > 0 && map[y - 1][x] === 0) {
            playerPosition.y -= 1;
        } else if (event.key === "ArrowDown" && y < map.length - 1 && map[y + 1][x] === 0) {
            playerPosition.y += 1;
        } else if (event.key === "ArrowLeft" && x > 0 && map[y][x - 1] === 0) {
            playerPosition.x -= 1;
        } else if (event.key === "ArrowRight" && x < map[0].length - 1 && map[y][x + 1] === 0) {
            playerPosition.x += 1;
        }
    
        drawMap(); // Redraw the map
    });
    
    
    
}