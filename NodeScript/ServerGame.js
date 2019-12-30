 const server_player = require('./ServerPlayer')
 const server_ai = require('./ServerAi');
 const matching = require('./Matching');
 const timer = require('./timer');
 module.exports.ServerGame = class {
     /**
      * This class will handle all the game logic for the server
      * It will have:
      *      -> turn: the nick of the user that has to play
      *      -> winner: the winner of the match
      *      -> stack: the game stack
      *      -> board: the game board
      *      -> player1: the class ServerPlayer for player 1 (the first that connects)
      *      -> player2: can be either a normal player or AI
      */
     constructor(user, pass, gameid, is_ai = false) {
         this.turn = undefined;
         this.winner = undefined;
         this.is_ai = is_ai;
         this.gameid = gameid;
         this.lastpiece = undefined;
         this.place = undefined;
         this.leave = [false, undefined];
         var all, stk, bd, h1, h2;
         all = getAllPieces();

         stk = getRandomElements(all, 14);
         all = filterArray(all, stk);
         h1 = getRandomElements(all, 7);
         all = filterArray(all, h1);
         h2 = getRandomElements(all, 7);

         this.stack = stk;
         this.board = new Array();
         this.hand1 = h1;
         this.hand2 = h2;
         this.sz1 = this.hand1.length;
         this.sz2 = this.hand2.length;
         this.szstk = 14;
         this.player1 = new server_player.ServerPlayer(user, pass, this.hand1);
         this.player2 = undefined;
         if (is_ai) {
             this.player2 = new server_ai.ServerAi();
             this.setTurn();
             if (this.turn == 'AI') {
                 this.makePlayAi();
             }
         }
     }
     getTurn() { return this.turn; }
     setTimer(core, user) {
         if (user == this.player1.user)
             this.timer_u1 = new timer.timer(user, core, this.gameid);
         else this.timer_u2 = new timer.timer(user, core, this.gameid);
     }
     clearTimer(user) {
         if (user == this.player1.user) this.timer_u1 = undefined;
         else this.timer_u2 = undefined;
     }
     setTurn() {
         var p1, p2;
         p1 = matching.getMaxPiece(this.hand1);
         p2 = matching.getMaxPiece(this.hand2);
         [p1, p2] = [p1[0] + p1[1], p2[0] + p2[1]];
         let random = Math.round(Math.random());
         this.turn = p1 > p2 ? this.player1.getUser() :
             p1 < p2 ? this.player2.getUser() :
             random == 1 ? this.player1.getUser() : this.player2.getUser();
     }
     getLast() { return this.lastpiece; }
     getPlace() { return this.place; }
     getWinner() { return this.winner }
     getBoard() { return this.board; }
     getStack() { return this.stack; }
     getPlayer1() { return this.player1; }
     getPlayer2() { return this.player2; }
     isAi() { return this.is_ai; }
     isGameOver() {
         if (this.leave[0]) this.gameover = true;
         else this.gameover = this.checkGameOver();
         return this.gameover;

     }
     checkGameOver() {
         //console.log(this.sz1 + ' ' + this.sz2);
         if (this.player2 == undefined) return false;
         if (this.sz1 == 0) return true;
         if (this.sz2 == 0) return true;
         if (this.board.length == 0) return false;
         if (this.board.length == 1) return false;

         var top = this.board[0],
             bot = this.board[this.board.length - 1];
         if (top != bot) return false;
         var count = 0;
         for (let p of this.board)
             if (p[0] == top || p[1] == top) count++;
         return count >= 7;
     }

     joinPlayer(user, pass) {
         this.player2 = new server_player.ServerPlayer(user, pass);
         this.setTurn();
     }
     leavePlayer(user) {
         if (!this.isGameOver()) {
             if (this.player2 != undefined)
                 this.winner = user == this.player1.getUser() ?
                 this.player2.getUser() : this.player1.getUser();
             else this.winner = undefined;
         } else this.checkWinner();

         this.leave = [true, this.winner];
         return this.winner;
     }
     checkWinner() {
         if (this.player2 == undefined) return undefined; //game hasn't even started
         var p1, p2, u1, u2;
         [p1, p2] = [calculatePoints(this.hand1), calculatePoints(this.hand2)];
         [u1, u2] = [this.player1.getUser(), this.player2.getUser()];
         let random = Math.round(Math.random());
         if (this.sz1 == 0) this.winner = u1;
         else if (this.sz2 == 0) this.winner = u2;
         else this.winner = p1 < p2 ? u1 :
             p1 == p2 ? true : u2;
     }

     stackAvailable() { return this.szstk != 0; }
     goStack(user) {
         //console.log('Stack -- ' + this.stack.length);
         if (this.stack.length == 0) return false;
         var piece = getRandomElements(this.stack, 1);
         this.stack = filterArray(this.stack, piece);
         //console.log('Stack: ' + piece);
         this.szstk--;
         if (user == this.player1.user) {
             this.hand1.push(piece);
             this.sz1++;
         } else {
             this.hand2.push(piece);
             this.sz2++;
         }
         return piece[0];
     }
     skipTurn(user) {
         var p1, p2;
         [p1, p2] = [this.player1.getUser(), this.player2.getUser()];
         this.turn = user == p1 ? p2 : p1;
         if (this.isAi() && user != "AI") this.makePlayAi();
         /**
          * else if (!this.isAi()) {
             this.clearTimer(user);
             this.setTimer(this.turn);
         }
          */
     }
     getUser(user) {
         var p1, p2, player;
         if (this.player2 == undefined) return this.player1;
         [p1, p2] = [this.player1.getUser(), this.player2.getUser()];
         player = user == p1 ? this.player1 : this.player2;
         return player;
     }
     getHand(user) {
         if (this.player2 == undefined) return this.hand1;
         if (user == this.player1.user) return this.hand1;
         return this.hand2;
     }
     appendPiece(user, piece) {
         //console.log('Append: ', piece);

         //piece [r0,r1]
         this.lastpiece = piece;
         this.place = 'end';
         var r0, r1, d;
         [r0, r1] = [Number(piece[0]), Number(piece[1])];
         var l = this.board.length;
         if (l != 0) {
             d = this.board[l - 1][1];
             if (r0 != r1)
                 [r0, r1] = r0 == d ? [r0, r1] : [r1, r0];
         }
         this.board.push(new Array(r0, r1));

         if (user == this.player1.getUser()) {
             this.hand1 = filterArray(this.hand1, new Array(piece));
             this.sz1--;
         } else {
             this.hand2 = filterArray(this.hand2, new Array(piece));
             this.sz2--;
         }
         this.skipTurn(user);
     }
     prependPiece(user, piece) {
         //console.log('Prepend: ', piece);
         this.lastpiece = piece;
         this.place = 'start';
         var r0, r1, d;
         [r0, r1] = [Number(piece[0]), Number(piece[1])];
         var l = this.board.length;
         if (l != 0) {
             d = this.board[0][0];
             if (r0 != r1)
                 [r0, r1] = r0 == d ? [r1, r0] : [r0, r1];
         }
         this.board.unshift(new Array(r0, r1));

         if (user == this.player1.getUser()) {
             this.hand1 = filterArray(this.hand1, new Array(piece));
             this.sz1--;
         } else {
             this.hand2 = filterArray(this.hand2, new Array(piece));
             this.sz2--;
         }
         this.skipTurn(user);
     }

     makePlayAi() {
         var user = "AI"; //AI
         var hand = this.hand2;
         var l = this.board.length;
         var board = this.board;
         if (l == 0) { //AI starts
             var piece, move;
             [piece, move] = matching.findBestMatch(hand, board);
             this.appendPiece(user, piece);
         } else {
             if (matching.hasAnyMatch(this.hand2, board)) {
                 var piece, move;
                 [piece, move] = matching.findBestMatch(hand, board);
                 if (l == 1) {
                     var result = matching.checkMatch(piece, board[0], l);
                     if (result == 'both')
                         if (Math.round(Math.random()) == 1)
                             this.appendPiece(user, piece);
                         else this.prependPiece(user, piece);
                     else if (result == 'top') this.prependPiece(user, piece);
                     else this.appendPiece(user, piece);
                 } else if (l > 1) {
                     var result = [matching.checkMatch(piece, board[0], l, true), matching.checkMatch(piece, board[l - 1], l)];
                     if (result[0] != 'nomatch' && result[1] != 'nomatch')
                         if (Math.round(Math.random()) == 1)
                             result = result[0];
                         else result = result[1];
                     else result = result[0] == 'nomatch' ? result[1] : result[0];
                     if (result == 'top') this.prependPiece(user, piece);
                     else this.appendPiece(user, piece);
                 }
             } else {
                 //Nomatch => check if stack is available, if not, pass
                 if (this.szstk == 0) this.skipTurn(user);
                 else {
                     this.goStack(user);
                     this.makePlayAi();
                 }
             }
         }
     }

 }

 function calculatePoints(hand) {
     var points = 0;
     hand.forEach(piece => { points += piece[0] + piece[1]; });
     return points;
 }

 function getAllPieces() {
     var array = new Array();
     for (let i = 6; i >= 0; i--)
         for (let j = i; j >= 0; j--)
             array.push(new Array(i, j));
     return array;
 }

 function getRandomElements(source, n) {
     /* This function will remove n random elements from source array*/
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
     var tmp = new Map();
     for (let [r0, r1] of source)
         tmp.set(r0 + '-' + r1, [r0, r1]);
     for (let [r0, r1] of to_remove) {
         let id = r0 + '-' + r1;
         if (tmp.has(id)) tmp.delete(id);
     }
     var new_array = new Array();
     for (let [k, v] of tmp) new_array.push(v);
     /* This function will remove all the elements in to_remove that occur in source*/
     /**
      * var tmp_source = source.filter(function(el) {
         return !to_remove.includes(el);
     });
      */
     return new_array;
 }