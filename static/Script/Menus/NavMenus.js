/*------------------------------------------------------------------------------
This javaScript file will control the opening and closing of "menus",
    the overlays in the nav bar
------------------------------------------------------------------------------*/


function openMenu(element, zindex) {
    /**
     * General function to open any "menu" in the page.
     * Given the element id it will set its styling to display the menu
     */
    document.getElementById(element).style.width = "100%";
    document.getElementById(element).style.overflowY = "scroll";
    document.getElementById("copy").style.visibility = "hidden";
    if (zindex != 'undefined') document.getElementById(element).style.zIndex = zindex;
    document.body.style.overflowY = 'hidden';
    console.log(element + " is now visible");
    if (element == 'leader-page') openLeaders();
}

function addEraseCache() {
    var bt = document.createElement('button');
    bt.setAttribute('id', 'delete-entries');
    bt.setAttribute('class', 'bt-red');
    bt.style.filter = 'invert(100%)';
    bt.textContent = 'Delete Entries';
    document.getElementById('PVA').insertBefore(bt, document.getElementById('PVA-Table'));
    bt.onclick = function() {
        if (typeof(Storage) !== "undefined") {
            if (localStorage.computerGameResults != undefined) {
                var map = new Map();
                localStorage.computerGameResults = JSON.stringify(Array.from(map.entries()));
                var parent = document.getElementById("PVA-Table");
                var header = document.getElementById("PVA-H");
                while (header.nextSibling) parent.removeChild(header.nextSibling);
            }
        }
    }
}


function openLeaders() {
    //append AI games
    addEraseCache();
    var tr, cont, t;
    tr = document.createElement('tr');
    tr.setAttribute('id', 'PVA-H');
    tr.setAttribute('class', 'tb-r-head');
    cont = new Array('Date', 'Player', 'Winner');
    for (let el of cont) {
        t = document.createElement('th');
        t.innerHTML = el;
        tr.appendChild(t);
    }
    document.getElementById('PVA-Table').appendChild(tr);
    if (typeof(Storage) !== "undefined") {
        if (localStorage.computerGameResults != undefined) {
            var map = new Map(JSON.parse(localStorage.computerGameResults));
            for (let [k, v] of map) {
                var draw, winner, date;
                [draw, winner, date, pl] = [v[0], v[1], v[2], v[3]];
                var c, p;
                [c, p] = draw ? ["", "Draw"] : [winner != 'AI' ? 'green' : 'red', winner]
                var p = "<b class=\"" + c + "\">" + p + "</b>";
                tr = document.createElement('tr');
                cont = new Array(date, pl, p);
                for (let el of cont) {
                    t = document.createElement('td');
                    t.innerHTML = el;
                    tr.appendChild(t);
                }
                document.getElementById('PVA-Table').appendChild(tr);
            }
        }
    }
    //Append player games
    ranking();
}

function closeMenu(element) {
    document.getElementById(element).style.width = "0%";
    document.getElementById(element).style.overflowY = "hidden";
    document.getElementById("copy").style.visibility = "visible";
    document.body.style.overflowY = 'visible';
    console.log(element + " is now hidden");
    if (element == 'instruction-page') {
        if (document.getElementById("ai-page").style.width == "100%") {
            console.log("close body");
            console.log("disp |" + document.getElementById("inst-on-game").style.display + "|");

            if (document.getElementById("inst-on-game").style.display == 'block') {
                document.body.style.overflowY = 'hidden';
                console.log("Closing");

            }
        }
    }
    if (element == 'leader-page') closeLeaders();
}

function closeLeaders() {
    document.getElementById('PVA').removeChild(document.getElementById('delete-entries'));
    var parent = document.getElementById("PVA-Table");
    var header = document.getElementById("PVA-H");
    while (parent.firstElementChild) parent.removeChild(parent.firstElementChild);

    parent = document.getElementById("PVP-Table");
    header = document.getElementById("PVP-H");
    while (parent.firstElementChild) parent.removeChild(parent.firstElementChild);
}

/*------------------------------------------------------------------------------
                    Functions to display the login and register forms
------------------------------------------------------------------------------*/
function showLogin() {
    document.getElementById('login-form').style.display = 'block';
}

function hideLogin() {
    document.getElementById('login-form').style.display = 'none';
}