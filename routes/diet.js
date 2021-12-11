const express = require('express');
const router = express.Router();
const dietmod = require('../lib/dietmod');

router.get('/', (req, res) => {
    if(!req.session.is_logined) {
        res.redirect('/');
    }
    res.header({
        'Content-Type': 'text/html',
        'Content-Security-Policy': `script-src 'self' https://cdn.jsdelivr.net`,
    }).render('diet', {
        is_logined: req.session.is_logined,
        nickname: req.session.nickname,
        title: 'Diet Manager',
    });
});

router.post('/db_write', (req, res) => {
    dietmod.db_write(req, res);
});

router.get('/db_read/:dateId', (req, res) => {
    dietmod.db_read(req, res);
});

module.exports = router;