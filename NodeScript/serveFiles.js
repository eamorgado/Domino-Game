const fs = require('fs');
const path = require('path');

function serveFiles(request, response) {
    var file_path = '.' + request.url;
    if (file_path == './') file_path = './index.html';

    var extension_name = path.extname(file_path);
    var content_type = 'text/html';
    switch (extension_name) {
        case '.js':
            content_type = 'text/javascript';
            break;
        case '.css':
            content_type = 'text/css';
            break;
        case '.json':
            content_type = 'application/json';
            break;
        case '.png':
            content_type = 'image/png';
            break;
        case '.jpg':
            content_type = 'image/jpg';
            break;
        case '.wav':
            content_type = 'audio/wav';
            break;
    }
    fs.readFile(file_path, function(error, content) {
        if (error) {
            if (error.code == 'ENOENT') {
                fs.readFile('./404.html', function(error, content) {
                    response.writeHead(200, { 'Content-Type': content_type });
                    response.end(content, 'utf-8');
                });
            } else {
                response.writeHead(500);
                response.end('Sorry, check with the site admin for error: ' + error.code + ' ..\n');
                response.end();
            }
        } else {
            response.writeHead(200, { 'Content-Type': content_type });
            response.end(content, 'utf-8');
        }
    });
}

module.exports.serveFiles = serveFiles;