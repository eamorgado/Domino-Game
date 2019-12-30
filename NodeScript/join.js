const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const message = require('./message');

function makeJoin(request, response, core) {
    var id, query,
        body = '';

    request.on('data', (chunk) => { body += chunk; })
        .on('end', () => {
            try {
                query = JSON.parse(body);
                var code, resp;
                if (query.is_ai == true) {
                    [code, resp] = [200, core.join("HUMAN", "HUMAN", undefined, true)];
                } else if (query.nick == undefined && query.pass == undefined) { //user is not reg
                    [code, resp] = [401, { error: "Register first, no values given" }];
                } else {
                    var group = query.group != undefined ? query.group : undefined;
                    resp = core.join(query.nick, query.pass, group, query.is_ai);
                    code = 200
                }
                message.message(response, code, resp);
            } catch (error) {}
        })
        .on('error', (err) => { console.log(err.message); });
}

module.exports.makeJoin = makeJoin;