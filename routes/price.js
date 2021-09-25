const express = require('express');
const router = express.Router();
const pricemod = require('../lib/pricemod');

router.get('/', (req, res) => {
    res.render('priceCompare');
});

router.get('/get_prices/:mart/:qs', (req, res) => {
    pricemod.get_prices(req, res);
});


module.exports = router;