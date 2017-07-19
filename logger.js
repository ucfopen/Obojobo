const debug = require('debug')

const logger_debug = debug('obojobo_server:debug')
const logger_error = debug('obojobo_server:error')
const logger_info = debug('obojobo_server:info')
const logger_warn = debug('obojobo_server:warn')

const logger = {
	debug: logger_debug,
	error: logger_error,
	info: logger_info,
	warn: logger_warn
}

logger.debug.log = console.log.bind(console)
logger.info.log = console.info.bind(console)
logger.warn.log = console.warn.bind(console)

module.exports = logger
