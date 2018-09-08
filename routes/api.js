'use strict';

const express = require('express');
const router = express.Router();
const NewsAPI = require('newsapi');
const newsapi = new NewsAPI('1d6ffffb59a8449280549905550de6f8');
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
            multichain: info,
            name: "blockchain"
        });
        }
    });
});

// Create key pairs api
router.get('/config', (req, res) => {
    res.render('config');
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

router.get('/news', (req,res) => {
    newsapi.v2.topHeadlines({
        country: 'us'
      }).then(response => {
        res.render('news', {
            response: response
        });
      }, function(err) {
          console.log('KUY');
      });
    /*var url = 'https://newsapi.org/v2/top-headlines?' +
          'country=us&' +
          'apiKey=1d6ffffb59a8449280549905550de6f8';
    var req = new Request(url);
    fetch(req)
        .then(function(response) {
            res.render('news', {
                data: response.json()
            })
        })*/
})



module.exports = router;