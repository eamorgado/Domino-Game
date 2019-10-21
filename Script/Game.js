function getRandomElements(source, n){
    //function to get n random elements from array
    var resulting_array = new Array(n);
        let len = source.length;
        let taken = new Array(len);
    if(n > len) 
        throw new RangeError("getRandomElements: more elements taken than available");
    while(n--){
        var x = Math.floor(Math.random() * len);
        resulting_array[n] = source[x in taken ? taken[x] : x];
        taken[x] = --len in taken ? taken[len] : len;
    }
    return resulting_array;
}

function filterArray(source, to_remove){
    //function to remove all elements in to_remove that occur in source
    var tmp_source = source.filter(function(el) {
        return !to_remove.includes(el);
    });
    return tmp_source;
}

var players;
async function startGame(pieces,player1, player2){
    //start players + stack
        players = new Array(3);
            [players[0],players[1],players[2],players[3]] = [new Player(player1),new Player(player2),new Player('Stack'),new Board('Game-Board')];
            
    var pieces_to_give = Array.from(pieces);

    //get random elements for player 1
        var pieces_p0 = getRandomElements(pieces_to_give,7);
        pieces_to_give = Array.from(filterArray(pieces_to_give,pieces_p0));
        
    //get random elements for player 2
        var pieces_p1 = getRandomElements(pieces_to_give,7);
        pieces_to_give = Array.from(filterArray(pieces_to_give,pieces_p1));
    
    var to_give = new Array(pieces_p0,pieces_p1,pieces_to_give);
    for(let i = 0; i < 3; i++)
        for(let piece of to_give[i])
            players[i].addPiece(new Array(piece),false,5,5,
                ((i == 0 || i == 2)? true:false),'5%',
                ((i == 0 || i == 2)? false:true),
                ((i == 2)? true:false));

    var stack = document.getElementById('Player-Stack');
    //players[2].getHand().set('array',pieces_to_give);
    stack.textContent = 'Stack Pieces: '+ players[2].getHand().size;
    
    var max1 = players[0].findMaxPiece();
    var max2 = players[1].findMaxPiece();
    var id = ((max1[0] > max2[0])? max1[1] : ((max1[0] == max2[0])? 
                getRandomElements(new Array(max1[1],max2[1]),1)[0]: max2[1]));

                console.log(document.getElementById(id).parentElement.id);
    gameLoop(document.getElementById(id).parentElement.id,id)        
}

async function isGameOver(board){
    //check points player 1
    if(players[0].getHand().size == 0) return true;
    if(players[1].getHand().size == 0) return true;
    var dom = board.getDominos();
    if(dom.length == 0) return false;
    var [top,bot] = [dom[0],dom[dom.length-1]];
    var up,down;

    var span = document.getElementById(top.getId());
    span = span.style.transform.split('(')[1].split(')')[0];
    if(span == '0deg' || span == '180deg') up = top.getRec1();
    up = (span == '90deg')? top.getRec2() : top.getRec1();

    span = document.getElementById(bot.getId());
    span = span.style.transform.split('(')[1].split(')')[0];
    if(span == '0deg' || span == '180deg') down = bot.getRec1();
    down = (span == '90deg')? bot.getRec1() : bot.getRec2();

    if(up != down) return false;
    //up and down are the same, check closed;
    var count = 0;
    for(let p of dom)
        if(p.getRec1() == up || p.getRec2() == up) count++;
    closed = count == 7;
    return closed;
}
var closed = false;
async function gameLoop(player, piece){
    //piece is the img id
    //player first move
     await sleep(1000);
    if(player == 'Player-AI'){
        players[0].playPiece(piece,players[3],0);
        turn(true);
        //console.log("AI");        
        player = 'Player-Current';
    }else if(player == 'Player-Current'){
        //turn(true);
        players[1].playPiece(piece,players[3],0);
        console.log("Curr");        
        player = 'Player-AI';
    }

    await sleep(1000);
    if(player != 'Player-Current'){
        //AI or other player
        if(player == 'Player-AI'){
            console.log("AI to play");
            //await sleep(1000);
            players[0].findBestPlay(players[3],players[2]);   
            turn(true);     
        }
        player = 'Player-Current';
    }
    else{
        console.log(" You must Make play");
        //turn(true);
        makePlay(players[3]);  
    }
}

function gameHasEnded(){
    //game is over
    if(!closed){
        //one player has 0
        if(players[0].hand.size == 0) console.log("Player-"+players[0].player+" WON!");
        else if(players[1].hand.size == 0) console.log("Player-"+players[1].player+" WON!");
    }else{
        //game closed find one with lowest points
        var points = new Array(0,0);
        for(let i = 0; i < 2; i++)
            for(let [k,v] of players[0].getHand())
                points[i] += v.getPoints();
        if(points[0] > points[1]) console.log("Player-"+players[0].player+" WON!");
        else if(points[0] < points[1]) console.log("Player-"+players[1].player+" WON!");
        else console.log("DRAW");        
    }
}

