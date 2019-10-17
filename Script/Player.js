/*------------------------------------------------------------------------------
                            Player Class
------------------------------------------------------------------------------*/
class Player{
    constructor(player){this.player = player; this.points = 0; this.hand = new Map();}

    isAI(){return this.player == 'AI';}
    getName(){return this.player;}
    getHand(){return this.hand;}
    addPoints(points){this.points += points;}
    addPiece(pieces_array, add_onclick, margin_lef, margin_right, is_flipped, width, hover,is_stack){
        for(const piece of pieces_array){
            if(!this.hand.has(piece)){
                if(!is_stack){
                    var receiver = document.getElementById('Player-'+this.player);
                    givePieces(receiver,new Array(piece), add_onclick, margin_lef, margin_right, is_flipped, width, hover);
                }
                var splitted = piece.split('-');                
                var rec1 = Number(splitted[1]);
                var rec2 = Number(splitted[2]);
                

                var domino = new Domino(rec1,rec2,is_flipped,'vertical','Player-'+this.player,piece);
                this.hand.set(piece,domino);
            }
            else console.log("addPiece: piece "+piece+" already exists in Player-"+this.player);
        }
    }
    findMaxPiece(){
        var max = -1, id;
        for(let [k,v] of this.hand){
            id = (max > v.getPoints)? id : k;
            max = (max > v.getPoints())? max : v.getPoints();
        }
        return new Array(max,id);
    }
}