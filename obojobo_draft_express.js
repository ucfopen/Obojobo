let express = require('express');
let app = express();
let lti  = require("ims-lti");
let DevNonceStore = oboRequire('dev_nonce_store');
let db = oboRequire('db')
let apiResponseDecorator = oboRequire('api_response_decorator');
let ltiMiddleware = require('express-ims-lti');
let loadBalancerHelperMiddleware = oboRequire('express_load_balancer_helper')
let currentUserMiddleware = oboRequire('express_current_user')
let ltiLaunchMiddlerware = oboRequire('express_lti_launch')
let registerChunks = oboRequire('express_register_chunks')
let EventEmitter = require('events');
let ltiUtil = oboRequire('lti')

// Global event emitter for the application
// Not ideal to store this as a global, buuuut
global.oboEvents = new EventEmitter(this);
global.oboEvents.on('client:saveState', (event, req) => {
	req.requireCurrentUser()
	.then(user => {
		let data = {
			_id: `${currentUser.id}:${event.draft_id}:${event.draft_rev}`,
			userId: currentUser.id,
			metadata: metadata,
			payload: payload
		};

		db.none(`
			INSERT INTO view_state
			(user_id, metadata, payload)
			VALUES($[userId], $[metadata], $[payload])`
			, data)
		.then(result => {
			return true;
		})
		.catch(error => {
			console.log(error);
			res.error(404).json({error:'Draft not found'})
		})
	})
});

app.on('mount', (app) => {
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
	registerChunks(app)

	// =========== ROUTING & CONTROLERS ===========
	app.use('/', oboRequire('/routes/index'));
	app.use('/', oboRequire('routes/viewer'));
	app.use('/', oboRequire('routes/editor'));
	app.use('/lti', oboRequire('routes/lti'));
	app.use('/api/drafts', oboRequire('routes/api/drafts'))
	app.use('/api/events', oboRequire('routes/api/events'))
	app.use('/api/states', oboRequire('routes/api/states'))
})

module.exports = app
