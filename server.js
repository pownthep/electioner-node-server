'use strict';

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
mongoose.connect
  (
    'mongodb+srv://electioner:2118a6r4@cluster0-ypngq.mongodb.net/test?retryWrites=true', // Replace with your own connection string
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  );

global.config = {
  port: 6474,
  host: '35.190.131.98', // Use the IP of the machine you are running MultiChain on.
  user: "multichainrpc",
  pass: "12345678"
}
const db = mongoose.connection;

// Check connection
db.once('open', function () {
  console.log('Connected to MongoDB');
});

// Check for DB errors
db.on('error', function (err) {
  console.log(err);
});

// Constants

const routes = require('./routes/index');
const users = require('./routes/users');
const api = require('./routes/api');
const multichain = require('./routes/multichain');
const app = express();

var corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200
};

//app.use(express.static(path.join(__dirname, 'static')));
app.use('/static', express.static(path.join(__dirname, 'static')))

app.use(cors(corsOptions));

// Bring in Models
//let user = require('./models/user');

// Body Parser Middleware
// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// Parse application/json
app.use(bodyParser.json());

app.use('/', routes);
app.use('/users', users);
app.use('/api', api);
app.use('/multichain', multichain);

app.listen(process.env.PORT || 8080);
