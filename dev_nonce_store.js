let NonceStore = require('ims-lti').Stores.NonceStore
let logger = oboRequire('logger')

EXPIRE_IN_SEC = 5 * 60

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

		let firstTimeSeen = this.used[nonce] === undefined

		if (!firstTimeSeen) {
			logger.warn(`Nonce already seen ${nonce}`)
			return next(null, true)
		}

		this.setUsed(nonce, timestamp, err => {
			if (typeof timestamp !== 'undefined' && timestamp !== null) {
				timestamp = parseInt(timestamp, 10)
				let currentTime = Math.round(Date.now() / 1000)

				let timestampIsFresh = currentTime - timestamp <= EXPIRE_IN_SEC

				if (timestampIsFresh) {
					next(null, true)
				} else {
					logger.warn(
						`Timestamp is Expired - current:${currentTime} - lti timestamp:${timestamp} <= age limit:${EXPIRE_IN_SEC} - epried: ${currentTime -
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
		this.used[nonce] = timestamp + EXPIRE_IN_SEC
		next(null)
	}

	_clearExpiredNonces() {
		let now = Math.round(Date.now() / 1000)
		Object.keys(this.used).forEach(key => {
			logger.info(`Clearing nonce memory for ${key}`)
			if (this.used[key] <= now) delete this.used[key]
		})
		return
	}
}

module.exports = DevNonceStore
