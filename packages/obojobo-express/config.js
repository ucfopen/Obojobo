const fs = require('fs')
const logger = require('./logger')
const configuration = {}

const CONFIG_DIR = './config'

let env = 'development'

if (process.env.NODE_ENV) {
	env = process.env.NODE_ENV
}

// if DATABASE_URL is set, use it to override the other database params
// expects DATABASE_URL to be HEROKU format like 'postgres://user:password@domain:port/dbname'
// NOTE db-migrate commands will automatically use HEROKU's DATABASE_URL, skipping our config
if (process.env.DATABASE_URL) {
	const url = require('url')
	const dburl = url.parse(process.env.DATABASE_URL)
	process.env.DB_USER = dburl.auth.split(':')[0]
	process.env.DB_PASS = dburl.auth.split(':')[1]
	process.env.DB_HOST = dburl.hostname
	process.env.DB_NAME = dburl.path.substring(1)
	process.env.DB_PORT = dburl.port
}

const replaceENVsInObject = configObject => {
	const rawJson = JSON.stringify(configObject) // convert back to string

	// replace any "ENV": "CONFIG_VAR" settings with
	// values from procesess.env
	const pattern = /\{\s*"ENV"\s*?:\s*?"(.*?)"\s*\}/gi
	let result

	let replacedJson = rawJson
	while ((result = pattern.exec(rawJson))) {
		if (!process.env[result[1]]) {
			throw new Error(`Expected ENV var ${result[1]} is not set`)
		} else {
			let replacement = process.env[result[1]]
			// if the value isnt true, false, or an integer, wrap it with quotes
			if (replacement !== 'true' && replacement !== 'false' && !/^\d+$/g.test(replacement)) {
				replacement = `"${replacement}"`
			}
			// replace without changing pattern.exec()'s position in rawJson
			replacedJson = replacedJson.replace(result[0], replacement)
		}
	}

	return JSON.parse(replacedJson) // convert back to object
}

const getConfigFileData = (configFile, env) => {
	try {
		const config = JSON.parse(fs.readFileSync(configFile))
		const defaultObject = config.default ? config.default : {}
		let envObject = config[env] ? config[env] : {}

		if (!config[env] && !config.default) {
			throw new Error(`Missing config environment for "default" and "${env}" for ${configFile}`)
		}

		if (config[env]) {
			envObject = replaceENVsInObject(envObject)
		}

		return Object.assign({}, defaultObject, envObject) // combine with default if it exists
	} catch (error) {
		logger.error(`Error loading config file: ${configFile}`)
		logger.error(error.toString())

		return {}
	}
}

configuration.db = getConfigFileData(`${CONFIG_DIR}/db.json`, env)
configuration.lti = getConfigFileData(`${CONFIG_DIR}/lti.json`, env)
configuration.permissions = getConfigFileData(`${CONFIG_DIR}/permission_groups.json`, env)
configuration.draft = getConfigFileData(`${CONFIG_DIR}/draft.json`, env)
configuration.general = getConfigFileData(`${CONFIG_DIR}/general.json`, env)
configuration.media = getConfigFileData(`${CONFIG_DIR}/media.json`, env)

module.exports = configuration
