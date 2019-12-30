module.exports.getMaxPiece = function(hand) {
    var piece = new Array(-1, -1),
        points = -1;
    hand.forEach(p => {
        let pt = p[0] + p[1];
        if (pt > points)[points, piece] = [pt, p];
        else if (pt == points)
            if (Math.round(Math.random()) == 1)[points, piece] = [pt, p];
    });
    return piece;
}

module.exports.hasAnyMatch = function(hand, board) {
    let l = board.length;
    if (l == 0) return true;
    for (let piece of hand) {
        var result, cond;
        if (l == 1) {
            result = module.exports.checkMatch(piece, board[0], l);
            cond = result != "nomatch";
        } else {
            result = [module.exports.checkMatch(piece, board[0], l, true), module.exports.checkMatch(piece, board[l - 1], l)];
            cond = result[0] != "nomatch" || result[1] != "nomatch";
        }
        if (cond) return true;
    }
    return false;
}

module.exports.findBestMatch = function(hand, board) {
    //from all the possible matches gets the best match
    var options = module.exports.allMatches(hand, board);
    var max = -1,
        move, piece;

    if (board.length == 1) {
        for (let [k, v] of options) {
            let p = k.split('-');
            p = new Array(Number(p[0]), Number(p[1]));
            let points = p[0] + p[1];
            if (points > max)[max, piece, move] = [points, p, v];
            else if (points == max)
                if (Math.round(Math.random()) == 1)[max, piece, move] = [points, p, v];
        }
    } else {
        for (let i = 0; i < 2; i++) {
            for (let [k, v] of options[i]) {
                let p = k.split('-');
                p = new Array(Number(p[0]), Number(p[1]));
                let points = p[0] + p[1];
                if (points > max)[max, piece, move] = [points, p, v];
                else if (points == max)
                    if (Math.round(Math.random()) == 1)[max, piece, move] = [points, p, v];
            }
        }
    }
    return [piece, move];
}

module.exports.allMatches = function(hand, board) {
    //makes a map or array of maps for all possible matches
    let l = board.length;
    var options, result;
    if (l == 1) {
        options = new Map();
        for (let piece of hand) {
            let id = '' + piece[0] + '-' + piece[1];
            result = module.exports.checkMatch(piece, board[0], board.length);
            if (result != 'nomatch') options.set(id, result);
        }
    } else {
        options = new Array(new Map(), new Map());
        for (let piece of hand) {
            let id = '' + piece[0] + '-' + piece[1];
            result = [module.exports.checkMatch(piece, board[0], board.length, true), module.exports.checkMatch(piece, board[l - 1], board.length)];
            for (let i = 0; i < 2; i++)
                if (result[i] != 'nomatch') options[i].set(id, result[i]);
        }
    }
    return options;
}

module.exports.checkMatch = function(piece, board_piece, length, is_top = false) {
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
    /*module.exports.checkMatch = function(piece, board_piece, is_top = false) {
        //piece = [r0,r1] board_piece = [d1,d2];
        var r0, r1, d0, d1, pdouble, bdouble;
        [r0, r1, d0, d1] = [piece[0], piece[1], board_piece[0], board_piece[1]];
        [pdouble, bdouble] = [r0 == r1, d0 == d1];

        var result = "nomatch";
        if (this.board.length == 1) {
            if (bdouble)
                result = r0 == d0 ? "match-r0-both" : r1 == d0 ? "match-r1-both" :
                "nomatch";
            else
            if (pdouble)
                result = r0 == d0 ? "match-2sides-top" : r0 == d1 ? "match-2sides-bot" :
                "nomatch";
            else
                result = r0 == d0 ? "match-r0-top" : r0 == d1 ? "match-r0-bot" :
                r1 == d0 ? "match-r1-top" : r1 == d1 ? "match-r1-bot" :
                "nomatch";
        } else if (is_top) {
            if (bdouble)
                result = r0 == d0 ? "match-r0-top" : r1 == d0 ? "match-r1-top" :
                "nomatch";
            else
                result = pdouble && r0 == d0 ? "match-2sides-top" :
                r0 == d0 ? "match-r0-top" : r1 == d0 ? "match-r1-top" :
                "nomatch";
        } else { //bottom
            if (bdouble)
                result = r0 == d0 ? "match-r0-bot" : r1 == d0 ? "match-r1-bot" :
                "nomatch";
            else
                result = pdouble && r0 == d1 ? "match-2sides-bot" :
                r0 == d1 ? "match-r0-bot" : r1 == d1 ? "match-r1-bot" :
                "nomatch";
        }
        return result;
    }*/