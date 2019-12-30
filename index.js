const port = 8151;
const url = require('url');
const http = require('http');
const fs = require('fs');
const path = require('path');
const serveFiles = require('./NodeScript/serveFiles');
const ranking = require('./NodeScript/ranking');
const register = require('./NodeScript/register');
const join = require('./NodeScript/join');
const leave = require('./NodeScript/leave');
const update = require('./NodeScript/update');
const notify = require('./NodeScript/notify');
const server_core = require('./NodeScript/ServerCore')

var CORE = new server_core.ServerCore();

const server = http.createServer(function(request, response) {
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    const parse_url = url.parse(request.url, true);
    const pathname = parse_url.pathname;
    //console.log(pathname);

    switch (pathname) {
        case '/update':
            update.update(request, response, parse_url.query, CORE);
            break;
        case '/ranking':
            ranking.getRanking(request, response);
            break;
        case '/register':
            register.userRegister(request, response);
            break;
        case '/join':
            join.makeJoin(request, response, CORE);
            break;
        case '/leave':
            leave.leave(request, response, CORE);
            break;
        case '/notify':
            notify.notify(request, response, CORE);
            break;
        default:
            serveFiles.serveFiles(request, response);
            break;
    }
});

server.listen(port);