const express = require('express');
const router = express.Router();
const calmod = require('../lib/calmod');
const template = require('../lib/template');

router.get('/', (req, res) => {
    template.calendar(req, res);
});

router.get('/schedule/:dateId', (req, res) => {
    template.schedule(req, res);
});

router.get('/db_read/:dateId', (req, res) => {
    calmod.db_read(req, res);
});

router.post('/db_write', (req, res) => {
    calmod.db_write(req, res);
});

router.get('/db_update_checked/:id/:checked', (req, res) => {
    calmod.db_update_checked(req, res);
});

router.get('/db_delete/:id', (req, res) => {
    calmod.db_delete(req, res);
});

module.exports = router;