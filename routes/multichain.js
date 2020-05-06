'use strict';

const express = require('express');
const router = express.Router();
const multichain = require("multichain-node")(global.config);
const util = require('util');
const Rep = require('../models/representative');

// Test multichain connection
router.get('/', async (req, res) => {
	try {
		const getInfo = util.promisify(multichain.getInfo);
		res.json(await getInfo());
	}
	catch (e) {
		console.log(e);
		res.sendStatus(500);
	}
});

// List stream
router.get('/liststreams', async (req, res) => {
	try {
		const listStreams = util.promisify(multichain.listStreams);
		res.json(await listStreams());
	}
	catch (e) {
		console.log(e);
		res.sendStatus(500);
	}
});

// List stream items
router.get('/liststreamitems/:id', async (req, res) => {
	try {
		const listStreamItems = util.promisify(multichain.listStreamItems);
		res.json(await listStreamItems({
			stream: req.params.id,
			count: 10000000000
		}));
	}
	catch (e) {
		console.log(e);
		res.sendStatus(500);
	}
});

router.get('/count/:id', async (req, res) => {
	try {
		let data = [];
		let reps = {};
		const listStreamItems = util.promisify(multichain.listStreamItems);
		const ballots = await listStreamItems({
			stream: req.params.id,
			count: 10000000000
		});
		ballots.forEach(ballot => {
			if(!reps[ballot.data]) reps[ballot.data] = 1;
			else reps[ballot.data]++;
		});
		for (const key in reps) {
			let rep = await Rep.findById(key);
			rep['votes'] = reps[key];
			data.push(rep);
		}
		res.json(data);
	}
	catch (e) {
		console.log(e);
		res.sendStatus(500);
	}
});

router.get('/subscribe/:id', async (req, res) => {
	try {
		const subscribe = util.promisify(multichain.subscribe);
		res.json(await subscribe({
			stream: req.params.id
		}));
	}
	catch (e) {
		console.log(e);
		res.sendStatus(500);
	}
});

router.get('/addresses', async (req, res) => {
	try {
		const getAddresses = util.promisify(multichain.getAddresses);
		res.json(await getAddresses());
	}
	catch (e) {
		console.log(e);
		res.sendStatus(500);
	}
});

module.exports = router;