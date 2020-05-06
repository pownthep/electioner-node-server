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

const multichain = require("multichain-node")(global.config);
const axios = require('axios');
const util = require('util');
const publish = util.promisify(multichain.publish);

//Variables
const n = '63643836349122878110314948763039607655658373514564579581533705313808805192463';
const lambda = "31821918174561439055157474381519803827571165229892378477650320364876810303840";
const bits = 256;
const pub = new paillier.publicKey(bits, new BigInteger(n));
const priv = new paillier.privateKey(new BigInteger(lambda), pub);
const md = forge.md.sha1.create();
md.update('sign this', 'utf8');
const address = "16exXAYvaAuX6Cu6cfXipMBT2t45euAvXmWhv7";

//Register user
router.post('/register', async (req, res) => {
	try {
		const publicKey = forge.pki.publicKeyFromPem(req.body.key);
		const exist = await User.getUserByKey(forge.pki.publicKeyToPem(publicKey));
		if (exist) { res.json("User already exist"); return; }
		else {
			const newUser = new User({
				pubKey: forge.pki.publicKeyToPem(publicKey),
				district: req.body.district,
				voted: false
			})
			const user = await User.createUser(newUser);
			res.json(user);
		}
	} catch (e) {
		console.log(e);
		res.sendStatus(500);
	}
});

//Login user
router.post('/login', async (req, res) => {
	try {
		const query = { active: true };
		const started = await Election.findOne(query);
		let user = '';
		const publicKey = forge.pki.publicKeyFromPem(req.body.key);

		if (!started) { res.json("Election has ended or has not started."); return; }
		if (!req.body.key) { res.json("User does not exist"); return; }
		user = await User.getUserByKey(forge.pki.publicKeyToPem(publicKey));
		if (!user) res.json("User does not exist");
		else if (user.voted) res.json("You're already voted.");
		else {
			console.log(user.pubKey);
			const reps = await Rep.getRepByDistrict(user.district);
			if (reps.length === 0) { res.json("No representatives in your district."); return; }
			res.json(reps);
		}

	} catch (e) {
		console.log(e);
		res.sendStatus(500);
	}
});

//publishFrom: ["from", "stream", "key", "data"]
router.post('/vote', async (req, res) => {
	try {
		const publicKey = forge.pki.publicKeyFromPem(req.body.key);
		const key = forge.pki.publicKeyToPem(publicKey);
		const election = await Election.findOne({ active: true });
		if (!election) { res.json("Election has ended or has not started."); return; }

		const user = await User.getUserByKey(key);
		if (!user) res.json("User does not exist");
		else if (user.voted) res.json("You're already voted.");
		else {
			const signature = req.body.signature;
			
			const authenticated = publicKey.verify(md.digest().bytes(), signature);
			if (!authenticated) { res.json("Aunthentication failed."); return; }
			const voted = await publish({
				stream: election.name,
				key: 'key',
				data: req.body.data
			});
			const updated = await user.update({ voted: true });
			res.json(voted);
		}

	} catch (e) {
		console.log(e);
		res.sendStatus(500);
	}
});

module.exports = router;