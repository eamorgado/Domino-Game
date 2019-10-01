/*------------------------------------------------------------------------------
------------------------------------------------------------------------------*/
class Domino{
    /*Constructor for blank domino piece*/
    constructor(){
        this.rec1 = 0;
        this.rec2 = 0;
        this.flipped = false;
    }
    constructor(rec1, rec2){
        this.rec1 = rec1;
        this.rec2 = rec2;
        this.flipped = false;
    }

    getRec1(){
        return this.rec1;
    }
    getRec2(){
        return this.rec2;
    }
    isFlipped(){return this.flipped;}
    flipPiece(){this.flipped = !this.isFlipped();}

    getPoints(){return this.getRec1() + this.getRec2();}

    equal(domino){return this.getPoints() == domino.getPoints();}

    printVertical(){
        if(!this.isFlipped())
            console.log("---\n "+this.getRec1()+"\n -\n "+this.getRec2()+"\n---\n");
        else
            console.log("---\n "+this.getRec2()+"\n -\n "+this.getRec1()+"\n---\n");
    }
    printHorizontal(){
        if(!this.isFlipped())
            console.log("["+this.getRec1()+" | "+this.getRec2()+"]");
        else
            console.log("["+this.getRec2()+" | "+this.getRec1()+"]");
    }
}



/*------------------------------------------------------------------------------
------------------------------------------------------------------------------*/