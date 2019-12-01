function getRandomElements(source, n) {
    /**
     * This function will remove n random elements from source array
     */
    var resulting_array = new Array(n);
    let len = source.length;
    let taken = new Array(len);
    if (n > len)
        throw new RangeError("getRandomElements: more elements taken than available");
    while (n--) {
        var x = Math.floor(Math.random() * len);
        resulting_array[n] = source[x in taken ? taken[x] : x];
        taken[x] = --len in taken ? taken[len] : len;
    }
    return resulting_array;
}


function filterArray(source, to_remove) {
    /**
     * This function will remove all the elements in to_remove that occur in source
     */
    var tmp_source = source.filter(function(el) {
        return !to_remove.includes(el);
    });
    return tmp_source;
}


var players, closed; //global variables


async function startGame(pieces, player1, player2) {
    /**
     * This function will start the game, initialize the players, choose which player
     *      to play first give turns
     */
    closed = false;
    //start players + stack
    players = new Array(3);
    [players[0], players[1], players[2], players[3]] = [new Player(player1), new Player(player2), new Player('Stack'), new Board('Game-Board')];


    var pieces_to_give = Array.from(pieces);

    //get random elements for player 1 adv
    var pieces_p0 = getRandomElements(pieces_to_give, 7);
    pieces_to_give = Array.from(filterArray(pieces_to_give, pieces_p0));

    //get random elements for player 2 current
    var pieces_p1 = getRandomElements(pieces_to_give, 7);
    pieces_to_give = Array.from(filterArray(pieces_to_give, pieces_p1));

    //adds all the pieces to the respective player
    var to_give = new Array(pieces_p0, pieces_p1, pieces_to_give);
    for (let i = 0; i < 3; i++)
        for (let piece of to_give[i])
            players[i].addPiece(new Array(piece), false, 5, 5,
                ((i == 0 || i == 2) ? true : false), '5%',
                ((i == 0 || i == 2) ? false : true),
                ((i == 2) ? true : false));

    //display available pieces in stack
    var stack = document.getElementById('Player-Stack');
    //players[2].getHand().set('array',pieces_to_give);
    stack.textContent = 'Stack Pieces: ' + players[2].getHand().size;

    //Finds the max piece in both players the one with the highest will start
    //if they are equal in points then randomize
    var max1 = players[0].findMaxPiece();
    var max2 = players[1].findMaxPiece();
    var id = ((max1[0] > max2[0]) ? max1[1] : ((max1[0] == max2[0]) ?
        getRandomElements(new Array(max1[1], max2[1]), 1)[0] : max2[1]));

    console.log("max:" + document.getElementById(id).parentElement.id);
    gameLoop(document.getElementById(id).parentElement.id, id)
}


function isGameOver() {
    /**
     * This function will check if game has ended
     * Game ends if either player has no more pieces
     *  or if game is closed, game is closed, if stack is empty, and extremes have same values
     *  and that value repeats itself 7 times in board, in which case, winner is player
     *  with less points in hand
     */
    //check points player 1    
    if (players[1].getHand().size == 0) return true;
    if (players[0].getHand().size == 0) return true;
    var dom = players[3].getDominos();
    if (dom.length == 0) return false;

    var [top, bot] = [dom[0], dom[dom.length - 1]];
    var up, down;

    var span = document.getElementById(top.getId());

    span = span.style.transform.split('(')[1].split(')')[0];
    if (span == '0deg' || span == '180deg') up = top.getRec1();
    else up = (span == '90deg') ? top.getRec2() : top.getRec1();

    span = document.getElementById(bot.getId());
    span = span.style.transform.split('(')[1].split(')')[0];
    if (span == '0deg' || span == '180deg') down = bot.getRec1();
    else down = (span == '90deg') ? bot.getRec1() : bot.getRec2();

    if (up != down) return false;
    //up and down are the same, check closed;
    var count = 0;
    for (let p of dom)
        if (p.getRec1() == up || p.getRec2() == up) count++;
    closed = count >= 7;
    return closed;
}


