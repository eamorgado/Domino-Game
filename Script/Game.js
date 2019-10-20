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
function startGame(pieces,player1, player2){
    //start players + stack
        players = new Array(3);
            [players[0],players[1],players[2]] = [new Player(player1),new Player(player2),new Player('Stack')];
            
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

function isGameOver(board){
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
function gameLoop(player, piece){
    //piece is the img id
    var game_over = false, closed = false;
    var game_board = new Board('Game-Board');
    //player first move
    if(player == 'Player-AI'){
        players[0].playPiece(piece,game_board,0);
        player = 'Player-Current';
    }else if(player == 'Player-Current'){
        players[1].playPiece(piece,game_board,0);
        player = 'Player-AI';
    }

    while(!isGameOver(game_board)){
        if(player != 'Player-Current'){
            //AI or other player
            if(player == 'Player-AI'){
                console.log("AI to play");
                players[0].findBestPlay(game_board,players[2]);
                //console.log("AI played");    
            }
            player = 'Player-Current';
        }
        else{
            console.log(" You must Make play"); 
            break;   
        }
    }
    //game is over
    if(!closed){
        //one player has 0
        if(players[0].length == 0) console.log("Player-"+players[0].player+" WON!");
        else if(players[1].length == 0) console.log("Player-"+players[1].player+" WON!");
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
