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

function addBlank(i) {
    var img = document.createElement('span');
    img.style.fontSize = '5vw';
    img.innerHTML = '&#127074;';
    //var img = document.createElement('div');
    img.setAttribute('class', 'DM-normal');
    img.setAttribute('id', i);
    img.style.display = 'fixed';
    img.style.marginLeft = '5px';
    img.style.marginRight = '5px';
    return img;
}

function appendBlank(receiver, pieces_array) {
    var i = 0;
    for (let p of pieces_array)
        receiver.appendChild(addBlank(i++));
}

function createPiecePlayers(id, side, flag) {
    var rec1, rec2, split;
    if (Array.isArray(id))[rec1, rec2] = [id[0], id[1]];
    else {
        split = id.split('-');
        [rec1, rec2] = [Number(split[1]), Number(split[2])];
    }
    var img = document.createElement('span');
    if (!flag && !side) {
        img.style.width = '5vw';
    }
    img.innerHTML = flag ? '&#127074;' : codeVertical(rec1, rec2);

    img.style.fontSize = '5vw';

    //var img = document.createElement('div');
    img.setAttribute('id', id);
    img.style.display = 'fixed';
    img.className = 'DM-normal';
    img.onmouseover = function() {
        img.style.filter = 'invert(100%)';
    };
    img.onmouseout = function() {
        img.style.filter = 'invert(0%)';
    };
    if (side)
        img.innerHTML = side == 'left' ? codeHorizontal(rec1, rec2) : codeHorizontal(rec2, rec1);
    return img;
}

function givePiecesPlayers(receiver, hand, before, side, flag) {
    //hand is dictionary
    for (let [k, v] of hand)
        if (before) receiver.prepend(createPiecePlayers(k, side, flag));
        else receiver.appendChild(createPiecePlayers(k, side, flag));
}

function generateGameBoard(id, player1, player2) {
    var game_page = document.getElementById(id).getElementsByClassName('overlay-content')[0];
    var extra = id == 'human-page' ? '-player' : '-ai';
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