async function gameLoop(player, piece) {
    //piece is the img id
    //Disable clicks for player
    for (let [k, v] of players[1].hand) document.getElementById(k).style.pointerEvents = 'none';
    //await sleep(1000);

    //Starting player is AI
    if (player == players[0].getName() && player == 'Player-AI') {
        players[0].playPiece(piece, players[3], 0);
        turn(true);
        player = players[1].getName();
    } else if (player == players[1].getName()) {
        //turn(true);
        players[1].playPiece(piece, players[3], 0);
        player = players[0].getName();
    }

    //await sleep(1000);
    if (player != players[1].getName()) {
        //AI or other player
        if (player == players[0].getName()) {
            console.log(players[0].getName() + " to play");
            //await sleep(1000);
            players[0].findBestPlay(players[3], players[2]);
        }
        player = players[1].getName();
    } else {
        for (let [k, v] of players[1].hand) document.getElementById(k).style.pointerEvents = 'initial';
        console.log("You must Make play");
        turn(true);
        makePlay(players[3]);
    }
}


function gameHasEnded() {
    //game is over
    var winner, loser;
    if (!closed) {
        //one player has 0
        if (players[0].hand.size == 0) {
            console.log(players[0].getName() + " WON!");
            gameResults(players[0].getName(), false);
            winner = 0;
            loser = 1;
        } else if (players[1].hand.size == 0) {
            console.log(players[1].getName() + " WON!");
            gameResults(players[0].getName(), false);
            winner = 1;
            loser = 0;
        }
    } else {
        //game closed find one with lowest points
        var points = new Array(0, 0);
        for (let i = 0; i < 2; i++)
            for (let [k, v] of players[0].getHand())
                points[i] += v.getPoints();
        if (points[0] < points[1]) {
            console.log(players[0].getName() + " WON!");
            gameResults(players[0].getName(), false);
            winner = 0;
            loser = 1;
        } else if (points[0] > points[1]) {
            console.log(players[1].getName() + " WON!");
            gameResults(players[1].getName(), false);
            winner = 1;
            loser = 0;
        } else {
            console.log("DRAW");
            gameResults('', true);
            winner = loser = 0;
        }
    }
    updateLeaderBoard(winner, loser);
    quitGame.apply();
}


async function makePlay(board) {
    //player will click on pice, launching pieceToPlay
    //Game is over
    if (isGameOver()) { gameHasEnded(); return; }

    //Checks to see if there is any match
    var max, move, pice, is_top, opt;
    [max, move, piece, is_top, opt] = players[1].findPlayerMatch(board);
    console.log("Was there a match? " + max);
    //has to go to stack
    if (max == -1) {
        infoStack(true); //await sleep(1000);
        console.log('No pieces Player => Stack');
        var empty = players[1].takeFromStack(players[2]);
        //await sleep(1000);
        //stack is empty
        if (empty) {
            //check if game is over
            if (isGameOver()) { gameHasEnded(); return; }
            //game isn't over => adv play
            players[0].findBestPlay(players[3], players[2]);
        }
        makePlay(players[3]);
    } else {
        //Has pieces to play, listen to all
        for (let [k, v] of players[1].hand) {
            var span = document.getElementById(k);
            span.setAttribute('class', 'DM-normal');
            span.addEventListener("onclick", pieceToPlay(span, k));
        }
    }
}

