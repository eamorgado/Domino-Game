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
                var ng = document.getElementById('new-game-players');
                ng.style.display = 'none';
                var qg = document.getElementById("quit-game-players");
                qg.style.display = "inline-block";
                document.getElementById('connect-opt').style.display = 'none';
                var game_page = document.getElementById('human-page').getElementsByClassName('overlay-content')[0];
                document.getElementById("game-in-progress").style.display = "block";
                document.getElementById("inst-on-game-players").style.display = 'block';

                player1 = 'Player-Adv';
                player2 = 'Player-' + username;
                player = new Player(player2);
                adv = new Player(player1);
                generateGameBoard('human-page', player1, player2);
                var hands = data.hand;
                appendPieces(player, hands, false);
                update(username, GAME_ID);
            }
        })
        .catch(console.log);
}


function appendPieces(pl, hand, is_adv) {
    for (let piece of hand) {
        //piece = [_,_]
        if (!is_adv) {
            var first, sec;
            [first, sec] = (piece[0] >= piece[1] ? [piece[1], piece[0]] : [piece[0], piece[1]]);
            var p = 'DM-' + first + '-' + sec;
        } else var p = piece;
        pl.addPiece(new Array(p), false, 5, 5, is_adv, '5%', !is_adv, false);
    }
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