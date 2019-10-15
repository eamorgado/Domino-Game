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


function createPiece(id, add_onclick,left,right){
    var path = 'Assets/DominoPieces/';
    var img = document.createElement('img');
    img.src = path + id + '.png';    
       
    var span_piece = document.createElement('span');
        span_piece.setAttribute('class','DM-flipped');        
        span_piece.setAttribute('id',id);
        span_piece.style.display = 'inline-block';
        span_piece.appendChild(img);
        span_piece.style.marginLeft = left + 'px';
        span_piece.style.marginRight = right + 'px';
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
    //adding on mouse hover
    span_piece.onmouseover = function(){
        span_piece.firstChild.setAttribute('style',"filter: invert(100%); border: 3px outset whitesmoke; border-radius: 15%;");       
    };
    span_piece.onmouseout = function(){
        span_piece.firstChild.setAttribute('style',"filter: invert(0%); border: 0px hidden;");       
    };
    return span_piece;
}


function givePieces(receiver, pieces_array, add_onclick, margin_lef, margin_right){
    pieces_array.forEach(function(piece){
        receiver.appendChild(createPiece(piece, add_onclick, margin_lef, margin_right));
    });
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

function closeInfo(option){
    if(option){
        var game_page = document.getElementById('ai-page').getElementsByClassName('overlay-content')[0];
        game_page.removeChild(document.getElementById('loader'));
        generatePlayerSide('AI');
        generateGameBoard();
        generatePlayerSide('Current');
    }
    document.getElementById("ai-page").firstChild.nextSibling.style.visibility = "visible";
    var child = document.getElementById("info-popup");
    var parent = child.parentNode;
    parent.removeChild(child);
    document.getElementById('ai-page').style.overflowY = 'auto';
    //generateBoard();
}


function generatePlayerSide(player){
    var game_page = document.getElementById('ai-page').getElementsByClassName('overlay-content')[0];
    var div = createTable('Player'+player,'');
    var tbody = div.firstElementChild.firstElementChild;
            var tr = document.createElement('tr');
            for(var i = 0; i < 7; i++){
                var td = document.createElement('td');
                var span = document.createElement('span');
                span.style.fontSize = '5vw';
                span.innerHTML = span.textContent = "&#127074;";
                td.appendChild(span);
                tr.appendChild(td);
            }
        tbody.appendChild(tr);
    game_page.appendChild(div);
}

function createTable(id,class_optional){
    var div = document.createElement('div');
        div.setAttribute('id', id);
        div.style.overflowX = 'auto';
    var table = document.createElement('table');
        var tbody = document.createElement('tbody');
    table.setAttribute("class",class_optional);
    table.appendChild(tbody);
    div.appendChild(table);
    return div;
}

function generateGameBoard(){
    var game_page = document.getElementById('ai-page').getElementsByClassName('overlay-content')[0];
    var div = createTable('Game-Board','board');
    var tbody = div.firstElementChild.firstElementChild;
        var tr = document.createElement('tr');
            //Stack
            var td = document.createElement('td');
                td.style.width = '5%';
                td.colSpan = '2';
                var divs = createTable('Stack','stack');
                var tbodys = divs.firstElementChild.firstElementChild;
                for(var i = 0; i < 14; i++){
                    var trs = document.createElement('tr');
                    var span = document.createElement('span');
                    span.style.fontSize = '3vw';
                    span.innerHTML = span.textContent = '&#127074;';
                    trs.appendChild(span);
                    tbodys.appendChild(trs);
                }
                td.appendChild(divs);
            tr.appendChild(td);

            //Playing Field
            var td2 = document.createElement('td');
                td2.style.width = '100%';
                td2.style.height = '100%';
                var divf = createTable('Play-Field','board');
                /*var tbodyf = divf.firstElementChild.firstElementChild;
                for(var i = 0; i < 7; i++){
                    var trf = document.createElement('tr');
                    for(var j = 0; j < 7; j++){
                        var tdf = document.createElement('td');
                        var span = document.createElement('span');
                        span.style.fontSize = '5vw';
                        span.innerHTML = span.textContent = "&#127025;";
                        tdf.appendChild(span);
                        trf.appendChild(tdf);
                    }
                    tbodyf.appendChild(trf);
                }*/
                var table = divf.firstElementChild;
                for(var i = 0; i < 7; i++){
                    var row = table.insertRow(i);
                    for(var j = 0; j < 7; j++){
                        var cell = row.insertCell(j);
                        cell.innerHTML = "&#127025;";
                        cell.style.fontSize = '5vw';
                    }
                }
                td2.appendChild(divf);
            tr.appendChild(td2);

            //Stats
                var td3 = document.createElement('td');
                td3.style.width = '5%';
                td3.colSpan = '1';
                td3.textContent = 'Stats';
            tr.appendChild(td3);
        tbody.appendChild(tr);
    game_page.appendChild(div);
}
function generateBoard(){
    /**
     * For now it only is a simple table 28x28
     *
    var game_page = document.getElementById('ai-page').getElementsByClassName('overlay-content')[0];
    tbl = document.createElement('table');
        tbl.style.width = '100%';
        tbl.style.height = '100%';
        tbl.setAttribute('border', '1');
        tbl.setAttribute('id', 'table-game');
        var tbdy = document.createElement('tbody');
            for (var i = 0; i < 7; i++) { //table with 3 columns
                var tr = document.createElement('tr');
                for (var j = 0; j < 7; j++) {
                    var td = document.createElement('td');
                    td.appendChild(document.createTextNode('\u0020'))
                    tr.appendChild(td)
                }
                tbdy.appendChild(tr);
            }
            tbl.appendChild(tbdy);
    game_page.appendChild(tbl);
    givePieces(tbl.firstChild.childNodes[1].firstChild, new Array("DM-0-6"), false, 0,0);*/
    var str = "<form id=\"board\" style=\"display: inline-block;\" width=\"100%\" height=\"100%\">"
                + "<p aling=\"center\">"
                    + "<table border=\"0\" cellspacing=\"0\" cellpading=\"0\">"
                        + "<tbody>"
                            + "<tr>"
                                + "<td width=\"120\"></td>"
                                + "<td width=\"120\"></td>"
                                + "<td width=\"120\"></td>"
                                + "<td width=\"120\"></td>"
                                + "<td width=\"120\"></td>"
                                + "<td width=\"120\"></td>"
                                + "<td width=\"120\"></td>"
                                + "<td width=\"120\"></td>"
                                + "<td width=\"120\"></td>"
                                + "<td width=\"120\"></td>"
                            + "</tr>"
                            + "<tr>"
                                + "<td align=\"left\">"
                                    + "<table width=\"30\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\">"
                                        + "<tbody>"
                                            + "<tr></tr>"
                                            + "<tr></tr>"
                                            + "<tr></tr>"
                                            + "<tr></tr>"
                                        + "</tbody>"
                                    + "</table>"
                                + "</td>"
                                + "<td align=\"middle\">"
                                    + "<table>"
                                        + "<tbody>"
                                            + "<tr>"
                                                + "<td with=\"120\"></td>"
                                                + "<td with=\"120\"></td>"
                                                + "<td with=\"120\"></td>"
                                                + "<td with=\"120\"></td>"
                                                + "<td with=\"120\"></td>"
                                                + "<td with=\"120\"></td>"
                                                + "<td with=\"120\"></td>"
                                            + "</tr>"
                                        + "</tbody>"
                                    + "</table>"
                                + "</td>"
                                + "<td align=\"left\">"
                                    + "<table width=\"30\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\">"
                                        + "<tbody>"
                                            + "<tr></tr>"
                                            + "<tr></tr>"
                                            + "<tr></tr>"
                                            + "<tr></tr>"
                                        + "</tbody>"
                                    + "</table>"
                                + "</td>"
                            + "</tr>"
                            + "<tr>"
                                + "<td width=\"120\"></td>"
                                + "<td width=\"120\"></td>"
                                + "<td width=\"120\"></td>"
                                + "<td width=\"120\"></td>"
                                + "<td width=\"120\"></td>"
                                + "<td width=\"120\"></td>"
                                + "<td width=\"120\"></td>"
                                + "<td width=\"120\"></td>"
                                + "<td width=\"120\"></td>"
                                + "<td width=\"120\"></td>"
                            + "</tr>"
                        + "</tbody>"
                    + "</table>"
                + "</p>"
            + "</form>";
    var game_page = document.getElementById('ai-page').getElementsByClassName('overlay-content')[0];
    generateHtml(game_page,str);
    
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
        displayInfo(document.getElementById('ai-page'), 
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
        givePieces(document.getElementById("info-cnt"), pieces, true, 5,5);
        document.getElementById('ai-page').style.overflowY = 'hidden';
    await sleep(3000);
    pieces.forEach(async function(piece){
        var p = document.getElementById(piece);
        p.onclick.apply(p);
    });
}


function quitGame(){
    document.getElementById("quit-game").style.display = "none";
    document.getElementById('new-game').style.display = 'inline-block';
    var content = document.getElementById('ai-page').getElementsByClassName[0];
    var parent = document.getElementById('Game-Board').parentNode;
    console.log(parent.children);
    console.log(parent);
    
    
    for(var i = 0; i < 3;i++) parent.removeChild(parent.children[1]);
}



function sleep(ms){
    return new Promise(resolve => setTimeout(resolve,ms));
}