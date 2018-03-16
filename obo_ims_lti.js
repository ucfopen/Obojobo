let ltiMiddleware = require('express-ims-lti')
let DevNonceStore = oboRequire('dev_nonce_store')
let ltiUtil = oboRequire('lti')
let logger = oboRequire('logger')

/*
 Obojobo LTI Middleware abstraction
*/

module.exports = ltiMiddleware({
	nonceStore: new DevNonceStore(),
	addToSession: false,
	credentials: (key, callback) => {
		let secret = ltiUtil.findSecretForKey(key)

		if (!secret) {
			logger.error('LTI unable to find secret for key', err)
			return callback(new Error('Invalid LTI credentials'))
		}

		callback(null, key, secret)
	}
})
