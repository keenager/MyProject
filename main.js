var http = require('http');
var url = require('url');

var app = http.createServer(function(request, response){
    var _url = request.url; // 포트번호 뒷부분('/'부터)
    var queryData = url.parse(_url, true).query; // '?' 뒷부분
    var pathname = url.parse(_url, true).pathname;  // '/'부터 '?' 앞까지

    if(pathname === '/'){

        response.writeHead(200);
        response.end('Success!');
    }else{
        response.writeHead(404);
        response.end();
    }
});

app.listen(3000);