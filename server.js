'use strict';

const express = require('express');
const path = require('path');
const multichain = require("multichain-node")({
    port: 6758,
    host: '178.128.27.70',
    user: "multichainrpc",
    pass: "HpE3acAYinEcBoV1sBkMS9FnqeTY86rm5pQz6Mky7MRZ"
});

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

app.get('/test', (req,res) => {
  multichain.getInfo((err, info) => {
    if(err){
      res.render('test', {
        multichain: "Unable to retrieve chain data"
      });
    }
    else {
      res.render('test', {
        multichain: info
      });
    }
  });
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
