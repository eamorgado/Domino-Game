function enableUserSelection(piece_obj, piece, gameid) {
    piece_obj.onclick = function(piece_obj) {
        var flag, turn;
        if (gameid == GAME_ID_PVP)[flag, turn] = [false, TURN_PVP];
        else [flag, turn] = [true, TURN_PVE];
        var rec1, rec2;
        [rec1, rec2] = [piece[0], piece[1]];
        [rec1, rec2] = rec2 >= rec1 ? [rec2, rec1] : [rec1, rec2];
        notify(username, password, gameid, undefined, new Array(rec1, rec2));
    }
}


function sidePicker(rec1, rec2, pice, gameid) {
    var extra, start;
    if (gameid == GAME_ID_PVP)[extra, start] = ['player', 'PVPDM'];
    else [extra, start] = ['ai', 'PVEDM'];
    var gb = document.getElementById('Game-Board-' + extra);
    var p1 = addBlank(start + '-Flip-start-' + rec1 + '-' + rec2);
    var p2 = addBlank(start + '-Flip-end-' + rec1 + '-' + rec2);
    p1.style.filter = 'invert(100%)';
    p2.style.filter = 'invert(100%)';
    gb.prepend(p1);
    gb.appendChild(p2);
    p1.addEventListener('onclick', clickPossible(p1, gameid));
    p2.addEventListener('onlcick', clickPossible(p2, gameid));
}

function clickPossible(p_obj, gameid) {
    p_obj.onclick = function(p_obj) {
        var extra;
        if (gameid == GAME_ID_PVP)[extra, flag_pick_pvp] = ['PVPDM', false];
        else [extra, flag_pick_pve] = ['PVEDM', false];
        var parent = this.parentElement;

        var splitted = this.id.split('-'); //DM Flip side rec1 rec2
        var side, rec1, rec2;
        [side, rec1, rec2] = [splitted[2], splitted[3], splitted[4]];
        var op = side == 'start' ? 'end' : 'start';
        parent.removeChild(document.getElementById(extra + '-Flip-' + op + '-' + rec1 + '-' + rec2));
        parent.removeChild(document.getElementById(extra + '-Flip-' + side + '-' + rec1 + '-' + rec2));
        [rec1, rec2] = rec2 >= rec1 ? [rec2, rec1] : [rec1, rec2];
        [rec1, rec2] = [Number(rec1), Number(rec2)];
        //console.log("Piece: [" + rec1 + ',' + rec2 + ']  Side ' + side);
        updatePlayer(gameid);
        notify(username, password, gameid, side, new Array(rec1, rec2));
    }
}

function skipP(gameid) {
    var extra = gameid == GAME_ID_PVP ? 'player' : 'ai';
    var str = "<span id=\"skip-" + extra + "\" style=\"display:flex; justify-content: center;align-items: baseline; height:3vh; font-size:3vw\"><button type=\"button\" class=\"login-cancelbtn\">Skip</button></span>";
    generateHtml(document.getElementById('Player-Stack-' + extra), str);
    var stk = document.getElementById('skip-' + extra);
    stk.style.filter = 'invert(100%)';
    stk.onclick = function() {
        document.getElementById('Player-Stack-' + extra).removeChild(document.getElementById('skip-' + extra));
        notify(username, password, gameid, undefined, undefined, true);

    }
}

function codePosition(r1, r2, code) {
    if (r1 == r2) return '0';
    var c90, c270;
    [c90, c270] = [codeHorizontal(r2, r1), codeHorizontal(r1, r2)]
    return code == c90 ? '90' : '270';
}


function codeVertical(r1, r2) {
    var v = 127075 + r1 * 7 + r2;
    return '&#' + v + ';';
}

function codeHorizontal(r1, r2) {
    var v = 127025 + r1 * 7 + r2;
    return '&#' + v + ';';
}

function hasAnyMatch(board, gameid) {
    var l = board.length;
    var hand = gameid == GAME_ID_PVP ? PLAYER_PVP.hand : PLAYER_PVE.hand;
    if (l == 0) return true;
    for (let [k, piece] of hand) {
        var result, cond = false;
        if (l == 1) {
            result = checkMatch(piece, board[0], l);
            cond = result != "nomatch";
        } else {
            result = [checkMatch(piece, board[0], l, true), checkMatch(piece, board[l - 1], l)];
            cond = result[0] != "nomatch" || result[1] != "nomatch";
        }
        if (cond) return true;
    }
    return false;
}

function checkMatch(piece, board_piece, length, is_top = false) {
    //piece = [r0,r1] board_piece = [d1,d2];
    var r0, r1, d0, d1, pdouble, bdouble;
    [r0, r1, d0, d1] = [piece[0], piece[1], board_piece[0], board_piece[1]];
    [pdouble, bdouble] = [r0 == r1, d0 == d1];

    var result = "nomatch";
    if (length == 1) {
        if (bdouble)
            result = r0 == d0 || r1 == d0 ? "both" : "nomatch";
        else
        if (pdouble)
            result = r0 == d0 ? "top" : r0 == d1 ? "bot" :
            "nomatch";
        else
            result = r0 == d0 || r1 == d0 ? "top" : r0 == d1 || r1 == d1 ? "bot" : "nomatch";
    } else if (is_top) {
        if (bdouble)
            result = r0 == d0 || r1 == d0 ? "top" : "nomatch";
        else
            result = r0 == d0 || r1 == d0 ? "top" : "nomatch";
    } else { //bottom
        if (bdouble)
            result = r0 == d0 || r1 == d0 ? "bot" : "nomatch";
        else
            result = r0 == d1 || r1 == d1 ? "bot" : "nomatch";
    }
    return result;
}


function createStackRetriever(gameid) {
    var extra = gameid == GAME_ID_PVP ? 'player' : 'ai';
    var str = "<span id=\"stack-taker-" + extra + "\" style=\"display:flex; justify-content: center;align-items: baseline; height:3vh; font-size:3vw\"><button type=\"button\" class=\"login-cancelbtn\"> Take from Stack</button></span>";
    generateHtml(document.getElementById('Player-Stack-' + extra), str);
    var stk = document.getElementById('stack-taker-' + extra);
    stk.style.filter = 'invert(100%)';
    stk.addEventListener('onclick', takePieceStack(stk, gameid));
}

function takePieceStack(obj, gameid) {
    obj.onclick = function(obj) {
        var extra, stk;
        if (gameid == GAME_ID_PVP)[extra, stk] = ['player', STACK_PVP];
        else [extra, stk] = ['ai', STACK_PVE];
        if (stk == 0) {
            messageUser('starter', 'No piece matches, Stack is empty. Passing turn');
            notify(username, password, gameid, undefined, undefined, true);
        } else {
            document.getElementById('Player-Stack-' + extra).removeChild(this);
            notify(username, password, gameid, undefined, true, undefined);
        }
    }
}

function playMax(gameid) {
    var piece, max = -1;
    var hand = gameid == GAME_ID_PVP ? PLAYER_PVP.hand : PLAYER_PVE.hand;
    for (let [k, p] of hand) {
        var points = p[0] + p[1];
        if (points > max)[piece, max] = [p, points];
        else if (points == max)
            if (Math.round(Math.random()) == 1)[piece, max] = [p, points];
    }
    [rec1, rec2] = [piece[0], piece[1]];
    [rec1, rec2] = rec2 >= rec1 ? [rec2, rec1] : [rec1, rec2];
    //console.log("Piece: [" + rec1 + ',' + rec2 + ']');
    updatePlayer(gameid);

    notify(username, password, gameid, undefined, new Array(rec1, rec2));

}