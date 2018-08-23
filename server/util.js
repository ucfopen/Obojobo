const logger = oboRequire('logger')

const logAndRespondToUnexpected = (errorMessage, res, req, jsError) => {
	logger.error('logAndRespondToUnexpected', errorMessage, jsError)
	res.unexpected(errorMessage)
}

const getRandom = () => Math.random()

module.exports = {
	getRandom,
	logAndRespondToUnexpected
}
