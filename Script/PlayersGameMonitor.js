function enableUserSelection(piece_obj, piece) {
    piece_obj.onclick = function(piece_obj) {
        if (TURN != username) messageUser('starter', 'Not your turn. Wait.');
        else {
            var domino = PLAYER.hand.get(piece);
            var rec1, rec2;
            [rec1, rec2] = [domino.getRec1(), domino.getRec2()];
            [rec1, rec2] = rec2 >= rec1 ? [rec2, rec1] : [rec1, rec2];
            notify(username, password, GAME_ID, undefined, new Array(rec1, rec2));
        }
    }
}


function sidePicker(rec1, rec2, pice) {
    var gb = document.getElementById('Game-Board-player');
    var p1 = addBlank('DM-Flip-start-' + rec1 + '-' + rec2, 5, 5, '5%');
    var p2 = addBlank('DM-Flip-end-' + rec1 + '-' + rec2, 5, 5, '5%');
    p1.style.filter = 'invert(100%)';
    p2.style.filter = 'invert(100%)';
    gb.prepend(p1);
    gb.appendChild(p2);
    p1.addEventListener('onclick', clickPossible(p1));
    p2.addEventListener('onlcick', clickPossible(p2));
}

function clickPossible(p_obj) {
    p_obj.onclick = function(p_obj) {
        var parent = this.parentElement;
        console.log(this.id);

        var splitted = this.id.split('-'); //DM Flip side rec1 rec2
        var side, rec1, rec2;
        [side, rec1, rec2] = [splitted[2], splitted[3], splitted[4]];
        var op = side == 'start' ? 'end' : 'start';
        parent.removeChild(document.getElementById('DM-Flip-' + op + '-' + rec1 + '-' + rec2));
        parent.removeChild(document.getElementById('DM-Flip-' + side + '-' + rec1 + '-' + rec2));
        [rec1, rec2] = rec2 >= rec1 ? [rec2, rec1] : [rec1, rec2];
        [rec1, rec2] = [Number(rec1), Number(rec2)];
        console.log("Piece: [" + rec1 + ',' + rec2 + ']  Side ' + side);
        updatePlayer();
        notify(username, password, GAME_ID, side, new Array(rec1, rec2));
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

function checkMatch(b) {
    var size = b.length;
    if (size == 0) return true;
    var comp = size == 1 ? new Array(b[0]) : new Array(b[0], b[size - 1]);
    for (let [k, v] of PLAYER.hand) {
        if (comp.length == 1) {
            if (v.matchVersus(comp[0][0], comp[0][1], undefined, size) != 'nomatch') return true;
        } else {
            if (v.matchVersus(comp[0][0], comp[0][1], 'left', size) != 'nomatch') return true;
            else if (v.matchVersus(comp[1][0], comp[1][1], 'right', size) != 'nomatch') return true;
        }
    }
    return false;
}


function createStackRetriever() {
    var str = "<span id=\"stack-taker\" style=\"display:flex; justify-content: center;align-items: baseline; height:3vh; font-size:3vw\"><button type=\"button\" class=\"login-cancelbtn\"> Take from Stack</button></span>";
    generateHtml(document.getElementById('Player-Stack-player'), str);
    var stk = document.getElementById('stack-taker');
    stk.style.filter = 'invert(100%)';
    stk.addEventListener('onclick', takePieceStack(stk));
}

function takePieceStack(obj) {
    obj.onclick = function(obj) {
        if (STACK == 0) {
            messageUser('starter', 'No piece matches, Stack is empty. Passing turn');
            notify(username, password, GAME_ID, undefined, undefined, null);
        } else {
            document.getElementById('Player-Stack-player').removeChild(this);
            notify(username, password, GAME_ID, undefined, null, undefined);
        }
    }
}

function playMax() {
    var piece, max = -1;
    for (let [k, v] of PLAYER.hand) {
        var points = v.getPoints();
        if (points > max)[piece, max] = [k, points];
        else if (points == max)
            if (Math.round(Math.random()) == 1)[piece, max] = [k, points];
    }
    console.log(piece);
    piece = piece.split('-');
    var rec1, rec2;
    [rec1, rec2] = [Number(piece[1]), Number(piece[2])];
    [rec1, rec2] = rec2 >= rec1 ? [rec2, rec1] : [rec1, rec2];
    console.log("Piece: [" + rec1 + ',' + rec2 + ']');
    updatePlayer();
    notify(username, password, GAME_ID, undefined, new Array(rec1, rec2));

}