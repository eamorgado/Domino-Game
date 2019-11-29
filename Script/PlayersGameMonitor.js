function enableUserSelection(piece_obj, piece) {
    piece_obj.onclick = function(piece_obj) {
        if (TURN != username) messageUser('starter', 'Not your turn. Wait.');
        else {
            var domino = player.hand.get(piece);
            var rec1, rec2;
            [rec1, rec2] = [domino.getRec1(), domino.getRec2()];
            [rec1, rec2] = rec2 >= rec1 ? [rec2, rec1] : [rec1, rec2];
            notify(username, password, GAME_ID, undefined, new Array(rec1, rec2));
        }
    }
}


function sidePicker(rec1, rec2, pice) {
    var gb = document.getElementById('Game-Board');
    var side = rec1 == rec2 ? undefined : 'right';
    var p1 = addBlank('DM-Flip-start-' + rec1 + '-' + rec2, 5, 5, '5%', side);
    var p2 = addBlank('DM-Flip-end-' + rec1 + '-' + rec2, 5, 5, '5%', side);
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
        notify(username, password, GAME_ID, side, new Array(rec1, rec2));
    }
}