const fs = require('fs');
const url = require('url');
const db = require('./db');

exports.home = (req, res) => {
    fs.readFile('index.html', (error, data) => {
        if(error) throw error;
        res.send(data);
    });
}

exports.html = function(req, res){
    fs.readFile(`${__dirname}/../${req.params.category}`, 'utf-8', (error, data)=>{
        if(error) throw error;
        res.send(data);
    });
}

exports.db_write = function(req, res){
    let post = req.body;
    db.query('INSERT INTO schedule (date, schedule, checked) VALUES (?, ?, ?)',
            [post.dateId, post.schedule, 0], 
            function(error, schedule){
                if(error) throw error;
                res.redirect('/schedule.html?dateId=' + post.dateId);
            });
}

exports.db_read = function(req, res){
    db.query('SELECT * FROM schedule WHERE date=?', [req.params.dateId], function(error, schedules){
        if(error) throw error;
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(schedules));
    });
}

exports.db_update_checked = function(req, res){
    //let queryData = url.parse(request.url, true).query;
    if(req.params.checked == 1){
        db.query('UPDATE schedule SET checked=? WHERE id=?', [0, req.params.id], function(error, result){
            if(error) throw error;
            res.send();
        }); 
    }else{
        db.query('UPDATE schedule SET checked=? WHERE id=?', [1, req.params.id], function(error, result){
            if(error) throw error;
            res.send();
        });
    }
}

exports.db_delete = function(req, res){
    //let queryData = url.parse(request.url, true).query;
    db.query('DELETE FROM schedule WHERE id=?',
            [req.params.id],
            function(error, result){
                if(error) throw error
                res.send();
    });
}

exports.test_process = function(requrest, response){
    response.send('fetch success!!');
}