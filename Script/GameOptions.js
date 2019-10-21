/*------------------------------------------------------------------------------
This file  is responsible for generating the pieces and controlling the game
    options as well as the 
------------------------------------------------------------------------------*/
//Array of pieces id
var pieces = new Array("DM-0-0","DM-0-1","DM-0-2","DM-0-3", "DM-0-4","DM-0-5", "DM-0-6",
        "DM-1-1","DM-1-2","DM-1-3","DM-1-4","DM-1-5","DM-1-6",
        "DM-2-2","DM-2-3","DM-2-4","DM-2-5","DM-2-6",
        "DM-3-3","DM-3-4","DM-3-5","DM-3-6",
        "DM-4-4","DM-4-5","DM-4-6",
        "DM-5-5","DM-5-6",
        "DM-6-6");


function createPiece(id, add_onclick,left,right,is_flipped,width,hover){
    var path = 'Assets/DominoPieces/';
    var img = document.createElement('img');
    img.src = path + ((is_flipped)?'DM-Flip':id) + '.png';
    img.style.width = '100%';    
       
    var span_piece = document.createElement('span');
        span_piece.setAttribute('class',('DM-'+((is_flipped)? 'flipped':'displayed')));        
        span_piece.setAttribute('id',id);
        span_piece.style.display = 'inline-block';
        span_piece.appendChild(img);
        span_piece.style.marginLeft = left + 'px';
        span_piece.style.marginRight = right + 'px';
        span_piece.style.width = width;
        span_piece.style.transform = 'rotate(0deg)';
        if(add_onclick){
            img.src = path + 'DM-Flip.png';
            var onclick = span_piece.getAttribute('onclick');
            span_piece.onclick = function(){
                if(span_piece.className == 'DM-flipped'){
                    span_piece.firstChild.src = path + id + '.png';
                    span_piece.className = 'DM-displayed';
                }
                else{
                    span_piece.firstChild.src = path + 'DM-Flip.png';
                    span_piece.className = 'DM-flipped';
                }
            };
        }
    if(hover){
        span_piece.onmouseover = function(){
            span_piece.firstChild.style.filter = 'invert(100%)';
            span_piece.firstChild.style.border = '3px outset whitesmoke';
            span_piece.firstChild.style.borderRadius = '15%';       
        };
        span_piece.onmouseout = function(){
            span_piece.firstChild.style.filter = 'invert(0%)';
            span_piece.firstChild.style.border = '0px hidden';
            span_piece.firstChild.style.borderRadius = '0%';       
        };
    }
    else{span_piece.className = 'DM-normal';}
    return span_piece;
}
function givePieces(rec, pieces_array, add_onclick, margin_lef, margin_right,is_flipped, width,hover,before){
    var receiver = rec, choice = false;
    if(Array.isArray(rec)) [receiver,choice] = [rec[0],true]
    for(let p of pieces_array){
        let piece = choice? p+rec[1] : p;
        if(before){
            var first = receiver.firstElementChild
            //console.log("givePieces: adding before");            
            receiver.insertBefore(createPiece(piece, add_onclick, margin_lef, margin_right, is_flipped, width,hover),first);
        }
        else receiver.appendChild(createPiece(piece, add_onclick, margin_lef, margin_right, is_flipped, width,hover));
    }
}


function generateHtml(receiver, content){
    //function to generate html code
    var html = new DOMParser().parseFromString(content, "text/html");
    receiver.appendChild(html.body.childNodes[0]);
}
function displayInfo(receiver, inner_text, option){
    document.getElementById("ai-page").firstChild.nextSibling.style.visibility = "hidden";
    var str = 
        "<div id=\"info-popup\" class=\"modal-info\">"
            + "<span onclick=\"closeInfo(\'option\')\" class=\"close-login\" title=\"Close info\" style=\"font-size: 60px;\">&times;</span>"
            + "<div id=\"info-cnt\" class=\"mi-content animate\">"
                + inner_text
            + "</div>"
        + "</div>";
    generateHtml(receiver, str);
}

