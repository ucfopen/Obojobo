let fs = require('fs')
let path = require('path')
let express = require('express')
let draftNodeStore = oboRequire('draft_node_store')
let assetForEnv = oboRequire('asset_resolver').assetForEnv
const getInstalledModules = require('./obo_get_installed_modules')

module.exports = (app) => {
	let isProd = app.get('env') === 'production'
	// let isProd = true

	// ===========  GENERATE installed_modules.json ===========
	spawn = require( 'child_process' ).spawnSync,
	ls = spawn('yarn', [(isProd ? 'chunks:register' : 'chunks:registerdev')]);

	let modules = getInstalledModules(app.get('env'))

	// =========== REGISTER CUSTOM EXPRESS MIDDLEWARE ===========
	modules.express.forEach(expressFile => {
		console.log('Registering express App', expressFile)
		app.use(require(expressFile));
	})

	// =========== REGISTER CUSTOM DRAFT NODES ===========
	modules.draftNodes.forEach((nodeFile, nodeName) => {
		draftNodeStore.add(nodeName, nodeFile)
	})

	// =========== STATIC ASSET PATHS ================
	// Register static assets
	// app.use(express.static(path.join(__dirname, 'public')))
	// app.use(asset.url, express.static(asset.path))

	// ===========  ASSETS FROM THE ASSET MANIFEST ===========
	app.use('/static/viewer.min.js', express.static('./public/compiled/viewer.min.js'))
	app.use('/static/viewer.js', express.static('./public/compiled/viewer.js'))

	app.use('/static/viewer.min.css', express.static('./public/compiled/viewer.min.css'))
	app.use('/static/viewer.css', express.static('./public/compiled/viewer.css'))

}
