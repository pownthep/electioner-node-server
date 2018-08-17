'use strict';

const express = require('express');
const path = require('path');

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

// App
const app = express();
app.use(express.static(path.join(__dirname,'public')))
app.use(express.static(path.join(__dirname,'html')))


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + 'html/index.html'));
});

app.get('/vote/candidates', (req, res) => {
  res.sendFile(path.join(__dirname + '/html/candidates.html'));
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