var intro = true;
function closeInfo(option){
    if(option){
        var game_page = document.getElementById('ai-page').getElementsByClassName('overlay-content')[0];
        game_page.removeChild(document.getElementById('loader'));
        intro = false;
        generateGameBoard('AI','Current');
        startGame(pieces,'AI','Current');
    }
    document.getElementById("ai-page").firstChild.nextSibling.style.visibility = "visible";
    var child = document.getElementById("info-popup");
    var parent = child.parentNode;
    parent.removeChild(child);
    document.getElementById('ai-page').style.overflowY = 'auto';
}


function generateGameBoard(player1,player2){
    var game_page = document.getElementById('ai-page').getElementsByClassName('overlay-content')[0];

    var board = document.createElement('div');
        board.setAttribute('id','Board');
    var player1_side = document.createElement('div');
        player1_side.setAttribute('id','Player-'+player1);
        player1_side.setAttribute('class','player-class');

    var board_side = document.createElement('div');
        board_side.setAttribute('id','Game-Board');

    var stack_side = document.createElement('div');
        stack_side.setAttribute('id','Player-Stack');

    var player2_side = document.createElement('div');
        player2_side.setAttribute('id','Player-'+player2);
        player2_side.setAttribute('class','player-class');
    
    arr = new Array(stack_side,player1_side,board_side,player2_side);
    arr.forEach(function(p){board.appendChild(p);});
    //board_side.textContent = 'board';
    game_page.appendChild(board);
}


async function newGame(){
    //retrieve new-game node and hide it
        var ng = document.getElementById('new-game');
        ng.style.display = 'none';
    //retrieve quit-game node and display it
        var qg = document.getElementById("quit-game");
        qg.style.display = "inline-block";
    
    //get the overlay-content tree node
        var game_page = document.getElementById('ai-page').getElementsByClassName('overlay-content')[0];
    
    //create and append the loader circle
        var loader = document.createElement('div');
        loader.setAttribute('class', 'loader');
        loader.setAttribute('id', 'loader');
        game_page.appendChild(loader);

            //givePieces(game_page, pieces, true, 5,5);
            //await sleep(2000);
    //overlap a information window
        /*displayInfo(document.getElementById('ai-page'), 
            "<p>"
                + "This are all the game pieces, 28 in total"
            + "</p>"
            + "<p>"
                + "As you can see they have two sides, a back side (the full black version) and a displayed side (with the dots or the single bar)"
            + "</p>"
            + "<p>"
                + "Before the game starts they will be shuffled and each player will have 7 random initial pieces. The rest of them will remain in the stack"
            + "</p>"
            + "<p>"
                + "You will be able to see your pieces but not your opponents or the stack's pieces. If you have the double sixes piece it is your turn to start"
            + "</p>",true);

    //add domino pieces to the info window
        givePieces(document.getElementById("info-cnt"), pieces, true, 5,5,false,'',true);
        document.getElementById('ai-page').style.overflowY = 'hidden';*/
        document.getElementById("game-in-progress").style.display = "block";
        document.getElementById("inst-on-game").style.display = 'block';
        generateGameBoard('AI','Current');
        startGame(pieces,'AI','Current');
}


function quitGame(){
    document.getElementById("quit-game").style.display = "none";
    document.getElementById('new-game').style.display = 'inline-block';
    var content = document.getElementById('Board');
    
    var parent = content.parentElement;
    parent.removeChild(content);
    document.getElementById("game-in-progress").style.display = "none";
    document.getElementById("inst-on-game").style.display = 'none';
    parent = document.getElementById('ai-page').getElementsByClassName('overlay-content')[0];
    content = document.getElementById("loader");
    parent.removeChild(content);
        

}



function sleep(ms){
    return new Promise(resolve => setTimeout(resolve,ms));
}