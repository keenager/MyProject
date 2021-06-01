const fs = require('fs');
//const db = require('./db');

exports.html = function(request, response, pathname){
    fs.readFile(__dirname + '/../html' + pathname, 'utf-8', (error, data)=>{
        if(error) throw error;
        response.writeHead(200);
        response.end(data);
    });
}
/*
exports.db_process = function(request, response){

    let temp = 'post 방식으로 쿼리데이터에 dateId 받아와서 request.on 으로 분석?';

    db.query('SELECT * FROM schedule WHERE date=?', [dateId], function(error, schedules){
        if(error) throw error;
        scd = schedules[0].schedule;
    });
}
*/

exports.test_process = function(requrest, response){
    response.writeHead(200);
    response.end('fetch success!!');
}