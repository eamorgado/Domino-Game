/*------------------------------------------------------------------------------
                                Board Class
------------------------------------------------------------------------------*/
class Board{
    /*
     * Board Class:
     *  > dominos -- Will save the array of Domino pieces that have been played
     *  > top_side -- Will save first element index on the left
     *  > bot_side -- Will save first element index on the right
     * 
     *  - getDominos() -- returns the array of pieces
     *  - isEmpty() -- checks if board is empty
     *  - addDominoTop() -- appends new domino to top of board
     *  - addDominoBot() -- appends new domino to bot of board
     */

    constructor(id){
        this.dominos = new Array();
        this.top_side = -1;
        this.bot_side = -1;
        this.id = id;
    }

    getDominos(){return this.dominos;}
    isEmpty(){return typeof this.dominos === 'undefined' && this.dominos.length == 0;}
    getTopSide(){return ((!this.isEmpty())? this.top_side : -1)}
    getBotSide(){return ((!this.isEmpty())? this.bot_side : -1);}
    boardSize(){return this.getDominos().length;}

    addDominoTop(domino, index_match){
        this.dominos.splice(0,0,domino);
        domino.newOwner('board');
        //this.getDominos().push(domino);
        this.top_side = 0;
        if(this.getDominos().length == 1) this.bot_side = 0;
    }
    addDominoBot(domino,index_match){
        domino.newOwner('board');
        this.getDominos().push(domino);
        this.bot_side = this.getDominos().length-1;
        if(this.getDominos().length == 1) this.top_side = 0;
    }
}
/*------------------------------------------------------------------------------
------------------------------------------------------------------------------*/