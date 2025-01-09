
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
     const tileSize = 64;  // each tile is a 64 by 64 sprite

     const mapWidth = 10; // cols
     const mapHeight = 10; // rows

     canvas.width = mapWidth * tileSize;
     canvas.height = mapHeight * tileSize;

     // tile map, 0=grass, 1=wall
     const tileMap = [
         [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         [0, 0, 0, 0, 0, 0, 0, 0, 1, 0]
     ];

     const grassImage = new Image();
     grassImage.src = '/static/img/grass.avif';

     const wallImage = new Image();
     wallImage.src = '/static/img/wall.avif';   

     // Load player image
     const playerImage = new Image();
     playerImage.src = '/static/img/spritesheet.png';

     // player pos
     let playerPos = { x: 0, y: 0 };

     const spriteWidth = 64; // width
     const spriteHeight = 64; // height

     let currentDirection = 'down'; // let the default be down
     let currentFrame = 0; // current frame of animation
     const totalFrames = 4; // # of frames per animation. in this case its 4 per row




     function drawMap() {
         for (let row = 0; row < mapHeight; row++) {
             for (let col = 0; col < mapWidth; col++) {
                 const tileType = tileMap[row][col];
                 const x = col * tileSize;
                 const y = row * tileSize;

                 if (tileType === 0) {
                     ctx.drawImage(grassImage, x, y, tileSize, tileSize);
                 } else {
                     ctx.drawImage(wallImage, x, y, tileSize, tileSize);
                 }
             }
         }
     }

     function drawPlayer() {
            const x = playerPos.x * tileSize;
            const y = playerPos.y * tileSize;
            // shadow
            const shadowWidth = 40; 
            const shadowHeight = 10; 
            const shadowOffsetY = 50; 

            ctx.beginPath();
            ctx.ellipse(
                x + tileSize / 2, // Center x of the shadow (align with the player's center)
                y + shadowOffsetY + 7, // Center y of the shadow (slightly below the player)
                shadowWidth / 2,   // Horizontal radius
                shadowHeight / 2,  // Vertical radius
                0,                 // Rotation (none)
                0,                 // Start angle
                2 * Math.PI        // End angle (full circle)
            );
            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'; // Semi-transparent black
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

     function updateGame() {
         // clear the canvas
         ctx.clearRect(0, 0, canvas.width, canvas.height);

         // draw the map and the player
         drawMap();
         drawPlayer();
     }

     const movementCooldown = 50; // in ms
     let lastMovementTime = 0; // timestamp of the last movement

     document.addEventListener('keydown', (event) => {
        const movementSpeed = 1; 
        const currentTime = Date.now(); // Get the current time
        if (currentTime - lastMovementTime < movementCooldown) {
            return; // to limit the speed moved when holding the key down
        }
    
        lastMovementTime = currentTime;

        if (event.key === 'w') {
            currentDirection = 'up';
        } else if (event.key === 's' ) {
            currentDirection = 'down'; 
        } else if (event.key === 'a' ) {
            currentDirection = 'left';
        } else if (event.key === 'd' ) {
            currentDirection = 'right'; 
        }


        if (event.key === 'w' && playerPos.y > 0 && tileMap[playerPos.y - 1][playerPos.x] === 0) {
            playerPos.y -= movementSpeed;
            currentDirection = 'up'; 
        } else if (event.key === 's' && playerPos.y < mapHeight - 1 && tileMap[playerPos.y + 1][playerPos.x] === 0) {
            playerPos.y += movementSpeed;
            currentDirection = 'down';
        } else if (event.key === 'a' && playerPos.x > 0 && tileMap[playerPos.y][playerPos.x - 1] === 0) {
            playerPos.x -= movementSpeed;
            currentDirection = 'left';
        } else if (event.key === 'd' && playerPos.x < mapWidth - 1 && tileMap[playerPos.y][playerPos.x + 1] === 0) {
            playerPos.x += movementSpeed;
            currentDirection = 'right';
        }

        // update the animation frame (from the spritesheet)
        currentFrame = (currentFrame + 1) % totalFrames;

        // update the canvas
        updateGame();
    });
    
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
