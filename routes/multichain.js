'use strict';

const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const forge = require('node-forge');
const multichain = require("multichain-node")({
	port: 2904,
	host: '127.0.0.1',
	user: "multichainrpc",
	pass: "2118a6r4"
});
const Rep = require('../models/representative');

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
			res.json(info);
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
		stream: req.params.id,
		count: 10000000000
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
	let message = (encrypted.toString("hex"));
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
	//console.log(req.body.data.toString());
	//let buffer = new Buffer(req.body.data);
	//console.log(tmp);
	let message = forge.util.bytesToHex(req.body.data);
	multichain.publish({
        stream: req.body.stream,
        key: req.body.key,
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