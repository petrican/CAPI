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

  console.log('Sent TOKEN : ---->  ' + token);

  // decode token
  if (token) {
    // we verify the token against Redis first to see if is valid or not
    client.get(token, function (err, reply) {
      // console.log("Reply:"+reply);
      if (reply === null) {
        return res.json({ success: false, message: 'Invalid token.' });

      } else {
        // verifies secret and checks exp
        jwt.verify(token, config.secret, function (err, decoded) {
          if (err) {
            return res.json({ success: false, message: 'Failed to authenticate token.' });
          } else {
            // if everything is good, save to request for use in other routes
            req.decoded = decoded;
            next();
          }
        });
      }
    });

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
