const express = require('express');
const router = express.Router();
const userData = require('./userData');

const authData = {
    email: userData.naivesky.email,
    password: userData.naivesky.password,
    nickname: userData.naivesky.nickname,
}

router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/login_process', (req, res) => {
    if(req.body.email === authData.email && req.body.password === authData.password) {
        req.session.is_logined = true;
        req.session.nickname = authData.nickname;
        req.session.save( () => res.redirect('/') );
    } else {
        res.send('누구세요?');
    }
});

router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        res.redirect('/');
    });
});


module.exports = router;