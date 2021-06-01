const http = require('http');
const url = require('url');
const calmod = require('./lib/calmod');

let app = http.createServer(function(request, response){
    let _url = request.url; // 포트번호 뒷부분('/'부터)
    let queryData = url.parse(_url, true).query; // '?' 뒷부분
    let pathname = url.parse(_url, true).pathname;  // '/'부터 '?' 앞까지

    if(pathname === '/'){
        calmod.html(request, response, '/index.html')
    } else if(pathname === '/calendar'){
        calmod.html(request, response, '/calendar.html');
    } else if(pathname === '/calendar.css'){
        calmod.html(request, response, pathname);
    } else if(pathname === '/calendar.js'){
        calmod.html(request, response, pathname);
    } else if(pathname === '/inputWindow.html'){
        calmod.html(request, response, pathname);
    } else if(pathname === '/todolist.html'){
        calmod.html(request, response, pathname);
    } else if(pathname === '/todolist.js'){
        calmod.html(request, response, pathname);
    } else if(pathname === '/db_process'){
        calmod.db_process(request, response);
    } else{
        response.writeHead(404);
        response.end();
    }
});

app.listen(3000);