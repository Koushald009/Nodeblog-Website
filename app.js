var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var favicon = require('serve-favicon');
var expressValidator = require('express-validator');
var session = require('express-session');
var bodyParser = require('body-parser');
var multer = require('multer');
var flash = require('connect-flash');

var routes = require('./routes/index');
var posts = require('./routes/posts');
var categories = require('./routes/categories');


var app = express();

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
      cb(null, './public/images/uploads/');
  },
  filename: function(req, file, cb) {
      cb(null, file.originalname);
  }
});

app.locals.moment = require('moment');

app.locals.truncateText = function(text, length){
    var truncateText = text.substring(0,length);
    return truncateText;
};

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// Handle file uploads
app.use(multer({ storage: storage }).single("mainimage"));

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Handle Express Sessions
app.use(session({
    secret:'secret',
    saveUninitialized: true,
    resave: true
}));

// Validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

app.use(express.static(path.join(__dirname, 'public')));


// app.use(flash());
// app.use(function (req, res, next) {
//   res.locals.messages = require('express-messages')(req, res);
//   next();
// });

// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   req.db =  db;
//   next();
// });

app.use('/', routes);
app.use('/posts', posts);
app.use('/categories', categories);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
