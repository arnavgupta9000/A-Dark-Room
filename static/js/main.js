
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
        let gameMap = new GameMap(play);
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


class GameMap {
    constructor(playElement) {
        this.tileSize = 64;
        this.viewportWidth = 10;
        this.viewportHeight = 8;
        this.mapWidth = Math.floor(window.innerWidth / this.tileSize);
        this.mapHeight = Math.floor(window.innerHeight / this.tileSize) - 1;

        this.canvas = document.createElement("canvas");
        this.canvas.width = this.viewportWidth * this.tileSize;
        this.canvas.height = this.viewportHeight * this.tileSize;
        playElement.appendChild(this.canvas);

        this.ctx = this.canvas.getContext('2d');

        // Camera and player
        this.camera = { x: 0, y: 0 };
        this.playerPos = { x: 0, y: 0 };
        this.currentDirection = 'down';
        this.currentFrame = 0;
        this.totalFrames = 4;

        // Movement control
        this.keysPressed = {};
        this.movementSpeed = 1;
        this.movementCooldown = 50;
        this.lastMovementTime = 0;

        // Map
        this.tileMap = this.createTileMap();
        this.isMoving = false;

        // Load assets
        this.grassImage = this.loadImage('/static/img/space.jpg');
        this.wallImage = this.loadImage('/static/img/wall.avif');
        this.playerImage = this.loadImage('/static/img/spritesheet.png');

        this.imagesLoaded = 0;
        this.totalImages = 3;

        this.setupEventListeners();

        setInterval(() => this.handleMovement(), 16);
    }

    createTileMap() {
        const map = Array.from({ length: this.mapHeight }, () => 
            Array.from({ length: this.mapWidth }, () => 0)
        );
        map[this.mapHeight - 1][this.mapWidth - 1] = 1;
        return map;
    }


    

    loadImage(src) {
        const img = new Image();
        img.src = src;
        img.onload = () => this.onImageLoaded();
        return img;
    }

    onImageLoaded() {
        this.imagesLoaded++;
        if (this.imagesLoaded === this.totalImages) {
            this.updateGame();
        }
    }

    setupEventListeners() {
        document.addEventListener('keydown', (event) => {
            this.keysPressed[event.key] = true;
        });
        document.addEventListener('keyup', (event) => {
            this.keysPressed[event.key] = false;
        });
    }

    updateCamera() {
        this.camera.x = Math.max(0, Math.min(this.playerPos.x - this.viewportWidth / 2, this.mapWidth - this.viewportWidth));
        this.camera.y = Math.max(0, Math.min(this.playerPos.y - this.viewportHeight / 2, this.mapHeight - this.viewportHeight));
    }

    drawMap() {
        const startCol = Math.max(0, Math.floor(this.camera.x));
        const endCol = Math.min(this.mapWidth, Math.ceil(this.camera.x + this.viewportWidth));
        const startRow = Math.max(0, Math.floor(this.camera.y));
        const endRow = Math.min(this.mapHeight, Math.ceil(this.camera.y + this.viewportHeight));

        const offsetX = Math.floor((this.camera.x - startCol) * this.tileSize);
        const offsetY = Math.floor((this.camera.y - startRow) * this.tileSize);

        for (let row = startRow; row < endRow; row++) {
            for (let col = startCol; col < endCol; col++) {
                const tileType = this.tileMap[row][col];
                const x = (col - startCol) * this.tileSize - offsetX;
                const y = (row - startRow) * this.tileSize - offsetY;

                if (tileType === 0) {
                    this.ctx.drawImage(this.grassImage, x, y, this.tileSize, this.tileSize);
                } else {
                    this.ctx.drawImage(this.wallImage, x, y, this.tileSize, this.tileSize);
                }
            }
        }
    }

    drawPlayer() {
        const x = (this.playerPos.x - this.camera.x) * this.tileSize;
        const y = (this.playerPos.y - this.camera.y) * this.tileSize;
        const shadowWidth = 40;
        const shadowHeight = 10;
        const shadowOffsetY = 50;

        // Shadow
        this.ctx.beginPath();
        this.ctx.ellipse(x + this.tileSize / 2, y + shadowOffsetY + 7, shadowWidth / 2, shadowHeight / 2, 0, 0, 2 * Math.PI);
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        this.ctx.fill();

        // Player sprite
        const spriteWidth = 64;
        const spriteHeight = 64;
        let spriteRow = 0;

        if (this.currentDirection === 'down') spriteRow = 0;
        if (this.currentDirection === 'left') spriteRow = 1;
        if (this.currentDirection === 'right') spriteRow = 2;
        if (this.currentDirection === 'up') spriteRow = 3;

        const spriteX = this.currentFrame * spriteWidth;
        this.ctx.drawImage(this.playerImage, spriteX, spriteRow * spriteHeight, spriteWidth, spriteHeight, x, y, this.tileSize, this.tileSize);
    }

    updateGame() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.updateCamera();
        this.drawMap();
        this.drawPlayer();
    }

    handleMovement() {
        const currentTime = Date.now();
        this.isMoving = false;

        if (currentTime - this.lastMovementTime >= this.movementCooldown) {
            if (this.keysPressed['w'] && this.playerPos.y > 0 && this.tileMap[this.playerPos.y - 1][this.playerPos.x] === 0) {
                this.playerPos.y -= this.movementSpeed;
                this.currentDirection = 'up';
                this.isMoving = true;
            }
            if (this.keysPressed['s'] && this.playerPos.y < this.mapHeight - 1 && this.tileMap[this.playerPos.y + 1][this.playerPos.x] === 0) {
                this.playerPos.y += this.movementSpeed;
                this.currentDirection = 'down';
                this.isMoving = true;
            }
            if (this.keysPressed['a'] && this.playerPos.x > 0 && this.tileMap[this.playerPos.y][this.playerPos.x - 1] === 0) {
                this.playerPos.x -= this.movementSpeed;
                this.currentDirection = 'left';
                this.isMoving = true;
            }
            if (this.keysPressed['d'] && this.playerPos.x < this.mapWidth - 1 && this.tileMap[this.playerPos.y][this.playerPos.x + 1] === 0) {
                this.playerPos.x += this.movementSpeed;
                this.currentDirection = 'right';
                this.isMoving = true;
            }

            if (this.isMoving) {
                this.currentFrame = (this.currentFrame + 1) % this.totalFrames;
                this.lastMovementTime = currentTime;
            }
        }

        this.updateGame();
    }
}