function pieceToPlay(span, piece) {
    span.onclick = function(span) {
        var dom = players[1].hand.get(piece);
        var length = players[3].getDominos().length;
        var top = players[3].getDominos()[0],
            bot = players[3].getDominos()[length - 1];
        //Test match
        var verify = new Array(dom.match(top, 'left', length), dom.match(bot, 'right', length)); //get the 2 arrays for all possibilities

        var span = document.getElementById(piece);
        //No match
        if (verify[0] == 'nomatch' && verify[1] == 'nomatch') {
            noMatch(piece);
            console.log("No match");
            span.style.filter = "invert(0%)";
            span.style.transform = "scale(1)";
            makePlay(players[3]);
            return;
        } else {
            console.log("Match found");
            for (let [k, v] of players[1].hand) document.getElementById(k).style.pointerEvents = 'none';

            //will disable hover for player pieces and increase scale for current
            for (let [k, v] of players[1].hand) document.getElementById(k).setAttribute('class', 'DM-normal');
            span.style.filter = "invert(100%)";
            span.style.transform = "scale(1.2)";

            var str = "<span id=\"dont-place\" style=\"display:flex; justify-content: center;align-items: baseline; height:3vh; font-size:3vw\"><button type=\"button\" class=\"login-cancelbtn\">Don't Place</button></span>"
            generateHtml(document.getElementById('Player-Stack'), str)
            document.getElementById('dont-place').addEventListener('click', function() {
                document.getElementById('Player-Stack').removeChild(document.getElementById("dont-place"));
                var piece, pos, origin;
                for (let p of players[3].getDominos()) {
                    let sp = p.img_id.split('-');
                    if (sp.length > 3) {
                        pos = Number(sp[4]);
                        origin = sp[0] + '-' + sp[1] + '-' + sp[2];
                        break;
                    }
                }
                for (let i = 0; i < players[3].getDominos().length; i++) {
                    if (players[3].getDominos()[i].img_id == (origin + '-Possible-2')) {
                        document.getElementById('Game-Board').removeChild(document.getElementById(origin + '-Possible-2'));
                        players[3].getDominos().splice(i, 1);
                    } else if (players[3].getDominos()[i].img_id == (origin + '-Possible-1')) {
                        document.getElementById('Game-Board').removeChild(document.getElementById(origin + '-Possible-1'));
                        players[3].getDominos().splice(i, 1);
                    }
                }
                for (let [k, v] of players[1].hand) {
                    var dpc = document.getElementById(k);
                    dpc.style.filter = 'invert(0%)';
                    dpc.style.transform = 'scale(1)';
                    dpc.style.pointerEvents = 'initial';
                    dpc.style.transform = "scale(1)";
                }
                makePlay(players[3]);
            });

            var s, t, move;
            var to_top, to_rotate, to_translate, rotate, translate, options_gp;
            if (verify[1] != 'nomatch' && verify[0] != 'nomatch') {
                console.log("pieceToPlay: test matches " + verify[0] + " " + verify[1]);

                var ts = verify[0].split('-');
                s = ts[0] + '-' + ts[1];
                var tt = verify[1].split('-');
                t = tt[0] + '-' + tt[1];
                if (s == t && ts[2] == tt[2] && tt[2] == 'both') {

                    console.log("Both verify " + verify[0] + " " + verify[1]);
                    move = verify[0];
                    [to_top, to_rotate, to_translate, rotate, translate, options_gp] = players[1].logicPlacement(move, piece, true);
                    if (Array.isArray(rotate)) {
                        foo(piece, 1, true, true, to_translate, rotate[0], translate[0]);
                        foo(piece, 2, false, true, to_translate, rotate[1], translate[1]);
                    } else { foo(piece, 1, to_top, to_rotate, to_translate, rotate, translate); }
                    console.log("pieceToPlay: " + piece + ": [" + dom.getRec1() + "," + dom.getRec2() + "]\nMade match-->{" + move + "}\nRotation:" + rotate + "\nGoing to top=" + to_top);
                } else {
                    move = verify[0];
                    [to_top, to_rotate, to_translate, rotate, translate, options_gp] = players[1].logicPlacement(move, piece, true);
                    foo(piece, 1, to_top, to_rotate, to_translate, rotate, translate);
                    console.log("pieceToPlay: " + piece + ": [" + dom.getRec1() + "," + dom.getRec2() + "]\nMade match-->{" + move + "}\nRotation:" + rotate + "\nGoing to top=" + to_top);

                    move = verify[1];
                    [to_top, to_rotate, to_translate, rotate, translate, options_gp] = players[1].logicPlacement(move, piece, true);
                    foo(piece, 2, to_top, to_rotate, to_translate, rotate, translate);
                    console.log("pieceToPlay: " + piece + ": [" + dom.getRec1() + "," + dom.getRec2() + "]\nMade match-->{" + move + "}\nRotation:" + rotate + "\nGoing to top=" + to_top);

                }
            } else {
                move = verify[0] == 'nomatch' ? verify[1] : verify[0];
                [to_top, to_rotate, to_translate, rotate, translate, options_gp] = players[0].logicPlacement(move, piece, true);
                if (Array.isArray(rotate)) {
                    foo(piece, 1, true, true, to_translate, rotate[0], translate[0]);
                    foo(piece, 2, false, true, to_translate, rotate[1], translate[1]);
                } else { foo(piece, 1, to_top, to_rotate, to_translate, rotate, translate); }
                console.log("pieceToPlay: " + piece + ": [" + dom.getRec1() + "," + dom.getRec2() + "]\nMade match-->{" + move + "}\nRotation:" + rotate + "\nGoing to top=" + to_top);


            }
            //console.log([to_top,to_rotate,to_translate,rotate,translate]);

        }
    }
}

