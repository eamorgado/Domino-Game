/*------------------------------------------------------------------------------
                            Player Class
------------------------------------------------------------------------------*/
class Player{
    constructor(player){this.player = player; this.points = 0;}

    isAI(){return this.player == 'AI';}
    getName(){return this.player;}
    getHand(){return this.hand;}
    addPoints(points){this.points += points;}
    addPiece(domino){
        this.hand[domino.getId()] = domino;
        domino.newOwner(this.player);
    }
    removePiece(domino, new_owner){
        delete this.hand[domino.getId()];
        domino.newOwner(new_owner);
    }
}