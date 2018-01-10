let ltiMiddleware = require('express-ims-lti')
let DevNonceStore = oboRequire('dev_nonce_store')
let ltiUtil = oboRequire('lti')
let logger = oboRequire('logger')

/*
 Obojobo LTI Middleware abstraction
*/

module.exports = ltiMiddleware({
	nonceStore: new DevNonceStore(),
	credentials: (key, callback) => {
		try {
			let secret = ltiUtil.tryFindSecretForKey(key)
			callback(null, key, secret)
		} catch (err) {
			logger.error('LTI unable to find secret for key', err)
			callback(new Error('Invalid LTI credentials'))
		}
	}
})
