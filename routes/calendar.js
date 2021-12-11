const express = require('express');
const router = express.Router();
const calmod = require('../lib/calmod');
// router에서 단순 /이면 /현재날짜 로 인식, 그외에 /:yearMonth
router.get('/', (req, res) => {
    if(!req.session.is_logined) {
        res.redirect('/');
    }
    let date = new Date();

    res.render('calendar', {
        is_logined: req.session.is_logined,
        nickname: req.session.nickname,
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        title: 'Calendar',
    });
});

router.get('/:yearMonth', (req, res) => {
    if(!req.session.is_logined) {
        res.redirect('/');
    }
    let arr = req.params.yearMonth.split('-');

    res.render('calendar', {
        is_logined: req.session.is_logined,
        nickname: req.session.nickname,
        year: arr[0],
        month: +arr[1],
    });
});

router.get('/schedule/:dateId', (req, res) => {
    if(!req.session.is_logined) {
        res.redirect('/');
    }
    res.render('schedule', {
        dateId: req.params.dateId,
    });
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