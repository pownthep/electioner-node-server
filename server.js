'use strict';

const express = require('express');
const path = require('path');
//const mongoose = require('mongoose');
const bodyParser = require('body-parser');

//mongoose.connect('mongodb://electioner:electioner@206.189.83.23:27017/test')
const multichain = require("multichain-node")({
    port: 6758,
    host: '178.128.27.70',
    user: "multichainrpc",
    pass: "HpE3acAYinEcBoV1sBkMS9FnqeTY86rm5pQz6Mky7MRZ"
});

// Check connection
/*db.once('open', function(){
  console.log('Connected to MongoDB');
});

// Check for DB errors
db.on('error', function(err){
  console.log(err);
});*/

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

// App
const app = express();
app.use(express.static(path.join(__dirname,'public')))

// Bring in Models
//let user = require('./models/user');

// Load view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Body Parser Middleware
// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended:false}));
// Parse application/json
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/candidates', (req, res) => {
  res.render('candidates');
});

app.get('/about', (req, res) => {
  res.render('about');
});

app.get('/slider', (req, res) => {
  res.render('carousel');
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

// Post route
app.post('/vote', (req, res) => {
  let temp = req.body.body;
  res.render('test_vote'), {
    text: temp
  };
})

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
