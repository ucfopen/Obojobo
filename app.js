var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var ltiMiddleware = require('express-ims-lti');
var cookieSession = require('cookie-session')
var cons = require('consolidate');

// Require our routes/controllers
var indexRoute = require('./routes/index');
var ltiRoute = require('./routes/lti');
var apiDraftsRoute = require('./routes/api/drafts');
var apiEventsRoute = require('./routes/api/events');
var apiStatesRoute = require('./routes/api/states');

var app = express();

// view engine setup
var engines = require('consolidate');
app.engine('pug', engines.pug)
app.engine('mustache', engines.mustache)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cookieSession({
  name: 'obo3',
  keys: ['key1', 'key2']
}))
app.use(require('node-sass-middleware')({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true,
  sourceMap: true
}));
app.use(ltiMiddleware({
  credentials: function (key, callback) {
    // `this` is a reference to the request object.
    // var consumer = this.consumer = fetchLtiConsumer(key);
    // The first parameter is an error (null if there is none).
    // callback(null, key, consumer.secret);
    callback(null, key, 'lti-secret2');
  },

}));

app.use(express.static(path.join(__dirname, 'public')));
app.use('/static/react', express.static(__dirname + '/node_modules/react/dist'));
app.use('/static/react-dom', express.static(__dirname + '/node_modules/react-dom/dist'));

app.use('/', indexRoute);
app.use('/lti', ltiRoute);
app.use('/api/drafts', apiDraftsRoute)
app.use('/api/events', apiEventsRoute)
app.use('/api/states', apiStatesRoute)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error.pug');
});


var cdb = 'http://localhost:5984'
var rp = require('request-promise');

// THIS SHOULD PROBABLY BE MOVED
app.on('oboevent:SaveState', event => {
  event._id = event.user + ':' + event.draft_id + ':' + event.draft_rev

  let getRequest = {
    uri: cdb + '/view_state/'+event._id,
    method: 'GET',
    json: true
  }

  // create
  rp(getRequest)
  .then( body => {
    event._rev = body._rev
    let putRequest = {
      uri: cdb + '/view_state/'+event._id,
      method: 'PUT',
      json: true,
      body: event
    }

    // create
    rp(putRequest)
    .then( body => {
      console.log('state saved', body);
    })
    .catch( err => {
      console.log('ERROR', err)
    })

  })
  .catch( err => {

    let postRequest = {
      uri: cdb + '/view_state',
      method: 'POST',
      json: true,
      body: event
    }

    // create
    rp(postRequest)
    .then( body => {
      console.log('state saved', body);
    })
    .catch( err => {
      console.log('ERROR', err)
    })

  })

});

module.exports = app;
