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
mongoose.connect
(
  'mongodb+srv://electioner:2118a6r4@cluster0-ypngq.mongodb.net/test?retryWrites=true', // Replace with your own connection string
  {useNewUrlParser: true}
);

global.config = {
	port: 8000,
	host: '35.190.131.98', // Use the IP of the machine you are running MultiChain on.
	user: "multichainrpc",
	pass: "12345678"
}
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
const PORT = 8080;

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
app.use('/users', users);
app.use('/api', api);
app.use('/multichain', multichain);

app.listen(PORT);
