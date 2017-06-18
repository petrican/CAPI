var express = require('express');
var https = require('https');
var router = express.Router();
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('../config'); // get our config file

var mongoose = require('mongoose');
var User = require('../models/User.js');

var redis = require('redis');
var client = redis.createClient(); //creates a new client

/* GET home page. */
router.get('/', function (req, res, next) {
	res.json({ message: 'Invalid request.' });
});

/* POST  this is where the actual logic happens. */
router.post('/', function (req, res, next) {
	// res.render('index', { title: 'Express' });
	if (req.body.fb_access_token != '') {

		var fb_graph_url = 'https://graph.facebook.com/me?access_token=' + req.body.fb_access_token;

		https.get(fb_graph_url, function (res_fb) {
			body = '';

			res_fb.on('data', function (chunk) {
				body += chunk;
				// console.log(chunk);
			});

			res_fb.on('end', function () {
				fbResponse = JSON.parse(body);

				console.log("FB ID:" + fbResponse.id);
				console.log("Got a response: " + fbResponse);

				if (typeof fbResponse.id != 'undefined') {
					// authenticated - find the user that corresponds to the FB ID
					User.findOne({
						email: fbResponse.email
					}, function (err, user) {

						if (err) throw err;

						if (!user) {
							// res.json({ success: false, message: 'Authentication failed. User not found.' });
							// add here routine to add the new user with the info taken from FB

							var full_name = fbResponse.name;

							var userdata = new User({
								username: full_name.replace(" ", "") + (Math.floor(Math.random() * 100) + 1),
								email: fbResponse.email,
								password: config.randomPassword,  // rand p
								facebookId: fbResponse.id,
								gender: fbResponse.gender,
								firstName: fbResponse.first_name,
								lastName: fbResponse.last_name
							});

							// res.json(req.body);

							userdata.save(function (err, data) {
								if (err) {
									// console.log(err);
									var err_result = { success: false, error: 'Could not register user with parsed FB info.' };
									res.json(err_result);
								} else {
									// user is created - we return the token
									var token = jwt.sign(userdata, config.secret, {
										expiresIn: 86400 // expires in 24 hours
									});

									// we also push the token to redis
									client.set(token, 'set', function (err, reply) {
										// console.log(reply);
									});

									// return the information including token as JSON
									res.json({
										success: true,
										username: userdata.username,
										email: userdata.email,
										message: 'Authenticated',
										token: token
									});
								}
							});

						} else if (user) {

							// save the FBID -  we create the token
							var token = jwt.sign(user, config.secret, {
								expiresIn: 86400 // expires in 24 hours
							});

							// we also push the token to redis
							client.set(token, 'set', function (err, reply) {
								// console.log(reply);
							});

							// return the information including token as JSON
							res.json({
								success: true,
								id: user._id,
								username: user.username,
								email: user.email,
								message: 'Authenticated',
								token: token
							});
						} // end user check

					}); // end findone
				} else {
					// else not authenticated with fb - SEND to FB authentication 
					res.json({ success: false, message: 'Failed to Authenticate with FB!' });
				}
			});
		});

		// try to authenticate with the FB token
		// res.json({ message: 'FB_token:'+req.body.fb_access_token });
	} else {
		res.json({ message: 'No token given.' });
	}
});

module.exports = router;
