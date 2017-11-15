'use strict'
const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const lessMiddleware = require('less-middleware');
const constants = require('./scripts/constants.js')
const db = require('./scripts/db.js')
//const CronJob = require('cron').CronJob;
const session = require('express-session')
const RedisStore = require('connect-redis')(session);

const index = require('./routes/index');
const users = require('./routes/users');
const orders = require('./routes/orders');
const admin = require('./routes/admin');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(lessMiddleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/node', express.static(__dirname + '/node_modules/'))

var sessionStore;

if(!constants.redis){
  sessionStore = {
    secret: constants.sessionSecret,
    resave: false,
    cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 },
    saveUninitialized:false
  }
}else{
  sessionStore = {
    store:  new RedisStore({url:constants.redis}),
    secret: constants.sessionSecret,
    resave: false,
    cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 },
    saveUninitialized:false
  }
}
app.use(session(
  sessionStore
));

app.use('/', index);
app.use('/artists', users);
app.use('/orders', orders);
app.use('/admin', admin);

//timed events here!
// var job = new CronJob('00 30 11 * * 1-5', function() {
//   /*
//    * Runs every weekday (Monday through Friday)
//    * at 11:30:00 AM. It does not run on Saturday
//    * or Sunday.
//    */
//     console.log('Timed event: Check for old orders to release')
//   }, function () {
    
//     /* This function is executed when the job stops */
//   },
//   true, /* Start the job right now */
//   timeZone /* Time zone of this job. */
// );

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(function(req, res, next) {
  var err = new Error('Forbidden');
  err.status = 403;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  console.log('ERR:',err.status)
  // render the error page
  if(err.status == 403){
    res.status(err.status)
    res.redirect('/login')
  }else{
    res.status(err.status || 500);
    res.render('error');
  } 
});

module.exports = app;
