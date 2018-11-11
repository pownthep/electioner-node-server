'use strict';

const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const forge = require('node-forge');
const multichain = require("multichain-node")({
	port: 6758,
	host: '178.128.27.70',
	user: "multichainrpc",
	pass: "HpE3acAYinEcBoV1sBkMS9FnqeTY86rm5pQz6Mky7MRZ"
});
const Rep = require('../models/representative');
const fs = require('fs');
const crypto = require('crypto');

const priv_key = fs.readFileSync( './private.key' );
const publicKey = fs.readFileSync( './localhost.cert');
const privateKeyPem = `-----BEGIN RSA PRIVATE KEY-----
  MIIEowIBAAKCAQEAkHZZK4120cekvdg8UgIUIu033Obajxnd1lJeUdC0puee7G/C
  0e/iepg5IEU/RDmQFxiJSnppmwadPmGTsyrBAgCgf8qaW7jwI9lkIq5PlOuzWREc
  c1EKqwvB381Et8QtaoiEjv6iGoyHEu8l9Dgy0+UK2Wvto07O5lGncLpAiADtGk2y
  cmqZOkmhYsnFW0xpEIYdaWhMIYKG+DUrVMpD0Ntr+zjKtbBYVL5kA6kjdxlKfKGW
  +tMCdQ8GLQMLVZgH2qrxiTSzUj7OkyXMPGcB+UTt985Zk/Ok9jgGRDPS312vKzqF
  ALVj3tX+ZV/g7NyWCkN1LdW9peUZRxqrHxI5dwIDAQABAoIBAAqljkDVdjJTwmJz
  c06f9Jf2X62aHfV59I19GJJzDT1XyLCoM/WA9nIOkfc840LF80agek3Q48OXIzOb
  wWTs+7iID0wbxHCKGrippuWfbyIMlPU1e6FMEbs1bJ5v5GaewLIfSZW4Un4eaT4N
  /gAXvDc9pCUN/T+R6VG0JuD5+ROM0ZNyjASquAKopqp8la4Q5QT5jk82fMfuXOlQ
  YGHHGiQArdHlCn+qIYPrNIk5HdueO/BknYkJ/JXOMzP/fRe88+A463ThS3X4iUVm
  8i659PLNkMHq8IcNRAnF0z6Lj3Sp/jGVz2Hxsz9IVxK48KnRWPhdxaNm1mOZ11CK
  w0UolGECgYEAwr7KxSrFaI5tt2jNyIOPwrCd5aKpcxlfs1K5Jzwl+kbEc17NxUT1
  CNl5aSvOspw9zyK/noTouE2agCvqdiHaJl6ub3bQuDhIfpcgv8IUH5n/9cXA7YHR
  49C8lk8Oa3m9NRW4WdkkDPRFOMJC3eLAuAqyOKSBRkh7SKfR2SW0f08CgYEAveaw
  OA3woRGWhF0+cYTPrFFaomAyf6XqY0yVr2QJvNA4lXd7pJ8FqbA7u799oUKGRynw
  fzXO2sE5vmNTQFVy2a8Jxo+lypcnOHRtzYda2hBE4wWnGsQfrsCt8oj6ryZfIgRV
  6d55NqOQiolaht5UHRYAOPnhkaF0r1EMnqwY2VkCgYEAhClu+re4GOjv1JSvcvC1
  026A+aKWVKJXrB7rwJC1RVBZaeJgywutL0BHgPRV5ijaWYQ/fpi8RreDrpAfIeR/
  Y6LFxqdfpmWr7R0rAHf5qCie6HA4Kfb8NhsmoOst4gpQOYJwBamzKYdsosRTFLoa
  B8xafs5FXSk7YWdipndMM0kCgYAbP8rxgC6TLi7m92pKZ8BU/ad/vUYBwxELBqZD
  8JrlGQvFhsubJ6ZsXvlzS1r/lMgn1gDIgDQad7eNdjsv9BLy4YcJkvs7Qs1B8JMA
  9vc2azc3TExaLuJM9SEAuF8gWuUzwGODl4TVLktDVcpDqAtx0QJfKpwPhZd0wLCK
  5C78oQKBgBKjo2fVNNA/7O2qhf+ZiSRrhJucSAY5w3bsyjXPSBdDvbJo43o2eXJG
  x5vSU8EnU2m//65nAbn4PjLOtD+86hQRsmBZAOqqgXzLGw1Ht4tLmSn5zdzg/deD
  2mv/nlBy1rCTVKVg4N5AwX353B4MtmXVNYI2PDebnImMvBdtfva4
  -----END RSA PRIVATE KEY-----`;
  const privateKey = forge.pki.privateKeyFromPem(privateKeyPem);

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
			res.json(info);
		}
    });
});

// List stream
router.get('/liststreams', ensureAuthenticated, (req, res) => {
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

router.get('/count/:streamname/:key', (req, res) => {
	var result = [];
	var candidate = {};
	var party = {};
	var count = {};
	multichain.listStreamItems({
		stream: req.params.streamname,
		//key: req.params.key,
		count: 10000000
	}, (err, ballots) => {
		if(err) {
			res.json(err);
		}
		else {
			for (var data of ballots) {
				var tmp = privateKey.decrypt(forge.util.hexToBytes(data.data));
				
				if (count[tmp]) {
					count[tmp] = parseInt(count[tmp]) + 1;
				}
				else {
					count[tmp] = 1;
				}
			}
			var i = 0;
			var length = Object.keys(count).length;
			for (var key in count) {
				Rep.findById(key, function(err,rep) {
					if(err) {
						res.json(err);
						console.log(err);
					}
					else {
						candidate[rep.fname+' '+rep.lname] = count[rep._id];
						if (party[rep.party]) {
							party[rep.party] = parseInt(party[rep.party]) + count[rep._id];
						}
						else {
							party[rep.party] = count[rep._id];
						}
						i++;
						if(i === length) {
							result.push(candidate);
							result.push(party);
							res.json(result);	
						}
					}
				});
			}
			
		}
	})
});

function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		//req.flash('error_msg','You are not logged in');
		res.json('You are not logged in! Please log in!');
	}
}
module.exports = router;