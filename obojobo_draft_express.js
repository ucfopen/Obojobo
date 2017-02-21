var express = require('express');
var fs = require('fs');
var path = require('path');
var ltiMiddleware = require('express-ims-lti');
var db = require('./db')
var router = require('./router');

let app;
let settings = {};
let registeredDraftModules = new Map();
let isProd = true;


let initialize = (appRef, settingsRef = null) => {
  settings = settingsRef
  app = appRef
  isProd = app.get('env') === 'production';

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
    draftPath: "/static/obo-draft/"
  }

  let registerChunkScript = 'chunks:register'
  if( ! isProd){
    app.locals.paths.draftPath = "http://localhost:8090/build/"
    registerChunkScript = 'chunks:registerdev'
  }

  // call yarn script
  spawn = require( 'child_process' ).spawnSync,
  ls = spawn('yarn', [registerChunkScript]);

  // Process dynamic Obojobo Draft Modules
  console.log("Dynamic Asset Routing")
  let installedModulesJson = fs.readFileSync('./config/installed_modules.json');
  let installedModulesObject = JSON.parse(installedModulesJson);

  app.locals.modules = {
    serverScript: [],
    viewerScript: [],
    viewerCss: [],
    authorScript: [],
    authorCss: []
  }

  for(let moduleName in installedModulesObject){
    let paths = installedModulesObject[moduleName]
    let urlBase = `static/modules/${moduleName}`;
    let pathBase = __dirname

    for(var pathType in paths){
      let filePath = paths[pathType]
      let pathPair = { url: `${urlBase}/${pathType}${path.extname(filePath)}`, path:`${pathBase}/${filePath}`}

      if( ! isProd && pathPair.path.includes('/devsrc/')){
        pathPair.url = `${app.locals.paths.draftPath}${path.basename(filePath)}`
      }

      if( ! app.locals.modules[pathType]){
        app.locals.modules[pathType] = [];
      }

      app.locals.modules[pathType].push(pathPair)

      if(pathType !== 'serverScripts'){
        console.log(`${pathPair.url} => ${pathPair.path}`)
        app.use(pathPair.url, express.static(pathPair.path))
      }
    }
  }


  // =========== ROUTING & CONTROLERS ===========
  app.use('/lti', require('./routes/lti'));
  app.use('/api/drafts', require('./routes/api/drafts'))
  app.use('/api/events', require('./routes/api/events'))
  app.use('/api/states', require('./routes/api/states'))
  // app.use('/api/assessments', require('./routes/api/assessments'))

  // load up the dynamic obojobo draft chunks/objects
  // @TODO more dyanmic or include in
  // Change this so the registration happens in the module's main require?
  registerDraftModule(require('./assessment/assessment'))
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
