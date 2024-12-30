document.getElementById("login_play").addEventListener("click", () => {
    document.getElementById("login_id").style.display = 'none';
    document.getElementById("header").style.display = 'none';
    document.getElementById("play_mode").style.display = 'block';

    fetch('/has_played') // fetch the data
    .then(response => response.json())
    .then(data => { // data can be any name
        let action = document.getElementById('play_mode');
        action.innerHTML = '';

        if (data.played) {
            action.innerHTML = '<button id = "start_continue_button">Continue</button>';
        } else {
            action .innerHTML = '<button id="start_continue_button">Start</button>';

        }
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('play_mode').innerHTML = '<p> An error has occured </p>'
    });
});