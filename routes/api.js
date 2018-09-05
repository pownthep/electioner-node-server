'use strict';

const express = require('express');
const router = express.Router();
const multichain = require("multichain-node")({
    port: 6758,
    host: '178.128.27.70',
    user: "multichainrpc",
    pass: "HpE3acAYinEcBoV1sBkMS9FnqeTY86rm5pQz6Mky7MRZ"
});

// Test multichain connection
router.get('/multichain', (req,res) => {
    multichain.getInfo((err, info) => {
        if(err){
        res.render('multichain', {
            multichain: "Unable to retrieve chain data"
        });
        }
        else {
        res.render('multichain', {
            multichain: info
        });
        }
    });
});

// Create key pairs api
router.get('/createkeypairs', (req, res) => {
    multichain.createKeyPairs({"count": 2},(err, keyPair) => {
        console.log(keyPair);
    
    });
});

// Get address api
router.get('/getaddresses', (req, res) => {
    multichain.getAddresses((err, addresses) => {
        if(err) console.log(err);
        res.render('addresses', {
            addresses: addresses
        });
    });
});




module.exports = router;