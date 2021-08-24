const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    if(!req.session.is_logined) {
        res.redirect('/');
    }
    res.render('bookSchedule', {
        is_logined: req.session.is_logined,
        nickname: req.session.nickname,
        template: `a.closebtn(href='javascript:void(0)') &times;
                    <a href='/'> Home </a>
                    a(href='/calendar') Calendar
                    a(href='/case') Case Search
                    a(href='/diet') Diet Management
                    a(href='/book') Book Schedule
                    a(href='/scrap') Scrap`
    });
})

module.exports = router;