const express = require('express');
const app = express();
app.use(express.urlencoded({extended: false}));
app.use(express.static('public'));

// const helmet = require('helmet');
// app.use(helmet());

const session = require('express-session');
const FileStore = require('session-file-store')(session);
app.use(session({
    secret: 'akhgalkdhfk',
    resave: false,
    saveUninitialized: true,
    store: new FileStore({}),
}));

app.set('views', './views');
app.set('view engine', 'pug');

const indexRouter = require('./routes/index');
const calRouter = require('./routes/calendar');
const dietRouter = require('./routes/diet');
const authRouter = require('./routes/auth');
const scrapRouter = require('./routes/scrap');
app.use('/', indexRouter);
app.use('/calendar', calRouter);
app.use('/diet', dietRouter);
app.use('/auth', authRouter);
app.use('/scrap', scrapRouter);

app.use( (req, res, next) => {
    res.status(404).send(`Sorry can't find that.`);
});

app.use( (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

const PORT = 80;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
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