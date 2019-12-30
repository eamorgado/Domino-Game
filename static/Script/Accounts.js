const BASE_URL = "http://twserver.alunos.dcc.fc.up.pt:8151/";
var GAME_ID_PVP, SOURCE_PVP, TURN_PVP, STACK_PVP, LINE_PVP;
var GAME_ID_PVE, SOURCE_PVE, TURN_PVE, STACK_PVE, LINE_PVE;
var PLAYER_PVP, ADV_PVP;
var PLAYER_PVE, ADV_PVE;
var username, password;
var adv_name_pvp, adv_name_pve;
var flag_pick_pvp = false,
    flag_pick_pve;



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
    register(username, password);
}

function register(username, password) {
    const url = BASE_URL + 'register';
    const data = { 'nick': username, 'pass': password };
    dataPost(url, data).then(data => {
        console.log('Register: ' + JSON.stringify(data));
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

function updatePlayer(gameid) {
    //console.log('Hand', PLAYER.hand);
    var player = gameid == GAME_ID_PVP ? PLAYER_PVP : PLAYER_PVE;
    var pl = document.getElementById(player.getName());
    while (pl.firstElementChild) pl.removeChild(pl.firstElementChild);
    givePiecesPlayers(pl, player.hand, false);
}

function updateAdv(count, gameid) {
    var name = 'Adv';
    var users = gameid == GAME_ID_PVP ? username : 'HUMAN';
    for (let user in count)
        if (user != users) { name = user; break; }
    if (name == users) {
        messageUser('starter', 'Users have same username, error.');
        leave(username, password, gameid);
    }
    var flag = false
    if (gameid == GAME_ID_PVP) adv_name_pvp = name;
    else [adv_name_pve, flag] = [name, true];
    flag = flag ? 'AI' : 'Adv';
    var ad = document.getElementById('Player-' + flag);
    while (ad.firstElementChild) ad.removeChild(ad.firstElementChild);

    var ar = new Array();
    for (let i = 0; i < count[name]; i++) ar.push(pieces[i]);
    appendBlank(ad, ar);
}

function updateStack(stack, gameid) {
    var extra, turn, flag = false;
    if (gameid == GAME_ID_PVP)[extra, turn, STACK_PVP] = ['player', TURN_PVP, stack];
    else [extra, turn, STACK_PVE, flag] = ['ai', TURN_PVE, stack, true];
    flag = flag ? turn == "HUMAN" : false;
    if (flag && username != undefined) turn = username;
    document.getElementById('Player-Stack-' + extra).textContent = 'Stack Pieces: ' + stack + ' | Turn: ' + turn;
}

function updateGameBoard(gameboard, gameid) {
    var extra, flag = false;
    if (gameid == GAME_ID_PVP)[extra, LINE_PVP] = ['player', gameboard];
    else [extra, LINE_PVE, flag] = ['ai', gameboard, true];

    //gameboard [ [recx,recy],[recy,recz] ]
    var b = document.getElementById('Game-Board-' + extra);
    //remove all children
    while (b.firstElementChild) b.removeChild(b.firstElementChild);
    //extractPieceParts(piece);
    for (let piece of gameboard) {
        //piece = [_,_]
        var rec1, rec2, id;
        [rec1, rec2, id] = extractPieceParts(piece, flag);
        //console.log("updateGameBoard: " + id);
        var side = (piece[0] == rec1 ? (piece[0] == rec2 ? undefined : 'left') : 'right');
        var p = createPiecePlayers(id, side);
        b.appendChild(p);
    }
}

function update(user, gameid) {
    const url = BASE_URL + "update?nick=" + user + "&game=" + gameid;
    var source
    source = new EventSource(url);
    if (gameid == GAME_ID_PVP) SOURCE_PVP = source;
    else SOURCE_PVE = source;
    source.onmessage = function(e) {
        console.log("Update: " + JSON.stringify(e.data));
        var data = JSON.parse(e.data);
        if ((gameid == GAME_ID_PVP && flag_pick_pvp) || gameid == GAME_ID_PVE && flag_pick_pve) {} else if (data['turn'] != undefined) {
            var flag = false;
            if (gameid == GAME_ID_PVP)[TURN_PVP, STACK_PVP] = [data['turn'], 0];
            else [TURN_PVE, STACK_PVE, flag] = [data['turn'], 0, true];

            //Update stack-------
            if (data.board.stock)
                updateStack(data.board['stock'], gameid);
            //Update adv------

            updateAdv(data.board.count, gameid);
            //Update cur player---
            updatePlayer(gameid);

            //Update game board ----
            if (data.board.line)
                updateGameBoard(data.board.line, gameid);

            //It is our turn
            if ((flag && data['turn'] == 'HUMAN') || TURN_PVP == username) {
                var match = hasAnyMatch(data.board.line, gameid);
                //console.log("[User: " + username + ', Has Match: ' + match + ']\n');
                if (match) {
                    //There is at least one piece that matches => addEventlistner
                    if (data.board.line.length == 0) {
                        playMax(gameid);
                    } else {
                        var hand = gameid == GAME_ID_PVP ? PLAYER_PVP.hand : PLAYER_PVE.hand;
                        for (let [k, v] of hand) {
                            var piece = document.getElementById(k);
                            piece.addEventListener('onclick', enableUserSelection(piece, v, gameid));
                        }
                    }
                } else {
                    //No match => take stack if not empty
                    var stk = gameid == GAME_ID_PVP ? STACK_PVP : STACK_PVE;
                    if (stk == 0) {
                        //Stack empty => Pass turn
                        messageUser('starter', 'No piece matches, Stack is empty. Passing turn');
                        notify(username, password, gameid, undefined, undefined, true);
                    } else {
                        //Stack not empty take one piece
                        createStackRetriever(gameid);
                    }

                }
            }
        }
        if (data["winner"] != undefined) {
            var draw = false;
            if (data["winner"] == true) {
                draw = true;
                messageUser('starter', 'Draw');
            } else messageUser('starter', 'Player ' + data['winner'] + ' has won');
            cleanUp(gameid);
            var sc, flag = false;
            if (gameid == GAME_ID_PVP) sc = SOURCE_PVP;
            else [sc, flag] = [SOURCE_PVE, true];
            if (flag) {
                var winner, loser;
                if (draw)
                    [winner, loser] = ['HUMAN', 'AI'];
                else {
                    winner = data["winner"];
                    loser = winner == "HUMAN" ? 'AI' : 'HUMAN';
                }
                updateLeaderBoard(winner, loser, draw);
            }
            sc.close();
        }
    };
}

function notify(user, pass, gameid, side, piece, skip) {
    const url = BASE_URL + 'notify';
    const input = { "nick": user, "pass": pass, "game": gameid, };
    if (skip != undefined) {
        input["skip"] = true;
        console.log('THIS=================');
    } else {
        if (piece != undefined) input["piece"] = piece == true ? true : piece;
        if (side != undefined) input["side"] = side;
    }
    dataPost(url, input)
        .then(data => {
            console.log("Notify: " + JSON.stringify(data));
            if (data.error != undefined) {
                messageUser('starter', data.error);
            } else {
                var rec1, rec2, p;
                if (data.side != undefined) {
                    var flag = gameid == GAME_ID_PVE;
                    [rec1, rec2, p] = extractPieceParts(piece, flag);
                    messageUser('starter', 'Pick side');

                    if (gameid == GAME_ID_PVP) flag_pick_pvp = true;
                    else flag_pick_pve = true;
                    sidePicker(rec1, rec2, p, gameid);
                } else if (data.piece != undefined) {
                    //added piece
                    var player, b;
                    if (gameid == GAME_ID_PVP)[player, b] = [PLAYER_PVP, LINE_PVP];
                    else [player, b] = [PLAYER_PVE, LINE_PVE];
                    appendPiece(player, data.piece, gameid);
                    updatePlayer(gameid);
                    var match = hasAnyMatch(b, gameid);
                    //console.log("[User: " + username + ', Has Match: ' + match + ']\n');
                    if (match) {
                        notify(username, password, gameid, undefined, data.piece);
                    }
                }
                // notify {}
                else {
                    if (skip != undefined) {} else if (piece != undefined) {
                        //[rec1, rec2, p] = extractPieceParts(piece);
                        var player = gameid == GAME_ID_PVP ? PLAYER_PVP : PLAYER_PVE;
                        player.delete(piece);
                    }
                }
                updatePlayer(gameid);
            }
        });
}

function leave(user, pass, gameid) {
    const url = BASE_URL + 'leave';
    const input = { 'nick': user, 'pass': pass, 'game': gameid };
    console.log("Leaving");

    dataPost(url, input)
        .then(data => {
            console.log('Leave: ' + JSON.stringify(data));
            if (data.error != undefined) {
                messageUser('starter', data.error);
            } else {
                var game, sc, flag = false;
                if (gameid == GAME_ID_PVP)[game, sc] = [GAME_ID_PVP, SOURCE_PVP];
                else [game, sc, flag] = [GAME_ID_PVE, SOURCE_PVE, true];
                game = null;
                cleanUp(gameid);
                if (flag) updateLeaderBoard('AI', 'HUMAN', false);
                sc.close();
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