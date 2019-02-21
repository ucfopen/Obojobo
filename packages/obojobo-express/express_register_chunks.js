const express = require('express')
const draftNodeStore = oboRequire('draft_node_store')
const getInstalledModules = require('./obo_get_installed_modules')
const logger = oboRequire('logger')

module.exports = app => {
	const isProd = app.get('env') === 'production'

	// ===========  GENERATE installed_modules.json ===========
	const spawn = require('child_process').spawnSync
	spawn('yarn', [isProd ? 'chunks:register' : 'chunks:registerdev'])

	const modules = getInstalledModules(app.get('env'))

	// =========== REGISTER CUSTOM EXPRESS MIDDLEWARE ===========
	modules.express.forEach(expressFile => {
		logger.info('Registering express App', expressFile)
		app.use(require(expressFile))
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
	const registerAssetVersions = (base, ext) => {
		app.use(`/static/${base}.min${ext}`, express.static(`${__dirname}/public/compiled/${base}.min${ext}`))
		app.use(`/static/${base}${ext}`, express.static(`${__dirname}/public/compiled/${base}${ext}`))
	}

	registerAssetVersions('viewer', '.js')
	registerAssetVersions('viewer', '.css')
	registerAssetVersions('viewer-app', '.js')
}
