const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const message = require('./message');

function notify(request, response, core) {
    var body = '',
        query;
    request.on('data', (chunk) => { body += chunk; })
        .on('end', () => {
            try {
                query = JSON.parse(body);
                var side, piece, skip;
                side = query.side != undefined ? query.side : undefined;
                piece = query.piece != undefined ? query.piece : undefined;
                skip = query.skip != undefined ? query.skip : undefined;
                var resp = core.notify(query.nick, query.game, side, piece, skip);
                message.message(response, 200, resp);
            } catch (error) {}
        })
        .on('error', (err) => { console.log(err.message); });
}

module.exports.notify = notify;