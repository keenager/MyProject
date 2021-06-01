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
        let scd = '';
        let i = 0;
        while(i < schedules.length){
            scd = scd + schedules[i].schedule;
            if(i != schedules.length-1) scd += '\n';
            i++;
        }
        response.writeHead(200);
        response.end(scd);
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
                    response.writeHead(302, {Location: '/calendar'});
                    response.end();
                });
    });

    
}


exports.test_process = function(requrest, response){
    response.writeHead(200);
    response.end('fetch success!!');
}