//const http = require('http');
//const url = require('url');
const express = require('express');
const app = express();
const calmod = require('./lib/calmod');
const dietmod = require('./lib/dietmod');
//const temp = require('./lib/temp');

app.use(express.urlencoded({extended: false}));
app.use(express.static('public'));


app.get('/calendar', (req, res) => {
    res.sendFile(__dirname + '/public/calendar.html');
});

app.get('/calendar/schedule', (req, res) => {
    res.sendFile(__dirname + '/public/schedule.html');
});

app.get('/diet', (req, res) => {
    res.sendFile(__dirname + '/public/diet.html');
});

app.get('/calendar/db_read/:dateId', (req, res) => {
    calmod.db_read(req, res);
});

app.post('/calendar/db_write', (req, res) => {
    calmod.db_write(req, res);
});

app.get('/db_update_checked/:id/:checked', (req, res) => {
    calmod.db_update_checked(req, res);
});

app.get('/db_delete/:id', (req, res) => {
    calmod.db_delete(req, res);
});

app.post('/diet/db_write', (req, res) => {
    dietmod.db_write(req, res);
});

app.get('/diet/db_read/:dateId', (req, res) => {
    dietmod.db_read(req, res);
});

app.get('/test_process', (req, res) => {
    caltmod.test_process(req, res);
});

app.use( (req, res, next) => {
    res.status(404).send(`Sorry can't find that.`);
});

app.use( (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(3000, () => {
    console.log('App is listening on port 3000!')
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