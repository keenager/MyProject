//const http = require('http');
//const url = require('url');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const calmod = require('./lib/calmod');
const dietmod = require('./lib/dietmod');
//const temp = require('./lib/temp');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static('public'));


app.get('/db_read_calendar/:dateId', (req, res) => {
    calmod.db_read(req, res);
});

app.post('/db_write_calendar', (req, res) => {
    calmod.db_write(req, res);
});

app.get('/db_update_checked/:id/:checked', (req, res) => {
    calmod.db_update_checked(req, res);
});

app.get('/db_delete/:id', (req, res) => {
    calmod.db_delete(req, res);
});

app.get('/db_write_diet', (req, res) => {
    dietmod.db_write(req, res);
});

app.get('/db_read_diet/:dateId', (req, res) => {
    dietmod.db_read(req, res);
});

app.get('/test_process', (req, res) => {
    caltmod.test_process(req, res);
});

/*
let app = http.createServer(function(request, response){
    let _url = request.url; // 포트번호 뒷부분('/'부터)
    let queryData = url.parse(_url, true).query; // '?' 뒷부분
    let pathname = url.parse(_url, true).pathname;  // '/'부터 '?' 앞까지

    if(pathname === '/'){
    } else if(pathname === '/calendar'){
    } else{
        response.writeHead(404);
        response.end();
    }
}); */

app.listen(3000, () => {
    console.log('App is listening on port 3000!')
});