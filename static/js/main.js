document.getElementById("login_play").addEventListener("click", () => {
    document.getElementById("login_id").style.display = 'none';
    document.getElementById("header").style.display = 'none';
    document.getElementById("play_mode").style.display = 'block';

    fetch('/has_played')
    .then(response => response.json())
    .then(data => {
        let action = document.getElementById('play_mode');
        action.innerHTML = '';

        if (data.played) {
            action.innerHTML = '<button id = "continue">Continue</button>';
        } else {
            action .innerHTML = '<button id="start">Start</button>';

        }
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('play_mode').innerHTML = '<p> An error has occured </p>'
    });
});