function generateHtml(receiver, content) {
    //function to generate html code
    var html = new DOMParser().parseFromString(content, "text/html");
    receiver.appendChild(html.body.childNodes[0]);
}

//Array of pieces id
var pieces = new Array("DM-0-0", "DM-0-1", "DM-0-2", "DM-0-3", "DM-0-4", "DM-0-5", "DM-0-6",
    "DM-1-1", "DM-1-2", "DM-1-3", "DM-1-4", "DM-1-5", "DM-1-6",
    "DM-2-2", "DM-2-3", "DM-2-4", "DM-2-5", "DM-2-6",
    "DM-3-3", "DM-3-4", "DM-3-5", "DM-3-6",
    "DM-4-4", "DM-4-5", "DM-4-6",
    "DM-5-5", "DM-5-6",
    "DM-6-6");

function addBlank(i, left, right, width) {
    var img = document.createElement('span');
    img.style.fontSize = '5vw';
    img.innerHTML = '&#127074;';
    //var img = document.createElement('div');
    img.setAttribute('class', 'DM-normal');
    img.setAttribute('id', i);
    img.style.display = 'fixed';
    img.style.marginLeft = left + 'px';
    img.style.marginRight = right + 'px';
    return img;
}

function appendBlanck(receiver, pieces_array, left, right, width, flag) {
    var i = 0;
    for (let p of pieces_array)
        receiver.appendChild(addBlank(i++, left, right, width));
}

function createPiece(id, add_onclick, left, right, is_flipped, width, hover, side) {
    var path = 'Assets/DominoPieces/';
    var img = document.createElement('img');
    img.src = path + ((is_flipped) ? 'DM-Flip' : id) + '.png';
    img.style.width = '5%';
    img.style.height = '5%';

    //var img = document.createElement('div');
    img.setAttribute('class', ('DM-' + ((is_flipped) ? 'flipped' : 'displayed')));
    img.setAttribute('id', id);
    img.style.display = 'fixed';
    img.style.marginLeft = left + 'px';
    img.style.marginRight = right + 'px';
    img.style.transform = 'rotate(0deg)';

    if (add_onclick) {
        img.src = path + 'DM-Flip.png';
        var onclick = img.getAttribute('onclick');
        img.onclick = function() {
            if (img.className == 'DM-flipped') {
                img.src = path + id + '.png';
                img.className = 'DM-displayed';
            } else {
                img.src = path + 'DM-Flip.png';
                img.className = 'DM-flipped';
            }
        };
    }
    if (hover) {
        img.onmouseover = function() {
            img.style.filter = 'invert(100%)';
            img.style.border = '3px outset whitesmoke';
            img.style.borderRadius = '15%';
        };
        img.onmouseout = function() {
            img.style.filter = 'invert(0%)';
            img.style.border = '0px hidden';
            img.style.borderRadius = '0%';
        };
    } else { img.className = 'DM-normal'; }

    var splitted = img.style.transform;
    splitted = splitted.split('(')[1].split(')')[0];
    var angle = splitted;
    var origin, translate = new Array();
    if (splitted == '0deg' || splitted == '180deg') {
        if (side == 'left') {
            if (splitted == '0deg') angle = '270deg';
            else if (splitted == '180deg') angle = '90deg';
            else console.log("rotatePiece: error rotating vertical left |" + splitted + "| " + (splitted == '0deg'));
        } else if (side == 'right') {
            if (splitted == '0deg') angle = '90deg';
            else if (splitted == '180deg') angle = '270deg';
            else console.log("rotatePiece: error rotating vertical right |" + splitted + "| " + (splitted == '0deg'));
        }
    } else {
        if (side == 'left') {
            if (splitted == '90deg') angle = '0deg';
            else if (splitted == '270deg') angle = '180deg';
            else console.log("rotatePiece: error rotating horizontal left |" + splitted + "|");
        } else if (side == 'right') {
            if (splitted == '90deg') angle = '180deg';
            else if (splitted == '270deg') angle = '0deg';
            else console.log("rotatePiece: error rotating horizontal right |" + splitted + "|");
        }
    }
    //console.log("\n\nRotating "+id+" start: "+splitted+" side:"+side+" finish:"+angle+"\n\n");
    var str = 'rotate(' + angle + ')';
    //img.style.transformOrigin = 'center bottom';
    img.style.webkitTransform = str;
    img.style.mozTransform = str;
    img.style.msTransform = str;
    img.style.oTransform = str;
    img.style.transform = str;
    return img;
}

