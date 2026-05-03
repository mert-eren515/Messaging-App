const url = require('url');
const http = require('http');
const fs = require('fs');
const path = require('path');
const { error } = require('console');

const postUsers = (req, res) => {
    fs.readFile(path.join(__dirname, 'users.json'), 'utf-8', (err, data) => {
        if (err) {
            console.error('Error reading users.txt:', err);
            // Frontende şunu der "Benim gönderdiğim js objesi/response JSON formatında"
            res.writeHead(500, { 'Content-Type': 'application/json' });
            // JS objesini JSON formatında stringe çevirip gönder
            res.end(JSON.stringify({ error: 'There is a problem on server side' }));
        } else {
            usernameToFind = req.body.username;
            passwordToCheck = req.body.password;

            const users = JSON.parse(data);

            const user = users.find(u => u.username === usernameToFind);

            if (user && user.password === passwordToCheck) {
                console.log('Login successful for user:', usernameToFind);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Login successful' }));
            } else {
                console.log('Login failed for user:', usernameToFind);
                res.writeHead(401, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Invalid username or password' }));
            }
        }
    })
};

const getMessages = (req, res) => {
    fs.readFile(path.join(__dirname, 'messages.txt'), 'utf-8', (err, data) => {
        if (err) {
            console.error('Error reading messages.txt:', err);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'There is a problem on server side' }));
        } else {
            const messages = data.split('\n').map(line => {
                const parts = line.split('\t');
                return {
                    user: parts[0],
                    message: parts[1],
                    time: parts[2]
                };
            });
            console.log('Messages successfully read from messages.txt');
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ messages: messages }));
        }
    })
};

const postMessage = (req, res) => {
    fs.appendFile(path.join(__dirname, 'messages.txt'), `${req.body.username}\t${req.body.message}\t${req.body.time}\n`, (err) => {
        if (err) {
            console.error('Error writing to messages.txt:', err);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'There is a problem on server side' }));
        } else {
            console.log('Message successfully saved to messages.txt');
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ username: req.body.username, message: req.body.message, time: req.body.time}));
        }
    });
};


module.exports = {
    postUsers,
    getMessages,
    postMessage
};