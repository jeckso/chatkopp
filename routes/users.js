var express = require('express');
var router = express.Router();
var app = express();
var cors = require('cors')
var mysql = require('../app.js');
/* GET users listing. */


router.get('/', function (req, res) {
    mysql.mysqlcon.query(
        'SELECT * FROM messages', function (error, results, fields) {
        if (error) throw error;
      res.send(results);
        //res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
    });
});


module.exports = router;