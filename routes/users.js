'use strict';
// Imports
const express = require('express');
const router = express.Router();
const User = require('../models/user');
const forge = require('node-forge');
const Rep = require('../models/representative');
const paillier = require('jspaillier');
const Election = require('../models/election');
const BigInteger = require('jsbn').BigInteger;
const os = require( 'os' );
const networkInterfaces = os.networkInterfaces();
const config = {
	port: 2904,
	host: '127.0.0.1',
	user: "multichainrpc",
	pass: "2118a6r4"
}
const multichain = require("multichain-node")(config);
const axios = require('axios');

//Variables
let n = '63643836349122878110314948763039607655658373514564579581533705313808805192463';
let lambda = "31821918174561439055157474381519803827571165229892378477650320364876810303840";
let bits = 256;
let pub = new paillier.publicKey(bits, new BigInteger(n));
let priv = new paillier.privateKey(new BigInteger(lambda), pub);
let md = forge.md.sha1.create();
md.update('sign this', 'utf8');

//Routes
// router.get('/result/:electionname', (req,res) => {
// 	let final = [];
// 	let responses = [];
// 	axios.all([
// 		axios.get('http://localhost:8080/users/decrypt/'+req.params.electionname),
// 		axios.get('http://localhost:8080/users/decrypt/'+req.params.electionname),
// 		axios.get('http://localhost:8080/users/decrypt/'+req.params.electionname)
//   	]).then(axios.spread((response1, response2, response3) => {
// 		final = response1.data;
// 		responses.push(response2.data, response3.data);
// 		let i = 0;
// 		for(let response of responses) {
// 			for(let key in response[0]) {
// 				for(let i = 0; i < response[0][key].length; i++) {
// 					final[0][key][i].votes+=response[0][key][i].votes
// 				}
// 			}
// 			for(let key in response[1]) {
// 				final[1][key]+=response[1][key];
// 			}
// 			i++;
// 			if(i==responses.length) {
// 				let tmp = {};
// 				let j = 0;
// 				let length = Object.keys(final[0]).length;
// 				for(let key in final[0]) {
// 					let district = {
// 						district: key.split(' ')[1]+' '+key.split(' ')[2],
// 						candidates: final[0][key]
// 					}
// 					if(!tmp[key.split(' ')[0]]) tmp[key.split(' ')[0]] = [district];
// 					else tmp[key.split(' ')[0]].push(district);
// 					j++;
// 					if(j==length) {
// 						final[0] = tmp;
// 						res.json(final);
// 					}
// 				}
// 			}
// 		}
// 	})).catch(error => {
// 			console.log(error);
// 	});
// });

router.get('/result/latest', (req,res) => {
	Election.findOne().sort({$natural:-1}).exec((err, data)=>{
		if(err) res.sendStatus(500);
		if(!data.active) {
			let final = [];
			let responses = [];
			axios.all([
				axios.get('http://35.229.127.39:8080/users/decrypt/'+data.name),
				axios.get('http://35.226.78.98:8080/users/decrypt/'+data.name),
				axios.get('http://35.226.162.109:8080/users/decrypt/'+data.name),
				axios.get('http://35.188.154.143:8080/users/decrypt/'+data.name),
				axios.get('http://35.232.59.156:8080/users/decrypt/'+data.name),
				axios.get('http://35.192.90.156:8080/users/decrypt/'+data.name)
			  ]).then(axios.spread((response1,response2,response3,response4,response5,response6) => {
				responses.push(response1.data,response2.data,response3.data,response4.data,response5.data,response6.data);
				for(let i = 0; i < responses.length; i++) {
					if(responses[i].length == 2) {
						// console.log(responses[i]);
						// console.log('-----------------------------------------------');
						if(final.length == 0) {
							final = responses[i];
							//console.log(final[0]);
						}
						else {
							// console.log(final);
							// console.log('-----------------------------------------------');
							for(let key in responses[i][0]) {
								//console.log(key);
								//console.log(responses[i][0][key]);
								for(let j = 0; j < responses[i][0][key].length; j++) {
									//console.log(responses[i][0][key][j].votes);
									if(final[0][key]) final[0][key][j].votes+=responses[i][0][key][j].votes
									else final[0][key] = responses[i][0][key]
									// console.log(final[0][key][j]);
									// console.log(final[0][key][j].votes);
									// console.log('-----------------------------------------------');
								}
							}
							for(let key in responses[i][1]) {
								//console.log();
								final[1][key]+=responses[i][1][key];
							}
						}
					}
					if(i==responses.length-1 && final.length == 2) {
						let tmp = {};
						let j = 0;
						let length = Object.keys(final[0]).length;
						for(let key in final[0]) {
							let district = {
								district: key.split(' ')[1]+' '+key.split(' ')[2],
								candidates: final[0][key]
							}
							if(!tmp[key.split(' ')[0]]) tmp[key.split(' ')[0]] = [district];
							else tmp[key.split(' ')[0]].push(district);
							j++;
							if(j==length) {
								final[0] = tmp;
								res.json(final);
							}
						}
					}
					else {
						res.json(final);
					}
				}
			})).catch(error => {
					console.log(error);
			});
		}
		else {
			res.json("Unable to retrieve results because election is still active.");
		}
	})
	
});


