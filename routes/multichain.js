'use strict';

const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const forge = require('node-forge');
const os = require( 'os' );
const networkInterfaces = os.networkInterfaces( );
const config = {
	port: 2904,
	host: '127.0.0.1',
	user: "multichainrpc",
	pass: "2118a6r4"
}
const multichain = require("multichain-node")(config);
const Rep = require('../models/representative');
const http = require('http');

//listStreamPublisherItems: ["stream", "address", {"verbose": false}, {"count": 10}, {"start": startDefault}, {"local-ordering": false}],
router.get('/liststream/publish/items', (req,res) => {
	try {
		multichain.getAddresses({

		},(err, addresses) => {
			if(err) res.sendStatus(500);
			else {
				console.log(addresses[0]);
				multichain.listStreamPublisherItems({
					stream: "election4",
					address: addresses[0],
					count: 20000000
				}, (err, items) => {
					if(err) res.sendStatus(500);
					else res.json(items)
				});				
			}
		})
		
	}
	catch(e) {
		console.log(e);
	}
});

//getAddresses: [{"verbose": false}]
router.get('/getaddress', (req,res) => {
	try {
		multichain.getAddresses({

		},(err, response) => {
			if(err) res.sendStatus(500);
			else res.json(response[0]);
		})
	}
	catch(e) {
		console.log(e);
	}
});

//listWalletTransactions: [{"count": 10}, {"skip": 0}, {"includeWatchOnly": false}, {"verbose": false}]
router.get('/listwallettransactions', (req, res) => {
    multichain.listWalletTransactions({
        count: 10000000000000000
    }, (err, response) => {
        if(err) res.sendStatus(500);
        else if (response) {
            res.json(response);
        }
        else {
            res.sendStatus(500);
        }
    })
});

// Test multichain connection
router.get('/multichain', (req,res) => {
	try {
		multichain.getInfo((err, info) => {
			if(err) {
				res.json(err);
				console.log(err);
			}
			else {
				res.json(info);
			}
		});
	}
	catch(e) {
		console.log(e);
		res.sendStatus(500);
	}
});

// List stream
router.get('/liststreams', (req, res) => {
	try {
		multichain.listStreams((err, response) => {
			if(err) {
				res.json(err);
				console.log(err);
			}
			else {
				res.json(response);
			}
		});
	}
	catch(e) {
		console.log(e);
		res.sendStatus(500);
	}
});

// List stream items
router.get('/liststreamitems/:id', (req, res) => {
	try {
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
		});
	}
	catch(e) {
		console.log(e);
		res.sendStatus(500);
	}
});

// List asset transaction
router.get('/listassettransaction/:id', (req, res) => {
	try {
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
		});
	}
	catch(e) {
		console.log(e);
		res.sendStatus(500);
	}
});

module.exports = router;