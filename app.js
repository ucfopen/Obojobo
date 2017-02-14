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
app.locals.paths = {
  chunkPath: "/static/chunks/",
  draftPath: "/static/obo-draft/"
}

let registerChunkScript = 'chunks:register'
if(app.get('env') !== 'production'){
  console.log('Registering Development Chunks');
  app.locals.paths.draftPath = "http://localhost:8090/build/"
  app.locals.paths.chunkPath = "http://localhost:8090/build/"
  registerChunkScript = 'chunks:registerdev'
}

// call script
spawn = require( 'child_process' ).spawnSync,
ls = spawn('yarn', [registerChunkScript]);

// Process dynamic Obojobo Draft Chunks
let installedChunksJson = fs.readFileSync('./config/installed_chunks.json');
let installedChunksObject = JSON.parse(installedChunksJson);
app.locals.installedChunks = [];
console.log("Dynamic Asset Routing")
Object.keys(installedChunksObject).forEach( chunkName => {
  let urlBase = `static/chunks/${chunkName}`;
  let pathBase = `${__dirname}/${installedChunksObject[chunkName]}`
  console.log(`${urlBase} => ${pathBase}`)
  app.use(`${urlBase}.js`, express.static(`${pathBase}.js`));
  app.use(`${urlBase}.css`, express.static(`${pathBase}.css`));
  app.locals.installedChunks.push(chunkName)
})


// =========== ROUTING & CONTROLERS ===========
app.use('/', require('./routes/index'));
app.use('/lti', require('./routes/lti'));
app.use('/api/drafts', require('./routes/api/drafts'))
app.use('/api/events', require('./routes/api/events'))
app.use('/api/states', require('./routes/api/states'))
// app.use('/api/assessments', require('./routes/api/assessments'))

// load up the dynamic obojobo draft chunks/objects
// @TODO more dyanmic or include in
// Change this so the registration happens in the module's main require?
assessment = require('./assessment')
questionBank = require('./assessment/questionbank')
mcAssessment = require('./assessment/mcassessment')
question = require('./assessment/question')
mcChoice = require('./assessment/mcchoice')

var router = require('./router');
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
