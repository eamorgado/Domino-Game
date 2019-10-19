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
    players[2].getHand().set('array',pieces_to_give);
    stack.textContent = 'Stack Pieces: '+ players[2].getHand().get('array').length;
    
    var max1 = players[0].findMaxPiece();
    var max2 = players[1].findMaxPiece();
    var id = ((max1[0] > max2[0])? max1[1] : ((max1[0] == max2[0])? 
                getRandomElements(new Array(max1[1],max2[1]),1)[0]: max2[1]));

                console.log(document.getElementById(id).parentElement.id);
    gameLoop(document.getElementById(id).parentElement.id,id)        
}

function gameLoop(player, piece){
    //piece is the img id
    var game_over = false;
    var game_board = new Board('Game-Board');
    //player first move
    if(player == 'Player-AI'){
        players[0].playPiece(piece,game_board,0);
        player = 'Player-Current';
    }else if(player == 'Player-Current'){
        players[1].playPiece(piece,game_board,0);
        player = 'Player-AI';
    }

    while(!game_over){
        if(player != 'Player-Current'){
            console.log("And And here");
            //AI or other player
            if(player == 'Player-AI'){
                console.log("AI to play");
                players[0].findBestPlay(game_board);
                console.log("AI played");
                
            }
            player = 'Player-Current';
        }
        else{
            console.log(" You must Make play");
            
        }
        game_over = true;
    }
}
