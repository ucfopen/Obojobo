let pgp = require('pg-promise')(/*options*/)
let config = require('./config')

let cn = {
	host: config.db.host,
	port: config.db.port,
	database: config.db.database,
	user: config.db.user,
	password: config.db.password
}

let db = pgp(cn);

module.exports = db;
