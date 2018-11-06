'use strict';

const express = require('express');
const router = express.Router();
const Rep = require('../models/representative');
const Party = require('../models/party');
const District = require('../models/district');
const qrcode = require('qrcode');

//Add a representative
router.post('/add_rep', (req,res) => {
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
});

//Add a party
router.post('/add_party', (req,res) => {
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
});

//Get a list of representatives
router.get('/rep', (req,res) => {
    Rep.getReps(function(err, reps){
        if(err) {
            res.json(err);
            console.log(err);
        }
        else res.json(reps);
    })
});

//Get a representative by id
router.get('/rep/:id', function(req,res){
    Rep.findById(req.params.id, function(err,rep) {
        if(err) {
            res.json(err);
            console.log(err);
        }
      else res.json(rep);
    });
  });

//Get a representative by area
router.get('/area/:id', function(req,res){
    Rep.getRepByDistrict(req.params.id, "แพร่", function(err,rep) {
        if(err) {
            res.json(err);
            console.log(err);
        }
      else res.json(rep);
    });
  });

// Get a party by id
router.get('/party/:id', function(req,res){
    Party.findById(req.params.id, function(err,party) {
        if(err) {
            res.json(err);
            console.log(err);
        }
        else res.json(party);
    });
});

//Get a list of parties
router.get('/party', (req,res) => {
    Party.getParties(function(err, parties){
        if(err) {
            res.json(err);
            console.log(err);
        }
        else res.json(parties);
    })
});

//Delete a representative
router.delete('/rep/:id', function(req,res){
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
});

//Delete party
router.delete('/party/:id', function(req,res){
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
});

//Update a representative
router.post('/rep/edit/:id', function(req,res){
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
});

//Update a party
router.post('/party/edit/:id', function(req,res){
    var newParty = {
        name: req.body.party_name,
        number: req.body.number,
        url: req.body.url
    };
    var query = {_id:req.params.id}
    
    console.log(req.body);
    Party.updateOne(query, newParty, function(err, party){
        if(err){
            console.log(err);
            res.json(err);
        }
        else {
            res.json(party);
        }
    });
});

/*router.get('/province', (req,res) => {
    for (var x of province) {
        var newDistrict = new District({
            province: x.province,
            amphoe: x.amphoe,
            district: x.district}
        );
        newDistrict.save((err, district) => {
            if(err) {
                //res.json(err);
                console.log(err);
            }
            else console.log(district);
        });
    }
    res.json(province[0].province);
});*/

router.post('/qr', (req, res) => {
    const data = req.body.data;
    run().catch(error => console.error(error.stack));
    async function run() {
        const response = await qrcode.toDataURL(data);
        res.json(response);
    }
});

module.exports = router;