/*------------------------------------------------------------------------------
This file  is responsible for generating the pieces and controlling the game
    options for a 2 player match
------------------------------------------------------------------------------*/
function newGamePlayers() {
    //join no connection
    const url = BASE_URL + "join";
    var inp_group = document.getElementById('input_group').value;
    const inputData = (inp_group ? { 'group': inp_group, "nick": username, "pass": password } : { "nick": username, "pass": password })
    dataPost(url, inputData)
        .then(data => {
            console.log("Join: " + JSON.stringify(data));
            if (data.error != undefined)
                messageUser('starter', data.error);
            else {
                GAME_ID = data.game;
                console.log('gameId:' + GAME_ID);
                //retrieve new-game node and hide it
                var ng = document.getElementById('new-game-players');
                ng.style.display = 'none';
                //retrieve quit-game node and display it
                var qg = document.getElementById("quit-game-players");
                qg.style.display = "inline-block";

                document.getElementById('connect-opt').style.display = 'none'

                //get the overlay-content tree node
                var game_page = document.getElementById('human-page').getElementsByClassName('overlay-content')[0];

                document.getElementById("game-in-progress").style.display = "block";
                document.getElementById("inst-on-game-players").style.display = 'block';

                player1 = 'Player-Adv';
                player2 = 'Player-User';
                generateGameBoard('human-page', player1, player2);
                update(username, GAME_ID);
            }
        })
        .catch(console.log);
}


function quitGamePlayers() {
    document.getElementById("quit-game-players").style.display = "none";
    document.getElementById('new-game-players').style.display = 'inline-block';
    document.getElementById('connect-opt').style.display = 'block';
    var content = document.getElementById('Board');

    var parent = content.parentElement;
    parent.removeChild(content);
    document.getElementById("game-in-progress").style.display = "none";
    document.getElementById("inst-on-game-players").style.display = 'none';
    parent = document.getElementById('human-page').getElementsByClassName('overlay-content')[0];
}