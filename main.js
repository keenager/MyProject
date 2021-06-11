const express = require('express');
const app = express();
const helmet = require('helmet');
const indexRouter = require('./routes/index');
const calRouter = require('./routes/calendar');
const dietRouter = require('./routes/diet');

app.use(express.urlencoded({extended: false}));
app.use(express.static('public'));
app.use(helmet());
app.use('/', indexRouter);
app.use('/calendar', calRouter);
app.use('/diet', dietRouter);

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