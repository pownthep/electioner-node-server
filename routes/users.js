'use strict';
// Imports
const express = require('express');
const router = express.Router();
const User = require('../models/user');
const forge = require('node-forge');
const Rep = require('../models/representative');
const paillier = require('jspaillier');
const BigInteger = require('jsbn').BigInteger;
const multichain = require("multichain-node")({
	port: 6758,
	host: '178.128.27.70',
	user: "multichainrpc",
	pass: "HpE3acAYinEcBoV1sBkMS9FnqeTY86rm5pQz6Mky7MRZ"
});

//Variables
let start = true;
let n = '63643836349122878110314948763039607655658373514564579581533705313808805192463';
let lambda = "31821918174561439055157474381519803827571165229892378477650320364876810303840";
let bits = 256;
let pub = new paillier.generatePub(bits, new BigInteger(n));
let priv = new paillier.privateKey(new BigInteger(lambda), pub);
let stream = "test6";
let encA = pub.encrypt(new BigInteger('1'));
//Routes
router.get('/key', (req, res) => {
	res.json({
		bits: bits,
		n: n,
	})
})

router.get('/decrypt', (req, res) => {
	// multichain.listStreamItems({
	// 	stream: stream,
	// 	//key: req.params.key,
	// 	count: 1
	// }, (err, ballots) => {
	// 	if (err) res.json("There is error");
	// 	if(ballots) {
	// 		for(let ballot of ballots) {
	// 			let obj = forge.util.hexToBytes(ballot.data);
	// 			//console.log(obj.5be7f98ed75164378cacbf87);
	// 			/*for(let key in obj) {
	// 				//let decrypt = priv.decrypt(new BigInteger(obj.key)).toString(10);
	// 				console.log(obj.key +"\n");
	// 			}*/
	// 		}
	// 	}
	// });
	//res.json(priv.decrypt(new BigInteger(req.params.data)).toString(10));
	//console.log(priv.decrypt(new BigInteger(req.params.data)).toString(10));

	for(let i = 0; i <= 1000000; i++) {
		if(i==1000000) res.json("done");
		priv.decrypt(encA);
		console.log(i);
	}
});

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
	if(start) {
		User.getUserByKey(key, (err, user) => {
			if(err) res.sendStatus(500);
			if(user && user.voted == 0) {
				var signature = req.body.signature;
				try {
					var publicKey = forge.pki.publicKeyFromPem(key);
					var legit = publicKey.verify(md.digest().bytes(), signature);
					if (legit) {
						//let message = forge.util.bytesToHex(JSON.stringify(req.body.data));
						multichain.publish({
							stream: stream,
							key: key,
							data: req.body.data
						}, (err, response) => {
							if(err) {
								res.json(err);
								console.log(err);
							}
							else {
								var query = {pubKey:key}
								user.voted = 0;
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