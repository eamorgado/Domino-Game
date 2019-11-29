function enableUserSelection(piece_obj, piece) {
    piece_obj.onclick = function(piece_obj) {
        var domino = player.hand.get(piece);
        var rec1, rec2;
        [rec1, rec2] = [domino.getRec1(), domino.getRec2()];
        [rec1, rec2] = rec2 >= rec1 ? [rec2, rec1] : [rec1, rec2];
        notify(username, password, GAME_ID, undefined, new Array(rec1, rec2));
    }
}


function sidePicker(rec1, rec2, pice) {
    var gb = document.getElementById('Game-Board');
    var side = rec1 == rec2 ? undefined : 'right';
    var p1 = addBlank('start-' + rec1 + '-' + rec2, 5, 5, '5%', side);
    var p2 = addBlank('end-' + rec1 + '-' + rec2, 5, 5, '5%', side);
    p1.style.filter = 'invert(0%)';
    p2.style.filter = 'invert(0%)';
    p1.addEventListener('onclick', clickPossible(p1));
    p2.addEventListener('onlcick', clickPossible(p2));
}

function clickPossible(p_obj) {
    p_obj.onclick = function(p_obj) {
        var parent = p_obj.parentElement;
        var splitted = p_obj.id.split('-'); //DM Flip side rec1 rec2
        var side, rec1, rec2;
        [side, rec1, rec2] = [splitted[2], splitted[3], splitted[4]];
        var op = side == 'start' ? 'end' : 'start';
        parent.removeChild(document.getElementById('DM-Flip-' + op));
        parent.removeChild(document.getElementById('DM-Flip-' + side));
        [rec1, rec2] = rec2 >= rec1 ? [rec2, rec1] : [rec1, rec2];
        notify(username, password, GAME_ID, side, new Array(rec1, rec2));
    }
}