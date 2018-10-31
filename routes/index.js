'use strict'

const express = require('express');
const router = express.Router();


router.get('/', (req,res) => {
    res.send('/electioner-angular/index.html');
})

router.get('/admin', (req,res) => {
    res.send('/admin/index.html');
})
module.exports = router;