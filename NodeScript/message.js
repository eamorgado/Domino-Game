module.exports.message = function(response, code, json, second = false) {
    response.writeHead(code, { 'Content-Type': "application/json", 'Access-Control-Allow-Origin': '*' });

    response.write(JSON.stringify(json));
    response.end("\n\n");
}

module.exports.messageSSE = function(response, code, json) {
    //'Connection': 'keep-alive'
    let header = {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*'
    };
    response.writeHead(code, header);
    response.write('data: ' + JSON.stringify(json))
    response.end('\n\n');
}