//Routes
router.get('/key', (req, res) => {
	res.json({
		bits: bits,
		n: n,
	})
})

router.get('/decrypt/:name', (req, res) => {
	var result = [];
	var candidate = {};
	var party = {};
	let sum = {};
	multichain.getAddresses({},(err, addresses) => {
		if(err) res.sendStatus(500);
		else {
			multichain.listStreamPublisherItems({
				stream: req.params.name,
				address: addresses[0],
				count: 100000000000
			}, (err, ballots) => {
				if (err) {
					res.json("There is error");
					console.log(err);
				}
				if(ballots && ballots.length > 0) {
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
									else if(rep) {
										let tmp = {
											name: rep.fname+" "+rep.lname,
											party: rep.party,
											votes: parseInt(sum[rep._id])
										}
										if(!candidate[rep.district]) {
											candidate[rep.district] = [tmp];
										}
										else {
											candidate[rep.district].push(tmp);
										}
										
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
									else {
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
				else {
					res.json([]);
				}
			});
		}
	});
	
});

//Register user
router.post('/register', (req,res) => {
	Election.findOne().sort({$natural:-1}).exec((err, data)=>{
		if(err) res.sendStatus(500);
		if(!data.active) {
			try{
				let publicKey = forge.pki.publicKeyFromPem(req.body.key);
				let key = req.body.key.substring(0, req.body.key.indexOf('-----END PUBLIC KEY-----')+24).replace(/(\r\n|\n|\r)/gm,"");
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
								console.log(user);
								res.json("User is verified.");
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
		}
		else {
			res.json("Registration period has ended");
		}
	});
});

//Login user
router.post('/login', (req,res) => {
	Election.findOne().sort({$natural:-1}).exec((err, data)=>{
		if(err) res.sendStatus(500);
		if(data.active & !data.ended) {
			try {
				let publicKey = forge.pki.publicKeyFromPem(req.body.key);
				let key = req.body.key.substring(0, req.body.key.indexOf('-----END PUBLIC KEY-----')+24).replace(/(\r\n|\n|\r)/gm,"");
				User.getUserByKey(key, (err, user) => {
					if (err) {
						res.sendStatus(500);
					}
					if(user) {
						if(user.voted == 0) {
							Rep.getRepByDistrict(user.district, (err, reps) => {
								if(err) {
									console.log(err);
									res.sendStatus(500)
								}
								if(reps.length > 0) {
									console.log(7);
									res.json(reps);
								}
								else {
									console.log(1);
									res.json("No representatives in your district.");
								}
							})
						}
						else {
							console.log(2);
							res.json("You're already voted.");
						}
					}
					else {
						console.log(user);
						res.json("User does not exist");
						console.log("User does not exist");
					}
				});
			}
			catch(e) {
				console.log(3);
				res.sendStatus(500);
			}
		}
		else {
			res.json("Election has ended or has not started.")
		}
	});
});

//publishFrom: ["from", "stream", "key", "data"]
router.post('/vote', (req,res) => {
	Election.findOne({active: true}, (err, election) => {
		if(err) res.json("Error: unable to query.");
		else if(election) {
			let key = req.body.key.substring(0, req.body.key.indexOf('-----END PUBLIC KEY-----')+24).replace(/(\r\n|\n|\r)/gm,"");
			User.getUserByKey(key, (err, user) => {
				if(err) res.sendStatus(500);
				if(user && user.voted == 0) {
					var signature = req.body.signature;
					try {
						var publicKey = forge.pki.publicKeyFromPem(key);
						var legit = publicKey.verify(md.digest().bytes(), signature);
						if (legit) {
							multichain.getAddresses({

							},(err, addresses) => {
								if(err) res.sendStatus(500);
								else {
									console.log(election.name);
									multichain.publishFrom({
										from: addresses[0],
										stream: election.name,
										key: user.district.split(" ")[0],
										data: req.body.data
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
			res.sendStatus(500);
		}
	});
});

module.exports = router;