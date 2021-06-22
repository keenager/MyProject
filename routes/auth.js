const express = require('express');
const router = express.Router();
const userData = require('./userData');

router.get('/login', (req, res) => {
    res.render('login');
    console.log(userData);
});

router.post('/login_process', (req, res) => {

    function isMember(userData) {
        for (let user in userData) {
            if(req.body.id === user && req.body.password === userData[user].password) return true
        }
        return false
    }

    if(isMember(userData)) {
        req.session.is_logined = true;
        req.session.nickname = userData[req.body.id].nickname;
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