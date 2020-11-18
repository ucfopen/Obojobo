const NonceStore = require('ims-lti').Stores.NonceStore
const logger = oboRequire('server/logger')
const EXPIRE_IN_SEC = 5 * 60
const MAX_COUNT = 10000

class DevNonceStore extends NonceStore {
	constructor() {
		super()
		this.used = Object.create(null)
	}

	isNew(nonce, timestamp, next = () => {}) {
		if (
			typeof nonce === 'undefined' ||
			nonce === null ||
			typeof nonce === 'function' ||
			typeof timestamp === 'function' ||
			typeof timestamp === 'undefined'
		) {
			return next(new Error('Invalid parameters'), false)
		}

		this._clearExpiredNonces()

		// eslint-disable-next-line no-undefined
		const firstTimeSeen = this.used[nonce] === undefined

		if (!firstTimeSeen) {
			logger.warn(`Nonce already seen ${nonce}`)
			return next(null, true)
		}

		// eslint-disable-next-line no-unused-vars
		this.setUsed(nonce, timestamp, err => {
			if (typeof timestamp !== 'undefined' && timestamp !== null) {
				timestamp = parseInt(timestamp, 10)
				const currentTime = Math.round(Date.now() / 1000)

				const timestampIsFresh = currentTime - timestamp <= EXPIRE_IN_SEC

				if (timestampIsFresh) {
					next(null, true)
				} else {
					logger.warn(
						`Timestamp is Expired - current:${currentTime} - lti timestamp:${timestamp} <= age limit:${EXPIRE_IN_SEC} - expired: ${currentTime -
							timestamp -
							EXPIRE_IN_SEC}s ago`
					)
					next(null, true)
				}
			} else {
				next(new Error('Timestamp required'), false)
			}
		})
	}

	setUsed(nonce, timestamp, next = () => {}) {
		timestamp = parseInt(timestamp, 10)
		this.used[nonce] = timestamp + EXPIRE_IN_SEC
		next(null)
	}

	_clearExpiredNonces() {
		const now = Math.round(Date.now() / 1000)
		const nonceKeys = Object.keys(this.used)
		let cleared = 0

		// clear all expired nonces and any that are over our limit
		nonceKeys.forEach((key, index) => {
			if (this.used[key] <= now || index >= MAX_COUNT) {
				cleared++
				delete this.used[key]
			}
		})

		logger.info(`${nonceKeys.length - cleared} lti nonce keys stored`)
	}
}

module.exports = DevNonceStore
