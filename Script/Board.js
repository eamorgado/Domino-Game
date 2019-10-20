/*------------------------------------------------------------------------------
------------------------------------------------------------------------------*/
class Board{
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