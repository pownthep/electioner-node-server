'use strict';

const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const multichain = require("multichain-node")({
	port: 6758,
	host: '178.128.27.70',
	user: "multichainrpc",
	pass: "HpE3acAYinEcBoV1sBkMS9FnqeTY86rm5pQz6Mky7MRZ"
});
const fs = require('fs');
const crypto = require('crypto');

const priv_key = '';

router.post('/setkeys', (req,res) => {
    pub_key = req.body.key;
    console.log(priv_key);
});

// Get address api
router.get('/getaddresses', (req, res) => {
    multichain.getAddresses((err, response) => {
        if(err) {
			res.json(err);
			console.log(err);
		}
		else {
			res.json(response);
		}
    });
});

// Test multichain connection
router.get('/multichain', (req,res) => {
    multichain.getInfo((err, info) => {
        if(err) {
			res.json(err);
			console.log(err);
		}
		else {
			res.json(response);
		}
    });
});

// List stream
router.get('/liststreams', (req, res) => {
	multichain.listStreams((err, response) => {
		if(err) {
			res.json(err);
			console.log(err);
		}
		else {
			res.json(response);
		}
    })
});

// List stream items
router.get('/liststreamitems/:id', (req, res) => {
	multichain.listStreamItems({
		stream: req.params.id
	}, (err, response) => {
		if(err) {
			res.json(err);
			console.log(err);
		}
		else {
			res.json(response);
		}
	})
});

// List asset transaction
router.get('/listassettransaction/:id', (req, res) => {
	const test = crypto.createECDH();
	multichain.listAssetTransactions({
		asset: req.params.id
	}, (err, response) => {
		if(err) {
			res.json(err);
			console.log(err);
		}
		else {
			res.json(response);
		}
	})
});

router.get('/publish/:id', (req, res) => {
	let buffer = new Buffer("Kuy");
	let encrypted = crypto.publicEncrypt(publicKey, buffer);
	let message = (encrypted.toString("hex"));;
	console.log(message);
	console.log(encrypted);
	console.log(req.params.id);
	multichain.publishFrom({
        from: req.params.id+"",
        stream: "test",
		key: "key",
		data: message
	}, (err, response) => {
		if(err) {
			res.json(err);
			console.log(err);
		}
		else {
			res.json(response);
		}
	})
});

// publishFrom: ["from", "stream", "key", "data"]
router.post('/publish', (req, res) => {
	multichain.publishFrom({
        from: req.body.from,
        stream: req.body.stream,
        key: req.body.key,
        data: req.body.data
	}, (err, response) => {
		if(err) {
			res.json(err);
			console.log(err);
		}
		else {
			res.json(response);
		}
	})
});

// publishFrom: ["from", "stream", "key", "data"]
router.get('/publish/:id', (req, res) => {
	multichain.publishFrom({
        from: req.params.id,
        stream: "test",
        key: "key",
        data: "data"
	}, (err, response) => {
		if(err) {
			res.json(err);
			console.log(err);
		}
		else {
			res.json(response);
		}
	})
});

// createKeyPairs: [{"count": 1}]
router.get('/createkey', (req, res) => {
	multichain.createKeyPairs({
        count: 1
	}, (err, response) => {
        if(err) {
			res.json(err);
			console.log(err);
		}
		else {
			res.json(response);
		}
	})
});

// grant: ["addresses", "permissions", {"native-amount":null}, {"start-block": null}, {"end-block": null}, {"comment": null}, {"comment-to": null}],
router.get('/grant', (req, res) => {
	multichain.grant({
        addresses: 1
	}, (err, response) => {
        if(err) {
			res.json(err);
			console.log(err);
		}
		else {
			res.json(response);
		}
	})
});

module.exports = router;