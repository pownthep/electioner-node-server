'use strict';

const express = require('express');
const router = express.Router();
const Rep = require('../models/representative');
const Party = require('../models/party');
const bodyParser = require('body-parser');

router.post('/add_rep', (req,res) => {
    var newRep = new Rep(
        {
            fname : req.body.fname,
            lname : req.body.lname,
            number : req.body.number,
            party : req.body.party,
            area : req.body.area,
            province : req.body.province,
            district : req.body.district,
            image : req.body.image
        }
    );
    newRep.save((err) => {
        if(err) console.log(err);
        else console.log("Successful saved");
    });
});

router.post('/add_party', (req,res) => {
    var newParty = new Party({
        name: req.body.party_name,
        code: req.body.code,
        url: req.body.image_url}
    );
    newParty.save((err) => {
        if(err) {
            res.status(404);
            console.log(err);
        }
        else res.send("OK!");
    });
});

router.get('/rep', (req,res) => {
    Rep.getReps(function(err, reps){
        if(err) console.log(err);
        else res.json(reps);
    })
});

router.get('/rep/:id', function(req,res){
    Rep.findById(req.params.id, function(err,rep) {
      if(err) throw err;
      else res.json(rep);
    });
  });

router.get('/party', (req,res) => {
    Party.getParties(function(err, parties){
        if(err) console.log(err);
        else res.json(parties);
    })
});

router.delete('/rep/:id', function(req,res){
    let query = {_id:req.params.id}
    Rep.remove(query,function(err){
        if(err){
            //console.log(err);
            res.send("Error");
        }
        else {
            Rep.getReps(function(err, reps){
                if(err) console.log(err);
                else res.json(reps);
            })
        }
    });
});

router.delete('/party/:id', function(req,res){
    let query = {_id:req.params.id}
    Party.remove(query,function(err){
        if(err){
            //console.log(err);
            res.send("Error");
        }
        else {
            Party.getParties(function(err, party){
                if(err) console.log(err);
                else res.json(party);
            })
        }
    });
});

router.post('/rep/edit/:id', function(req,res){
    var newRep = 
        {
            fname : req.body.fname,
            lname : req.body.lname,
            number : req.body.number,
            party : req.body.party,
            area : req.body.area,
            province : req.body.province,
            district : req.body.district,
            image : req.body.image
        };
    var query = {_id:req.params.id}

    Rep.updateOne(query, newRep, function(err){
        if(err){
            console.log(err);
            res.send("Error");
        }
        else {
            Rep.getReps(function(err, reps){
                if(err) console.log(err);
                else res.json(reps);
            })
        }
    });
});

module.exports = router;