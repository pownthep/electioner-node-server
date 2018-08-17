'use strict';

const express = require('express');
const path = require('path');

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

// App
const app = express();
app.use(express.static(path.join(__dirname,'public')))

// Load view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


app.get('/', (req, res) => {
  res.render('index');
});

app.get('/candidates', (req, res) => {
  res.render('candidates');
});

app.get('/about', (req, res) => {
  res.render('about');
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
