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
    constructor(rec1,rec2,flipped,position,owner,img_id){
        this.position = position;
        this.rec1 = rec1;
        this.rec2 = rec2;
        this.points = rec1 + rec2;
        this.owner = owner;
        this.flipped = flipped;
        this.img_id = img_id;
    }
    getId(){return this.img_id;}
    getRec1(){return this.rec1;}
    getRec2(){return this.rec2;}
    tellPosition(){ return this.position;}
    tellOwner(){return this.owner;}
    //tellImgID(){return this.img_id;}
    isFlipped(){return this.flipped;}
    
    getPoints(){return this.points;}

    newOwner(owner){this.owner = owner;}
    rotatePiece(side){
        var span = document.getElementById(this.img_id);
        var r1 = this.rec1; var r2 = this.rec2;
        var position;
        var angle;
        if(this.position == 'vertical'){
            position = 'horizontal';
            if(side == 'left') angle = '90';
            else if(side == 'right'){angle = '-90'; [r1,r2] = [r2,r1];}
        }
        else{
            position = 'vertical';
            if(side == 'left'){angle = '90'; [r1,r2] = [r2,r1];}
            else if(side == 'right') angle = '-90';
        }
        [this.rec1,this.rec2] = [r1,r2];
        this.position = position;
        span.firstElementChild.style.transform = 'rotate('+angle+'deg)';
    }
    showPiece(){return this.position;}
    equal(domino){return this.getPoints() == domino.getPoints();}
    match(domino){
        var two_equal = (this.rec1 == this.rec2)? true : false
        if(two_equal){
            if(this.rec1 == domino.getRec1())
                return 'two';
            return 'no'
        }
        if(this.rec1 == domino.getRec1())
            return 'right';
        if(this.rec2 == domino.getRec1())
            return 'left';
        return 'no';
    }
}



/*------------------------------------------------------------------------------
------------------------------------------------------------------------------*/