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
let pub = new paillier.publicKey(bits, new BigInteger(n));
let priv = new paillier.privateKey(new BigInteger(lambda), pub);
let stream = "test7";

//Routes
router.get('/key', (req, res) => {
	res.json({
		bits: bits,
		n: n,
	})
})

router.get('/decrypt', (req, res) => {
	var result = [];
	var candidate = {};
	var party = {};
	let sum = {};
	multichain.listStreamItems({
		stream: stream,
		//key: req.params.key,
		count: 100000
	}, (err, ballots) => {
		if (err) res.json("There is error");
		if(ballots) {
			for(let i = 0; i < ballots.length; i++) {
				let obj = forge.util.hexToBytes(ballots[i].data);
				obj = JSON.parse(obj);
				for(let key in obj) {
					if(sum[key]) {
						sum[key] = pub.add(new BigInteger(obj[key]), sum[key]);
					}
					else{
						sum[key] = new BigInteger(obj[key]);
					}
				}
				if (i==ballots.length-1) {
					for(let key in sum) {
						sum[key] = priv.decrypt(sum[key]).toString(10);
					}
					var j = 0;
					var length = Object.keys(sum).length;
					for (var key in sum) {
						Rep.findById(key, function(err,rep) {
							if(err) {
								res.json("Error");
								console.log(err);
							}
							else {
								candidate[rep.fname+' '+rep.lname] = sum[rep._id];
								if (party[rep.party]) {
									party[rep.party] = parseInt(party[rep.party]) + parseInt(sum[rep._id]);
								}
								else {
									party[rep.party] = parseInt(sum[rep._id]);
								}
								j++;
								if(j === length) {
									result.push(candidate);
									result.push(party);
									res.json(result);	
								}
							}
						});
					}

				}
			}
		}
	});
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