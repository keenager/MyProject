const fs = require('fs');

exports.src = function(request, response, pathname){
    fs.readFile(__dirname + pathname, 'utf-8', (error, data)=>{
        if(error) throw error;
        response.writeHead(200);
        response.end(data);
    });
}

exports.html = function(request, response, pathname){
    fs.readFile(__dirname + '/../html' + pathname, 'utf-8', (error, data)=>{
        if(error) throw error;
        response.writeHead(200);
        response.end(data);
    });
}