'use strict';

const express = require('express');
const router = express.Router();
const Rep = require('../models/representative');
const Party = require('../models/party');
const Election = require('../models/election');
const qrcode = require('qrcode');
const util = require('util')


const multichain = require("multichain-node")(global.config);

router.get('/list/elections', async (req, res) => {
    try {
        const elections = await Election.find();
        res.json(elections);
    } catch (error) {
        res.status(500).json(e.message);
    }
});

// Create an election
router.post('/create/election', async (req, res) => {
    try {
        const election = new Election({
            active: false,
            name: req.body.name,
            publicKey: req.body.publicKey,
            privateKey: ""
        })
        const create = util.promisify(multichain.create);
        const subscribe = util.promisify(multichain.subscribe);
        const createElection = await create({
            type: "stream",
            name: req.body.name,
            open: true
        });
        const subscribeStream = await subscribe({stream: req.body.name});
        const saved = await election.save();
        res.json(saved);
    }
    catch (e) {
        console.log(e);
        res.status(500).json(e.message);
    }
});

//Closed and set decryption for an election
router.post('/set/key', async (req, res) => {
    try {
        const key = {
            privateKey: req.body.privateKey
        }
        const query = { name: req.body.name }
        const newKey = await Election.updateOne(query, key);
        res.json(newKey);
    }
    catch (e) {
        console.log(e);
        res.status(500).json(e.message);
    }
});

router.post('/election/start', async (req, res) => {
    try {
        const query = { name: req.body.name };
        const started = await Election.updateOne(query, { active: true });
        res.json(started);
    }
    catch (e) {
        console.log(e);
        res.status(500).json(e.message);
    }
});

router.post('/election/stop', async (req, res) => {
    try {
        const query = { name: req.body.name };
        const stopped = await Election.updateOne(query, { active: false });
        res.json(stopped);
    }
    catch (e) {
        console.log(e);
        res.status(500).json(e.message);
    }
});

router.post('/add_rep', async (req, res) => {
    try {
        var newRep = new Rep(
            {
                fname: req.body.fname,
                lname: req.body.lname,
                dob: req.body.dob,
                party: req.body.party,
                district: req.body.district,
                url: req.body.url
            }
        );
        const rep = await newRep.save();
        res.json(rep);
    }
    catch (e) {
        console.log(e);
        res.status(500).json(e.message);
    }
});

//Add a party
router.post('/add_party', async (req, res) => {
    try {
        const newParty = new Party({
            name: req.body.name,
            number: req.body.number,
            url: req.body.url
        }
        );
        const party = await newParty.save();
        res.json(party);
    }
    catch (e) {
        console.log(e);
        res.status(500).json(e.message);
    }
});

//Get a list of representatives
router.get('/rep', async (req, res) => {
    try {
        const reps = await Rep.getReps();
        res.json(reps);
    }
    catch (e) {
        console.log(e);
        res.status(500).json(e.message);
    }
});

//Get a representative by id
router.get('/rep/:id', async (req, res) => {
    try {
        const rep = await Rep.findById(req.params.id);
        res.json(rep);
    }
    catch (e) {
        console.log(e);
        res.status(500).json(e.message);
    }
});

//Get a representative by area
router.get('/area/:id', async function (req, res) {
    try {
        const rep = await Rep.getRepByDistrict(req.params.id);
        res.json(rep);
    }
    catch (e) {
        console.log(e);
        res.status(500).json(e.message);
    }
});

// Get a party by id
router.get('/party/:id', async (req, res) => {
    try {
        const party = await Party.findById(req.params.id);
        res.json(party);
    }
    catch (e) {
        console.log(e);
        res.status(500).json(e.message);
    }
});

//Get a list of parties
router.get('/party', async (req, res) => {
    try {
        const parties = await Party.getParties();
        res.json(parties);
    }
    catch (e) {
        console.log(e);
        res.status(500).json(e.message);
    }
});

//Query reps by party name
router.post('/listreps', async (req, res) => {
    try {
        const reps = await Rep.getRepByParty(req.body.party);
        res.json(reps);
    }
    catch (e) {
        console.log(e);
        res.status(500).json(e.message);
    }
});

//Delete a representative
router.delete('/rep/:id', async (req, res) => {
    try {
        const query = { _id: req.params.id }
        const deleted = await Rep.deleteOne(query);
        res.json(deleted);
    }
    catch (e) {
        console.log(e);
        res.status(500).json(e.message);
    }
});

//Delete party
router.delete('/party/:id', async (req, res) => {
    try {
        const query = { _id: req.params.id }
        const deleted = await Party.deleteOne(query);
        res.json(deleted);
    }
    catch (e) {
        console.log(e);
        res.status(500).json(e.message);
    }
});

//Update a representative
router.post('/rep/edit/:id', async (req, res) => {
    try {
        const newRep =
        {
            fname: req.body.fname,
            lname: req.body.lname,
            dob: req.body.dob,
            party: req.body.party,
            district: req.body.district,
            url: req.body.url
        };
        const query = { _id: req.params.id }
        const rep = await Rep.updateOne(query, newRep);
        res.json(rep);
    }
    catch (e) {
        console.log(e);
        res.status(500).json(e.message);
    }
});

//Update a party
router.post('/party/edit/:id', async (req, res) => {
    try {
        const newParty = {
            name: req.body.name,
            number: req.body.number,
            url: req.body.url
        };
        const query = { _id: req.params.id }
        const party = await Party.updateOne(query, newParty);
        res.json(party);
    }
    catch (e) {
        console.log(e);
        res.status(500).json(e.message);
    }
});

router.post('/qr', async (req, res) => {
    try {
        const data = req.body.data;
        const qrImg = await qrcode.toDataURL(data);
        res.json(qrImg);
    }
    catch (e) {
        console.log(e);
        res.status(500).json(e.message);
    }
});

module.exports = router;