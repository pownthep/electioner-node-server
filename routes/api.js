'use strict';

const express = require('express');
const router = express.Router();
const Rep = require('../models/representative');
const Party = require('../models/party');

//Add a representative
router.post('/add_rep', (req,res) => {
    var newRep = new Rep(
        {
            fname : req.body.fname,
            lname : req.body.lname,
            age : req.body.age,
            number : req.body.number,
            party : req.body.party,
            area : req.body.area,
            province : req.body.province,
            district : req.body.district,
            image : req.body.image
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
        name: req.body.party_name,
        code: req.body.code,
        url: req.body.image_url}
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
            age : req.body.age,
            number : req.body.number,
            party : req.body.party,
            area : req.body.area,
            province : req.body.province,
            district : req.body.district,
            image : req.body.image
        };
    var query = {_id:req.params.id}

    Rep.updateOne(query, newRep, function(err, rep){
        if(err){
            console.log(err);
            res.send("Error");
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
        code: req.body.code,
        url: req.body.image_url
    };
    var query = {_id:req.params.id}
    
    console.log(req.body);
    Party.updateOne(query, newParty, function(err, party){
        if(err){
            console.log(err);
            res.send("Error");
        }
        else {
            res.json(party);
        }
    });
});

module.exports = router;