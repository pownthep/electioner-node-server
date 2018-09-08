'use strict'

const express = require('express');
const router = express.Router();


// Get Homepage
router.get('/', (req, res) => {
  res.render('index',{
    login: false,
    name: 'home'
  });
});

// About us route
router.get('/about', (req, res) => {
  res.render('about', {
    name: "about"
  });
});

router.get('/result', (req,res) => {
  res.render('graph');
});


module.exports = router;