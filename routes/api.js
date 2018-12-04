'use strict';

const express = require('express');
const router = express.Router();
const Rep = require('../models/representative');
const Party = require('../models/party');
const Election = require('../models/election');
const qrcode = require('qrcode');
const os = require( 'os' );
const networkInterfaces = os.networkInterfaces( );
const config = {
	port: 2904,
	host: '127.0.0.1',
	user: "multichainrpc",
	pass: "2118a6r4"
}
const multichain = require("multichain-node")(config);

router.get('/admin', (req,res) => {
    res.sendFile('/index.html');
})

router.get('/app', (req,res) => {
    res.sendFile('/electioner.apk');
})

router.get('/list/elections', (req,res) => {
    Election.find((err, elections) => {
        if(err) res.sendStatus(500);
        else res.json(elections);
    });
});

// Create an election
router.post('/create/election', (req, res) => {
    try {
        let election = new Election({
            active: false,
            name: req.body.name,
            publicKey: req.body.publicKey,
            privateKey: ""
        })
        multichain.create({
            type: "stream",
            name: req.body.name,
            open: true
        }, (err, txid) => {
            if(err) {
                console.log(err);
                res.json(err);
            }
            else if(txid){
                election.save(election, (err, election) => {
                    if(err) res.json("Error: unable to save election info.");
                    else res.json("Success: election has been saved.");
                })
            }
        });
    }
    catch(e) {
        console.log(e); 
    }
});

//Closed and set decryption for an election
router.post('/set/key', (req, res) => {
    try {
        let key = {
            privateKey: req.body.privateKey
        }
        let query = {name:req.body.name}
        Election.updateOne(query, key, function(err, election){
            if(err){
                console.log(err);
                res.json("Error: unable to set key.");
            }
            else if(election){
                res.json(election);
            }
            else {
                res.sendStatus(500);
            }
        });
    }
    catch(e) {
        console.log(e);
        res.sendStatus(500);        
    }
});

router.post('/election/start', (req,res) => {
    try {
        let query = {name:req.body.name};
        Election.updateOne(query, {active: true}, (err, election) => {
            if(err) {
                res.sendStatus(500);
            }
            else if(election) res.json(req.body.name+" started.");
            else res.sendStatus(500);
        });
    }
    catch(e) {
        console.log(e);
        res.sendStatus(500);
    }
});

router.post('/election/stop', (req,res) => {
    try {
        let query = {name:req.body.name};
        Election.updateOne(query, {active: false}, (err, election) => {
            if(err) {
                res.sendStatus(500);
            }
            else if(election) res.json(req.body.name+" stopped.");
            else res.sendStatus(500);
    
        });
    }
    catch(e) {
        console.log(e);
        res.sendStatus(500);
    }
});

router.post('/add_rep', (req,res) => {
    try {
        var newRep = new Rep(
            {
                fname : req.body.fname,
                lname : req.body.lname,
                dob : req.body.dob,
                party : req.body.party,
                district : req.body.district,
                url : req.body.url
            }
        );
        newRep.save((err, rep) => {
            if(err) {
                res.json(err);
                console.log(err);
            }
            else res.json(rep);
        });
    }
    catch(e) {
        console.log(e);
        res.sendStatus(500);
    }
});

//Add a party
router.post('/add_party', (req,res) => {
    try {
        var newParty = new Party({
            name: req.body.name,
            number: req.body.number,
            url: req.body.url}
        );
        newParty.save((err, party) => {
            if(err) {
                res.json(err);
                console.log(err);
            }
            else res.json(party);
        });
    }
    catch(e) {
        console.log(e);
        res.sendStatus(500);
    }
});

//Get a list of representatives
router.get('/rep', (req,res) => {
    try {
        Rep.getReps(function(err, reps){
            if(err) {
                res.json(err);
                console.log(err);
            }
            else res.json(reps);
        });
    }
    catch(e) {
        console.log(e);
        res.sendStatus(500);
    }
});

