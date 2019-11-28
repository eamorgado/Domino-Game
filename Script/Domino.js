/*------------------------------------------------------------------------------
                Functions for flipping pieces/ checking flip
------------------------------------------------------------------------------*/
function flipPiece(piece) {
    var elem = document.getElementById(piece);
    var path = 'Assets/DominoPieces/';
    if (elem.className == 'DM-flipped') {
        elem.firstChild.src = path + piece + '.png';
        elem.className = 'DM-displayed';
        return false;
    } else {
        elem.firstChild.src = path + 'DM-Flip.png';
        elem.className = 'DM-flipped';
        return true;
    }
}

function checkFlipped(piece) {
    var elem = document.getElementById(piece);
    return elem.className == 'DM-flipped';
}




/*------------------------------------------------------------------------------
                            Domino Class
------------------------------------------------------------------------------*/
class Domino {
    /**
     * Domino Class:
     *  > rec1 -- saves value of first dotted square in piece
     *  > rec2 -- saves value of second dotted square in piece
     *  > points -- saves the sum of the 2 squares, the domino piece's points
     *  > position -- saves position of domino piece on board (vertical/horizontal)
     *  > img_id -- saves DOM id for domino piece's image tag
     *  > is_double -- saves if piece is double, meaning both squares have equal dots
     *  > owner -- saves owner of piece (Adv,Curr,Stack,Board) [obsolete=>to_remove]
     *  > flipped -- saves if piece is flipped or not [obsolete=>to_remove]
     * 
     *  - newOwner(owner) -- changes piece owner to given [obsolete=>to_remove]
     *  - translatePieceX(translate) -- performs css translateX to <img id=img_id> tag [obsolete=>to_remove]
     *  - rotatePiece(side, translate) -- toggles piece position between vertical and horizontal
     *  - copyDomino() -- returns new copy domino
     *  - showPiece() [obsolete=>to_remove]
     *  - equal(domino) [obsolete=>to_remove]
     * 
     *  - match(domino,relative_to) -- tests match for piece against domino on board
     *          returns string with match/nomatch and types of match
     *  
     */
    constructor(rec1, rec2, flipped, position, owner, img_id) {
        this.rec1 = rec1;
        this.rec2 = rec2;
        this.points = rec1 + rec2;
        this.position = position;
        this.img_id = img_id;
        this.is_double = this.rec1 == this.rec2;
        this.owner = owner;
        this.flipped = flipped;
    }

    getId() { return this.img_id; }
    isDouble() { return this.is_double; }
    getRec1() { return this.rec1; }
    getRec2() { return this.rec2; }
    getPoints() { return this.points; }
    tellPosition() { return this.position; }
    tellOwner() { return this.owner; }
    isFlipped() { return this.flipped; }

    newOwner(owner) { this.owner = owner; }

    translatePieceX(translate) {
        var origin;
        var span = document.getElementById(this.img_id);
        if (translate == 'top_part')
            origin = (-1 * span.height / 4) + 'px';
        else origin = (span.height / 4) + 'px';
        span.style.webkitTransform = "translateX(" + translate + ")";
        span.style.mozTransform = "translateX(" + translate + ")";
        span.style.msTransform = "translateX(" + translate + ")";
        span.style.oTransform = "translateX(" + translate + ")";
        span.style.transform = "translateX(" + translate + ")";
    }

    rotatePiece(side, translate) {
        this.position = (this.position == 'vertical') ? 'horizontal' : 'vertical';
    }

    copyDomino() {
        var d = this.isDouble();
        var dom = new Domino(this.rec1, this.rec2, this.flipped, this.position, this.owner, this.img_id);
        dom.is_double = d;
        return dom;
    }

    showPiece() { return this.position; }
    equal(domino) { return this.getPoints() == domino.getPoints(); }

    match(domino, relative_to, size) {
        //console.log("Domino.match: "+domino.img_id);        
        var span = document.getElementById(domino.img_id);
        var splitted = span.style.transform.split('(')[1].split(')')[0];
        var [r1, r2] = [this.rec1, this.rec2];
        var [d1, d2] = [domino.getRec1(), domino.getRec2()];
        var comp;

        if (relative_to == 'left' && domino.position == 'horizontal')
            comp = ((splitted == '90deg') ? d2 : d1);
        else if (relative_to == 'right' && domino.position == 'horizontal')
            comp = ((splitted == '90deg') ? d1 : d2);

        if (this.isDouble()) {
            //the two sides are the same
            if (size == 1) {
                var sides = new Array();
                if (r1 == comp && relative_to == 'left') sides.push('match-2sides-left-' + comp);
                if (r1 == comp && relative_to == 'right') sides.push('match-2sides-right-' + comp);
                if (sides.length == 0) return 'nomatch';
                return getRandomElements(sides, 1)[0];
            } else {
                if (relative_to == 'left' && r1 == comp) return 'match-2sides-top-' + comp;
                if (relative_to == 'right' && r1 == comp) return 'match-2sides-bot-' + comp;
            }
            return 'nomatch';
        }
        //two sides are different
        if (domino.isDouble()) {
            //domino to match is double
            if (size == 1) {
                if (r1 == d1) return 'match-r1-both';
                if (r2 == d1) return 'match-r2-both';
            } else {
                if (relative_to == 'left') {
                    if (r1 == d1) return 'match-r1-right';
                    if (r2 == d1) return 'match-r2-left';
                } else {
                    if (r1 == d1) return 'match-r1-left';
                    if (r2 == d1) return 'match-r2-right';
                }
            }
            return 'nomatch'
        }
        //domino piece is horizontal
        if (size == 1) {
            var sides = new Array();
            //both sides of domino are free => check r1-top r1-bot r2-top r2-bot
            if (r1 == comp && relative_to == 'left') sides.push('match-r1-right-top-' + comp);
            else if (r1 == comp && relative_to == 'right') sides.push('match-r1-left-bot-' + comp);

            if (r2 == comp && relative_to == 'left') sides.push('match-r2-left-top-' + comp);
            else if (r2 == comp && relative_to == 'right') sides.push('match-r2-right-bot-' + comp);
            if (sides.length == 0) return 'nomatch';
            return getRandomElements(sides, 1)[0];
        }
        if (relative_to == 'left') {
            if (r1 == comp) return 'match-r1-right-' + comp;
            if (r2 == comp) return 'match-r2-left-' + comp;
        } else { //only one side is free => check bot or tod depending on relative
            if (r1 == comp) return 'match-r1-left-' + comp;
            if (r2 == comp) return 'match-r2-right-' + comp;
        }
        return 'nomatch';
    }
}
/*------------------------------------------------------------------------------
------------------------------------------------------------------------------*/