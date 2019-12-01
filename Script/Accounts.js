const BASE_URL = "http://twserver.alunos.dcc.fc.up.pt:8008/";
var GAME_ID, SOURCE, TURN, STACK, LINE;
var flag;
var username, password, adv_name;
var PLAYER, ADV, players_board;


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
    var pl = document.getElementById(PLAYER.getName());
    while (pl.firstElementChild) pl.removeChild(pl.firstElementChild);
    for (let [k, v] of PLAYER.hand)
        givePiecesPlayers(pl, new Array(k), false, 5, 5, false, '5%', true);
}

function updateAdv(count) {
    var name = 'Adv';
    for (var user in count)
        if (user != username) { name = user; break; }
    if (name == username) {
        messageUser('starter', 'Users have same username, error.');
        leave(username, password);
    }
    adv_name = name;
    var ad = document.getElementById('Player-Adv')
    while (ad.firstElementChild) ad.removeChild(ad.firstElementChild);

    var ar = new Array();
    for (let i = 0; i < count[name]; i++) ar.push(pieces[i]);
    appendBlanck(ad, ar, 5, 5, '5%');
}

function updateStack(stack) {
    STACK = stack;
    document.getElementById('Player-Stack-player').textContent = 'Stack Pieces: ' + stack + ' | Turn: ' + TURN;
}

function updateGameBoard(gameboard) {
    LINE = gameboard;
    //gameboard [ [recx,recy],[recy,recz] ]
    var b = document.getElementById('Game-Board-player');
    //remove all children
    while (b.firstElementChild) b.removeChild(b.firstElementChild);
    //extractPieceParts(piece);
    for (let piece of gameboard) {
        //piece = [_,_]
        var rec1, rec2, id;
        [rec1, rec2, id] = extractPieceParts(piece);
        //console.log("updateGameBoard: " + id);

        var side;
        side = (piece[0] == rec1 ? (piece[0] == rec2 ? undefined : 'left') : 'right');
        var p = createPiecePlayers(id, false, 5, 5, false, '5%', false, side);
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
            STACK = 0;
            if (data.board.stock)
                updateStack(data.board['stock']);
            //Update adv------
            updateAdv(data.board.count);
            //Update cur player---
            updatePlayer();

            //Update game board ----
            if (data.board.line)
                updateGameBoard(data.board.line);

            //It is our turn
            if (TURN == username) {
                var match = checkMatch(data.board.line);
                console.log("[User: " + username + ', Has Match: ' + match + ']\n');
                if (match) {
                    //There is at least one piece that matches => addEventlistner
                    if (data.board.line.length == 0) {
                        playMax();
                    } else {
                        for (let [k, v] of PLAYER.hand) {
                            var piece = document.getElementById(k);
                            piece.setAttribute('class', 'DM-normal');
                            piece.addEventListener('onclick', enableUserSelection(piece, k));
                        }
                    }
                } else {
                    //No match => take stack if not empty
                    if (STACK == 0) {
                        //Stack empty => Pass turn
                        messageUser('starter', 'No piece matches, Stack is empty. Passing turn');
                        notify(username, password, GAME_ID, undefined, undefined, null);
                    } else {
                        //Stack not empty take one piece
                        createStackRetriever();
                    }

                }
            }
        }
        if (data["winner"] != undefined) {
            messageUser('starter', 'Player ' + data['winner'] + ' has won');
            cleanUp();
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
                if (data.side != undefined) {
                    [rec1, rec2, p] = extractPieceParts(piece);
                    messageUser('starter', 'Pick side');
                    sidePicker(rec1, rec2, p);
                } else if (data.piece != undefined) {
                    //added piece
                    console.log('Piece to be added: ' + data.piece);
                    //var arr = new Array(Number(data.piece[0]), Number(data.piece[1]));
                    appendPieces(PLAYER, new Array(data.piece), false);
                    updatePlayer();
                    var match = checkMatch(LINE);
                    console.log("[User: " + username + ', Has Match: ' + match + ']\n');
                    if (match) {
                        notify(username, password, GAME_ID, undefined, data.piece);
                    }
                }
                // notify {}
                else {
                    if (piece) {
                        [rec1, rec2, p] = extractPieceParts(piece);
                        PLAYER.hand.delete(p);
                    }
                }
                updatePlayer();
            }
        });
}

function leave(user, pass) {
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
                SOURCE.close();
            }
        });
}


function ranking() {
    const url = BASE_URL + 'ranking';
    dataPost(url)
        .then(data => {
            if (data.error != undefined)
                messageUser('starter', data.error);
            else {
                var tr, t, cont;
                tr = document.createElement('tr');
                tr.setAttribute('id', 'PVP-H');
                tr.setAttribute('class', 'tb-r-head');
                cont = new Array('User', 'Victories', 'Games Played');
                for (let el of cont) {
                    t = document.createElement('th');
                    t.innerHTML = el;
                    tr.appendChild(t);
                }
                document.getElementById('PVP-Table').appendChild(tr);
                var ranks = data.ranking; //[{},{},...]
                for (let r of ranks) {
                    cont = new Array(r.nick, r.victories, r.games);
                    tr = document.createElement('tr');
                    for (let k of cont) {
                        t = document.createElement('td');
                        t.textContent = k
                        tr.appendChild(t);
                    }
                    document.getElementById('PVP-Table').appendChild(tr);
                }
            }
        });
}