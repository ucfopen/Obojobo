let express = require('express');
let app = express();
let fs = require('fs');
let path = require('path');
let ltiMiddleware = require('express-ims-lti');
let lti  = require("ims-lti");
let DevNonceStore = oboRequire('dev_nonce_store');
let db = oboRequire('db')
let apiResponseDecorator = oboRequire('api_response_decorator');
let draftNodeStore = oboRequire('draft_node_store')
let parentApp = null
let EventEmitter = require('events');
let registeredModuleApps = new Map();
let isProd = true;
let User = oboRequire('models/user')
let GuestUser = oboRequire('models/guest_user')


// Global event emitter for the application
// Not ideal to store this as a global, buuuut
global.oboEvents = new EventEmitter(this);


app.use((req, res, next) => {
	req.setCurrentUser = (user) =>{
		if(! user instanceof User) throw new Error('Invalid User for Current user')
		console.log('SETTING CURRENT USER', user.id)
		req.session.currentUserId = user.id
	}

	// returns a Promise!!!
	req.getCurrentUser = (isRequired=false) => {
		if(req.currentUser) return Promise.resolve(req.currentUser)

		if( ! req.session || ! req.session.currentUserId ){
			console.log('no currentUserId set');
			if(isRequired) return Promise.reject(new Error('Login Required'))
			return Promise.resolve(new GuestUser());
		}

		return User.fetchById(req.session.currentUserId)
		.then(user => {
			console.log('USER FOUND', user)
			req.currentUser = user
			return user
		})
		.catch(err => {
			console.log('user not found after query', req.session.currentUserId);
			if(isRequired) return Promise.reject(new Error('Login Required'))
			return Promise.resolve(new GuestUser());
		})
	}

	// returns a promise
	req.requireCurrentUser = () => {
		return req.getCurrentUser(true)
		.then(user => {
			return user
		})
		.catch( err => {
			throw new Error('Login Required')
		})
	}

	next();
})

app.on('mount', (app) => {
	isProd = app.get('env') === 'production';
	parentApp = app;


	parentApp.use(ltiMiddleware({
		nonceStore: new DevNonceStore(),
		credentials: (key, callback) => { callback(null, 'key', 'secret') }
	}))

	// Decorate api routes with convenient functions
	parentApp.use('/api', apiResponseDecorator);

	// =========== STATIC ASSET PATHS ================
	// Register static assets
	parentApp.use(express.static(path.join(__dirname, 'public')));
	parentApp.use('/static/obo-draft', express.static(`${__dirname}/node_modules/obojobo-draft-document-engine/build`));

	// Search for dynamic Obojobo Draft Chunks
	parentApp.locals.paths = {
		appPath: __dirname,
		draftPath: "/static/obo-draft/"
	}

	let registerChunkScript = 'chunks:register'
	if( ! isProd){
		parentApp.locals.paths.draftPath = "http://localhost:8090/build/"
		registerChunkScript = 'chunks:registerdev'
	}

	// call yarn script
	spawn = require( 'child_process' ).spawnSync,
	ls = spawn('yarn', [registerChunkScript]);

	// Process dynamic Obojobo Draft Modules
	let installedModulesJson = fs.readFileSync('./config/installed_modules.json');
	let installedModulesObject = JSON.parse(installedModulesJson);

	// register any express apps
	if(installedModulesObject.hasOwnProperty('expressApps')){
		let apps = installedModulesObject.expressApps
		delete installedModulesObject.expressApps
		apps.forEach( appFile => {
			let ea = require(appFile)
			console.log('Registering express App', appFile)
			registeredModuleApps.set(appFile, ea)
			parentApp.use(ea);
		})
	}

	// this holds references to files registered from plugin modules
	// registered via obojobo.json file in each node package
	// anything in here will be exposed with a public url
	parentApp.locals.modules = {
		viewerScript: [],
		viewerCSS: [],
		authorScript: [],
		authorCSS: []
	}

	// register client css, js and server side draftNodes
	for(let moduleName in installedModulesObject){
		let paths = installedModulesObject[moduleName]
		let urlBase = `/static/modules/${moduleName}`;
		for(var pathType in paths){
			let filePath = paths[pathType]
			let pathPair = { url: `${urlBase}/${pathType}${path.extname(filePath)}`, path:filePath, name:moduleName}

			if( ! isProd && pathPair.path.includes('/devsrc/')){
				pathPair.url = `${parentApp.locals.paths.draftPath}${path.basename(filePath)}`
			}

			// if it's a draftNode, register it
			if(pathType === 'draftNode'){
				draftNodeStore.add(pathPair.name, pathPair.path);
				continue;
			}

			// only allowed types are already defined in locals.modules
			if(!parentApp.locals.modules.hasOwnProperty(pathType)) continue;

			// add to the catalog
			parentApp.locals.modules[pathType].push(pathPair)
			//
			parentApp.use(pathPair.url, express.static(pathPair.path))
		}
	}

	// =========== ROUTING & CONTROLERS ===========

	parentApp.use('/', oboRequire('routes/viewer'));
	parentApp.use('/lti', oboRequire('routes/lti'));
	parentApp.use('/api/drafts', oboRequire('routes/api/drafts'))
	parentApp.use('/api/events', oboRequire('routes/api/events'))
	parentApp.use('/api/states', oboRequire('routes/api/states'))

})


global.oboEvents.on('client:saveState', (event, req) => {
	req.requireCurrentUser()
	.then(user => {
		let data = {
			_id: `${rcurrentUser.id}:${event.draft_id}:${event.draft_rev}`,
			userId: currentUser.id,
			metadata: metadata,
			payload: payload
		};

		db.none(`
			INSERT INTO view_state
			(user_id, metadata, payload)
			VALUES($[userId], $[metadata], $[payload])`
			, data)
		.then( (result) => {
			return true;
		})
		.catch( (error) => {
			console.log(error);
			res.error(404).json({error:'Draft not found'})
		})
	})
});


module.exports = app
