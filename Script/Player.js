/*------------------------------------------------------------------------------
                            Player Class
------------------------------------------------------------------------------*/
class Player{
    constructor(player){this.player = player; this.points = 0; this.hand = new Map();}

    isAI(){return this.player == 'AI';}
    getName(){return this.player;}
    getHand(){return this.hand;}
    addPoints(points){this.points += points;}
    playPiece(id,board,indexmatch){
        var dom = this.hand.get(id);
        if(indexmatch == 0){
            //add domino piece
                board.addDominoTop(dom,indexmatch);
            //place on board
                var b = document.getElementById(board.id);
                var parent = document.getElementById('Player-'+this.player);
                parent.removeChild(document.getElementById(id));
                givePieces(b,new Array(id),false,1,1,false,'5%',false,false);
            var d = board.getDominos()[indexmatch];
            d.rotatePiece('right');
            //rotate if necessary
                if(d.isDouble())
                    d.rotatePiece('left');
            this.hand.delete(id);
        }
        else board.addDominoBot(dom,indexmatch);

    }

    findBestPlay(board){
        //for AI player
        var options = new Array(new Map(),new Map()); //options for top and bot
        var size = board.getDominos().length;
        var top = board.getDominos()[0];
        var bot = board.getDominos()[board.getDominos().length-1];
        console.log("findBest: top-- "+top);
        console.log("findBest: bot-- "+bot);
        
        //get all matched pieces
        for(let [k,v] of this.hand){
            var verify = new Array(v.match(top,'left',size),v.match(bot,'right',size)); //get the 2 arrays for all possibilities
            if(verify[0] == 'nomatch' && verify[1] == 'nomatch') continue; //there is no match
            for(let i = 0; i < 2; i++) if(verify[i] != 'nomatch') options[i].set(k,verify[i]);
        }
        //get max points for piece
        var max = -1, move, piece, is_top;
        for(let i = 0; i < 2; i++){
            for(let [k,v] of options[i]){
                let points = this.hand.get(k).getPoints();
                if(points > max) [max,piece,move,is_top] = [points,k,v,((i == 0)?true:false)];
                else if(points == max)
                    if(Math.round(Math.random()) == 1) [piece,move,is_top] = [k,v,((i == 0)?true:false)];
            }
        }
        if(max == -1) console.log('No pieces => Stack');
        var b = document.getElementById('Game-Board');
        var splitted = move.split('-');        
        var parent = document.getElementById('Player-'+this.player);
        parent.removeChild(document.getElementById(piece));
        var length = board.getDominos().length;
        var copy = this.hand.get(piece).copyDomino();
        var d;
        switch(splitted.length){
            case 3: //2sides-{left,right}  |  {ri,r2}-{left-right,both}
                switch(splitted[1]){
                    case '2sides': 
                        if(splitted[2] == 'left'){
                            board.addDominoTop(copy,0);
                            givePieces(b,new Array(piece),false,1,1,false,'5%',false,false, true);
                        }
                        else{
                            board.addDominoBot(copy,length);
                            givePieces(b,new Array(piece),false,1,1,false,'5%',false,false, false);
                        }
                    break;
                    case 'r1': //r1-{left,right,both}
                        if(splitted[2] == 'both'){
                            if(Math.round(Math.random()) == 1){
                                board.addDominoBot(copy,length);
                                givePieces(b,new Array(piece),false,1,1,false,'5%',false,false, false);
                                let d = board.getDominos()[length];
                                d.rotatePiece('left');
                            }
                            else{
                                board.addDominoTop(copy,0);
                                givePieces(b,new Array(piece),false,1,1,false,'5%',false,false, true);
                                let d = board.getDominos()[0];
                                d.rotatePiece('right');
                            }
                        }
                        else{
                            if(splitted[2] == 'left'){
                                board.addDominoBot(copy,length);
                                givePieces(b,new Array(piece),false,1,1,false,'5%',false,false, false);
                                d = board.getDominos()[length];
                            }
                            else if(splitted[2] == 'right'){
                                board.addDominoTop(copy,0);
                                givePieces(b,new Array(piece),false,1,1,false,'5%',false,false, true);
                                d = board.getDominos()[0];
                            }d.rotatePiece(splitted[2]);
                        }
                    break;
                    case 'r2': //r2-{left,right,both}
                        if(splitted[2] == 'both'){
                            if(Math.round(Math.random()) == 1){
                                board.addDominoBot(copy,length);
                                givePieces(b,new Array(piece),false,1,1,false,'5%',false,false, false);
                                let d = board.getDominos()[length];
                                d.rotatePiece('right');
                            }
                            else{
                                board.addDominoTop(copy,0);
                                givePieces(b,new Array(piece),false,1,1,false,'5%',false,false, true);
                                let d = board.getDominos()[0];
                                d.rotatePiece('left');
                            }
                        }
                        else{
                            if(splitted[2] == 'right'){
                                board.addDominoBot(copy,length);
                                givePieces(b,new Array(piece),false,1,1,false,'5%',false,false, false);
                                d = board.getDominos()[length];
                            }
                            else if(splitted[2] == 'left'){
                                board.addDominoTop(copy,0);
                                givePieces(b,new Array(piece),false,1,1,false,'5%',false,false, true);
                                d = board.getDominos()[0];
                            }d.rotatePiece(splitted[2]);
                        }
                    break;
                }
            break;
            case 4://{r1,r2}-{left,right}-{top,bot}
                switch(splitted[1]){
                    case 'r1': 
                        if(splitted[3] == 'top'){
                            board.addDominoTop(copy,0);
                            givePieces(b,new Array(piece),false,1,1,false,'5%',false,false, true);
                            d = board.getDominos()[0];
                        }
                        else{
                            board.addDominoBot(copy,length);
                            givePieces(b,new Array(piece),false,1,1,false,'5%',false,false, false);
                            d = board.getDominos()[length];
                        }
                        d.rotatePiece(splitted[2]);
                    break;
                    case 'r2': 
                        if(splitted[3] == 'top'){
                            board.addDominoTop(copy,0);
                            givePieces(b,new Array(piece),false,1,1,false,'5%',false,false, true);
                            d = board.getDominos()[0];
                        }
                        else{
                            board.addDominoBot(copy,length);
                            givePieces(b,new Array(piece),false,1,1,false,'5%',false,false, false);
                            d = board.getDominos()[length];
                        }
                        d.rotatePiece(splitted[2]);
                    break;
                }
            break;
            case 1: //2sides
                if(is_top){
                    board.addDominoTop(copy,0);
                            givePieces(b,new Array(piece),false,1,1,false,'5%',false,false, true);
                }
                else{
                    board.addDominoBot(copy,length);
                            givePieces(b,new Array(piece),false,1,1,false,'5%',false,false, false);
                }
            break;
        }
    }
    
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
            if(max == -1) id = k;
            let points = v.getPoints();
            if(max < points){
                max = points;
                id = k;
            }
            else if(max == points)
                id = getRandomElements(new Array(id,k),1)[0];
        }
        return new Array(max,id);
    }
}