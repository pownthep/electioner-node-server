'use strict'

const express = require('express');
const router = express.Router();


router.get('/', (req,res) => {
    res.send('index.html');
})

router.get('/admin', (req,res) => {
    res.sendFile('index.html');
})

router.get('/index', (req,res) => {
    res.send('/electioner/index.html');
})
module.exports = router;