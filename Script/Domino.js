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
        this.is_double = this.rec1 == this.rec2;
    }
    getId(){return this.img_id;}
    isDouble(){return this.is_double;}
    getRec1(){return this.rec1;}
    getRec2(){return this.rec2;}
    tellPosition(){ return this.position;}
    tellOwner(){return this.owner;}
    //tellImgID(){return this.img_id;}
    isFlipped(){return this.flipped;}
    
    getPoints(){return this.points;}

    newOwner(owner){this.owner = owner;}
    translatePieceX(translate){
        var span = document.getElementById(this.img_id);
        span.style.webkitTransform = "translateX("+translate+")";
        span.style.mozTransform = "translateX("+translate+")";
        span.style.msTransform = "translateX("+translate+")";
        span.style.oTransform = "translateX("+translate+")";
        span.style.transform = "translateX("+translate+")";
    }
    rotatePiece(side,translate){
        var span = document.getElementById(this.img_id);
        //var img = span.firstElementChild;
        var r1 = this.rec1, r2 = this.rec2;
        var position, angle
        var splitted = span.style.transform;
        //console.log("rotatePiece ["+r1+","+r2+"] splitted before split: |"+splitted+"|");
        splitted = splitted.split('(')[1].split(')')[0];
        //console.log("rotatePiece ["+r1+","+r2+"] splitted after split: |"+splitted+"|");
         
        if(this.position == 'vertical'){
            position = 'horizontal';
            if(side == 'left'){
                if(splitted == '0deg')angle = 270;
                else if(splitted == '180deg')angle = 90;
                else console.log("rotatePiece: error rotating vertical left |"+splitted+"| "+(splitted == '0deg')); 
            }
            else if(side == 'right'){
                if(splitted == '0deg')angle = 90;
                else if(splitted == '180deg')angle = 270;
                else console.log("rotatePiece: error rotating vertical right |"+splitted+"| "+(splitted == '0deg')); 
            }
        }
        else{          
            position = 'vertical';
            if(side == 'left'){
                if(splitted == '90deg')angle = 0;
                else if(splitted == '270deg')angle = 180;
                else console.log("rotatePiece: error rotating horizontal left |"+splitted+"|"); 
            }
            else if(side == 'right'){
                if(splitted == '90deg') angle = 180;
                else if(splitted == '270deg') angle = 0;
                else console.log("rotatePiece: error rotating horizontal right |"+splitted+"|"); 
            }
        }
        //[this.rec1,this.rec2] = [r1,r2];
        this.position = position;
        var str = 'rotate('+angle+'deg)';
        //if(translate !== 'undefined') str += " translateY("+translate+")"
        span.style.webkitTransform = str;
        span.style.mozTransform = str;
        span.style.msTransform = str;
        span.style.oTransform = str;
        span.style.transform = str;
        if(translate !== 'undefined'){
            span.style.webkitTransform = str + " translateY("+translate+")";
            span.style.mozTransform = str + " translateY("+translate+")";
            span.style.msTransform = str + " translateY("+translate+")";
            span.style.oTransform =  str + " translateY("+translate+")";
            span.style.transform =  str + " translateY("+translate+")";
        }
        //console.log("rotatePiece ["+r1+","+r2+"] of position "+this.position+" angle("+angle+") transform: |"+span.style.transform+"|");
    }
    copyDomino(){
        var d = this.isDouble();
        var dom = new Domino(this.rec1,this.rec2,this.flipped,this.position,this.owner,this.img_id);
        dom.is_double = d;
        return dom;
    }
    showPiece(){return this.position;}
    equal(domino){return this.getPoints() == domino.getPoints();}
    match(domino,relative_to,size){
        var span = document.getElementById(domino.img_id);
        var splitted = span.style.transform.split('(')[1].split(')')[0];
        var [r1,r2] = [this.rec1,this.rec2];
        var [d1,d2] = [domino.getRec1(),domino.getRec2()];
        var comp;

        if(relative_to == 'left' && domino.position == 'horizontal')
            comp = ((splitted == '90deg')? d2 : d1);
        else if(relative_to == 'right' && domino.position == 'horizontal')
            comp = ((splitted == '90deg')? d1 : d2);

        if(this.isDouble()){
            //the two sides are the same
            if(size == 1){
                var sides = new Array();
                if(r1 == comp && relative_to == 'left') sides.push('match-2sides-left-'+comp);
                if(r1 == comp && relative_to == 'right') sides.push('match-2sides-right-'+comp);
                if(sides.length == 0) return 'nomatch';
                return getRandomElements(sides,1)[0];
            }else{
                if(relative_to == 'left' && r1 == comp) return 'match-2sides-top-'+comp;
                if(relative_to == 'right' && r1 == comp) return 'match-2sides-bot-'+comp;
            }
            return 'nomatch';
        }

        //two sides are different
        if(domino.isDouble()){
            //domino to match is double
            if(size == 1){
                if(r1 == d1) return 'match-r1-both';
                if(r2 == d1) return 'match-r2-both';
            }
            else{
                if(relative_to == 'left'){
                    if(r1 == d1) return 'match-r1-right';
                    if(r2 == d1) return 'match-r2-left';
                }else{
                    if(r1 == d1) return 'match-r1-left';
                    if(r2 == d1) return 'match-r2-right';
                }
            }
            return 'nomatch'
        }
        //domino piece is horizontal
        if(size == 1){
            var sides = new Array();
            //both sides of domino are free => check r1-top r1-bot r2-top r2-bot
            if(r1 == comp && relative_to == 'left') sides.push('match-r1-right-top-'+comp);
            else if(r1 == comp && relative_to == 'right') sides.push('match-r1-left-bot-'+comp);

            if(r2 == comp && relative_to == 'left') sides.push('match-r2-left-top-'+comp);
            else if(r2 == comp && relative_to == 'right') sides.push('match-r2-right-bot-'+comp);
            if(sides.length == 0) return 'nomatch';
            return getRandomElements(sides,1)[0];
        }
        if(relative_to == 'left'){
            if(r1 == comp) return 'match-r1-right-'+comp;
            if(r2 == comp) return 'match-r2-left-'+comp;
        }
        else{//only one side is free => check bot or tod depending on relative
            if(r1 == comp) return 'match-r1-left-'+comp;
            if(r2 == comp) return 'match-r2-right-'+comp;
        }return 'nomatch';
    }
}



/*------------------------------------------------------------------------------
------------------------------------------------------------------------------*/