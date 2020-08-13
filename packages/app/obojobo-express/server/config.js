const fs = require('fs')
const path = require('path')
const logger = require('./logger')
const configuration = {}
const CONFIG_DIR = path.resolve(__dirname, 'config')
const env = process.env.NODE_ENV || 'development'
const deepFreeze = require('deep-freeze')
const { getAllOboNodeRegistryDirsByType } = require('obojobo-lib-utils')
const camelCase = require('camelcase')

// returns true if `name` ends with _JSON and `json` is actually json
// trhows error if `name` ends with _JSON BUT `json` isn't json
const isStringJSON = (name, json) => {
	if (!name.endsWith('_JSON')) return false
	try {
		JSON.parse(json)
		return true
	} catch (error) {
		throw new Error(`Expected ENV ${name} to be valid JSON, but it did not parse`)
	}
}

// replace any JSON string matching configKey: {"ENV": "CONFIG_VAR"} with
// values from process.env
//
// EXAMPLE
// process.env.CONFIG_VAR = 'Ok, Alex'
// my-config.json = { configKey: {"ENV": "CONFIG_VAR"} }
// return = { configKey: 'Ok, Alex' }
const replaceENVsInJson = originalJson => {
	const pattern = /\{\s*"ENV"\s*?:\s*?"(.*?)"\s*\}/gi // matches json '{ "ENV": "CONFIG_VAR" }'
	let result

	let replacedJson = originalJson
	while ((result = pattern.exec(originalJson))) {
		const envVar = result[1]
		if (!process.env[envVar]) {
			throw new Error(`Expected ENV var ${envVar} is not set`)
		} else {
			let replacement = process.env[envVar]
			const isJSON = isStringJSON(envVar, replacement)

			// if JSON, recurse to allow env replacement inside json
			if (isJSON) replacement = replaceENVsInJson(replacement)

			// if the value isnt true, false, or an integer, wrap it with quotes
			if (
				!isJSON &&
				typeof replacement === 'string' &&
				replacement !== 'true' &&
				replacement !== 'false' &&
				!/^\d+$/g.test(replacement)
			) {
				replacement = `"${replacement}"`
			}
			// replace without changing pattern.exec()'s position in originalJson
			replacedJson = replacedJson.replace(result[0], replacement)
		}
	}

	return replacedJson
}

// synchronously loads a json config file
// combines settings into an object with env overiding defaults
// returns frozen object containing config data
const getConfigFileData = (configFile, env) => {
	try {
		// sync because this only happens on startup
		const config = JSON.parse(fs.readFileSync(configFile))
		const defaultObject = config.default ? config.default : {}
		let envObject = config[env] ? config[env] : {}

		if (!config[env] && !config.default) {
			throw new Error(`Missing config environment for "default" and "${env}" for ${configFile}`)
		}

		if (config[env]) {
			const hydratedJson = replaceENVsInJson(JSON.stringify(envObject))
			envObject = JSON.parse(hydratedJson)
		}

		// combine with default if it exists
		return deepFreeze({ ...defaultObject, ...envObject })
	} catch (error) {
		logger.error(`Error loading config file: ${configFile}`)
		logger.error(error.toString())
		return deepFreeze({})
	}
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

// collect configuration from all installed modules
const configDirs = getAllOboNodeRegistryDirsByType('config')

// load each json config file and place it in the
// configuration object
configDirs.forEach(dir => {
	const path = require('path');
	const fs = require('fs');
	// sync because this only happens on startup
	const files = fs.readdirSync(dir)
	files.forEach(file => {
		if(!file.endsWith('.json')) return
		const name = camelCase(path.basename(file, '.json'))
		const fPath = path.join(dir, file)
		if(configuration[name] !== undefined) logger.error(`Config name ${name} already registered, not loading: ${fPath}`)
		const cfg = getConfigFileData(fPath, env)
		if(cfg) configuration[name] = cfg
	})
})

module.exports = configuration
