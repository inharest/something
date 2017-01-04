var fs = require('fs');

const app = function(req, res) {
    control(req, res);
};

function control(req, res) {
    // console.log(req.url);
    let reg = /^\/(?:[\w\d-_]*(?!(?:[\.\w\d-_]+)))?/i;
    let match = reg.exec(req.url);
    // console.log(match);
    switch (match && match[0]) {
        case '/':
        case '/public':
            servePublic(req, res);
            break;
        case '/admin':
            serveAdmin(req, res);
            break;
        case '/users':
            console.log('Users router!');
            break;
        default:
            console.log('default router!');
            send404(res);
    }
}

function servePublic(req, res) {
    //console.log('public router!');
    let filepath = req.url.slice(1) || 'public/index.html';

    fs.stat(filepath, (err, stats) => {
        if (!err) {
            sendFile(res, filepath);
        } else {
            send404(res);
        }
    });
}

function sendFile(res, filepath) {
    fs.readFile(filepath, (err, data) => {
        if (!err) {
            res.statusCode = 200;
            // res.setHeader('Content-Type', 'text/html');
            res.end(data);
        } else {
            send500(res);
        }
    });
}

function send404(res) {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Error 404: Not Found');
}

function send500(res) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Error 500: Internal Server Error\n');
}

function serveAdmin(req, res) {
    //console.log('Admin router!');
    let body = '';
    // Get the data as utf8 strings.
    // If an encoding is not set, Buffer objects will be received.
    req.setEncoding('utf8');

    // Readable streams emit 'data' events once a listener is added
    req.on('data', (chunk) => {
        body += chunk;
    });

    // the end event indicates that the entire body has been received
    req.on('end', () => {
        // console.log(body);
        res.end(body);
        // try {
        //     const data = JSON.parse(body);
        //     // write back something interesting to the user:
        //     res.write(typeof data);
        //     res.end();
        // } catch (er) {
        //     // uh oh!  bad json!
        //     res.statusCode = 400;
        //     return res.end(`error: ${er.message}`);
        // }
    });
}

module.exports = app;
