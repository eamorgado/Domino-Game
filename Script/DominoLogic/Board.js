/*------------------------------------------------------------------------------
------------------------------------------------------------------------------*/
class Board{
    constructor(){
        this.dominos = new Array();
        this.top_side = -1;
        this.bot_side = -1;
    }
    getDominos(){return this.dominos;}
    isEmpty(){return typeof this.dominos === 'undefined' && this.dominos.length == 0;}
    getTopSide(){
        return ((!this.isEmpty())? this.top_side : -1)
    }
    getBotSide(){
        return ((!this.isEmpty())? this.bot_side : -1);
    }

    boardSize(){return this.getDominos().length;}
    addDominoTop(domino, rec1_match){
        this.getDominos().push(domino);
        if(rec1_match){
            domino.flipPiece();
            this.top_side = domino.getRec2();
        }
        else
            this.top_side = domino.getRec1();
    }
    addDominoBot(domino,rec1_match){
        this.getDominos().push(domino);
        if(rec1_match){
            domino.flipPiece();
            this.top_side = domino.getRec2();
        }
        else
            this.top_side = domino.getRec1();
    }
}



/*------------------------------------------------------------------------------
------------------------------------------------------------------------------*/