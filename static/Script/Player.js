/*------------------------------------------------------------------------------
                            Player Class
------------------------------------------------------------------------------*/
class Player {
    constructor(name, ai = false) {
        this.player = name;
        this.ai = ai;
        this.hand = new Map();
    }
    getName() { return this.player; }
    addHand(hand) {
        for (let piece of hand) {
            var r1, r2, id;
            [r1, r2, id] = extractPieceParts(piece, this.ai);
            this.hand.set(id, piece);
        }
    }
    addPiece(id, piece) {
        this.hand.set(id, piece);
    }
    delete(piece) {
        var r1, r2, id;
        [r1, r2, id] = extractPieceParts(piece, this.ai);
        this.hand.delete(id);
    }
}


/*class Player {
    constructor(player, hand) {
        this.player = player;
        this.points = 0;
        this.hand = hand;
    }

    getName() { return this.player; }
    getHand() { return this.hand; }
    addPoints(points) { this.points += points; }
    addPiece(pieces_array, margin_lef, margin_right, is_flipped, width, hover, flag) {
        
for (let piece of pieces_array) {
    var receiver = document.getElementById(this.player);
    if (flag)
        givePiecesPlayers(receiver, new Array(piece), margin_lef, margin_right, is_flipped, width, hover, undefined, undefined, true);
    else
        givePieces(receiver, new Array(piece), margin_lef, margin_right, is_flipped, width, hover, undefined, undefined);
    //get individual dotted values
    var splitted = piece.split('-');
    var rec1 = Number(splitted[1]);
    var rec2 = Number(splitted[2]);
    //console.log("addPiece " + piece + " [" + rec1 + "," + rec2 + "]");
    if (flag)
        var domino = new Domino(rec1, rec2, 'vertical', piece);
    else var domino = new Domino(rec1, rec2, is_flipped, 'vertical', this.player, piece);

    this.hand.set(piece, domino);
}
}
} */