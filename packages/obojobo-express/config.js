const fs = require('fs')
const configuration = {}
let env = 'development'

if (process.env.NODE_ENV) {
	env = process.env.NODE_ENV
}

const getConfigFileData = (configFile, type) => {
	const json = JSON.parse(fs.readFileSync(configFile))
	return json[type]
}

const addToConfig = function(configFile, type, propertyName) {
	configuration[propertyName] = getConfigFileData(configFile, type)
	return configuration[propertyName]
}

const db = getConfigFileData('./config/db.json', env)
// convert the json in db.json to an object our database libraries like
configuration.db = {
	host: db.host,
	port: db.port,
	database: db.database,
	user: db.user,
	password: db.password
}

addToConfig('./config/lti.json', env, 'lti')
addToConfig('./config/permission_groups.json', env, 'permissions')
addToConfig('./config/draft.json', env, 'draft')
addToConfig('./config/general.json', env, 'general')
addToConfig('./config/media.json', env, 'media')

module.exports = configuration
