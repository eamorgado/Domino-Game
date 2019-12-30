const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const message = require('./message');

module.exports.userRegister = function(request, response) {
    var file = './register.json';
    var body = '';
    var users;
    request.on('data', (chunk) => { body += chunk; })
        .on('end', () => {
            try {
                var query = JSON.parse(body);
                if (query.nick == '' || query.pass == '') {
                    message.message(response, 400, { error: "Bad request, Invalid Syntax" });
                } else {
                    fs.stat(file, function(err_stat) {
                        if (err_stat) //file does not exist
                            fs.writeFile(file, JSON.stringify({}), 'utf8', (err) => { if (err) throw err; });
                        fs.readFile(file, 'utf-8', function readCall(err, data) {
                            if (err) {
                                console.log(err);
                            } else {
                                users = JSON.parse(data);
                                let map = new Map(Object.entries(users));
                                const pass = crypto.createHash('md5').update(query.pass).digest('hex');
                                var resp = {},
                                    code = 200;
                                if (map.has(query.nick)) { //check to do login
                                    if (map.get(query.nick) != pass)
                                        [code, resp] = [401, { error: "User registered with a different password" }]
                                    message.message(response, code, resp);
                                } else { //register
                                    users[query.nick] = pass;
                                    fs.writeFile(file, JSON.stringify(users), 'utf-8', (err) => {
                                        if (err) throw err;
                                        message.message(response, code, resp);
                                    });
                                }
                            }
                        });
                    });
                }
            } catch (error) {}
        })
        .on('error', (err) => { console.log(err.message); })
}