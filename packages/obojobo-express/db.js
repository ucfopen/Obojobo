let pgp = require('pg-promise')(/*options*/)
let config = require('./config')

let db = pgp(config.db)

module.exports = db
