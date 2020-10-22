/*
 OBOJOBO Express Middleware

 Install into your own express app using:
 app.use(require('server/obo_express'))
 Your parent express app will need:
   * a session handler
   * a body parser (if using 'body-parser', make sure json options is set to 1mb or higher)
   * a view engine that parses .pug
*/
const path = require('path')
const basePath = path.resolve(`${__dirname}/../`)
global.oboRequire = name => require(`${basePath}/${name}`)
const express = require('express')
const app = express()
const responseDecorator = oboRequire('server/express_response_decorator')
const loadBalancerHelperMiddleware = oboRequire('server/express_load_balancer_helper')
const currentUserMiddleware = oboRequire('server/express_current_user')
const currentDocumentMiddleware = oboRequire('server/express_current_document')
const currentVisitMiddleware = oboRequire('server/express_current_visit')
const registerChunks = oboRequire('server/express_register_chunks')
const oboLtiMiddleware = oboRequire('server/obo_ims_lti')
oboRequire('server/viewer/viewer_events')
// when the parent app is mounted
app.on('mount', app => {
	// =========== MIDDLEWARE ===========
	app.use(loadBalancerHelperMiddleware)
	app.use(currentUserMiddleware)
	app.use(currentVisitMiddleware)
	app.use(currentDocumentMiddleware)
	app.use(oboLtiMiddleware)
	app.use('/', responseDecorator)

	// =========== ROUTING & CONTROLLERS ===========
	app.use('/preview', oboRequire('server/routes/preview'))
	app.use('/view', oboRequire('server/routes/viewer'))
	app.use('/editor', oboRequire('server/routes/editor'))
	app.use('/lti', oboRequire('server/routes/lti'))
	app.use('/api/drafts', oboRequire('server/routes/api/drafts'))
	app.use('/api/events', oboRequire('server/routes/api/events'))
	app.use('/api/media', oboRequire('server/routes/api/media'))
	app.use('/api/visits', oboRequire('server/routes/api/visits'))
	app.use('/api/locks', oboRequire('server/routes/api/locks'))
	app.use('/profile', oboRequire('server/routes/profile'))

	// =========== REGISTER OBOJOBO DRAFT CHUNKS ===========
	registerChunks(app)
})

module.exports = app
