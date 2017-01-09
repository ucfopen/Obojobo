var pgp = require('pg-promise')(/*options*/)
var db = pgp('postgres://postgres:mysecretpassword@127.0.0.1:5432/postgres')

module.exports = db