async function makePlay(board){
    //player will click on pice, launching pieceToPlay
    for(let [k,v] of players[1].hand){
        var span = document.getElementById(k);
        span.setAttribute('class','DM-normal');  
        span.addEventListener("onclick",pieceToPlay(span,k));
    }
}

function pieceToPlay(span,piece){
    span.onclick = function(span){
        var dom = players[1].hand.get(piece);
        var length = players[3].getDominos().length;
        
        var top = players[3].getDominos()[0], bot = players[3].getDominos()[length-1]
        var verify = new Array(dom.match(top,'left',length),dom.match(bot,'right',length)); //get the 2 arrays for all possibilities
        console.log("OK |"+piece+"|");
        var span = document.getElementById(piece);

        if(verify[0] == 'nomatch' && verify[1] == 'nomatch'){//no match
            noMatch(piece); console.log("No match");
            span.style.filter = "invert(0%)";
            span.style.transform = "scale(1)";
            span.removeEventListener('click',pieceToPlay(span,piece));
        }else{
            console.log("Match found");    
            //will disable hover for player pieces and increase scale for current
            for(let [k,v] of players[1].hand){
                document.getElementById(k).setAttribute('class','DM-normal'); 
                //if(k != piece) document.getElementById(k).removeEventListener("click");
            }
            span.style.filter = "invert(100%)";
            span.style.transform = "scale(1.2)";
            //span.setAttribute('id',piece+"-toPlay");
            var move = verify[0] == 'nomatch'? verify[1] : verify[0];
            var to_top,to_rotate,to_translate,rotate,translate,options_gp;
            [to_top,to_rotate,to_translate,rotate,translate,options_gp] = players[0].logicPlacement(move,piece,true);
            console.log([to_top,to_rotate,to_translate,rotate,translate]);
            
            if(Array.isArray(rotate)){
                dontPlace(piece,1);                
                foo(piece,1,true,true,to_translate,rotate[0],translate[0]);
                foo(piece,2,false,true,to_translate,rotate[1],translate[1]);
            }
            else{
                dontPlace(piece,1);
                foo(piece,1,to_top,to_rotate,to_translate,rotate,translate);
            }
        }
    }
}
function foo(piece,possible,to_top,to_rotate,to_translate,rotate,translate){

    var dom = players[1].hand.get(piece);
    console.log("foo: "+piece);
    
    var piece_to_place = createPiece(piece,false,1,1,false,'5%',false);
    piece_to_place.setAttribute('id',piece+'-Possible-'+possible);
    console.log("foo: span id "+piece_to_place.id);
    
    piece_to_place.setAttribute('class','DM-normal');
    piece_to_place.style.filter = 'invert(100%)';
    piece_to_place.style.display = 'flex';

    var index, length = players[3].getDominos().length;
    var copy = dom.copyDomino();
    copy.img_id = piece+'-Possible-'+possible;
    console.log("DOM copy img id: "+copy.img_id);
    
    var parent;
    parent = document.getElementById("Game-Board");
    if(to_top){
        index = 0; players[3].addDominoTop(copy,index);
        var first = parent.firstElementChild;
        parent.insertBefore(piece_to_place,first);
    }
    else{
        index = length; players[3].addDominoBot(copy,index);
        parent.appendChild(piece_to_place);
    }

    var d = players[3].getDominos()[index];
    console.log(to_rotate +" "+ translate);
    
    if(to_rotate) d.rotatePiece(rotate,translate);
    if(to_translate) d.translatePieceX(translate);
    piece_to_place.addEventListener('click',place(piece,possible));
}
function place(piece,poss){
    var piece_to_place = document.getElementById(piece+"-Possible-"+poss); //span in board
    piece_to_place.onclick = function(poss){
        var pc = document.getElementById("Player-Current");//

        var piece = this.getAttribute('id');
        var origin = piece.split('-'); 
        var poss = Number(origin[4]);
        origin = origin[0]+'-'+origin[1]+'-'+origin[2];
        console.log("piece: "+piece+" poss:"+poss +" origin: "+origin);
        
        pc.removeChild(document.getElementById(origin));
        document.getElementById(piece).style.filter = 'invert(0%)';
        if(poss == 1){
            console.log("entered pos 1");
            
            for(let i = 0; i < players[3].getDominos().length; i++){
                console.log("found the 2º");
                
                if(players[3].getDominos()[i].img_id == (origin+'-Possible-2')){
                    document.getElementById('Game-Board').removeChild(document.getElementById(origin+'-Possible-2'));
                }
            }
        }else{console.log("entered pos 2");
            for(let i = 0; i < players[3].getDominos().length; i++){
                if(players[3].getDominos()[i].img_id == (origin+'-Possible-1')){
                    console.log("found the 1st");                    
                    document.getElementById('Game-Board').removeChild(document.getElementById(origin+'-Possible-1'));
                }
            }
        }
        document.getElementById(piece).setAttribute('id',origin);
        console.log("got hre");
        //document.getElementById(origin).removeEventListener('click',place(piece,poss));
        //player = 'Player-AI';
        hideDontPlace(piece);
        players[0].findBestPlay(players[3],players[2]);
        turn(true);
    }
    //player = 'Player-AI';
}
function turn(my_turn){
    var s = my_turn? "It is your turn to play" : "It is Player-"+players[0].player+"'s turn to play";
    var str = 
        "<div id=\"no-match\" class=\"modal\">"
            + "<form class=\"login-modal-content animate\" action=\"#\">"
                + "<div class=\"login-container\"><h2>Game Turn</h2></div>"
                + "<div class=\"login-container\"><center>"+s+"</center></div>"
                + "<div class=\"login-container\" styler=\"background-color:#f1f1f1\">"
                    + "<button type=\"button\" onclick=\"hideNoMatch()\" class=\"submit\">OK</button>"
                + "</div>"
            + "</form>"
        + "</div>";
    generateHtml(document.getElementById('ai-page'), str);
    document.getElementById('no-match').style.zIndex = '5';
    document.getElementById('no-match').style.display = 'block';
}
function noMatch(piece){
    var str = 
        "<div id=\"no-match\" class=\"modal\">"
            + "<form class=\"login-modal-content animate\" action=\"#\">"
                + "<div class=\"login-container\"><h2>Piece has no match</h2></div>"
                + "<div class=\"login-container\"><center><img src=\"Assets/DominoPieces/"+piece+".png\" width=\"10%\"></center></div>"
                + "<div class=\"login-container\" styler=\"background-color:#f1f1f1\">"
                    + "<button type=\"button\" onclick=\"hideNoMatch()\" class=\"submit\">OK</button>"
                + "</div>"
            + "</form>"
        + "</div>";
    generateHtml(document.getElementById('ai-page'), str);
    document.getElementById('no-match').style.zIndex = '5';
    document.getElementById('no-match').style.display = 'block';
}
function hideNoMatch(){
    var game_p = document.getElementById('ai-page');
    game_p.removeChild(document.getElementById('no-match'));
}
function dontPlace(piece,pos){
    var str = "<span id=\"dont-place\" style=\"display:flex; justify-content: center;align-items: baseline; height:3vh; font-size:3vw\"><button type=\"button\" onclick=\"hideDontPlace(\'"+piece+"-Possible-"+pos+"\')\" class=\"login-cancelbtn\">Don't Place</button></span>"
    generateHtml(document.getElementById('Player-Stack'),str)
}
function hideDontPlace(piece){
        var origin = piece.split('-');
        var pos = Number(origin[4]);
        origin = origin[0]+'-'+origin[1]+'-'+origin[2];
        var index;
            if(pos == 1){
                for(let i = 0; i < players[3].getDominos().length; i++){
                    if(players[3].getDominos()[i].img_id == (origin+'-Possible-2')){
                        document.getElementById('Game-Board').removeChild(document.getElementById(origin+'-Possible-2'));
                        break;
                    }
                }
                for(let i = 0; i < players[3].getDominos().length; i++){
                    if(players[3].getDominos()[i].img_id == (origin+'-Possible-1')){
                        index = i;
                        document.getElementById('Game-Board').removeChild(document.getElementById(origin+'-Possible-1'));
                        break;
                    }
                }
                players[3].getDominos().splice(index,1);
            }else{
                for(let i = 0; i < players[3].getDominos().length; i++){
                    if(players[3].getDominos()[i].img_id == (origin+'-Possible-1')){
                        document.getElementById('Game-Board').removeChild(document.getElementById(origin+'-Possible-1'));
                        break;
                    }
                }
                for(let i = 0; i < players[3].getDominos().length; i++){
                    if(players[3].getDominos()[i].img_id == (origin+'-Possible-2')){
                        index = i;
                        document.getElementById('Game-Board').removeChild(document.getElementById(origin+'-Possible-2')); break;
                    }
                }
                players[3].getDominos().splice(index,0);b.getDominos().splice(index,1);
            }
            var span = document.getElementById(origin);
            span.style.filter = "invert(0%)";
            span.style.transform = "scale(1)";
            document.getElementById('Player-Stack').removeChild(document.getElementById("dont-place"));
}
