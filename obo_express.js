/*
 OBOJOBO Express Middleware

 Install into your own express app using:
 app.use(require('obo_express'))
 Your parent express app will need:
   * a session handler
   * a body parser (if using 'body-parser', make sure json options is set to 1mb or higher)
   * a view engine that parses .pug
*/

global.oboRequire = require('./obo_require')
let express = require('express');
let app = express();
let DevNonceStore = oboRequire('dev_nonce_store');
let apiResponseDecorator = oboRequire('api_response_decorator');
let ltiMiddleware = require('express-ims-lti');
let loadBalancerHelperMiddleware = oboRequire('express_load_balancer_helper')
let currentUserMiddleware = oboRequire('express_current_user')
let ltiLaunchMiddlerware = oboRequire('express_lti_launch')
let registerChunks = oboRequire('express_register_chunks')
let ltiUtil = oboRequire('lti')

// when the parent app is mounted
app.on('mount', (app) => {
	// =========== MIDDLEWARE ===========
	app.use(loadBalancerHelperMiddleware)
	app.use(currentUserMiddleware)
	app.use(ltiMiddleware({
		nonceStore: new DevNonceStore(),
		credentials: (key, callback) => {
			try{
				let secret = ltiUtil.findSecretForKey(key)
				callback(null, key, secret)
			}
			catch(err){
				callback(new Error('Invalid LTI credentials'))
			}
		}
	}))
	app.use('/view/:draftId*', ltiLaunchMiddlerware)
	app.use('/api', apiResponseDecorator);

	// =========== REGISTER OBOJOBO DRAFT CHUNKS ===========
	registerChunks(app)

	// =========== ROUTING & CONTROLERS ===========
	app.use('/view', oboRequire('routes/viewer'));
	app.use('/editor', oboRequire('routes/editor'));
	app.use('/lti', oboRequire('routes/lti'));
	app.use('/api/drafts', oboRequire('routes/api/drafts'))
	app.use('/api/events', oboRequire('routes/api/events'))
	app.use('/api/states', oboRequire('routes/api/states'))
})

module.exports = app
