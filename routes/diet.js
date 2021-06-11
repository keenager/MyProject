const express = require('express');
const router = express.Router();
const dietmod = require('../lib/dietmod');
const template = require('../lib/template');

router.get('/', (req, res) => {
    template.diet(req, res);
});

router.post('/db_write', (req, res) => {
    dietmod.db_write(req, res);
});

router.get('/db_read/:dateId', (req, res) => {
    dietmod.db_read(req, res);
});

module.exports = router;