const path = require('path')
const express = require('express')
const draftNodeStore = oboRequire('draft_node_store')
const logger = oboRequire('logger')

const { oboNodesServer, oboExpress } = require(path.resolve(__dirname, '../../obojobo.js'))
module.exports = app => {
	// =========== REGISTER CUSTOM EXPRESS MIDDLEWARE ===========
	oboExpress.forEach(expressFile => {
		const pathToLoad = `obojobo-document-engine/server/${expressFile}`
		logger.info('Registering express App:', pathToLoad)
		app.use(require(pathToLoad))
	})

	// =========== REGISTER CUSTOM DRAFT NODES ===========
	oboNodesServer.forEach(node => {
		const location = path.resolve(__dirname, '../obojobo-document-engine', node.location)
		logger.info('Adding server node:', location)
		draftNodeStore.add(node.name, location)
	})

	// ===========  ASSETS FROM THE ASSET MANIFEST ===========
	const registerAssetVersions = (base, ext) => {
		app.use(`/static/${base}.min${ext}`, express.static(`${__dirname}/public/compiled/${base}.min${ext}`))
		app.use(`/static/${base}${ext}`, express.static(`${__dirname}/public/compiled/${base}${ext}`))
	}

	registerAssetVersions('viewer', '.js')
	registerAssetVersions('viewer', '.css')
	registerAssetVersions('editor', '.js')
	registerAssetVersions('editor', '.css')
}
