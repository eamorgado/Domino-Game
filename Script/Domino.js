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
    isDouble(){return this.rec1 == this.rec2;}
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
        //var img = span.firstElementChild;
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
            if(side == 'left'){angle = '-180'; [r1,r2] = [r2,r1];}
            else if(side == 'right') angle = '0';
        }
        [this.rec1,this.rec2] = [r1,r2];
        this.position = position;
        span.style.transform = 'rotate('+angle+'deg)';
    }
    copyDomino(){
        return new Domino(this.rec1,this.rec2,this.flipped,this.position,this.owner,this.img_id);
    }
    showPiece(){return this.position;}
    equal(domino){return this.getPoints() == domino.getPoints();}
    match(domino,relative_to,size){
        var [r1,r2] = [this.rec1,this.rec2];
        var [d1,d2] = [domino.getRec1(),domino.getRec2()];
        if(this.isDouble()){
            //the two sides are the same
            return ((size == 1)? 
                        ((r1 == d1)? 'match-2sides-left' : ((r1 == d2)? 'match-2sides-right' : 'nomatch'))
                    :   ((r1 == d1)? 'match-2sides' : 'nomatch'));
        }

        //two sides are different
        if(domino.isDouble()){
            //domino to match is double
            if(size == 1)
                return ((r1 == d1)? 'match-r1-both' : ((r2 == d1)? 'match-r2-both' : 'nomatch')); 
            return ((r1 == d1)?
                        ((relative_to == 'left')? 'match-r1-right' : 'match-r1-left')
                    :   ((r2 == d1)?
                            ((relative_to == 'left')? 'match-r2-left' : 'match-r2-right')
                        :   'nomatch'
                        ));
        }
        //domino piece is horizontal
        if(size == 1){
            var sides = new Array();
            //both sides of domino are free => check r1-top r1-bot r2-top r2-bot
            if(r1 == d1) sides.push('match-r1-right-top');
            if(r1 == d2) sides.push('match-r1-left-bot');

            if(r2 == d1) sides.push('match-r2-left-top');
            if(r2 == d2) sides.push('match-r2-right-bot');
            if(sides.length == 0) return 'nomatch';
            return getRandomElements(sides,1)[0];
        }
        //only one side is free => check bot or tod depending on relative
        return ((relative_to == 'left')? 
                ((r1 == d1)? 'match-r1-right' : ((r2 == d1)? 'match-r2-left' : 'nomatch')) 
            :   ((r1 == d2)? 'match-r1-left' : ((r2 == d2)? 'match-r2-right' : 'nomatch')));
    }
}



/*------------------------------------------------------------------------------
------------------------------------------------------------------------------*/