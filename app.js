var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cookieSession = require('cookie-session')
var viewEngine = require('consolidate');
var app = express();
let obojoboDraftExpress = require('./obojobo_draft_express');

// =========== ROUTING & CONTROLERS ===========
app.use('/', require('./routes/index'));

// =========== STATIC ASSET PATHS ================
app.use(express.static(path.join(__dirname, 'public')));

// =========== VIEW ENGINES ================
app.engine('pug', viewEngine.pug)
app.engine('mustache', viewEngine.mustache)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

// =========== SET UP MIDDLEWARE ================
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cookieSession({name: 'obo3', keys: ['key1', 'key2']}))
app.use(require('node-sass-middleware')({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true,
  sourceMap: true
}));

obojoboDraftExpress.initialize(app)


// @TODO 404!
// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   var err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  console.error(err)
  // render the error page
  res.status(err.status || 500);
  res.render('error.pug');
  next()
});

// @TODO: centralize logging
app.logError = function(name, req, ...additional) {
  console.error("ERROR:", name, "\n", (new Date()), "\nREQUEST HEADERS", req.headers, "\nREQUEST BODY", req.body);
  if(typeof additional !== "undefined")
  {
    console.error(additional);
  }
  console.error("");
}

module.exports = app;
