const url = require('url');
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;  

const server = http.createServer((req, res) => {

    // Gelen URL'yi parçala
    const parsedUrl = url.parse(req.url, true);

    if (parsedUrl.pathname === '/messages' && req.method === 'GET') {
        fs.readFile(path.join(__dirname, 'messages.txt'), 'utf-8', (err, data) => {
            if (err) {
                console.error('Error reading messages.txt:', err);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'file error' }));
            } else {
                const messages = data.split('\n').map(line => {
                    const parts = line.split('\t');
                    return {
                        user: parts[0],
                        message: parts[1],
                        time: parts[2]
                    };
                });
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ messages: messages }));
            }
        });
    }

    if (parsedUrl.pathname === '/send' && req.method === 'POST') {

        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            const parsedJSON = JSON.parse(body);

            fs.appendFile(path.join(__dirname, 'messages.txt'), `${parsedJSON.username}\t${parsedJSON.message}\t${parsedJSON.time}\n`, (err) => {
                if (err) {
                    console.error('Error writing to messages.txt:', err);
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'file error' }));
                } else {
                    console.log('Message saved to messages.txt');
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ status: 'ok' , username: parsedJSON.username, message: parsedJSON.message, time: parsedJSON.time}));
                }
            });
        });
    }

    if (parsedUrl.pathname === '/login' && req.method === 'POST') {

        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            fs.readFile(path.join(__dirname, 'users.txt'), 'utf-8', (err, data) => {

                if (err) {
                    console.error('Error writing to messages.txt:', err);
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'file error' }));
                }

                const {username, password} = JSON.parse(body);

                const users = data.split('\n');

                const found = users.find(line => {
                    const [u, p] = line.split(':');
                    return u === username && p === password;
                });

                if (found) {
                    console.log('Successfully read users.txt');
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ status: 'ok'}));
                } else {
                    console.log('There is no such user in users.txt');
                    res.writeHead(401, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ status: 'fail', error: 'invalid credentials' }));
                }
            });
        });
    }

    // Buraya sonra tekrar bak
    else {
        let filePath = '.' + parsedUrl.pathname;
        if (filePath === './') filePath = './login.html';

        const extname = path.extname(filePath);
        const contentType = {
            '.html': 'text/html',
            '.js': 'text/javascript',
            '.css': 'text/css'
        }[extname] || 'text/plain';

        fs.readFile(path.join(__dirname, filePath), (err, content) => {
            if (err) {
                res.writeHead(404);
                res.end('Dosya bulunamadı');
            } else {
                res.writeHead(200, { 'Content-Type': contentType });
                res.end(content);
            }
        });
    }
});

server.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});
