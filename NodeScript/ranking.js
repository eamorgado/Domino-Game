const fs = require('fs');
const path = require('path');
const message = require('./message');

module.exports.getRanking = function(req, res) {
    var file = './ranking.json';
    let body = '';
    let rank;
    req
        .on('data', (chunk) => { body += chunk; })
        .on('end', () => {
            try {
                var d = { dado: { victories: 10, games: 120 }, edu: { victories: 10, games: 20 } }
                    //fs.writeFileSync(file, JSON.parse(d));
                fs.stat(file, function(err_stat) {
                    if (err_stat) //file does not exist
                        fs.writeFile(file, JSON.stringify({}), 'utf8', (err) => { if (err) throw err; });
                    fs.readFile(file, 'utf-8', function readCall(err, data) {
                        if (err) {
                            console.log(err);
                        } else {
                            try {
                                rank = JSON.parse(data); //convert into js object
                                var r = new Array();
                                for (var user in rank)
                                    r.push({
                                        "nick": user,
                                        "victories": rank[user]["victories"],
                                        "games": rank[user]["games"],
                                    });
                                r.sort((a, b) => (a.victories > b.victories) ? -1 :
                                    (a.victories == b.victories) ? (
                                        (a.games < b.games) ? -1 :
                                        (a.games == b.games) ? 0 : 1
                                    ) : 1);
                                message.message(res, 200, { ranking: r }, true);
                            } catch (error) {}
                        }
                    });
                });
            } catch (err) {}
        })
        .on('error', (err) => { console.log(err.message); })
}

module.exports.updateRanking = function(p1, p2, winner) {
    var file = './ranking.json';
    var loser = winner == p1 ? p2 : p1;
    try {
        fs.stat(file, function(err_stat) {
            if (err_stat) //file does not exist
                fs.writeFile(file, JSON.stringify({}), 'utf8', (err) => { if (err) throw err; });
            fs.readFile(file, 'utf-8', function readCall(err, data) {
                if (err) {
                    console.log(err);
                } else {
                    try {
                        //console.log('P1: ' + p1 + '| P2: ' + p2 + '| Winner: ' + winner);
                        rank = JSON.parse(data); //convert into js object
                        if (winner == true) { //draw
                            if (p1 in rank) rank[p1].games++;
                            else rank[p1] = { "games": 1, "victories": 0 };

                            if (p2 in rank) rank[p2].games++;
                            else rank[p2] = { "games": 1, "victories": 0 };

                        } else {
                            if (winner in rank) {
                                rank[winner].games++;
                                rank[winner].victories++;
                            } else rank[winner] = { "games": 1, "victories": 1 };

                            if (loser in rank) rank[loser].games++;
                            else rank[loser] = { "games": 1, "victories": 0 };
                        }
                        //console.log('Rank update');
                        //console.log(JSON.stringify(rank));
                        fs.writeFile(file, JSON.stringify(rank), 'utf-8', (err) => { if (err) throw err; });
                    } catch (error) {}
                }
            });
        });
    } catch (error) {}
}