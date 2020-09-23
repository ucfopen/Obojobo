// Default export namespaced to obojobo_server
// Use require('debug-logger')('otherNamespace') in files
// If a different namespace is needed

const logger = require('debug-logger')('obojobo_server')

// add a special method for logging error objects
logger.logError = (msg, error) => {
	logger.error(msg)
	logger.error(error)
	return msg
}

module.exports = logger
