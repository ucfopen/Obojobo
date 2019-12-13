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
	if (!process.env.IS_WEBPACK){
		app.use('/static', express.static(`${__dirname}/public/compiled/`))
	}
}
