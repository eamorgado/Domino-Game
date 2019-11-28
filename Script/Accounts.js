const BASE_URL = "http://twserver.alunos.dcc.fc.up.pt:8008/";
var GAME_ID
var flag;
var username, password;
var player, adv;

function dataPost(url, data = {}) {
    return fetch(url, {
        method: 'POST',
        cache: 'no-cache',
        body: JSON.stringify(data),
    }).then(response => response.json()).catch(console.log);
}

function messageUser(id, inner_text) {
    var receiver = document.getElementById(id);
    var str =
        "<div id=\"message-user\" class=\"modal\">" +
        "<form class=\"login-modal-content animate\" action=\"#\">" +
        "<div class=\"login-container\"><h2>" + inner_text + "</h2></div>" +
        "<div class=\"login-container\" styler=\"background-color:#f1f1f1\">" +
        "<button id='ok-message' type=\"button\" class=\"submit\">OK</button>" +
        "</div>" +
        "</form>" +
        "</div>";
    generateHtml(receiver, str);
    document.getElementById('message-user').style.zIndex = '5';
    document.getElementById('message-user').style.display = 'block';
    document.getElementById('ok-message').onclick = function() {
        var child = document.getElementById('message-user');
        var parent = child.parentElement;
        parent.removeChild(child);
    }
}

function executeLogin() {
    username = document.getElementById('login_username').value;
    password = document.getElementById('login_password').value;
    flag = false;
    register(username, password);
}

function register(username, password) {
    const url = BASE_URL + 'register';
    console.log(url);
    const data = { 'nick': username, 'pass': password };
    dataPost(url, data).then(data => {
        console.log(JSON.stringify(data));
        if (data.error != undefined)
            messageUser('starter', data.error);
        else {
            document.getElementById("auth").textContent = username;
            hideLogin();
            document.getElementById("auth").onclick = null;
            messageUser('starter', 'Authentication successful');
        }
    }).catch(console.log);
}


function update(user, gameid) {
    const url = BASE_URL + "update?nick=" + user + "&game=" + gameid;
    console.log(url);
    var evtSource = new EventSource(url);
    evtSource.onmessage = function(e) {
        console.log("update function answer: " + JSON.stringify(e.data));
        var data = JSON.parse(e.data);
        console.log(data);
        //Update stack-------
        var stack = document.getElementById('Player-Stack');
        stack.textContent = 'Stack Pieces: ' + data.board['stock'];
        //Update adv------
        var users = data.board.count;

        var name = '';
        for (var user in users)
            if (user != username) { name = user; break; }

        adv.player = name;
        var ad = document.getElementById('Player-Adv');
        if (ad)
            ad.setAttribute('id', 'PLayer-' + name);

        while (ad.firstElementChild)
            ad.removeChild(ad.firstElementChild);

        var tmp = new Array();
        for (let i = 0; i < data.board.count[name]; i++)
            tmp.push(pieces[i]);
        appendBlanck(ad, tmp, 5, 5, '5%');


        if (data["turn"] != undefined) {
            messageUser('starter', 'It is ' + data['turn'] + ' turn');
        }
        if (data["winner"] != undefined) {
            messageUser('starter', 'Player ' + data['winner'] + ' has won');
            GAME_ID = null;
            var date = new Date().toDateString();
            winner = data['winner'];
            var s = (winner == username) ? "<b style=\"color: green;\">" + winner + "</b> won match" : "<b style=\"color: red;\">" + winner + "</b> won match";
            var leader_page = document.getElementById('leader-page').getElementsByClassName('overlay-content')[0];
            var str = "<p><br><span class=\"leaders\"><b>" + username + "  VS  " + winner + "  " + date + "  Result: " + s + "</b></span></p>";
            generateHtml(leader_page, str);
            evtSource.close();
        }
    };
}