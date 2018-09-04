let ltiMiddleware = require('express-ims-lti')
let DevNonceStore = oboRequire('dev_nonce_store')
let ltiUtil = oboRequire('lti')

/*
 Obojobo LTI Middleware abstraction
*/

module.exports = ltiMiddleware({
	nonceStore: new DevNonceStore(),
	credentials: (key, callback) => {
		try {
			let secret = ltiUtil.findSecretForKey(key)
			callback(null, key, secret)
		} catch (err) {
			callback(new Error('Invalid LTI credentials'))
		}
	}
})
