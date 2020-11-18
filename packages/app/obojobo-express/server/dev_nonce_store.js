const NonceStore = require('ims-lti').Stores.NonceStore
const logger = oboRequire('server/logger')
const EXPIRE_IN_SEC = 5 * 60
const MAX_NONCE_COUNT = 500000

class DevNonceStore extends NonceStore {
	constructor() {
		super()
		this.used = new Map()
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
		const firstTimeSeen = !this.used.has(nonce)

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
		this.used.set(nonce, timestamp + EXPIRE_IN_SEC)
		next(null)
	}

	_clearExpiredNonces() {
		const now = Math.round(Date.now() / 1000)

		// store number of items to cull
		let reduceCount = this.used.size - MAX_NONCE_COUNT

		// iterate over noncemap
		const iterator1 = this.used[Symbol.iterator]()
		for (const [nonce, timestamp] of iterator1) {
			if (reduceCount > 0) {
				// above max count, remove (FIFO)
				this.used.delete(nonce)
				reduceCount--
			} else if (timestamp <= now) {
				// expired
				this.used.delete(nonce)
			}
		}

		logger.info(`${this.used.size} lti nonce keys stored`)
	}
}

module.exports = DevNonceStore
