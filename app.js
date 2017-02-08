var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var ltiMiddleware = require('express-ims-lti');
var cookieSession = require('cookie-session')
var cons = require('consolidate');
var fs = require('fs');
var path = require('path');

var appEvents = require('./appevents');

var sdom = require('./sdom');
var DraftTree = require('./drafttree');

var db = require('./db');

// Require our routes/controllers
var router = require('./router');
var indexRoute = require('./routes/index');
var ltiRoute = require('./routes/lti');
var apiDraftsRoute = require('./routes/api/drafts');
var apiEventsRoute = require('./routes/api/events');
var apiStatesRoute = require('./routes/api/states');
// var apiAssessmentsRoute = require('./routes/api/assessments');

var app = express();

// let EventEmitter = require('events')
// class Emitter extends EventEmitter {}
// let emitter = new Emitter();
// app.emitter = emitter;

// @TODO: figure these out dynamically?
let installedChunksJson = fs.readFileSync('./config/installed_chunks.json');
let installedChunksRaw = JSON.parse(installedChunksJson);
app.locals.installedChunks = installedChunksRaw.map((chunk) => {return path.basename(chunk)});


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
app.use(cookieSession({name: 'obo3', keys: ['key1', 'key2']}))
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
app.use('/static/obo-draft', express.static(__dirname + '/node_modules/obojobo-draft-document-engine/build'));

installedChunksRaw.forEach((chunk) => {
  console.log(`Registering chunk /static/chunks/${path.basename(chunk)} to ${__dirname}/${chunk}.js`)
  app.use(`/static/chunks/${path.basename(chunk)}.js`, express.static(`${__dirname}/${chunk}.js`));
  app.use(`/static/chunks/${path.basename(chunk)}.css`, express.static(`${__dirname}/${chunk}.css`));
})


app.use('/', indexRoute);
app.use('/lti', ltiRoute);
app.use('/api/drafts', apiDraftsRoute)
app.use('/api/events', apiEventsRoute)
app.use('/api/states', apiStatesRoute)
// app.use('/api/assessments', apiAssessmentsRoute)

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

  // render the error page
  res.status(err.status || 500);
  res.render('error.pug');
});

// app.registered = {}
// app.register = function(registration) {
//   if(app.registered[registration.title]) return

//   let api = Object.assign({
//     init: function() {},
//     listeners: {},
//     events: [],
//   }, registration.api)

//   app.registered[registration.title] = api

//   api.init(app, router, db);

//   for(let event in api.listeners)
//   {
//     app.on(event, api.listeners[event])
//   }
// }

assessment = require('./assessment')
questionBank = require('./assessment/questionbank')
mcAssessment = require('./assessment/mcassessment')
question = require('./assessment/question')
mcChoice = require('./assessment/mcchoice')

app.sdom = sdom

app.sdom.registerApi(app, db, router, assessment)
app.sdom.registerApi(app, db, router, questionBank)
app.sdom.registerApi(app, db, router, mcAssessment)
app.sdom.registerApi(app, db, router, question)
app.sdom.registerApi(app, db, router, mcChoice)




app.getDraft = function(id) {
  console.log('GET DRAFT', id)
  return new Promise(function(resolve, reject) {
    db
      .one(`
        SELECT *
        FROM drafts
        WHERE id = $1
      `, id)
      .then( result => {
        result.document._id = result.id
        result.document._rev = result.revision

        console.time('a')
        let draftTree = new DraftTree(app, db, result.document)
        console.timeEnd('a')

        // let draft = Object.assign({}, result.document)

        resolve(draftTree)
      })
      .catch( (error) => {
        reject(error)
      })
  })
}

// console.log('get d')
// app
//   .getDraft('00000000-0000-0000-0000-000000000000')
//   .then( (result) => {
//     // console.log('GOT RESULT', result)
//   })
//   .catch( (error) => {
//     console.error('GOT ERROR', error)
//   })

app.logError = function(name, req, ...additional) {
  console.error("ERROR:", name, "\n", (new Date()), "\nREQUEST HEADERS", req.headers, "\nREQUEST BODY", req.body);
  if(typeof additional !== "undefined")
  {
    console.error(additional);
  }
  console.error("");
}


appEvents.register(app);

module.exports = app;
