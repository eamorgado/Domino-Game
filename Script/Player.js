/*------------------------------------------------------------------------------
                            Player Class
------------------------------------------------------------------------------*/
class Player {
    constructor(player) {
        this.player = player;
        this.points = 0;
        this.hand = new Map();
    }

    getName() { return this.player; }
    getHand() { return this.hand; }
    addPoints(points) { this.points += points; }
    playPiece(id, board, indexmatch) {
        var dom = this.hand.get(id);
        var before = (indexmatch == 0) ? true : false;
        if (before) board.addDominoTop(dom.copyDomino(), 0);
        else board.addDominoBot(dom.copyDomino(), indexmatch);
        this.hand.delete(id);

        //place on board
        var b = document.getElementById(board.id);
        var parent = document.getElementById(this.player);
        parent.removeChild(document.getElementById(id));
        var d = board.getDominos()[indexmatch];
        var side = '';
        //console.log("Giving ["+d.getRec1()+","+d.getRec2()+"] and isDouble="+d.isDouble()+"\n\n");

        if (!d.isDouble()) {
            d.rotatePiece('left');
            side = 'left';
        }
        givePieces(b, new Array(id), false, 1, 1, false, '5%', false, before, side);
    }

    findPlayerMatch(board, check) {
        /**
         * This function checks if player has at least one piece that makes match
         *      if so, it finds the piece with more points
         */
        var options = new Array(new Map(), new Map()); //options for top and bot
        var length = players[3].getDominos().length;
        var dom = players[3].getDominos();
        var top = dom[0],
            bot = dom[length - 1];

        for (let [k, v] of this.hand) {
            var verify = new Array(v.match(top, 'left', length), v.match(bot, 'right', length)); //get the 2 arrays for all possibilities
            if (verify[0] == 'nomatch' && verify[1] == 'nomatch') continue; //there is no match
            for (let i = 0; i < 2; i++)
                if (verify[i] != 'nomatch') options[i].set(k, verify[i]);
        }
        //get max points for piece
        var max = -1,
            move, piece, is_top;
        for (let i = 0; i < 2; i++) {
            for (let [k, v] of options[i]) {
                //console.log(k);
                let points = this.hand.get(k).getPoints();
                if (points > max)[max, piece, move, is_top] = [points, k, v, ((i == 0) ? true : false)];
                else if (points == max)
                    if (Math.round(Math.random()) == 1)[piece, move, is_top] = [k, v, ((i == 0) ? true : false)];
            }
        }
        return [max, move, piece, is_top, options];
    }
    logicPlacement(move, piece, is_player) {
        /**
         * This function handles all the logic to place the pieces, where and how (rotation)
         */
        var splitted = move.split('-');
        var pieces = new Array(piece);
        var b = document.getElementById("Game-Board");
        let options_gp = new Array(b, pieces, false, 1, 1, false, '5%', false, false, '');
        var to_top = false,
            to_rotate = true,
            rotate_side, translate, to_translate = false;

        switch (splitted.length) {
            case 3: //2sides-comp  |  {r1,r2}-{left-right,both}
                switch (splitted[1]) {
                    case 'r1': //r1-{left,right,both}
                        if (splitted[2] == 'both') {
                            if (is_player) {
                                to_rotate = true;
                                rotate_side = new Array('right', 'left'); //top-bot
                                translate = new Array('-2vw', '-2vw');
                            } else {
                                if (Math.round(Math.random()) == 1) {
                                    to_top = false;
                                    to_rotate = true;
                                    rotate_side = 'left';
                                    translate = '-2vw';
                                } //bot
                                else {
                                    to_top = to_rotate = true;
                                    rotate_side = 'right';
                                    translate = '2vw';
                                } //top
                            }
                        } else {
                            to_top = !(splitted[2] == 'left');
                            to_rotate = true;
                            [rotate_side, translate] = [splitted[2], (splitted[2] == 'left') ? '-2vw' : '2vw'];
                        }
                        break;
                    case 'r2': //r2-{left,right,both}
                        if (splitted[2] == 'both') {
                            if (is_player) {
                                to_rotate = true;
                                rotate_side = new Array('left', 'right'); //top-bot
                                translate = new Array('-2vw', '-2vw');
                            } else {
                                if (Math.round(Math.random()) == 1) {
                                    to_top = false;
                                    to_rotate = true;
                                    rotate_side = 'right';
                                    translate = '-2vw';
                                } //bot
                                else {
                                    to_top = to_rotate = true;
                                    rotate_side = 'left';
                                    translate = '-2vw';
                                }
                            }
                        } else {
                            to_top = !(splitted[2] == 'right');
                            to_rotate = true;
                            [rotate_side, translate] = [splitted[2], (splitted[2] == 'right') ? '-2vw' : '2vw'];
                        }
                        break;
                }
                break;
            case 4: // 2sides-{left,right,top,bot}-comp | {r1,r2}-{left,right}-comp
                switch (splitted[1]) {
                    case '2sides':
                        if (splitted[2] == 'top') {
                            to_top = true;
                            to_rotate = false;
                        } else if (splitted[2] == 'bot') { to_top = to_rotate = false; } else {
                            to_top = (splitted[2] == 'left');
                            to_rotate = false;
                            to_translate = true;
                            translate = ((splitted[2] == 'left') ? '-2.5vw' : '2.5vw');
                        }
                        break;
                    case 'r1':
                        to_top = !(splitted[2] == 'left');
                        to_rotate = true;
                        [rotate_side, translate] = (to_top ? ['right', '2vw'] : ['left', '-2vw']);
                        break;
                    case 'r2':
                        to_top = (splitted[2] == 'left');
                        to_rotate = true;
                        [rotate_side, translate] = [splitted[2], top ? '2vw' : '2vw'];
                        break;
                }
                break;
            case 5: //{r1,r2}-{left,right}-{top,bot}-comp
                to_top = (splitted[3] == 'top');
                to_rotate = true;
                rotate_side = splitted[2];
                translate = ((splitted[1] == 'r1') ? (top ? '5vw' : '-4.7vw') : (top ? '-4.7vw' : '4.7vw'));
                break;
        }
        to_translate = false;
        //console.log("Rotate side " +rotate_side);

        return [to_top, to_rotate, to_translate, rotate_side, translate, options_gp];
    }
    findBestPlay(board, stack) {
        /**
         * This function finds the best piece to play for the Ai
         */
        //Disable clicks for player
        for (let [k, v] of players[1].hand) document.getElementById(k).style.pointerEvents = 'none';
        //Tests if game has ended
        if (isGameOver()) { gameHasEnded(); return; }

        var length = board.getDominos().length;
        var max, move, piece, is_top, opt;
        //get all matched pieces
        [max, move, piece, is_top, opt] = this.findPlayerMatch(board);
        //has to go to stack
        if (max == -1) {
            console.log('No pieces => Stack');
            var empty = this.takeFromStack(stack);
            if (empty) {
                //stack is empty
                if (isGameOver()) gameHasEnded();
                else {
                    turn(true);
                    makePlay(players[3]);
                }
                return;
            }
            //stack isn't empty, check if player AI can play
            this.findBestPlay(board, stack);
            return;
        }

        var copy = this.hand.get(piece).copyDomino();
        var b = document.getElementById('Game-Board'),
            splitted = move.split('-');
        var parent = document.getElementById(this.player);
        parent.removeChild(document.getElementById(piece));
        this.hand.delete(piece);

        //Finds how to place piece
        var options_gp;
        var to_top, to_rotate, to_translate, rotate_side, translate;
        [to_top, to_rotate, to_translate, rotate_side, translate, options_gp] = this.logicPlacement(move, piece, false);

        var index;
        if (to_top) {
            index = 0;
            board.addDominoTop(copy, index);
            options_gp[8] = true;
        } else {
            index = length;
            board.addDominoBot(copy, index);
        }
        var d = board.getDominos()[index];

        if (to_rotate) {
            options_gp[9] = rotate_side;
            d.rotatePiece(rotate_side, translate);
        }

        givePieces.apply(null, options_gp);
        console.log("domPiece AI: " + piece + ": [" + d.getRec1() + "," + d.getRec2() + "]\nsplitted: " + splitted);

        for (let [k, v] of players[1].hand) document.getElementById(k).style.pointerEvents = 'initial';
        turn(true);
        makePlay(players[3]);
        return;
    }
    takeFromStack(stack) {
        /**
         * This function will allow adversary or player to take pieces from stack
         *      if the stack is empty then it passes the turn to the other player
         */
        stack = players[2];
        //Stack is empty
        if (stack.hand.size == 0) {
            console.log("Stack empty ========");
            //PLayer is Adversary
            if (this.player != players[1].getName()) {}
            //Player is current
            else {
                //display pass modal
                document.getElementById("empty-stack").style.display = 'block';
                document.body.style.overflowY = 'hidden';
                document.getElementById('pass').onclick = function() {
                    document.getElementById("empty-stack").style.display = 'none';
                    document.body.style.overflowY = 'visible';
                }
            }
            return true;
        }
        //Stack is not empty, remove piece
        var keys = Array.from(stack.hand);
        keys = keys[Math.floor(Math.random() * keys.length)]; //random element in stack
        keys = keys[0];
        stack.hand.delete(keys);
        console.log("Giving piece " + keys + " to " + this.player);

        var stack_h = document.getElementById('Player-Stack');
        stack_h.textContent = 'Stack Pieces: ' + stack.getHand().size;

        //Append piece to player hand
        var flipped = !(this.player == players[1].getName()),
            hover = !flipped;
        this.addPiece(new Array(keys), false, 5, 5, flipped, '5%', hover, false);

        //If player was adv the display message that player is taking pieces
        if (this.player != players[1].getName()) infoTakeStack();
        //Stack was not empty so return false
        return false;
    }
    addPiece(pieces_array, add_onclick, margin_lef, margin_right, is_flipped, width, hover, is_stack, flag) {
        /**
         * This function will append the pieces in the array to player hand
         */
        for (const piece of pieces_array) {
            if (!this.hand.has(piece)) { //checks if piece to play isn't in hand
                if (!is_stack) { //if player isn't stack add dom img
                    var receiver = document.getElementById(this.player);
                    if (flag)
                        givePiecesPlayers(receiver, new Array(piece), add_onclick, margin_lef, margin_right, is_flipped, width, hover, undefined, undefined, true);
                    else
                        givePieces(receiver, new Array(piece), add_onclick, margin_lef, margin_right, is_flipped, width, hover, undefined, undefined);
                }
                //get individual dotted values
                var splitted = piece.split('-');
                var rec1 = Number(splitted[1]);
                var rec2 = Number(splitted[2]);
                //console.log("addPiece " + piece + " [" + rec1 + "," + rec2 + "]");
                if (flag)
                    var domino = new Domino(rec1, rec2, 'vertical', piece);
                else var domino = new Domino(rec1, rec2, is_flipped, 'vertical', this.player, piece);

                this.hand.set(piece, domino);
            } else console.log("addPiece: piece " + piece + " already exists in " + this.player);
        }
    }


    findMaxPiece() {
        var max = -1,
            id;
        for (let [k, v] of this.hand) {
            if (max == -1) id = k;
            let points = v.getPoints();
            if (max < points) {
                max = points;
                id = k;
            } else if (max == points)
                id = getRandomElements(new Array(id, k), 1)[0];
        }
        return new Array(max, id);
    }
}