/*------------------------------------------------------------------------------
                Functions for flipping pieces/ cheaacking flip
------------------------------------------------------------------------------*/
function flipPiece(piece){
    var elem = document.getElementById(piece);
    var normal = elem.getElementsByClassName("DM-flipped")[0];
    var displayed = elem.getElementsByClassName("DM-displayed")[0];
    console.log("Flipped "+piece);
    if(normal.style.display == 'inline-block'){
        normal.style.display = 'none';
        displayed.style.display = 'inline-block';
        //Piece is now flipped
        return false;
    }
    else{
        normal.style.display = 'inline-block';
        displayed.style.display = 'none';
        //Piece is now flipped
        return true;
    }
}

function checkFlipped(piece){
    var elem = document.getElementById(piece);
    var normal = elem.getElementsByClassName("DM-flipped")[0];
    var displayed = elem.getElementsByClassName("DM-displayed")[0];

    return (((normal.style.display == 'inline-block') && (displayed.style.display == 'none'))? true : false);
}




/*------------------------------------------------------------------------------
                            Domino Class
------------------------------------------------------------------------------*
class Domino{
    //Constructor for blank domino piece
    constructor(){
        this.rec1 = 0;
        this.rec2 = 0;
        this.flipped = false;
        this.position = 'stack';
        this.owner = 'stack';
    }
    constructor(rec1, rec2, flipped, position, owner, img_id){
        this.rec1 = rec1;
        this.rec2 = rec2;
        this.flipped = flipped;
        this.position = position;//at start all are vertical
        this.owner = owner;
        this.img_id = img_id;
    }

    getRec1(){
        return this.rec1;
    }
    getRec2(){
        return this.rec2;
    }
    tellPosition(){ return this.position;}
    tellOwner(){return this.owner;}
    tellImgID(){return this.img_id;}
    isFlipped(){return this.flipped;}
    
    getPoints(){return this.getRec1() + this.getRec2();}

    rotatePiece(side){
        var elem = document.getElementById(this.img_id);
        var piece = elem.getElementsByClassName("DM-flipped")[0];
        var angle;
        var position;
        var r1 = this.rec1, r2 = this.rec2;
        if(this.position == 'vertical'){
            position = 'horizontal';
            if(side == 'left') angle = '90';                
            else if(side == 'right'){ angle = '-90';[r1, r2] = [r2, r1];}
        }
        else{
            position = 'vertical';
            if(side == 'left'){ angle= '90';[r1, r2] = [r2, r1];}
            else if(side == 'right') angle = '90';
        }
        this.rec1 = r1;
        this.rec2 = r2;
        this.position = position;
        piece.style = 'transform: rotate('+angle+'deg)';
    }
    flipPiece(){this.flipped = flipPiece(this.img_id);}

    equal(domino){return this.getPoints() == domino.getPoints();
    
    }

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