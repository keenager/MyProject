const http = require('http');
const url = require('url');
const calmod = require('./lib/calmod');
const dietmod = require('./lib/dietmod');
const temp = require('./lib/temp');

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
    } else if(pathname === '/schedule.html'){
        calmod.html(request, response, pathname);
    } else if(pathname === '/schedule.js'){
        calmod.html(request, response, pathname);
    } else if(pathname === '/db_read'){
        calmod.db_read(request, response);
    } else if(pathname === '/db_write'){
        calmod.db_write(request, response);
    } else if(pathname === '/db_update_checked'){
        calmod.db_update_checked(request, response);
    } else if(pathname === '/db_delete'){
        calmod.db_delete(request, response);
    } else if(pathname === '/test_process'){
        calmod.test_process(request, response);
    } else if(pathname === '/diet'){
        dietmod.html(request, response, '/diet.html');
    } else{
        response.writeHead(404);
        response.end();
    }
});

app.listen(3000);