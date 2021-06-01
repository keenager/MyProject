exports.html = function(request, response){
    let temp = `
        <!DOCTYPE html>
        <html lang="ko">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Homepage</title>
        </head>
        <body>
            <h1>다이어트 관리 앱을 준비 중입니다...</h1>
        </body>
        </html>   
    `;
    response.writeHead(200);
    response.end(temp);
}