const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('index', {
        is_logined: req.session.is_logined,
        nickname: req.session.nickname,
    });
});

module.exports = router;