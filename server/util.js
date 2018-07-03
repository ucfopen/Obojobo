const logger = oboRequire('logger')

const logAndRespondToUnexpected = (errorMessage, res, req, jsError) => {
	logger.error('logAndRespondToUnexpected', errorMessage, jsError)
	res.unexpected(errorMessage)
}

module.exports = {
	logAndRespondToUnexpected
}
