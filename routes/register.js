var express = require('express');
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('../config'); // get our config file
var router = express.Router();

var mongoose = require('mongoose');
var User = require('../models/User.js');

// route to register a user (POST http://localhost:8080/api/register)
router.post('/', function (req, res) {

    // console.log(req.body);    

    var userdata = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        facebookId: '',
        firstName: req.body.firstName,
        lastName: req.body.lastName
    });

    //res.json(req.body);

    userdata.save(function (err, userdata) {
        if (err) {
            console.log(err);
            var err_result = { success: false, error: 'Could not register user' };
            res.json(err_result);
        } else {
            //res.json(userdata); 
            console.log('Sucess:', userdata);
            res.json({
                "success": true,
                message: "Account created successfully"
            })
        }
    });

});

/**
 *  GET not allowed
 */
router.get('/', function (req, res) {
    var err_result = { success: false, error: 'Not allowed.' };
    res.json(err_result);
});

module.exports = router;
