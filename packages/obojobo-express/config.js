const fs = require('fs')
const logger = require('./logger')
const configuration = {}

let env = 'development'

if (process.env.NODE_ENV) {
	env = process.env.NODE_ENV
}

// if DATABASE_URL is set, use it to override the other database params
// expects DATABASE_URL to be HEROKU format like 'postgres://user:password@domain:port/dbname'
// NOTE db-migrate commands will automatically use HEROKU's DATABASE_URL, skipping our config
if (process.env.DATABASE_URL){
	let url = require('url')
	let dburl = url.parse(process.env.DATABASE_URL)
	process.env.DB_USER = dburl.auth.split(':')[0]
	process.env.DB_PASS = dburl.auth.split(':')[1]
	process.env.DB_HOST = dburl.hostname
	process.env.DB_NAME = dburl.path.substring(1)
	process.env.DB_PORT = dburl.port
}

let replaceENVsInObject = json => {
	const rawJson = JSON.stringify(json) // convert back to string

	// replace any "ENV": "CONFIG_VAR" settings with
	// values from procesess.env
	const pattern = /\{\s*"ENV"\s*?:\s*?"(.*?)"\s*\}/gi
	let result

	let replacedJson = rawJson
	while( (result = pattern.exec(rawJson)) ){
		if(!process.env[result[1]]){
			throw new Error(`Expected ENV var ${result[1]} is not set`)
		}
		else{
			let replacement = process.env[result[1]]
			// if the value isnt true, false, or an integer, wrap it with quotes
			if(replacement !== 'true' && replacement !== 'false' && !(/^\d+$/g.test(replacement))){
				replacement = `"${replacement}"`
			}
			// replace without changing pattern.exec()'s position in rawJson
			replacedJson = replacedJson.replace(result[0], replacement)
		}
	}

	json = JSON.parse(replacedJson) // convert back to object
	return json
}

const getConfigFileData = (configFile, env) => {
	try{
		const rawJson = fs.readFileSync(configFile) // load
		const json = JSON.parse(rawJson) // parse
		const defaultObject = json.default ? json.default : {}
		let envObject = json[env] ? json[env] : {}

		if(!json[env] && !json.default){
			throw new Error(`Missing config environment for "default" and "${env}"`)
		}

		if(json[env]){
			envObject = replaceENVsInObject(envObject)
		}

		return Object.assign({}, defaultObject, envObject) // combine with default if it exists

	} catch (error){
		logger.error(`Error loading config file: ${configFile}`)
		logger.error(error)
	}
	return {}
}

const addToConfig = function(configFile, env, configGroup) {
	configuration[configGroup] = getConfigFileData(configFile, env)
	return configuration[configGroup]
}

addToConfig('./config/db.json', env, 'db')
addToConfig('./config/lti.json', env, 'lti')
addToConfig('./config/permission_groups.json', env, 'permissions')
addToConfig('./config/draft.json', env, 'draft')
addToConfig('./config/general.json', env, 'general')

module.exports = configuration
