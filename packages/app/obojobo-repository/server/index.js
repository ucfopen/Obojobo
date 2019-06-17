/*
 OBOJOBO Express Middleware

 Install into your own express app using:
 app.use(require('obo_express'))
 Your parent express app will need:
   * a session handler
   * a body parser (if using 'body-parser', make sure json options is set to 1mb or higher)
   * a view engine that parses .pug
*/
const path = require('path')
const express = require('express')
const app = express()

const fs = require('fs');
require.extensions['.svg'] = function (module, filename) {
    module.exports = fs.readFileSync(filename, 'utf8');
};
// const responseDecorator = oboRequire('obojobo-express/express_response_decorator')
// const loadBalancerHelperMiddleware = oboRequire('express_load_balancer_helper')
// const currentUserMiddleware = oboRequire('express_current_user')
// const currentDocumentMiddleware = oboRequire('express_current_document')
// const currentVisitMiddleware = oboRequire('express_current_visit')
// const registerChunks = oboRequire('express_register_chunks')
// const oboLtiMiddleware = oboRequire('obo_ims_lti')
// oboRequire('viewer_events')
// oboRequire('express_lti_launch')
// when the parent app is mounted
app.on('mount', app => {
	//  add our static directory
	app.use(express.static(path.join(__dirname, 'public')))


	// append our view path to the configured view paths
	let viewPaths = app.get('views')
	if(!Array.isArray(viewPaths)) viewPaths = [viewPaths]
	viewPaths.push(`${__dirname}/views`)
	app.set('views', viewPaths)

	app.engine('jsx', require('express-react-views').createEngine());
	// nunjucks.configure(`${__dirname}/views/`)
	// =========== MIDDLEWARE ===========
	// app.use(loadBalancerHelperMiddleware)
	// app.use(currentUserMiddleware)
	// app.use(currentVisitMiddleware)
	// app.use(currentDocumentMiddleware)
	// app.use(oboLtiMiddleware)
	// app.use('/', responseDecorator)

	// =========== ROUTING & CONTROLLERS ===========
	app.use('/', require('./routes/dashboard'))
	app.use('/', require('./routes/library'))
	// app.use('/view', oboRequire('routes/viewer'))
	// app.use('/editor', oboRequire('routes/editor'))
	// app.use('/lti', oboRequire('routes/lti'))
	// app.use('/api/drafts', oboRequire('routes/api/drafts'))
	// app.use('/api/events', oboRequire('routes/api/events'))
	// app.use('/api/media', oboRequire('routes/api/media'))
	// app.use('/api/visits', oboRequire('routes/api/visits'))
	// app.use('/profile', oboRequire('routes/profile'))

	// =========== REGISTER OBOJOBO DRAFT CHUNKS ===========
	// registerChunks(app)
})

module.exports = app