function foo(piece, possible, to_top, to_rotate, to_translate, rotate, translate) {
    var dom = players[1].hand.get(piece);
    //console.log("foo: "+piece);
    var index, length = players[3].getDominos().length;
    var copy = dom.copyDomino();
    copy.img_id = piece + '-Possible-' + possible;
    //console.log("DOM copy img id: "+copy.img_id);

    var parent;
    parent = document.getElementById("Game-Board");
    var opt = new Array(piece, false, 1, 1, false, '5%', false, '');
    var piece_to_place;

    if (to_rotate) opt[7] = rotate;
    piece_to_place = createPiece.apply(null, opt);

    piece_to_place.setAttribute('id', piece + '-Possible-' + possible);
    //console.log("foo: span id "+piece_to_place.id);    
    piece_to_place.setAttribute('class', 'DM-normal');
    piece_to_place.style.filter = 'invert(100%)';
    piece_to_place.style.display = 'block';

    if (to_top) {
        index = 0;
        players[3].addDominoTop(copy, index);
        var first = parent.firstElementChild;
        parent.insertBefore(piece_to_place, first);
    } else {
        index = length;
        players[3].addDominoBot(copy, index);
        parent.appendChild(piece_to_place);
    }

    var d = players[3].getDominos()[index];
    //console.log(to_rotate +" "+ translate);

    if (to_rotate) d.rotatePiece(rotate, translate);
    piece_to_place.addEventListener('click', place(piece, possible));
}

function place(piece, poss) {
    var piece_to_place = document.getElementById(piece + "-Possible-" + poss); //span in board
    piece_to_place.onclick = function(poss) {
        var pc = document.getElementById(players[1].getName());
        document.getElementById('Player-Stack').removeChild(document.getElementById("dont-place"));
        var piece = this.getAttribute('id');
        var origin = piece.split('-');
        var poss = Number(origin[4]);
        origin = origin[0] + '-' + origin[1] + '-' + origin[2];
        console.log("piece: " + piece + " poss:" + poss + " origin: " + origin);

        pc.removeChild(document.getElementById(origin));
        document.getElementById(piece).style.filter = 'invert(0%)';
        if (poss == 1) { //console.log("entered pos 1");            
            for (let i = 0; i < players[3].getDominos().length; i++) {
                //console.log("found the 2º");                
                if (players[3].getDominos()[i].img_id == (origin + '-Possible-2')) {
                    document.getElementById('Game-Board').removeChild(document.getElementById(origin + '-Possible-2'));
                    players[3].getDominos().splice(i, 1);
                } else if (players[3].getDominos()[i].img_id == (origin + '-Possible-1')) players[3].getDominos()[i].img_id = origin;
            }
        } else { //console.log("entered pos 2");
            for (let i = 0; i < players[3].getDominos().length; i++) {
                if (players[3].getDominos()[i].img_id == (origin + '-Possible-1')) {
                    //console.log("found the 1st");                    
                    document.getElementById('Game-Board').removeChild(document.getElementById(origin + '-Possible-1'));
                    players[3].getDominos().splice(i, 1);
                } else if (players[3].getDominos()[i].img_id == (origin + '-Possible-2')) players[3].getDominos()[i].img_id = origin;
            }
        }
        document.getElementById(piece).setAttribute('id', origin);
        players[1].hand.delete(origin);
        for (let [k, v] of players[1].hand) {
            var span = document.getElementById(k);
            span.removeEventListener('click', pieceToPlay(span, k));
        }
        turn(true);
        players[0].findBestPlay(players[3], players[2]);
    }
}

