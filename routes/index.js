'use strict'

const express = require('express');
const router = express.Router();


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




module.exports = router;