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
        this.top_side = index_match;
        if(this.getDominos().length == 1) this.bot_side = index_match;
    }
    addDominoBot(domino,index_match){
        domino.newOwner('board');
        this.getDominos().push(domino);
        this.bot_side = this.getDominos().length-1;
        if(this.getDominos().length == 1) this.top_side = index_match;
    }
    getMatch(domino){
        var dom_top = this.getDominos()[0];
        var dom_bot = this.getDominos()[this.getBotSide];
        //two side match
        var tp = domino.match(dom_top);
        var bt = domino.match(dom_bot);
        if(tp == 'no' && bt == 'no') return false;
        if(tp != 'no'){
            if(bt != 'no')
                return getRandomElements(new Array(0,this.getBotSide()),1)[0];
            return 0;
        }
        else if(bt != 'no'){
            if(tp != 'no')
                return getRandomElements(new Array(0,this.getBotSide()),1)[0];
            return this.getBotSide();
        }
        return false;
    }
}



/*------------------------------------------------------------------------------
------------------------------------------------------------------------------*/