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
            console.log("Join: ", JSON.stringify(data));
            if (data.error != undefined)
                messageUser('starter', data.error);
            else {
                //data = JSON.parse(data);
                GAME_ID_PVP = data.game;
                var ng = document.getElementById('new-game-player');
                ng.style.display = 'none';
                var qg = document.getElementById("quit-game-player");
                qg.style.display = "inline-block";
                document.getElementById('connect-opt').style.display = 'none';
                var game_page = document.getElementById('human-page').getElementsByClassName('overlay-content')[0];
                document.getElementById("game-in-progress-player").style.display = "block";
                document.getElementById("inst-on-game-player").style.display = 'block';

                var p1 = 'Player-Adv';
                var p2 = 'Player-' + username;

                PLAYER_PVP = new Player(p2);
                ADV_PVP = new Player(p1);
                generateGameBoard('human-page', p1, p2);
                var hands = data.hand;
                if (hands == null) {
                    messageUser('starter', 'Empty hand, try again.');
                    leave(username, password, GAME_ID_PVP);
                } else {
                    PLAYER_PVP.addHand(hands);
                    updatePlayer(GAME_ID_PVP);
                    update(username, GAME_ID_PVP);
                }
            }
        })
        .catch(console.log);
}

function newGame() {
    //join ai
    //join no connection
    const url = BASE_URL + "join";
    const inputData = { "nick": '"HUMAN', "pass": "HUMAN", "is_ai": true }
    dataPost(url, inputData)
        .then(data => {
            console.log("Join: ", JSON.stringify(data));
            if (data.error != undefined)
                messageUser('starter', data.error);
            else {
                //data = JSON.parse(data);
                GAME_ID_PVE = data.game;

                var ng = document.getElementById('new-game-ai');
                ng.style.display = 'none';

                document.getElementById('ai-options').style.display = 'none';
                //retrieve quit-game node and display it
                var qg = document.getElementById("quit-game-ai");
                qg.style.display = "inline-block";

                //get the overlay-content tree node
                var game_page = document.getElementById('ai-page').getElementsByClassName('overlay-content')[0];

                document.getElementById("game-in-progress-ai").style.display = "block";
                document.getElementById("inst-on-game-ai").style.display = 'block';

                var p1 = 'Player-AI';
                var p2 = 'Player-Current';

                PLAYER_PVE = new Player(p2);
                ADV_PVE = new Player(p1);
                generateGameBoard('ai-page', p1, p2);
                var hands = data.hand;
                if (hands == null) {
                    messageUser('starter', 'Empty hand, try again.');
                    leave(username, password, GAME_ID_PVP);
                } else {
                    PLAYER_PVE.addHand(hands);
                    updatePlayer(GAME_ID_PVE);
                    update("HUMAN", GAME_ID_PVE);
                }
            }
        })
        .catch(console.log);
}

function extractPieceParts(piece, flag) {
    //console.log('extractPieceParts: ' + piece);

    //piece = [_,_]
    var rec1, rec2;
    [rec1, rec2] = (piece[0] >= piece[1] ? [piece[1], piece[0]] : [piece[0], piece[1]]);
    var s = flag ? 'ADM-' : 'PDM-';
    var p = s + rec1 + '-' + rec2;
    return [Number(rec1), Number(rec2), p];
}


function appendPiece(pl, piece, game) {
    var first, sec, p;
    [first, sec, p] = extractPieceParts(piece);

    pl.addPiece(p, new Array(first, sec));
    updatePlayer(game);
}

function cleanUp(gameid) {
    var extra, flag;
    flag = gameid == GAME_ID_PVP;
    extra = flag ? 'player' : 'ai';
    document.getElementById("quit-game-" + extra).style.display = "none";
    document.getElementById('new-game-' + extra).style.display = 'inline-block';
    if (flag) document.getElementById('connect-opt').style.display = 'block';
    else document.getElementById('ai-options').style.display = 'block';

    var content = document.getElementById('Board-' + extra);
    var parent = content.parentElement;
    parent.removeChild(content);
    document.getElementById("game-in-progress-" + extra).style.display = "none";
    document.getElementById("inst-on-game-" + extra).style.display = 'none';

    flag = flag ? 'human' : 'ai';
    parent = document.getElementById(flag + '-page').getElementsByClassName('overlay-content')[0];
}

function quitGame() {
    leave(username, password, GAME_ID_PVE);
}

function quitGamePlayers() {
    leave(username, password, GAME_ID_PVP);
}

function updateLeaderBoard(winner, loser, draw) {
    var date = new Date().toDateString();;
    winner = (winner == "HUMAN" ?
        (username != undefined ? username : 'Human') : 'AI'
    );
    var p = username != undefined ? username : 'Human';
    var results = new Array(draw, winner, date, p);
    if (typeof(Storage) !== "undefined") {
        var map;
        if (localStorage.computerGameResults == undefined) {
            map = new Map();
            map.set(1, results);
            localStorage.computerGameResults = JSON.stringify(Array.from(map.entries()));
        } else {
            map = new Map(JSON.parse(localStorage.computerGameResults));
            var i = map.size + 1;
            map.set(i, results);
            localStorage.computerGameResults = JSON.stringify(Array.from(map.entries()));
        }
    }
}