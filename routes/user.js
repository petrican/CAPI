// var express = require('express');
// var router = express.Router();  // commented this out as router is loaded below from the router midleware to check token

var mongoose = require('mongoose');
var User = require('../models/User.js');
var router = require('../routes/check-token.js');  // respond only if token is valid

/* GET users listing.   api/user/:id  */
router.get('/id/:id', function (req, res, next) {
	User.findById(req.params.id, function (err, user) {
		if (err) {
			// res.send(err); 
			res.json({ success: false, message: 'User not found. Error occured. (e9001).' });
		} else {
			if (!user) {
				res.json({ success: false, message: 'User not found.' });
			} else {
				var u = JSON.parse(JSON.stringify(user));  // user is JSONObject 
				console.log('USERNAME:' + u.username);
				var response = {
					success: true,
					id: u._id,
					username: u.username,
					email: u.email
				};
				res.json(response);
			}
			//res.json(user);
		}
	});
});  // end user listing by ID


/* GET user info    api/user/:name  */
router.get('/name/:name', function (req, res, next) {
	User.findOne({ 'username': req.params.name }, function (err, user) {
		if (err) {
			// res.send(err); 
			res.json({ success: false, message: 'User not found. Error occured. (e9001).' });
		} else {
			if (!user) {
				res.json({ success: false, message: 'User not found.' });
			} else {
				var u = JSON.parse(JSON.stringify(user));  // user is JSONObject 
				console.log('USERNAME info request for :' + u.username);
				var response = {
					success: true,
					id: u._id,
					username: u.username,
					email: u.email
				};

				res.json(response);
			}
			//res.json(user);
		}
	});
});  // end user listing by ID


/* POST user info    api/user/:name  - USED TO UPDATE user data */
router.put('/name/:name', function (req, res, next) {
	User.findOne({ 'username': req.params.name }, function (err, user) {
		if (err) {
			// res.send(err); 
			res.json({ success: false, message: 'User not found. Error occured. (e9001).' });
		} else {
			if (!user) {
				res.json({ success: false, message: 'User not found.' });
			} else {
				var u = JSON.parse(JSON.stringify(user));  // user is JSONObject 
				console.log('USERNAME UPDATE REQUEST for : ------>   ' + u.username);

				if (req.decoded._doc.username == u.username) {
					var response = {
						success: true,
						id: u._id,
						username: u.username,
						email: u.email
					};
				} else {
					var response = {
						success: false,
						message: 'Not authorized.'
					};
				}

				res.json(response);
			}
			//res.json(user);
		}
	});
});  // end user listing by ID

module.exports = router;
