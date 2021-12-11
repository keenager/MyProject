const express = require('express');
const router = express.Router();
const scrapmod = require('../lib/scrapmod');

router.get('/', (req, res) => {
    // if(!req.session.is_logined){
    //     res.redirect('/');
    // }

    res.render('scrap', {
        is_logined: req.session.is_logined,
        nickname: req.session.nickname,
        title: 'Newspaper Scrap',
    });
});

router.get('/getArticles/:nameTopic', (req, res) => {
    scrapmod.getArticles(req, res);
});

module.exports = router;