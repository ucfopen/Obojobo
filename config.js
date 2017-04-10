let fs = require('fs')
let configuration = {}

let env = 'development' //@TODO

let getConfigFileData = (configFile, type) => {
	return JSON.parse(fs.readFileSync(configFile))[type]
}

let addToConfig = function(configFile, type, propertyName) {
	configuration[propertyName] = getConfigFileData(configFile, type)
	return configuration[propertyName]
}

db = getConfigFileData('./config/db.json', env)
// convert the json in db.json to an object our database libraries like
configuration.db = {
	host: db.host,
	port: db.port,
	database: db.database,
	user: db.user,
	password: db.password
};

addToConfig('./config/lti.json', env, 'lti')
addToConfig('./config/permission_groups.json', env, 'permissions')
addToConfig('./config/draft.json', env, 'draft')
addToConfig('./config/general.json', env, 'general')

module.exports = configuration
