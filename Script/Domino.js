/*------------------------------------------------------------------------------
                Functions for flipping pieces/ checking flip
------------------------------------------------------------------------------*/
function flipPiece(piece){
    var elem = document.getElementById(piece);
    var path = 'Assets/DominoPieces/';
    if(elem.className == 'DM-flipped'){
        elem.firstChild.src = path + piece + '.png';
        elem.className = 'DM-displayed';
        return false;
    }
    else{
        elem.firstChild.src = path + 'DM-Flip.png';
        elem.className = 'DM-flipped';
        return true;
    }
}

function checkFlipped(piece){
    var elem = document.getElementById(piece);
    return elem.className == 'DM-flipped';
}




/*------------------------------------------------------------------------------
                            Domino Class
------------------------------------------------------------------------------*/
class Domino{
    //Constructor for blank domino piece
    constructor(horizontal,vertical,position,rec1,rec2,owner){
        this.flipped_horizontal = "&#127124;";
        this.flipped_vertical = "&amp;#127074;";
        this.horizontal_right = "&#" +(127025 + rec2*7 + rec1) + ";";
        this.horizontal_left = "&#" +(127025 + rec1*7 + rec2) + ";";
        this.vertical_up = "&#" + (127075 + rec1*7 + rec2) + ";";
        this.vertical_down = "&#" + (127075 + rec2*7 + rec1) + ";";
        this.owner = owner;
        this.points = rec1 + rec2;
        this.position = position;
        this.piece = this.flipped_horizontal;
    }
    /*constructor(rec1, rec2, flipped, position, owner, img_id){
        this.rec1 = rec1;
        this.rec2 = rec2;
        this.flipped = flipped;
        this.position = position;//at start all are vertical
        this.owner = owner;
        this.img_id = img_id;
    }*/
    getId(){return this.img_id;}
    getRec1(){return this.rec1;}
    getRec2(){return this.rec2;}
    tellPosition(){ return this.position;}
    tellOwner(){return this.owner;}
    //tellImgID(){return this.img_id;}
    isFlipped(){return this.position == this.flipped_horizontal || this.position == this.flipped_vertical;}
    
    getPoints(){return this.points;}

    newOwner(owner){this.owner = owner;}
    rotatePiece(side){
        /*var elem = document.getElementById(this.img_id);
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
        piece.style = 'transform: rotate('+angle+'deg)';*/
        
        if(side == 'right') this.position = this.horizontal_right;
        else if(side == 'left') this.position = this.horizontal_left;
        else if(side == 'down') this.position = this.vertical_down;
        else this.position = this.vertical_up;
    }
    flipDomPiece(){//this.flipped = flipPiece(this.img_id);
        this.piece = this.position;
    }
    showPiece(){return this.position;}
    equal(domino){return this.getPoints() == domino.getPoints();}

    /*printVertical(){
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
    }*/
}



/*------------------------------------------------------------------------------
------------------------------------------------------------------------------*/