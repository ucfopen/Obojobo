let fs = require('fs')
let configuration = {}

let getConfigFileData = (configFile, type) => {
	return JSON.parse(fs.readFileSync(configFile))[type]
}

let addToConfig = function(configFile, type, propertyName) {
	configuration[propertyName] = getConfigFileData(configFile, type)
	return configuration[propertyName]
}

db = getConfigFileData('./config/db.json', 'development')
// convert the json in db.json to an object our database libraries like
configuration.db = {
	host: db.host,
	port: db.port,
	database: db.database,
	user: db.user,
	password: db.password
};

addToConfig('./config/lti.json', 'development', 'lti')
addToConfig('./config/permission_groups.json', 'development', 'permissions')
addToConfig('./config/general.json', 'development', 'general')

module.exports = configuration
