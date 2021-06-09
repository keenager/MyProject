const fs = require('fs');
const url = require('url');
const qs = require('querystring');
const db = require('./db');

exports.html = function(request, response, pathname){
    fs.readFile(__dirname + '/../html' + pathname, 'utf-8', (error, data)=>{
        if(error) throw error;
        response.writeHead(200);
        response.end(data);
    });
}

exports.db_write = function(request, response){
    let body = '';
    request.on('data', function(data){
        body += data;
    });
    request.on('end', function(){
        let post = qs.parse(body);
        db.query('INSERT INTO diet (date, weight) VALUES (?, ?) ON DUPLICATE KEY UPDATE weight=?',
                [post.dateId, post.weight, post.weight], 
                function(error, result){
                    if(error) throw error;
                    response.writeHead(302, {Location: '/schedule.html?dateId=' + post.dateId});
                    response.end();
                });
    });
}

exports.db_read = function(req, res){
    db.query('SELECT * FROM diet WHERE date=?', [req.params.dateId], function(error, result){
        if(error) throw error;
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(result));
    });
}