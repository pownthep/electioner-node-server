'use strict'

const express = require('express');
const router = express.Router();


router.get('/', (req,res) => {
    res.send('/electioner/index.html');
})

router.get('/admin', (req,res) => {
    res.send('/admin/index.html');
})

router.get('/index', (req,res) => {
    res.send('/electioner/index.html');
})
module.exports = router;