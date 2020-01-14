const ltiMiddleware = require('express-ims-lti')
const DevNonceStore = oboRequire('server/dev_nonce_store')
const ltiUtil = oboRequire('server/lti')
const logger = oboRequire('server/logger')

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
