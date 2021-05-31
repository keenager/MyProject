const http = require('http');
const url = require('url');
const fs = require('fs');
const calmod = require('./lib/calmod');

let app = http.createServer(function(request, response){
    let _url = request.url; // 포트번호 뒷부분('/'부터)
    let queryData = url.parse(_url, true).query; // '?' 뒷부분
    let pathname = url.parse(_url, true).pathname;  // '/'부터 '?' 앞까지

    if(pathname === '/'){

        response.writeHead(200);
        response.end('Success!');
    } else if(pathname === '/calendar'){
        calmod.html(request, response, '/index.html');
    } else if(pathname === '/calendar.css'){
        calmod.src(request, response, pathname);
    } else if(pathname === '/calendar.js'){
        calmod.src(request, response, pathname);
    } else if(pathname === '/inputWindow.html'){
        calmod.html(request, response, pathname);
    } else if(pathname === '/todolist.html'){
        calmod.html(request, response, pathname);
    } else if(pathname === '/todolist.js'){
        calmod.src(request, response, pathname);
    } else{
        response.writeHead(404);
        response.end();
    }
});

app.listen(3000);