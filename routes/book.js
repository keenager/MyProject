const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    if(!req.session.is_logined) {
        res.redirect('/');
    }
    res.render('bookSchedule', {
        is_logined: req.session.is_logined,
        nickname: req.session.nickname,
    });
})

module.exports = router;