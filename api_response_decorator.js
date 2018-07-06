const inflector = require('json-inflector')
const logger = oboRequire('logger')

const camelize = o => {
	return inflector.transform(o, 'camelizeLower')
}

const success = (req, res, next, valueObject) => {
	return res.status(200).json(
		camelize({
			status: 'ok',
			value: valueObject
		})
	)
}

const badInput = (req, res, next, message) => {
	return res.status(422).json(
		camelize({
			status: 'error',
			value: {
				type: 'badInput',
				message: message
			}
		})
	)
}

const notAuthorized = (req, res, next, message) => {
	return res.status(401).json(
		camelize({
			status: 'error',
			value: {
				type: 'notAuthorized',
				message: message
			}
		})
	)
}

const reject = (req, res, next, message) => {
	return res.status(403).json(
		camelize({
			status: 'error',
			value: {
				type: 'reject',
				message: message
			}
		})
	)
}

const missing = (req, res, next, message) => {
	return res.status(404).json(
		camelize({
			status: 'error',
			value: {
				type: 'missing',
				message: message
			}
		})
	)
}

const unexpected = (req, res, next, message) => {
	if (message instanceof Error) {
		logger.error('error thrown', message.stack)
		message = message.toString()
	} else {
		logger.error('error message', message)
	}

	return res.status(500).json(
		camelize({
			status: 'error',
			value: {
				type: 'unexpected',
				message: message
			}
		})
	)
}

module.exports = (req, res, next) => {
	// partially apply function with bind
	res.success = success.bind(this, req, res, next)
	res.missing = missing.bind(this, req, res, next)
	res.badInput = badInput.bind(this, req, res, next)
	res.notAuthorized = notAuthorized.bind(this, req, res, next)
	res.unexpected = unexpected.bind(this, req, res, next)
	res.reject = reject.bind(this, req, res, next)
	next()
}
