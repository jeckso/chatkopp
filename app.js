var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var cors = require('cors');

var logger = require('morgan');
const bodyparser = require('body-parser');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
var mysql = require("mysql");

//Database connection
app.use(bodyparser.json());
app.use('/api', usersRouter);


var mysqlConnection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "chat",
   port: "8889",
  multipleStatements: true

});
app.use(cors());

const port = process.env.PORT || 3000;
app.listen(port,()=> console.log(`listen on port ${port}..`));
module.exports.mysqlcon = mysqlConnection;
