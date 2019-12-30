const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const message = require('./message');
const ranking = require('./ranking');

function leave(request, response, core) {
    var file = './register.json',
        body = '',
        query, user;
    request.on('data', (chunk) => { body += chunk; })
        .on('end', () => {
            try {
                query = JSON.parse(body);
                user = core.core.get(query.game).isAi() ? 'HUMAN' : query.nick;
                var resp = core.leave(user, query.game);
                message.message(response, 200, resp);
            } catch (error) {}
        })
        .on('error', (err) => { console.log(err.message); });
}

module.exports.leave = leave;