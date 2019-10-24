const express = require('express')
const draftNodeStore = oboRequire('draft_node_store')
const logger = oboRequire('logger')
const { getAllOboNodeScriptPathsByType } = require('obojobo-lib-utils')

module.exports = app => {
	// =========== REGISTER CUSTOM EXPRESS MIDDLEWARE ===========
	const middleware = getAllOboNodeScriptPathsByType('middleware')

	middleware.forEach(middlewarePath => {
		logger.info('Registering express middleware:', middlewarePath)
		app.use(require(middlewarePath))
	})

	// =========== REGISTER CUSTOM OBONODES ===========
	const oboNodesServer = getAllOboNodeScriptPathsByType('obonodes')

	oboNodesServer.forEach(oboNodePath => {
		const oboNodeClass = require(oboNodePath)
		logger.info('Registering OboNode:', oboNodeClass.nodeName)
		draftNodeStore.add(oboNodeClass)
	})

	// ===========  ASSETS FROM THE ASSET MANIFEST ===========
	const registerAssetVersions = (base, ext) => {
		if (process.env.IS_WEBPACK) return

		app.use(
			`/static/${base}.min${ext}`,
			express.static(`${__dirname}/public/compiled/${base}.min${ext}`)
		)
		app.use(`/static/${base}${ext}`, express.static(`${__dirname}/public/compiled/${base}${ext}`))
	}

	registerAssetVersions('viewer', '.js')
	registerAssetVersions('viewer', '.css')
	registerAssetVersions('editor', '.js')
	registerAssetVersions('editor', '.css')
}
