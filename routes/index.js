'use strict'

const express = require('express');
const router = express.Router();


router.get('/test', (req,res) => {
    res.send(global.config);
})

router.get('/admin', (req,res) => {
    res.sendFile('index.html');
})

router.get('/index', (req,res) => {
    res.send('/electioner/index.html');
})
module.exports = router;