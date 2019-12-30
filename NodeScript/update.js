const fs = require('fs');
const path = require('path');
const message = require('./message');

function update(request, response, query, core) {
    var body = '',
        user;
    request.on('data', (chunk) => { body += chunk; })
        .on('end', () => {
            try {
                user = core.getCore().get(query.game).isAi() ? 'HUMAN' : query.nick;
                var resp = core.update(user, query.game);
                message.messageSSE(response, 200, resp);
            } catch (error) {}
        })
        .on('error', (err) => { console.log(err.message); });
}

module.exports.update = update;