var express = require('express');
var router = express.Router();
var app = express();
var cors = require('cors')
var http = require('http');
var fs = require('fs');
var mysql = require('../app.js');
/* GET users listing. */

router.get('/chat', function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    fs.readFile('./views/index.html', null, function(error, data) {
        if (error) {
            res.writeHead(404);
            res.write('File not found!');
        } else {
            res.write(data);
        }
        res.end();
    });
});

router.get('/', function (req, res) {
    mysql.mysqlcon.query(
        'SELECT * FROM messages', function (error, results, fields) {
        if (error) throw error;
      res.send(results);
        //res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
    });
});


module.exports = router;