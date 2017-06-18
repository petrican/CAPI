var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    //res.render('index', { title: 'Express' });
    res.json({
        message: 'Welcome to Core APIs for your APP!',
        server: 'Your Server'
    });
});

module.exports = router;
