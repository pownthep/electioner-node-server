'use strict'

const express = require('express');
const router = express.Router();


router.get('/', (req,res) => {
    res.send('electioner-angular/index.html');
})
module.exports = router;