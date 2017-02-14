var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var ltiMiddleware = require('express-ims-lti');
var cookieSession = require('cookie-session')
var cons = require('consolidate'); // allows multiple view engines
var fs = require('fs');
var appEvents = require('./appevents');
var sdom = require('./sdom');
var db = require('./db');
var app = express();

// =========== VIEW ENGINES ================
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

// =========== 3RD PARTY MIDDLEWARE ================
app.use(ltiMiddleware({
  credentials: function (key, callback) {
    // `this` is a reference to the request object.
    // var consumer = this.consumer = fetchLtiConsumer(key);
    // The first parameter is an error (null if there is none).
    // callback(null, key, consumer.secret);

    // THIS IS THE DEFAULT found in http://ltiapps.net/test/tc.php
    // TESTING
    if(key == 'jisc.ac.uk') callback(null, key, 'secret')
    else callback(null, key, 'secret');
  },

}));


// =========== ASSET PATHS ================
// Register static assets
app.use(express.static(path.join(__dirname, 'public')));
app.use('/static/react', express.static(__dirname + '/node_modules/react/dist'));
app.use('/static/react-dom', express.static(__dirname + '/node_modules/react-dom/dist'));
app.use('/static/obo-draft', express.static(__dirname + '/node_modules/obojobo-draft-document-engine/build'));

// Search for dynamic Obojobo Draft Chunks
app.locals.paths = {}
if(app.get('env') === 'production'){
  console.log('Registering Production Chunks');
  spawn = require( 'child_process' ).spawnSync,
  ls = spawn( 'yarn', [ 'chunks:register'] );

  app.locals.paths.chunkPath = "/static/chunks/"
  app.locals.paths.draftPath = "/static/obo-draft/"
}
else{
  console.log('Registering Development Chunks');
  spawn = require( 'child_process' ).spawnSync,
  ls = spawn('yarn', ['chunks:registerdev']);

  app.locals.paths.draftPath = "http://localhost:8090/build/"
  app.locals.paths.chunkPath = "http://localhost:8090/build/"
}

// Process dynamic Obojobo Draft Chunks
let installedChunksJson = fs.readFileSync('./config/installed_chunks.json');
let installedChunksObject = JSON.parse(installedChunksJson);
app.locals.installedChunks = [];
Object.keys(installedChunksObject).forEach( chunkName => {
  console.log(`Registering /static/chunks/${chunkName}.js to ${__dirname}/${installedChunksObject[chunkName]}.js`)
  app.use(`/static/chunks/${chunkName}.js`, express.static(`${__dirname}/${installedChunksObject[chunkName]}.js`));
  app.use(`/static/chunks/${chunkName}.css`, express.static(`${__dirname}/${installedChunksObject[chunkName]}.css`));
  app.locals.installedChunks.push(chunkName)
})


// =========== ROUTING & CONTROLERS ===========
var router = require('./router');
var indexRoute = require('./routes/index');
var ltiRoute = require('./routes/lti');
var apiDraftsRoute = require('./routes/api/drafts');
var apiEventsRoute = require('./routes/api/events');
var apiStatesRoute = require('./routes/api/states');
// var apiAssessmentsRoute = require('./routes/api/assessments');
app.use('/', indexRoute);
app.use('/lti', ltiRoute);
app.use('/api/drafts', apiDraftsRoute)
app.use('/api/events', apiEventsRoute)
app.use('/api/states', apiStatesRoute)
// app.use('/api/assessments', apiAssessmentsRoute)

// load up the dynamic obojobo draft chunks/objects
// @TODO more dyanmic or include in
// Change this so the registration happens in the module's main require?
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

  console.log(err)

  // render the error page
  res.status(err.status || 500);
  res.render('error.pug');
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

appEvents.register(app);

module.exports = app;