//Get a representative by id
router.get('/rep/:id', function(req,res){
    try {
        Rep.findById(req.params.id, function(err,rep) {
            if(err) {
                res.json(err);
                console.log(err);
            }
          else res.json(rep);
        });
    }
    catch(e) {
        console.log(e);
        res.sendStatus(500);
    }
});

//Get a representative by area
router.get('/area/:id', function(req,res){
    try {
        Rep.getRepByDistrict(req.params.id, "แพร่", function(err,rep) {
            if(err) {
                res.json(err);
                console.log(err);
            }
            else res.json(rep);
        });
    }
    catch(e) {
        console.log(e);
        res.sendStatus(500);
    }
});

// Get a party by id
router.get('/party/:id', function(req,res){
    try {
        Party.findById(req.params.id, function(err,party) {
            if(err) {
                res.json(err);
                console.log(err);
            }
            else res.json(party);
        });
    }
    catch(e) {
        console.log(e);
        res.sendStatus(500);
    }
});

//Get a list of parties
router.get('/party', (req,res) => {
    try {
        Party.getParties(function(err, parties){
            if(err) {
                res.json(err);
                console.log(err);
            }
            else res.json(parties);
        })
    }
    catch(e) {
        console.log(e);
        res.sendStatus(500);
    }
});

//Query reps by party name
router.post('/listreps', (req,res) => {
    try {
        if(req.body.party) {
            Rep.getRepByParty(req.body.party,function(err, reps){
                if(err) {
                    res.json(err);
                    console.log(err);
                }
                else res.json(reps);
            })
        }
        else {
            res.json("Error");
        }
    }
    catch(e) {
        console.log(e);
        res.sendStatus(500);
    }
});

//Delete a representative
router.delete('/rep/:id', function(req,res){
    try {
        let query = {_id:req.params.id}
        Rep.deleteOne(query,function(err, rep){
            if(err){
                console.log(err);
                res.json(err);
            }
            else {
                res.json(rep);
            }
        });
    }
    catch(e) {
        console.log(e);
        res.sendStatus(500);
    }
});

//Delete party
router.delete('/party/:id', function(req,res){
    try {
        let query = {_id:req.params.id}
        Party.deleteOne(query,function(err, party){
            if(err){
                console.log(err);
                res.json(err);
            }
            else {
                res.json(party);
            }
        });
    }
    catch(e) {
        console.log(e);
        res.sendStatus(500);
    }
});

//Update a representative
router.post('/rep/edit/:id', function(req,res){
    try {
        var newRep = 
        {
            fname : req.body.fname,
            lname : req.body.lname,
            dob : req.body.dob,
            party : req.body.party,
            district : req.body.district,
            url : req.body.url
        };
        var query = {_id:req.params.id}

        Rep.updateOne(query, newRep, function(err, rep){
            if(err){
                console.log(err);
                res.json(err);
            }
            else {
                res.json(rep);
            }
        });
    }
    catch(e) {
        console.log(e);
        res.sendStatus(500);
    }
});

//Update a party
router.post('/party/edit/:id', function(req,res){
    try {
        var newParty = {
            name: req.body.name,
            number: req.body.number,
            url: req.body.url
        };
        var query = {_id:req.params.id}
        
        Party.updateOne(query, newParty, function(err, party){
            if(err){
                console.log(err);
                res.json(err);
            }
            else {
                res.json(party);
            }
        });
    }
    catch(e) {
        console.log(e);
        res.sendStatus(500);
    }
});

router.post('/qr', (req, res) => {
    try {
        const data = req.body.data;
        run().catch(error => console.error(error.stack));
        async function run() {
            const response = await qrcode.toDataURL(data);
            res.json(response);
        }
    }
    catch(e) {
        console.log(e);
        res.sendStatus(500);
    }
});

module.exports = router;