const ltiMiddleware = require('express-ims-lti')
const DevNonceStore = oboRequire('dev_nonce_store')
const ltiUtil = oboRequire('lti')
const logger = oboRequire('logger')

/*
 Obojobo LTI Middleware abstraction
*/

module.exports = ltiMiddleware({
	nonceStore: new DevNonceStore(),
	addToSession: false,
	credentials: (key, callback) => {
		const secret = ltiUtil.findSecretForKey(key)

		if (!secret) {
			logger.error('LTI unable to find secret for key')
			return callback(new Error('Invalid LTI credentials'))
		}

		callback(null, key, secret)
	}
})
