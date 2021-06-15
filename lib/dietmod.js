const db = require('./db');

exports.db_write = function(req, res){
    let post = req.body;
    db.query('INSERT INTO diet (date, weight) VALUES (?, ?) ON DUPLICATE KEY UPDATE weight=?',
            [post.dateId, post.weight, post.weight], 
            function(error, result){
                if(error) throw error;
                res.redirect('/calendar/schedule/' + post.dateId);
            });
}

exports.db_read = function(req, res){
    db.query('SELECT * FROM diet WHERE date=?', [req.params.dateId], function(error, result){
        if(error) throw error;
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(result));
    });
}