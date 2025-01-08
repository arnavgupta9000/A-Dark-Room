
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
     // Set up the canvas
     let canvas = document.createElement("canvas");
     canvas.id = canvas;
     play.appendChild(canvas);
     const ctx = canvas.getContext('2d');
     const tileSize = 64; // Each tile's size (64x64 pixels)

     // Set canvas size to fit map dimensions
     const mapWidth = 10; // Number of columns
     const mapHeight = 10; // Number of rows
     canvas.width = mapWidth * tileSize;
     canvas.height = mapHeight * tileSize;

     // Define the tile map (0 = grass, 1 = wall)
     const tileMap = [
         [0, 1, 0, 0, 1, 0, 0, 0, 0, 1],
         [0, 0, 1, 0, 0, 1, 0, 1, 0, 0],
         [0, 1, 0, 0, 0, 0, 1, 0, 0, 1],
         [1, 0, 0, 1, 0, 0, 0, 0, 1, 0],
         [0, 0, 0, 0, 1, 0, 1, 0, 0, 0],
         [0, 1, 0, 0, 0, 1, 0, 1, 0, 1],
         [0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
         [1, 0, 1, 0, 0, 1, 0, 0, 1, 0],
         [0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
         [0, 1, 0, 0, 1, 0, 0, 0, 1, 0]
     ];

     // Load the tile images (grass and wall)
     const grassImage = new Image();
     grassImage.src = '/static/img/grass.avif';  // Replace with your grass image path

     const wallImage = new Image();
     wallImage.src = '/static/img/wall.avif';   // Replace with your wall image path

     // Load player image
     const playerImage = new Image();
     playerImage.src = '/static/img/spritesheet.png'; // Replace with your player image path

     // Player's position (in tile coordinates)
     let playerPosition = { x: 0, y: 0 };

     const spriteWidth = 64; // Width of each frame in the sprite sheet
     const spriteHeight = 64; // Height of each frame in the sprite sheet

     let currentDirection = 'down'; // Default is down
     let currentFrame = 0; // Current frame of animation
     const totalFrames = 4; // Number of frames per direction




     // Function to draw the tile map
     function drawMap() {
         // Loop through the tile map and draw each tile
         for (let row = 0; row < mapHeight; row++) {
             for (let col = 0; col < mapWidth; col++) {
                 const tileType = tileMap[row][col];
                 const x = col * tileSize;
                 const y = row * tileSize;

                 // Draw the correct tile based on the tile type (grass or wall)
                 if (tileType === 0) {
                     ctx.drawImage(grassImage, x, y, tileSize, tileSize);
                 } else {
                     ctx.drawImage(wallImage, x, y, tileSize, tileSize);
                 }
             }
         }
     }

     // Function to draw the player
     function drawPlayer() {
         const x = playerPosition.x * tileSize;
         const y = playerPosition.y * tileSize;
        // Set the sprite row based on the current direction
        let spriteRow = 0;
        if (currentDirection === 'down') {
            spriteRow = 0; // Row for down
        } else if (currentDirection === 'left') {
            spriteRow = 1; // Row for left
        } else if (currentDirection === 'right') {
            spriteRow = 2; // Row for right
        } else if (currentDirection === 'up') {
            spriteRow = 3; // Row for up
        }


        // Calculate the x position on the sprite sheet for the current frame
        const spriteX = currentFrame * spriteWidth;

        // Draw the current frame of the player sprite from the sprite sheet
        ctx.drawImage(playerImage, spriteX, spriteRow * spriteHeight, spriteWidth, spriteHeight, x, y, tileSize, tileSize);

           
  }

     // Function to update the game (clear and redraw)
     function updateGame() {
         // Clear the canvas
         ctx.clearRect(0, 0, canvas.width, canvas.height);

         // Draw the map and the player
         drawMap();
         drawPlayer();
     }

     // Listen for keypresses to move the player
     document.addEventListener('keydown', (event) => {
        const movementSpeed = 1; // Move by 1 tile

        // Update the direction based on the arrow keys
        if (event.key === 'w' && playerPosition.y > 0 && tileMap[playerPosition.y - 1][playerPosition.x] === 0) {
            playerPosition.y -= movementSpeed;
            currentDirection = 'up'; // Set direction to up
        } else if (event.key === 's' && playerPosition.y < mapHeight - 1 && tileMap[playerPosition.y + 1][playerPosition.x] === 0) {
            playerPosition.y += movementSpeed;
            currentDirection = 'down'; // Set direction to down
        } else if (event.key === 'a' && playerPosition.x > 0 && tileMap[playerPosition.y][playerPosition.x - 1] === 0) {
            playerPosition.x -= movementSpeed;
            currentDirection = 'left'; // Set direction to left
        } else if (event.key === 'd' && playerPosition.x < mapWidth - 1 && tileMap[playerPosition.y][playerPosition.x + 1] === 0) {
            playerPosition.x += movementSpeed;
            currentDirection = 'right'; // Set direction to right
        }

        // Update the animation frame
        currentFrame = (currentFrame + 1) % totalFrames;

        // Update the canvas
        updateGame();
    });
    
     // Wait until all images are loaded, then start the game
     let imagesLoaded = 0;
     const totalImages = 3; // We are loading 3 images (grass, wall, and player)

     function checkImagesLoaded() {
         imagesLoaded++;
         if (imagesLoaded === totalImages) {
             updateGame(); // Start the game once all images are loaded
         }
     }

     grassImage.onload = checkImagesLoaded;
     wallImage.onload = checkImagesLoaded;
     playerImage.onload = checkImagesLoaded;
}