function givePieces(rec, pieces_array, add_onclick, margin_lef, margin_right, is_flipped, width, hover, before, side) {
    var receiver = rec,
        choice = false;
    if (Array.isArray(rec))[receiver, choice] = [rec[0], true]
    for (let p of pieces_array) {
        let piece = choice ? p + rec[1] : p;
        if (before) {
            var first = receiver.firstElementChild
                //console.log("givePieces: adding before");            
            receiver.prepend(createPiece(piece, add_onclick, margin_lef, margin_right, is_flipped, width, hover, side));
        } else receiver.appendChild(createPiece(piece, add_onclick, margin_lef, margin_right, is_flipped, width, hover, side));
    }
}



function createPiecePlayers(id, add_onclick, left, right, is_flipped, width, hover, side, flag) {
    var rec1, rec2, split;
    split = id.split('-');
    [rec1, rec2] = [Number(split[1]), Number(split[2])];
    //console.log([rec1, rec2]);

    var img = document.createElement('span');
    if (!flag && !side) {
        img.style.width = '5vw';
    }
    img.innerHTML = is_flipped ? '&#127074;' : codeVertical(rec1, rec2);

    img.style.fontSize = '5vw';

    //var img = document.createElement('div');
    img.setAttribute('class', ('DM-' + ((is_flipped) ? 'flipped' : 'displayed')));
    img.setAttribute('id', id);
    img.style.display = 'fixed';

    if (add_onclick) {
        img.innerHTML = '&#127074;'
        var onclick = img.getAttribute('onclick');
        img.onclick = function() {
            if (img.className == 'DM-flipped') {
                img.innerHTML = codeVertical(rec1, rec2);
                img.className = 'DM-displayed';
            } else {
                img.innerHTML = '&#127074;'
                img.className = 'DM-flipped';
            }
        };
    }
    if (hover) {
        img.onmouseover = function() {
            img.style.filter = 'invert(100%)';
        };
        img.onmouseout = function() {
            img.style.filter = 'invert(0%)';
        };
    } else { img.className = 'DM-normal'; }
    if (side)
        img.innerHTML = side == 'left' ? codeHorizontal(rec1, rec2) : codeHorizontal(rec2, rec1);
    return img;
}

function givePiecesPlayers(rec, pieces_array, add_onclick, margin_lef, margin_right, is_flipped, width, hover, before, side, flag) {
    var receiver = rec,
        choice = false;
    if (Array.isArray(rec))[receiver, choice] = [rec[0], true]
    for (let p of pieces_array) {
        let piece = choice ? p + rec[1] : p;
        if (before) {
            var first = receiver.firstElementChild
                //console.log("givePieces: adding before");            
            receiver.prepend(createPiecePlayers(piece, add_onclick, margin_lef, margin_right, is_flipped, width, hover, side, flag));
        } else receiver.appendChild(createPiecePlayers(piece, add_onclick, margin_lef, margin_right, is_flipped, width, hover, side, flag));
    }
}

function generateGameBoard(id, player1, player2) {
    var game_page = document.getElementById(id).getElementsByClassName('overlay-content')[0];
    var extra = id == 'human-page' ? '-player' : '';
    var board = document.createElement('div');
    board.setAttribute('id', 'Board' + extra);
    var player1_side = document.createElement('div');
    player1_side.setAttribute('id', player1);
    player1_side.setAttribute('class', 'player-class');

    var board_side = document.createElement('div');
    board_side.setAttribute('id', 'Game-Board' + extra);

    var stack_side = document.createElement('div');
    stack_side.setAttribute('id', 'Player-Stack' + extra);

    var player2_side = document.createElement('div');
    player2_side.setAttribute('id', player2);
    player2_side.setAttribute('class', 'player-class');

    arr = new Array(stack_side, player1_side, board_side, player2_side);
    arr.forEach(function(p) { board.appendChild(p); });
    //board_side.textContent = 'board';
    game_page.appendChild(board);
}