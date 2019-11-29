const BASE_URL = "http://twserver.alunos.dcc.fc.up.pt:8008/";
var GAME_ID, SOURCE, TURN, STACK;
var flag;
var username, password, adv_name;
var player, adv, players_board;


function messageUser(id, inner_text) {
    var receiver = document.getElementById(id);
    var str =
        "<div id=\"message-user\" class=\"modal\">" +
        "<form class=\"login-modal-content animate\" action=\"#\">" +
        "<div class=\"login-container\"><h2>" + inner_text + "</h2></div>" +
        "<div class=\"login-container\" styler=\"background-color:#f1f1f1\">" +
        "<button id='ok-message-user' type=\"button\" class=\"submit\">OK</button>" +
        "</div>" +
        "</form>" +
        "</div>";
    generateHtml(receiver, str);
    document.getElementById('message-user').style.zIndex = '5';
    document.getElementById('message-user').style.display = 'block';
    document.getElementById('ok-message-user').onclick = function() {
        var child = document.getElementById('message-user');
        var parent = child.parentElement;
        parent.removeChild(child);
    }
}



function dataPost(url, data = {}) {
    return fetch(url, {
        method: 'POST',
        cache: 'no-cache',
        body: JSON.stringify(data),
    }).then(response => response.json()).catch(console.log);
}

function executeLogin() {
    username = document.getElementById('login_username').value;
    password = document.getElementById('login_password').value;
    flag = false;
    register(username, password);
}

function register(username, password) {
    const url = BASE_URL + 'register';
    console.log(url);
    const data = { 'nick': username, 'pass': password };
    dataPost(url, data).then(data => {
        console.log(JSON.stringify(data));
        if (data.error != undefined)
            messageUser('starter', data.error);
        else {
            document.getElementById("auth").textContent = username;
            hideLogin();
            document.getElementById("auth").onclick = null;
            messageUser('starter', 'Authentication successful');
        }
    }).catch(console.log);
}

function updatePlayer() {
    var pl = document.getElementById(player.getName());
    while (pl.firstElementChild) pl.removeChild(pl.firstElementChild);
    for (let [k, v] of player.hand)
        givePieces(pl, new Array(k), false, 5, 5, false, '5%', true);
}

function updateAdv(count) {
    var name = 'Adv';
    for (var user in count)
        if (user != username) { name = user; break; }
    adv_name = name;
    var ad = document.getElementById('Player-Adv')
    while (ad.firstElementChild) ad.removeChild(ad.firstElementChild);

    var ar = new Array();
    for (let i = 0; i < count[name]; i++) ar.push(pieces[i]);
    appendBlanck(ad, ar, 5, 5, '5%');;
}

function updateStack(stack) {
    STACK = stack;
    document.getElementById('Player-Stack').textContent = 'Stack Pieces: ' + stack + ' | Turn: ' + TURN;
}

function updateGameBoard(gameboard) {
    //gameboard [ [recx,recy],[recy,recz] ]
    var b = document.getElementById('Game-Board');
    //remove all children
    while (b.firstElementChild) b.removeChild(b.firstElementChild);
    //extractPieceParts(piece);
    for (let piece of gameboard) {
        //piece = [_,_]
        var rec1, rec2, id;
        [rec1, rec2, id] = extractPieceParts(piece);
        console.log("updateGameBoard: " + id);

        var side;
        side = (piece[0] == rec1 ? (piece[0] == rec2 ? undefined : 'left') : 'right');
        var p = createPiece(id, false, 5, 5, false, '5%', false, side);
        var dom = new Domino(rec1, rec2, false, 'vertical', 'board', id);
        if (side != undefined) dom.rotatePiece();
        players_board.addDominoBot(dom.copyDomino());
        b.appendChild(p);
    }
}

function update(user, gameid) {
    const url = BASE_URL + "update?nick=" + user + "&game=" + gameid;
    console.log(url);
    SOURCE = new EventSource(url);
    SOURCE.onmessage = function(e) {
        console.log("update function answer: " + JSON.stringify(e.data));
        var data = JSON.parse(e.data);
        console.log(data);
        if (data["turn"] != undefined) {
            TURN = data['turn'];
            //Update stack-------
            if (data.board.stock)
                updateStack(data.board['stock']);
            //Update adv------
            updateAdv(data.board.count);
            updatePlayer();
            if (data.board.line)
                updateGameBoard(data.board.line);
            if (TURN == username) {
                var match = checkMatch(data.board.line);
                if (match)
                    for (let [k, v] of player.hand) {
                        var piece = document.getElementById(k);
                        piece.setAttribute('class', 'DM-normal');
                        piece.addEventListener('onclick', enableUserSelection(piece, k));
                    }
                else {
                    //No match => take stack if not empty
                    if (STACK == 0) {
                        messageUser('starter', 'No piece matches, Stack is empty. Passing turn');
                        notify(username, password, GAME_ID, undefined, undefined, null)
                    } else {
                        messageUser('starter', 'No piece matches, taking from Stack');
                        notify(username, password, GAME_ID, undefined, null, undefined);
                    }

                }
            }
        }
        if (data["winner"] != undefined) {
            messageUser('starter', 'Player ' + data['winner'] + ' has won');
            cleanUp();
            GAME_ID = null;
            var date = new Date().toDateString();
            winner = data['winner'];
            var s = (winner == username) ? "<b style=\"color: green;\">" + winner + "</b> won match" : "<b style=\"color: red;\">" + winner + "</b> won match";
            var leader_page = document.getElementById('leader-page').getElementsByClassName('overlay-content')[0];
            var str = "<p><br><span class=\"leaders\"><b>" + username + "  VS  " + winner + "  " + date + "  Result: " + s + "</b></span></p>";
            generateHtml(leader_page, str);
            SOURCE.close();
        }
    };
}

function notify(user, pass, gameid, side, piece, skip) {
    const url = BASE_URL + 'notify';
    const input = { 'nick': user, 'pass': pass, 'game': gameid };
    console.log(piece);

    if (piece != undefined) input['piece'] = piece;
    if (side != undefined) input['side'] = side;

    if (skip != undefined) input['skip'] = skip;
    dataPost(url, input)
        .then(data => {
            console.log("Notify: " + JSON.stringify(data));
            if (data.error != undefined) {
                messageUser('starter', data.error);
            } else {
                var rec1, rec2, p;
                [rec1, rec2, p] = extractPieceParts(piece);
                if (data.side != undefined) {
                    messageUser('starter', 'Pick side');
                    sidePicker(rec1, rec2, p);
                } else if (data.piece != undefined) {
                    //added piece
                    var rec1, rec2, p, [rec1, rec2, p] = extractPieceParts(data.piece);
                    player.hand.set(p, new Domino(rec1, rec2, false, 'vertical', 'player', p));
                } else {
                    // notify {}
                    player.hand.delete(p);
                }
            }
        });
}

function
leave(user, pass) {
    const url = BASE_URL + 'leave';
    const input = { 'nick': user, 'pass': pass, 'game': GAME_ID };
    dataPost(url, input)
        .then(data => {
            console.log('Leaave: ' + JSON.stringify(data));
            if (data.error != undefined) {
                console.log(data.error);
                messageUser('starter', data.error);
            } else {
                GAME_ID = null;
                cleanUp();
            }
        });
}