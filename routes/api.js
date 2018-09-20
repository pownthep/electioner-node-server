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
            party : req.body.party,
            area : req.body.code,
            province : req.body.province,
            district : req.body.district,
            sub_district :req.body.sub_district,
            url : req.body.image_url2,
            key : req.body.key
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
        if(err) console.log(err);
        else console.log("Successful saved");
    });
});

router.get('/rep', (req,res) => {
    Rep.getReps(function(err, reps){
        if(err) console.log(err);
        else res.json(reps);
    })
});

router.get('/party', (req,res) => {
    Party.getParties(function(err, parties){
        if(err) console.log(err);
        else res.json(parties);
    })
});
module.exports = router;