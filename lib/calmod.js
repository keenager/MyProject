const fs = require('fs');
const url = require('url');
const db = require('./db');
const qs = require('querystring');

exports.html = function(request, response, pathname){
    fs.readFile(__dirname + '/../html' + pathname, 'utf-8', (error, data)=>{
        if(error) throw error;
        response.writeHead(200);
        response.end(data);
    });
}

exports.db_read = function(request, response){
    let queryData = url.parse(request.url, true).query;

    db.query('SELECT * FROM schedule WHERE date=?', [queryData.dateId], function(error, schedules){
        if(error) throw error;
        response.writeHead(200, {'Content-Type': 'application/json'});
        response.end(JSON.stringify(schedules));
    });
}

exports.db_write = function(request, response){
    let body = '';
    request.on('data', function(data){
        body += data;
    });
    request.on('end', function(){
        let post = qs.parse(body);
        db.query('INSERT INTO schedule (date, schedule, checked) VALUES (?, ?, ?)',
                [post.dateId, post.schedule, 0], 
                function(error, schedule){
                    if(error) throw error;
                    response.writeHead(302, {Location: '/schedule.html?dateId=' + post.dateId});
                    response.end();
                });
    });
}

exports.db_update_checked = function(request, response){
    let queryData = url.parse(request.url, true).query;
    if(queryData.checked == 1){
        db.query('UPDATE schedule SET checked=? WHERE id=?', [0, queryData.id], function(error, result){
            if(error) throw error;
            response.writeHead(200);
            response.end();
        }); 
    }else{
        db.query('UPDATE schedule SET checked=? WHERE id=?', [1, queryData.id], function(error, result){
            if(error) throw error;
            response.writeHead(200);
            response.end();
        });
    }
}

exports.db_delete = function(request, response){
    let queryData = url.parse(request.url, true).query;
    db.query('DELETE FROM schedule WHERE id=?',
            [queryData.id],
            function(error, result){
                if(error) throw error
                response.writeHead(200);
                response.end();
    });
}

exports.test_process = function(requrest, response){
    response.writeHead(200);
    response.end('fetch success!!');
}