
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
    let divs = document.querySelectorAll("div");
    divs.forEach(div => {
        if (div.id != "play_mode") {
            div.remove();
        }
    });

    let canvas = document.querySelectorAll("canvas")
    
    canvas.forEach(canvas => {
        canvas.remove();
    });
}


function generateMap() {
    let canvas = document.createElement("canvas"); // create the canvas
    canvas.id = canvas;
    play.appendChild(canvas);
    let ctx = canvas.getContext('2d');

    const tileSize = 64; // size of each tile in pixels
    const viewportWidth = 10; // horizontal
    const viewportHeight = 8; // vertical
    const mapWidth = Math.floor(window.innerWidth / tileSize) ; // cols
    const mapHeight = Math.floor(window.innerHeight / tileSize) - 1; // rows

    canvas.width = viewportWidth * tileSize;
    canvas.height = viewportHeight * tileSize;
    // camera
   


    const tileMap = Array.from({ length: mapHeight }, () => 
        Array.from({ length: mapWidth }, () => 0)
    );
    tileMap[mapHeight - 1][mapWidth - 1] = 1; 



    const grassImage = new Image();
    grassImage.src = '/static/img/space.jpg';

    const wallImage = new Image();
    wallImage.src = '/static/img/wall.avif';   

    // Load player image
    const playerImage = new Image();
    playerImage.src = '/static/img/spritesheet.png';

    // player pos
    let playerPos = { x: 0, y: 0 };

   

    let currentDirection = 'down'; // let the default be down
    let currentFrame = 0; // current frame of animation
    const totalFrames = 4; // # of frames per animation. in this case its 4 per row
    const camera = { x: 0, y: 0 }; // Camera position in tiles




    function drawMap() {
        const startCol = Math.max(0, Math.floor(camera.x));
        const endCol = Math.min(mapWidth, Math.ceil(camera.x + viewportWidth));
        const startRow = Math.max(0, Math.floor(camera.y));
        const endRow = Math.min(mapHeight, Math.ceil(camera.y + viewportHeight));

        const offsetX = Math.floor((camera.x - startCol) * tileSize);
        const offsetY = Math.floor((camera.y - startRow) * tileSize);

        for (let row = startRow; row < endRow; row++) {
            for (let col = startCol; col < endCol; col++) {
                const tileType = tileMap[row][col];
                const x = (col - startCol) * tileSize - offsetX;
                const y = (row - startRow) * tileSize - offsetY;

                if (tileType === 0) {
                    ctx.drawImage(grassImage, x, y, tileSize, tileSize);
                } else {
                    ctx.drawImage(wallImage, x, y, tileSize, tileSize);
                }
            }
        }
    }


    function drawPlayer() {
        const x = (playerPos.x - camera.x) * tileSize;
        const y = (playerPos.y - camera.y) * tileSize;
        const spriteWidth = 64; // width
        const spriteHeight = 64; // height
        // shadow
        const shadowWidth = 40; 
        const shadowHeight = 10; 
        const shadowOffsetY = 50; 

        ctx.beginPath();
        ctx.ellipse(x + tileSize / 2, y + shadowOffsetY + 7, shadowWidth / 2,   shadowHeight / 2,  0,0,2 * Math.PI);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'; // semi (0.5) gray for now
        ctx.fill();
        
        // set the sprite row based on the current direction
        let spriteRow = 0;
        if (currentDirection === 'down') {
            spriteRow = 0; 
        } else if (currentDirection === 'left') {
            spriteRow = 1; 
        } else if (currentDirection === 'right') {
            spriteRow = 2; 
        } else if (currentDirection === 'up') {
            spriteRow = 3; 
        }


        // calc the x position on the sprite sheet for the current frame
        const spriteX = currentFrame * spriteWidth;

        // draw player
        ctx.drawImage(playerImage, spriteX, spriteRow * spriteHeight, spriteWidth, spriteHeight, x, y, tileSize, tileSize);

        
    }

    function updateCamera() {
        camera.x = Math.max(0, Math.min(playerPos.x - viewportWidth / 2, mapWidth - viewportWidth));
        camera.y = Math.max(0, Math.min(playerPos.y - viewportHeight / 2, mapHeight - viewportHeight));
    }


    function updateGame() {
        // clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // draw the map and the player and update the camera
        updateCamera();
        drawMap();
        drawPlayer();
    }

    let keysPressed = {}; 
    const movementSpeed = 1;
    const movementCooldown = 50;
    let lastMovementTime = 0; 
    let isMoving = false;

    function handleMovement() {
        const currentTime = Date.now(); 
        isMoving = false; 

        if (currentTime - lastMovementTime >= movementCooldown) {
            if (keysPressed['w'] && playerPos.y > 0 && tileMap[playerPos.y - 1][playerPos.x] === 0) {
                playerPos.y -= movementSpeed;
                currentDirection = 'up';
                isMoving = true;
            }
            if (keysPressed['s'] && playerPos.y < mapHeight - 1 && tileMap[playerPos.y + 1][playerPos.x] === 0) {
                playerPos.y += movementSpeed;
                currentDirection = 'down';
                isMoving = true;
            }
            if (keysPressed['a'] && playerPos.x > 0 && tileMap[playerPos.y][playerPos.x - 1] === 0) {
                playerPos.x -= movementSpeed;
                currentDirection = 'left';
                isMoving = true;
            }
            if (keysPressed['d'] && playerPos.x < mapWidth - 1 && tileMap[playerPos.y][playerPos.x + 1] === 0) {
                playerPos.x += movementSpeed;
                currentDirection = 'right';
                isMoving = true;
            }

            if (isMoving) { // only update the animation if the player moves
                currentFrame = (currentFrame + 1) % totalFrames;
                lastMovementTime = currentTime; 
            }
        }

        updateGame();
    }

    // listen for key presses
    document.addEventListener('keydown', (event) => {
        keysPressed[event.key] = true;
    });

    // Listen for key releases
    document.addEventListener('keyup', (event) => {
        keysPressed[event.key] = false;
    });

    setInterval(handleMovement, 16); // ~60 FPS

    
     // load all images first then start the game
     let imagesLoaded = 0;
     const totalImages = 3; // 

     function checkImagesLoaded() {
         imagesLoaded++;
         if (imagesLoaded === totalImages) {
             updateGame(); // start
         }
     }

     grassImage.onload = checkImagesLoaded;
     wallImage.onload = checkImagesLoaded;
     playerImage.onload = checkImagesLoaded;
}
