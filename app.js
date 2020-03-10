var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var cors = require('cors');
const pool = require('generic-pool');;
var logger = require('morgan');
const bodyparser = require('body-parser');


var usersRouter = require('./routes/users');

var app = express();
var mysql = require("mysql");
app.use(bodyparser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyparser.json())
//Database connection

app.use('/api', usersRouter);


//mysql.createConnection('mysql://b3020c234f7bf9:c2f9aeec@eu-cdbr-west-02.cleardb.net/heroku_a055cf7e4179e62?reconnect=true').connect(done);
var mysqlConnection;
Reconnect = function *(db){

     mysqlConnection = db.connection = mysql.createConnection('mysql://b3020c234f7bf9:c2f9aeec@eu-cdbr-west-02.cleardb.net/heroku_a055cf7e4179e62?reconnect=true');

    try {

        console.log('test db>')

        yield cb => {mysqlConnection.connect(cb)};

        console.log('test db>', 'Ok')

    } catch (err) {

        console.log('open db error>', err);

        yield Reconnect(db);

        throw err

    };

    try {

        yield cb =>  db.connection.on('error',cb)

    } catch (err) {

        console.log('db error>', err);

        if((err.code === 'PROTOCOL_CONNECTION_LOST') || (err.code == 'ECONNRESET')) {

            console.log('try reconnect>')

            yield Reconnect(db);

        } else {

            throw err;

        }

    }

};
// var mysqlConnection = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "root",
//   database: "chat",
//    port: "8889",
//   multipleStatements: true
//
// });
app.use(cors());

const port = process.env.PORT || 3000;
app.listen(port,()=> console.log(`listen on port ${port}..`));
module.exports.mysqlcon = mysqlConnection;
