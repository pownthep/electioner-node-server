'use strict'

const express = require('express');
const router = express.Router();
const multichain = require("multichain-node")({
    port: 6758,
    host: '178.128.27.70',
    user: "multichainrpc",
    pass: "HpE3acAYinEcBoV1sBkMS9FnqeTY86rm5pQz6Mky7MRZ"
});

// Get Homepage
router.get('/', (req, res) => {
  res.render('index',{
	  login: false
  });
});

// About us route
router.get('/about', (req, res) => {
  res.render('about');
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

module.exports = router;