let fs = require('fs')
let path = require('path')

// Feed assetForEnv() asset urls with our special dev/prod markup
// EX: 'public/compiled/obo-draft-viewer$[.full|.min].js'
// in dev, returns: 'public/compiled/obo-draft-viewer.full.js'
// in prod, returns: 'public/compiled/obo-draft-viewer.min.js'
// the `|` character seperates dev from prod strings, with dev being first
// If | is ommited, it is assumed there is no value for non-production strings
//
// Pattern built to allow urls like:
// public/compiled/obo-draft-viewer$[.full|.min].js
// $2 = '.full'
// $3 = '.min'
//
// public/compiled/obo-draft-viewer$[.min].js
// $2 = undefined
// $3 = '.min'
//
// public/compiled/obo-draft-viewer$[.${somevar}|.${somevar}.min].js
// $2 = ".${somevar}"
// $3 = '.${somevar}.min'
//
const patternRegex = new RegExp(/\$\[(([^\|]+)\|)?(.+?)\]/)
const assetForEnv = (assetPath, forceEnvTo = null) => {
	let result
	switch (getEnv(forceEnvTo)) {
		case 'test':
		case 'dev':
		case 'development':
			result = assetPath.replace(patternRegex, '$2')
			break

		case 'prod':
		case 'production':
			result = assetPath.replace(patternRegex, '$3')
			break
	}

	return result
}

const getEnv = (forceEnvTo = null) => {
	return (forceEnvTo ? forceEnvTo : process.env.NODE_ENV).toLowerCase()
}

module.exports = {
	assetForEnv: assetForEnv
}
