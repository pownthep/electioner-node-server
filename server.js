'use strict';

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const mongoose = require('mongoose');
const cors = require('cors');
const https = require('https');
const fs = require('fs');

mongoose.connect('mongodb://electioner:A@?GAfa#xhY2B2wN2hTVz2t@35.185.190.211/electioner')
const db = mongoose.connection;

// Check connection
db.once('open', function(){
  console.log('Connected to MongoDB');
});

// Check for DB errors
db.on('error', function(err){
  console.log(err);
});

// Constants
const HOST = '0.0.0.0';

const routes = require('./routes/index');
const users = require('./routes/users');
const api = require('./routes/api');
const multichain = require('./routes/multichain');

// App
const options = {
  key: fs.readFileSync( './localhost.key' ),
  cert: fs.readFileSync( './localhost.cert' ),
  requestCert: false,
  rejectUnauthorized: false
};

const app = express();
const port = process.env.PORT || 443;
const server = https.createServer( options, app );

var corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Bring in Models
//let user = require('./models/user');

// Body Parser Middleware
// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended:false}));
// Parse application/json
app.use(bodyParser.json());
app.use(cookieParser());

// Express session middleware
app.use(session({
  secret: 'secret',
  saveUninitialized: true,
  resave: true
}));

// Passport init
app.use(passport.initialize());
app.use(passport.session());

// Express Validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

// Connect flash middleware
app.use(flash());

// Global Vars
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

app.use('/', routes);
//app.use('/users', users);
app.use('/api', api);
app.use('/multichain', multichain);

//app.listen(PORT, HOST);
server.listen( port, function () {
  console.log( 'Express server listening on port ' + server.address().port );
} );
