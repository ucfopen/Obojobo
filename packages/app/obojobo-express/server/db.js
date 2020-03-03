const config = require('./config')
const pgOptions = {}

if (config.db.useBluebird === true) {
	// use bluebird to make db stacktraces usable
	const bluebird = require('bluebird')
	bluebird.config({ longStackTraces: true })
	pgOptions.promiseLib = bluebird
}

const pgp = require('pg-promise')(pgOptions)
const db = pgp(config.db)

module.exports = db
