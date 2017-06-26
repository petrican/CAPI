var express = require('express');
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('../config'); // get our config file
var router = express.Router();

var mongoose = require('mongoose');
var User = require('../models/User.js');

// Conn to redis as we store in there the token
var redis = require('redis');
var client = redis.createClient(); //creates a new client


// route to authenticate a user (POST http://localhost:3000/api/authenticate)
router.post('/', function (req, res) {

  console.log('To Authenticate: '  + req.body.username);

  // find the user
  User.findOne({
    'username': req.body.username
  }, function (err, user) {

    if (err) throw err;

    if (!user) {
      res.json({ success: false, message: 'Authentication failed. User not found.' });
    } else if (user) {

      // test a matching password
      user.comparePassword(req.body.password, function (err, isMatch) {
        if (err) throw err;
        // console.log(req.body.password, isMatch); // true
        if (!isMatch) {
          res.json({ success: false, message: 'Authentication failed. Wrong password.' });
        } else {
          // if user is found and password is right
          // create a token
          var token = jwt.sign(user, config.secret, {
            expiresIn: 86400 // expires in 24 hours
          });

          console.log('Writting to Redis');
          console.log('Key ->' + user.username);
          console.log('Token ->' + token);

          client.set(token, user.username);

          // return the information including token as JSON
          res.json({
            success: true,
            message: 'Enjoy your token!',
            token: token
          });
        }
      });
    }
  });
});

module.exports = router;
