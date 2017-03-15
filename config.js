let fs = require('fs')
let configuration = {}

// Database
let db = fs.readFileSync('./config/db.json');
db = JSON.parse(db)['development']; // @TODO: use environment variable
configuration.db = db
configuration.db.connectionString = `${db.driver}://${db.user}:${db.password}@${db.host}:${db.port}/${db.database}`

let lti = fs.readFileSync('./config/lti.json');
lti = JSON.parse(lti)['development']
configuration.lti = lti

module.exports = configuration
