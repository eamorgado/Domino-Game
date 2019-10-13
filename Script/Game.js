var players = new Array(2);
var stack;
var board;


function getRandomElements(source, n){
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


function startGame(player1, player2){
    players[0] = new Player(player1);
    players[1] = new Player(player2);


}

