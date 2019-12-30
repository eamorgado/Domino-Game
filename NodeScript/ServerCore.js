const crypto = require('crypto');
const servergame = require('./ServerGame');
const matching = require('./Matching');
const ranking = require('./ranking');
const timer = require('./timer');

module.exports.ServerCore = class {
    /**
     * This class will store all the running games, using a map where the keys
     *  will be the group number and the value an object
     */
    constructor() {
        this.core = new Map();
        this.endedgames = new Set();
    }
    getCore() { return this.core; }
    getEnded() { return this.core; }
    join(user, pass, group = undefined, is_ai = false) {
        var g;
        if (group != undefined) {
            g = crypto.createHash('md5').update(group.toString()).digest('hex');
            if (this.endedgames.has(g)) return { error: "Game is ending, try again in a few moments" };
            if (this.core.has(g) && this.core.get(g).getPlayer2() != undefined)
                return { error: "Game is full" };
        } else g = this.findAvailable(user, is_ai); //find a valid group

        if (this.core.has(g)) {
            //created => join
            var u1 = this.core.get(g).getPlayer1().getUser();
            if (u1 == user) return { error: "Cannot join your own game" };
            this.core.get(g).joinPlayer(user, pass);
        } else {
            //create
            var newgame = new servergame.ServerGame(user, pass, g, is_ai);
            this.core.set(g, newgame);
        }
        //if (!is_ai) this.core.get(g).setTimer(this, user, g);
        let h = this.core.get(g).getHand(user);
        return { game: g, hand: h };
    }

    leave(user, game) {
        if (this.core.has(game)) {
            var g = this.core.get(game);
            g.leavePlayer(user);
            if (!g.isAi()) { //Not AI game => update rankings
                var winner = g.getWinner();
                //console.log('Leave winner:' + winner);

                if (this.endedgames.has(game)) { //game exists => all confirmed, remove
                    this.core.delete(game);
                    this.endedgames.delete(game);
                } else {
                    this.endedgames.add(game); //First leave confirm
                    if (winner != undefined) {
                        var p1, p2;
                        [p1, p2] = [g.getPlayer1().getUser(), g.getPlayer2().getUser()];
                        ranking.updateRanking(p1, p2, winner);
                    }
                }
            } else this.core.delete(game); //AI game => valid delete
        }
        return {};
    }

    notify(user, game, side, piece, skip) {
        /*
         *  [piece] -> add a piece
         *  [side,piece] -> add piece to side
         *  [piece==null] -> go to stack
         *  [skip == null] -> skip turn
         */

        //console.log('not [side,piece,skip] => [' + side + ',' + piece + ',' + skip + ']');
        if (!this.core.has(game)) {}
        var srv_game = this.core.get(game);
        user = srv_game.isAi() ? "HUMAN" : user;

        if (srv_game.getTurn() != user) return { error: "Not your turn to play" };
        else if (skip != undefined && skip == true) {
            //skip turn
            if (srv_game.stackAvailable()) return { error: "Stack still has pieces" };
            srv_game.skipTurn(user);
            return {};

        } else if (side != undefined && piece != undefined && piece != true) {
            //add piece to side
            let flag, resp;
            [flag, resp] = checkPiece(piece);
            if (flag) return resp;
            if (side == 'start')
                srv_game.prependPiece(user, piece);
            else if (side == 'end')
                srv_game.appendPiece(user, piece);
            return {};

        } else if (piece != undefined && piece == true) {
            //take piece from stak
            var p = srv_game.goStack(user);
            if (p == false) return { error: "Stack empty, passing turn" };
            return { piece: p };

        } else if (piece != undefined && piece != undefined) {
            //add piece
            let flag, resp;
            [flag, resp] = checkPiece(piece);
            if (flag) return resp;
            var board = srv_game.getBoard();
            var l = board.length;
            if (l == 0) {
                srv_game.appendPiece(user, piece);
                return {};
            } else if (l == 1) {
                var result = matching.checkMatch(piece, board[0], l);
                if (result == 'nomatch')
                    return { error: "Piece does not match" };
                else if (result == 'both')
                    return { piece: piece, side: "pick" };
                else if (result == 'top') srv_game.prependPiece(user, piece);
                else srv_game.appendPiece(user, piece);
                return {};
            } else if (l > 1) {
                var result = [matching.checkMatch(piece, board[0], l, true), matching.checkMatch(piece, board[l - 1], l)];
                if (result[0] == 'nomatch' && result[1] == 'nomatch')
                    return { error: "Piece does not match" };
                if (result[0] != 'nomatch' && result[1] != 'nomatch')
                    return { piece: piece, side: "pick" };
                result = result[0] == 'nomatch' ? result[1] : result[0];
                if (result == 'top') srv_game.prependPiece(user, piece);
                else srv_game.appendPiece(user, piece);
                return {};
            }
        }
    }

    update(user, id) {
        if (!this.core.has(id)) return { error: "Game does not exist" };
        var game = this.core.get(id); //find the game with this id

        if (game.player2 == undefined) return {};
        //update the winner
        if (game.isGameOver()) {
            var winner
            if (game.leave[0]) winner = game.leave[1];
            else {
                game.checkWinner();
                winner = game.winner;
            }
            if (winner != undefined) {
                //console.log('Ending game::::');
                //if (game.isGameOver()) game.checkWinner();
                //console.log(winner);
                var p1, p2;
                [p1, p2] = [game.player1.user, game.player2.user];

                var resp = { "winner": winner };
                //delete game id
                if (!game.isAi()) {
                    if (this.endedgames.has(id)) {
                        this.core.delete(id);
                        this.endedgames.delete(id);
                    } else {
                        this.endedgames.add(id);
                        ranking.updateRanking(p1, p2, winner);
                    }
                } else this.core.delete(id);
            }
            //console.log('Resp 1: ' + resp);
            //console.log(this.endedgames);
            return resp;
        }
        //console.log(game.sz1 + '  ' + game.sz2);

        var size1, size2, u1, u2;
        u1 = game.player1.user;
        u2 = game.player2.user;
        size1 = game.sz1;
        size2 = game.sz2;

        var resp = {
                board: {
                    line: game.getBoard(),
                    stock: game.getStack().length,
                },
                turn: game.turn,
            }
            //console.log('TURN: |' + game.turn + '|');

        resp.board["count"] = {};
        resp.board.count[u1] = size1;
        resp.board.count[u2] = size2;
        if (game.getBoard().length > 0) {
            resp.board["piece"] = game.getLast();
            resp.board["place"] = game.getPlace();
        }
        //console.log('Resp 2: ' + resp);

        return resp;
    }

    gameAvailable(game) { return !this.core.has(game) && !this.endedgames.has(game); }
    findAvailable(user, is_ai = false) {
        var game;
        //find available game
        if (!is_ai)
            for (let [k, v] of this.core)
                if (!this.endedgames.has(v))
                    if (v.getPlayer2() == undefined && v.player1.user != user) return k;
                    //no available games
        do {
            game = Math.floor(Math.random() * 999999);
            game = crypto.createHash('md5').update(game.toString()).digest('hex');
        } while (!this.gameAvailable(game));
        return game;
    }
}

function checkPiece(piece) {
    var flag, resp = undefined;
    if (!Array.isArray(piece)) resp = { error: "Piece is not an array" }
    if (piece.length != 2) resp = { error: "Piece should have 2 items" };
    if (!Number.isInteger(piece[0]) || !Number.isInteger(piece[1]))
        resp = { error: "Not a number" }
    if (!inRange(piece[0], 0, 6) || !inRange(piece[1], 0, 6))
        resp = { error: "Invalid piece" };
    flag = resp != undefined;
    return [flag, resp];
}

function inRange(x, min, max) {
    return x >= min && x <= max;
}