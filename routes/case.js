const express = require('express');
const router = express.Router();
const casemod = require('../lib/casemod');

router.get('/', (req, res) => {
    if(!req.session.is_logined) {
        res.redirect('/');
    }
    res.render('case', {
        is_logined: req.session.is_logined,
        nickname: req.session.nickname,
    });
});

router.get('/cookie_read', (req, res) => {
    casemod.cookie_read(req, res);
});

router.post('/cookie_write', (req, res) => {
    casemod.cookie_write(req, res);
});

router.get('/caseList_read', (req, res) => {
    casemod.caseList_read(req, res);
});

router.get('/caseContent_read/:caseNumber', (req, res) => {
    casemod.caseContent_read(req, res);
})

module.exports = router;