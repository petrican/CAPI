var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');


var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('./config'); // get our config file
var User   = require('./models/User'); // get our mongoose model




// ### LOAD ROUTES
var routes = require('./routes/index');
var user = require('./routes/user');
var authenticate =  require('./routes/authenticate');
var register =  require('./routes/register');

// login with FB
var fblogin = require('./routes/fblogin');
var logout = require('./routes/logout');



// Database
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect( config.database , function(err) {
    if(err) {
        console.log('connection error', err);
    } else {
        console.log('connection successful. Yeeee!');
    }
});

var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


// ### MIDDLEWARE 
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//  END OF MIDLEWARE - HERE WE SET THE API PATHS

// route for todos
// var todos = require('./routes/todos');
// app.use('/todos', todos);


// # API PATHS
// apply the routes to our application with the prefix /api
app.use('/api', routes);   // this was the initial one
// app.use('/api/users', users);    // used in tests - deprecated as I do not list all users ! 
app.use('/api/user', user);
app.use('/api/authenticate', authenticate);
app.use('/api/register', register);
app.use('/api/fblogin', fblogin);
app.use('/api/logout', logout);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  /*
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
  */
  res.json({ 
        success: false,
        error: 'Non-existent api path.'
     
  });
});



// error handlers

// development error handler
// will print stacktrace
/*
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}
*/

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
