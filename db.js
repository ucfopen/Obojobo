const pgp = require('pg-promise')(/*options*/)
const config = require('./config')

const db = pgp(config.db)

module.exports = db
