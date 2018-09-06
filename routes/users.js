'use strict';

const express = require('express');
const router = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const multichain = require("multichain-node")({
	port: 6758,
	host: '178.128.27.70',
	user: "multichainrpc",
	pass: "HpE3acAYinEcBoV1sBkMS9FnqeTY86rm5pQz6Mky7MRZ"
});

// Register get route
router.get('/register', (req, res) => {
	res.render('register');
});

// Login get route
router.get('/login', (req, res) => {
	res.render('login');
});

// Register post route
router.post('/register', (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
  
    //Validation
    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();
  
    let errors = req.validationErrors();
  
    if(errors) {
      res.render('register',{
        errors:errors
      });
    }
    else {
      let newUser = new User({
        username: username,
        password: password
      })
      User.createUser(newUser, (err, user) => {
        if(err) throw err;
      })
      res.redirect('/users/login');
    }
  });

// Local authentication strategy
passport.use(new LocalStrategy(
	function (username, password, done) {
		User.getUserByUsername(username, (err, user) => {
			if (err) throw err;
			if (!user) {
				return done(null, false, { message: 'Unknown User' });
			}
			User.comparePassword(password, user.password, function (err, isMatch) {
				if (err) throw err;
				if (isMatch) {
					return done(null, user);
				} else {
					return done(null, false, { message: 'Invalid password' });
				}
			});
		});
	}));

passport.serializeUser(function (user, done) {
	done(null, user.id);
});

passport.deserializeUser(function (id, done) {
	User.getUserById(id, function (err, user) {
		done(err, user);
	});
});

router.post('/login',
	passport.authenticate('local', { successRedirect: '/users/candidates', failureRedirect: '/users/login', failureFlash: true }),
	function (req, res) {
		res.redirect('/users/candidates');
	});

//Candidate info route
router.get('/candidates', ensureAuthenticated, (req, res) => {
	res.render('candidates', {
		login: true
	});
});

router.get('/logout', ensureAuthenticated, (req, res) => {
	req.logout();
  res.redirect('/');
});

router.post('/vote', ensureAuthenticated, (req, res) => {
	multichain.sendAssetFrom({from: '186wWemFogZ725eMXYLjvUSAPo88P9she3hduh', to: '16Qmnk7jhbn7J35VVArfk1fE4dv9XiayvBPaBR', asset: "GBP", qty: 1}, (err, tx) => {
		if(err) console.log(err);
		console.log(tx);
		res.redirect('/users/logout');
	});
});

router.get('/login/:id/:password', (req, res) => {
	res.render('login', {
		notFilled:true,
		id: req.params.id,
		password: req.params.password
	})
});

function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		//req.flash('error_msg','You are not logged in');
		res.redirect('/users/login');
	}
}


module.exports = router;