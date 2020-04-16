var express = require('express');
var router = express.Router();
var app = express();
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('../config'); // get our config file

var cors = require('cors')
var bodyParser = require("body-parser");
var fs = require('fs');
var mysql = require('../database.js');
/* GET users listing. */
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

router.get('/chat', function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    fs.readFile('./views/index.html', null, function (error, data) {
        if (error) {
            res.writeHead(404);
            res.write('File not found!');
        } else {
            res.write(data);
        }
        res.end();
    });
});
router.get('/chat/private/login/', function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    fs.readFile('./views/private_login.html', null, function (error, data) {
        if (error) {
            res.writeHead(404);
            res.write('File not found!');
        } else {
            res.write(data);
        }
        res.end();
    });
});
router.get('/chat/private/register/', function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    fs.readFile('./views/private_register.html', null, function (error, data) {
        if (error) {
            res.writeHead(404);
            res.write('File not found!');
        } else {
            res.write(data);
        }
        res.end();
    });
});

router.post('/', function (req, res) {
    var token = req.cookies.token || '';
    if (!token) {
        mysql.query(
            'CALL insert_message("' + req.body.$name + '","' + req.body.$message + '",1)', function (error, results, fields) {
                if (error) throw error;
                return res.send(results);
                //res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
            });
    } else {


        jwt.verify(token, config.secret, function (err, decoded) {
            if (err)
                return res.status(500).send({auth: false, message: 'Failed to authenticate token.'});
            mysql.query(
                'CALL insert_message("' + req.body.$name + '","' + req.body.$message + '",' + decoded.id + ')', function (error, results, fields) {
                    if (error) throw error;
                    return res.send(results);
                    //res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
                });


        });
    }

});
router.get('/', function (req, res) {

    console.log(req.headers);
    var token = req.cookies.token || '';
    console.log(token);
    if (!token) {
        mysql.query(
            'CALL select_messages(1)', function (error, results, fields) {
                if (error) throw error;
                return res.send(results);
                //res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
            });
    } else {


        jwt.verify(token, config.secret, function (err, decoded) {
            if (err)
                return res.status(500).send({auth: false, message: 'Failed to authenticate token.'});
            mysql.query(
                'CALL select_messages(' + decoded.id + ')', function (error, results, fields) {
                    if (error) throw error;
                    return res.send(results);
                    //res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
                });


        });
    }
});


module.exports = router;