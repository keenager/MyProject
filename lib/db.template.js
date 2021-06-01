const mysql = require('mysql');
const db = mysql.createConnection({
    host : '',
    user : '',
    password : '',
    database : 'calendar'
});
db.connect();

module.exports = db;
