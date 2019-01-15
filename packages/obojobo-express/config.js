const fs = require('fs')
const configuration = {}
let env = 'development'

const CONFIG_DIR = `${__dirname}/config`

if (process.env.NODE_ENV) {
	env = process.env.NODE_ENV
}

const getConfigFileData = (configFile, type) => {
	// should convert to use path
	const json = JSON.parse(fs.readFileSync(`${configFile}`))
	return json[type]
}

const addToConfig = function(configFile, type, propertyName) {
	configuration[propertyName] = getConfigFileData(`${CONFIG_DIR}/${configFile}`, type)
	return configuration[propertyName]
}

const db = getConfigFileData(`${CONFIG_DIR}/db.json`, env)
// convert the json in db.json to an object our database libraries like
configuration.db = {
	host: db.host,
	port: db.port,
	database: db.database,
	user: db.user,
	password: db.password
}

addToConfig('lti.json', env, 'lti')
addToConfig('permission_groups.json', env, 'permissions')
addToConfig('draft.json', env, 'draft')
addToConfig('general.json', env, 'general')

module.exports = configuration
