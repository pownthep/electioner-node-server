'use strict';

const express = require('express');
const router = express.Router();
const User = require('../models/user');
const forge = require('node-forge');
const Rep = require('../models/representative');
const multichain = require("multichain-node")({
	port: 6758,
	host: '178.128.27.70',
	user: "multichainrpc",
	pass: "HpE3acAYinEcBoV1sBkMS9FnqeTY86rm5pQz6Mky7MRZ"
});
let start = false;
//Add a representative

router.post('/toggle', (req, res) => {
    start = !start;
    res.json(start);
});

router.post('/status', (req, res) => {
    res.json(start);
});

const md = forge.md.sha1.create();
md.update('sign this', 'utf8');

//Register user
router.post('/register', (req,res) => {
	let key = req.body.key.substring(0, req.body.key.indexOf('-----END PUBLIC KEY-----')+24);
	try{
		User.getUserByKey(key, (err, user) => {
			if (err) {
				res.sendStatus(500);
				console.log(err);
			}
			if (!user) {
				let newUser = new User({
					pubKey: key,
					district: req.body.district,
					voted: 0
	
				})
				User.createUser(newUser, (err, user) => {
					if(err) {
						console.log(err);
						res.json(err);
					}
					else {
						res.json(user);
					}
				})
			}
			else {
				res.send("User already exist");
			}
		});
	}
	catch(e) {
		res.sendStatus(500);
	}

	
});

//Login user
router.post('/login', (req,res) => {
	let key = req.body.key.substring(0, req.body.key.indexOf('-----END PUBLIC KEY-----')+24);
	try {
		User.getUserByKey(key, (err, user) => {
			if (err) {
				res.sendStatus(500);
			}
			if(user) {
				if(user.voted == 0) {
					Rep.getReps((err, reps) => {
						if(err) {
							console.log(err);
							res.sendStatus(500)
						}
						if(reps) {
							res.json(reps);
						}
						else {
							res.send([]);
						}
					})
				}
				else {
					res.json([]);
				}
				
			}
			else {
				res.json("User does not exist");
				console.log("User does not exist");
			}
		});
	}
	catch(e) {
		res.sendStatus(500);
	}
	
});

router.post('/vote', (req,res) => {
	console.log(req.body);
	let key = req.body.key.substring(0, req.body.key.indexOf('-----END PUBLIC KEY-----')+24);
	if(true) {
		User.getUserByKey(key, (err, user) => {
			if(err) res.sendStatus(500);
			if(user && user.voted == 0) {
				var signature = req.body.signature;
				try {
					var publicKey = forge.pki.publicKeyFromPem(key);
					var legit = publicKey.verify(md.digest().bytes(), signature);
					if (legit) {
						let message = forge.util.bytesToHex(req.body.data);
						multichain.publish({
							stream: "test4",
							key: key,
							data: message
						}, (err, response) => {
							if(err) {
								res.json(err);
								console.log(err);
							}
							else {
								var query = {pubKey:key}
								user.voted = 1;
								User.updateOne(query, user, function(err, user){
									if(err){
										console.log(err);
										res.json(err);
									}
									else {
										res.json(response);
									}
								});							
							}
						})
					}
					else {
						res.json("Aunthentication failed.");
					}
				}
				catch (e) {
					res.json("Aunthentication failed.");
				}
			}
			else {
				res.json("Already voted!");
			}
		});
	}
	else {
		res.json(100);
	}
	
});

module.exports = router;