const config = require('./config')
const pgOptions = {}

if (config.db.useBluebird === true) {
	// use bluebird to make db stacktraces usable
	const bluebird = require('bluebird')
	bluebird.config({ longStackTraces: true })
	pgOptions.promiseLib = bluebird
}

// disable unwanted warnings from pg-promise in test
// ex: WARNING: Creating a duplicate database object for the same connection.
if (process.env['NODE_ENV'] === 'test') {
	pgOptions.noWarnings = true
}

const pgp = require('pg-promise')(pgOptions)
const db = pgp(config.db)

module.exports = db
