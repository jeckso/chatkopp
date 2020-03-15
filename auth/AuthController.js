var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

var VerifyToken = require('./VerifyToken');
var mysql = require('../database');
router.use(bodyParser.urlencoded({extended: false}));
router.use(bodyParser.json());


/**
 * Configure JWT
 */
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var bcrypt = require('bcryptjs');
var config = require('../config'); // get config file

router.post('/login', function (req, res) {
    var hashedPassword = bcrypt.hashSync(req.body.chat_pass, 8);

    mysql.query('SELECT `chat_name`, `chat_pass` FROM `credentials` WHERE `chat_name` = "' + req.body.chat_name + '"', function (error, results, fields) {
        if (error) return res.status(500).send("There was a problem logging in`.");
        if (results == 0) {
            return res.status(404).send("No chat with name ", req.body.chat_name, " found :(");
        } else {

            var passwordIsValid = bcrypt.compareSync(req.body.chat_pass, results[0].chat_pass);
            if (!passwordIsValid) return res.status(401).send({auth: false, token: null});
            var token = jwt.sign({id: req.body.chat_name}, config.secret, {
                expiresIn: 86400 // expires in 24 hours
            });
            res.status(200).send({auth: true, token: token});
        }


    });

    // User.findOne({ email: req.body.email }, function (err, user) {
    //     if (err) return res.status(500).send('Error on the server.');
    //     if (!user) return res.status(404).send('No user found.');
    //
    //     // check if the password is valid
    //     var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
    //     if (!passwordIsValid) return res.status(401).send({ auth: false, token: null });
    //
    //     // if user is found and password is valid
    //     // create a token
    //     var token = jwt.sign({ id: user._id }, config.secret, {
    //         expiresIn: 86400 // expires in 24 hours
    //     });
    //
    //     // return the information including token as JSON
    //     res.status(200).send({ auth: true, token: token });
    // });

});

router.get('/logout', function (req, res) {
    res.status(200).send({auth: false, token: null});
});
router.get('/:name', VerifyToken, function (req,res) {
    mysql.query(
        'SELECT * FROM "' + name + '" ORDER BY id DESC', function (error, results, fields) {
            if (error) throw error;
            res.send(results);
            //res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
        });

});
// router.post('/register', function (req, res) {
//
//     var hashedPassword = bcrypt.hashSync(req.body.chat_pass, 8);
//     mysql.query('Insert into temp_users(id) values (NULL)', function (err, user) {
//         console.log(err);
//         if (err) return res.status(500).send("There was a problem registering the user`.");
//
//         // if user is registered without errors
//         // create a token
//         var token = jwt.sign({id: req.body.chat_name}, config.secret, {
//             expiresIn: 86400 // expires in 24 hours
//         });
//        // res.redirect(307, '/auth/'+req.body.chat_name+'_chat').send({auth: true, token: token})
//              res.status(200).send({auth: true, token: token});
//     });
// });

router.post('/create', function(req,res){
    var hashedPassword = bcrypt.hashSync(req.body.chat_pass, 8);
    mysql.query('INSERT INTO `credentials` (`chat_name`, `chat_pass`) VALUES ("' + req.body.chat_name + '", "' + hashedPassword + '")', function (err, user) {
        if (err) return res.status(500).send("There was a problem creating chat`.");
        res.redirect(307, '/auth/login');
        //res.status(200).send("Chat created successfully!");

    });
    });

router.get('/me', VerifyToken, function (req, res, next) {


      //  if (err) return res.status(500).send("There was a problem finding the user.");
        // if (!user) return res.status(404).send("No user found.");
    res.status(200).send("MMM Let's have sex");
        // res.status(200).send(user);


});

module.exports = router;