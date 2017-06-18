var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('../config'); // get our config file

var redis = require('redis');
var client = redis.createClient(); //creates a new client

// route middleware to verify a token
router.use(function (req, res, next) {

  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  // decode token
  if (token) {
    // connect to Redis and remove the token. This way the user will be logged out
    client.del(token, function (err, reply) {
      console.log('Logout request');
    });
    var logout_result = { success: true, message: 'User is logged out.' };
    res.json(logout_result);

  } else {

    // if there is no token
    // return an error
    return res.status(403).send({
      success: false,
      message: 'No token provided.'
    });

  }
});

module.exports = router;