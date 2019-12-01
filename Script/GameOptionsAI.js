/*------------------------------------------------------------------------------
This file  is responsible for generating the pieces and controlling the game
    options for an AI match
------------------------------------------------------------------------------*/
async function newGame() {
    //retrieve new-game node and hide it
    var ng = document.getElementById('new-game-ai');
    ng.style.display = 'none';
    //retrieve quit-game node and display it
    var qg = document.getElementById("quit-game-ai");
    qg.style.display = "inline-block";

    //get the overlay-content tree node
    var game_page = document.getElementById('ai-page').getElementsByClassName('overlay-content')[0];

    document.getElementById("game-in-progress-ai").style.display = "block";
    document.getElementById("inst-on-game-ai").style.display = 'block';
    player1 = 'Player-AI';
    player2 = 'Player-Current';
    generateGameBoard('ai-page', player1, player2);
    startGame(pieces, player1, player2);
}


function quitGame() {
    if (!isGameOver()) {
        gameResults(players[0].getName(), false);
        updateLeaderBoard(0, 1);
    }
    document.getElementById("quit-game-ai").style.display = "none";
    document.getElementById('new-game-ai').style.display = 'inline-block';
    var content = document.getElementById('Board');

    var parent = content.parentElement;
    parent.removeChild(content);
    document.getElementById("game-in-progress-ai").style.display = "none";
    document.getElementById("inst-on-game-ai").style.display = 'none';
    parent = document.getElementById('ai-page').getElementsByClassName('overlay-content')[0];
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}