function turn(my_turn) {
    var p = username != undefined ? username : 'Human';
    var p = my_turn ? p : 'AI';

    var stack_h = document.getElementById('Player-Stack');
    stack_h.textContent = 'Stack Pieces: ' + players[2].getHand().size + '  |  Turn: ' + p;
}

function noMatch(piece) {
    var str =
        "<div id=\"no-match\" class=\"modal\">" +
        "<form class=\"login-modal-content animate\" action=\"#\">" +
        "<div class=\"login-container\"><h2>Piece has no match</h2></div>" +
        "<div class=\"login-container\"><center><img src=\"Assets/DominoPieces/" + piece + ".png\" width=\"10%\"></center></div>" +
        "<div class=\"login-container\" styler=\"background-color:#f1f1f1\">" +
        "<button id='ok-no-match' type=\"button\" class=\"submit\">OK</button>" +
        "</div>" +
        "</form>" +
        "</div>";
    generateHtml(document.getElementById('ai-page'), str);
    document.getElementById('no-match').style.zIndex = '5';
    document.getElementById('no-match').style.display = 'block';
    document.getElementById('ok-no-match').onclick = function() {
        document.getElementById('ai-page').removeChild(document.getElementById('no-match'));
    }
}


function infoStack(is_me) {
    var s = (is_me != 'undefined') ? 'You have no matching pieces<br>Taking from stack' : 'Adversary is taking pieces from stack';
    var str =
        "<div id=\"taking-from-stack\" class=\"modal\">" +
        "<form class=\"login-modal-content animate\" action=\"#\">" +
        "<div class=\"login-container\"><h2>" + s + "</h2></div>" +
        "<div class=\"login-container\" styler=\"background-color:#f1f1f1\">" +
        "<button id='ok-taking' type=\"button\" class=\"submit\">OK</button>" +
        "</div>" +
        "</form>" +
        "</div>";
    generateHtml(document.getElementById('ai-page'), str);
    document.getElementById('taking-from-stack').style.zIndex = '5';
    document.getElementById('taking-from-stack').style.display = 'block';
    document.getElementById('ok-taking').onclick = function() {
        var a = document.getElementById('ai-page');
        var st = document.getElementById('taking-from-stack');
        a.removeChild(st);
    }
}

function gameResults(winner, draw) {
    var s = (winner == players[1].player) ? 'You <b style=\"color: green;\">WON</b>' : 'You <b style=\"color: red;\">lost :(</b>';
    var s = draw ? 'Game was a <b>draw</b>' : s;
    var str =
        "<div id=\"game-results\" class=\"modal\">" +
        "<form class=\"login-modal-content animate\" action=\"#\">" +
        "<div class=\"login-container\"><h1>" + s + "</h1></div>" +
        "<div class=\"login-container\" styler=\"background-color:#f1f1f1\">" +
        "<button id='ok-results' type=\"button\" class=\"submit\">OK</button>" +
        "</div>" +
        "</form>" +
        "</div>";
    generateHtml(document.getElementById('ai-page'), str);
    document.getElementById('game-results').style.zIndex = '5';
    document.getElementById('game-results').style.display = 'block';
    document.getElementById('ok-results').onclick = function() {
        document.getElementById('ai-page').removeChild(document.getElementById('game-results'));
    }
}

function updateLeaderBoard(winner, loser) {
    var date = new Date().toDateString();;
    winner = players[winner].getName();
    loser = players[loser].getName();
    var draw = winner == loser;
    winner = (winner == players[1].getName() ?
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
    } else {
        /*var date = new Date().toDateString();;
        winner = players[winner].getName();
        loser = players[loser].getName();
        var s = (winner == loser) ? "Game was draw" : ((winner == players[1].getName()) ?
            "<b style=\"color: green;\">" + winner + "</b> won match" : "<b style=\"color: red;\">" + winner + "</b> won match");


        var leader_page = document.getElementById('leader-page').getElementsByClassName('overlay-content')[0]
        var str = "<p><br><span class=\"leaders\"><b>" + players[0].getName() + "  VS  " + players[1].getName() + "  " + date + "  Result: " + s + "</b></span></p>"
        generateHtml(leader_page, str);*/
    }
}