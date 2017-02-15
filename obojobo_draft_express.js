var express = require('express');
var fs = require('fs');
var path = require('path');
var ltiMiddleware = require('express-ims-lti');
var db = require('./db')
var router = require('./router');

let app;
let settings = {};
let registeredDraftModules = new Map();

let initialize = (appRef, settingsRef = null) => {
  settings = settingsRef
  app = appRef

  // =========== 3RD PARTY MIDDLEWARE ================
  app.use(ltiMiddleware({
    credentials: function (key, callback) {
      // `this` is a reference to the request object.
      // The first callback parameter is for errors (null if there is none).
      if(key == 'jisc.ac.uk') callback(null, key, 'secret') // THIS IS THE DEFAULT found in http://ltiapps.net/test/tc.php
      else callback(null, key, 'secret');
    },

  }));


  // =========== STATIC ASSET PATHS ================
  // Register static assets
  app.use(express.static(path.join(__dirname, 'public')));
  // app.use('/static/react', express.static(`${__dirname}/node_modules/react/dist`));
  // app.use('/static/react-dom', express.static(`${__dirname}/node_modules/react-dom/dist`));
  app.use('/static/obo-draft', express.static(`${__dirname}/node_modules/obojobo-draft-document-engine/build`));

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
  app.use('/lti', require('./routes/lti'));
  app.use('/api/drafts', require('./routes/api/drafts'))
  app.use('/api/events', require('./routes/api/events'))
  app.use('/api/states', require('./routes/api/states'))
  // app.use('/api/assessments', require('./routes/api/assessments'))

  // load up the dynamic obojobo draft chunks/objects
  // @TODO more dyanmic or include in
  // Change this so the registration happens in the module's main require?
  registerDraftModule(require('./assessment'))
  registerDraftModule(require('./assessment/questionbank'))
  registerDraftModule(require('./assessment/mcassessment'))
  registerDraftModule(require('./assessment/question'))
  registerDraftModule(require('./assessment/mcchoice'))

  app.on('client:saveState', onClientSaveState)

  app.use(middleware);
}

let createNewApi = () => {
  return {
    init: function() {},
    listeners: {},
    events: [],
  }
}

let registerDraftModule = (registration) => {
  if(registeredDraftModules.has(registration.title)) return

  api = {
    static: Object.assign(createNewApi(), registration.static),
    inst: Object.assign(createNewApi(), registration.instance)
  }

  registeredDraftModules.set(registration.title, api)
  api.static.init(app, db, router)

  for(let event in api.static.listeners)
  {
    app.on(event, api.static.listeners[event])
  }
}

let getDraftModule = (name) => {
  return registeredDraftModules.get(name)
}

let onClientSaveState = (event) => {
  event._id = `${event.user}:${event.draft_id}:${event.draft_rev}`

  db.none(`
    INSERT INTO view_state
    (user_id, metadata, payload)
    VALUES($[userId], $[metadata], $[payload])`
    , event)
  .then( (result) => {
    return true
  })
  .catch( (error) => {
    console.log(error);
    res.error(404).json({error:'Draft not found'})
  })
}

let middleware = (req, res, next) => {
  console.log('MIDDLEWARE FIRED');
  next()
}

module.exports = {
  initialize: initialize,
  registerDraftModule: registerDraftModule,
  getDraftModule: getDraftModule
}
