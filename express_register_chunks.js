let fs = require('fs')
let path = require('path')
let express = require('express')
let draftNodeStore = oboRequire('draft_node_store')
let registeredModuleApps = new Map()

module.exports = (app) => {
	let isProd = app.get('env') === 'production'
	// =========== STATIC ASSET PATHS ================
	// Register static assets
	app.use(express.static(path.join(__dirname, 'public')))
	app.use('/static/obo-draft', express.static(`${__dirname}/node_modules/obojobo-draft-document-engine/build`))

	// Search for dynamic Obojobo Draft Chunks
	app.locals.paths = {
		appPath: __dirname,
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
	let installedModulesObject = JSON.parse(fs.readFileSync('./config/installed_modules.json'));

	// register any express apps
	if(installedModulesObject.hasOwnProperty('expressApps')){
		let apps = installedModulesObject.expressApps
		delete installedModulesObject.expressApps
		apps.forEach(appFile => {
			let ea = require(appFile)
			console.log('Registering express App', appFile)
			registeredModuleApps.set(appFile, ea)
			app.use(ea);
		})
	}

	// this holds references to files registered from plugin modules
	// registered via obojobo.json file in each node package
	// anything in here will be exposed with a public url
	app.locals.modules = {
		viewerScript: [],
		viewerCSS: [],
		authorScript: [],
		authorCSS: []
	}

	// register client css, js and server side draftNodes
	for(let moduleName in installedModulesObject){
		let paths = installedModulesObject[moduleName]
		let urlBase = `/static/modules/${moduleName}`
		for(var pathType in paths){
			let filePath = paths[pathType]
			let pathPair = { url: `${urlBase}/${pathType}${path.extname(filePath)}`, path:filePath, name:moduleName}

			if( ! isProd && pathPair.path.includes('/devsrc/')){
				pathPair.url = `${app.locals.paths.draftPath}${path.basename(filePath)}`
			}

			// if it's a draftNode, register it
			if(pathType === 'draftNode'){
				draftNodeStore.add(pathPair.name, pathPair.path)
				continue
			}

			// only allowed types are already defined in locals.modules
			if(!app.locals.modules.hasOwnProperty(pathType)) continue;

			// add to the catalog
			app.locals.modules[pathType].push(pathPair)

			// add to static files
			app.use(pathPair.url, express.static(pathPair.path))
		}
	}
}
