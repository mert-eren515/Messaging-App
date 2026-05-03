const express = require('express');
const path = require('path');
const fs = require('fs');
const { postUsers, getMessages, postMessage } = require('./api');

const PORT = process.env.PORT || 3000;  

const app = express();

// built-in middleware to parse JSON bodies
app.use(express.json());

// built-in middleware to parse URL-encoded bodies (for form submissions)
app.use(express.urlencoded({ extended: true }));

// Static dosyaları sunmak için middleware
app.use(express.static(path.join(__dirname, '..', 'frontend')));

app.post('/login', postUsers);
app.get('/messages', getMessages);
app.post('/messages', postMessage);

app.listen(PORT , () => {
    console.log(`Server running on ${PORT}`);
});
