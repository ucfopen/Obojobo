let fs = require('fs')
let configuration = {}

// Database
let db = fs.readFileSync('./config/db.json');
db = JSON.parse(db)['development']; // @TODO: use environment variable

// convert the json in db.json to an object our database libraries like
configuration.db = {
	host: db.host,
	port: db.port,
	database: db.database,
	user: db.user,
	password: db.password
};


let lti = fs.readFileSync('./config/lti.json');
lti = JSON.parse(lti)['development']
configuration.lti = lti

module.exports = configuration
