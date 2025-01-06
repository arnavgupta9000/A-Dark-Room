(() => {
    let play = document.getElementById("play_mode");
    let building = document.getElementById("building");


    document.getElementById("login_play").addEventListener("click", () => {
        document.getElementById("login_id").style.display = 'none';
        document.getElementById("header").style.display = 'none';
        play.style.display = 'block';

        fetch('/has_played') // fetch the data
        .then(response => response.json())
        .then(data => { // data can be any name
            let action = document.getElementById('play_mode');
            action.innerHTML = '';
            if (data.played) {
                let continueButton = document.createElement("button");
                continueButton.id = "continue_button";
                continueButton.textContent = "Continue";
                action.appendChild(continueButton);
                
                continueButton.addEventListener("click", (event) => {
                    event.target.remove();
                    homeButton.remove();
                    startGame("continue");
                });

            } else {
                // action.innerHTML += '<button id="start_button">Start</button>'; // dont use
                let startButton = document.createElement("button");
                startButton.id = "start_button";
                startButton.textContent = "Start"
                action.appendChild(startButton);
                
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

            action.appendChild(homeButton);

        
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
            titleScreen("first");
        }
        
        if (mode == "continue") {
            console.log("continue");
        }
    }

    function titleScreen(mode) {
        if (mode == "first") {
            let Name = document.createElement("p");
            Name.textContent = "By Arnav Gupta";
            play.append(Name);
            let trigger = () => {
                play.classList.add('animate');

            }

            setTimeout(trigger, 100);
            play.classList.remove('animate');
        }
    }
})();