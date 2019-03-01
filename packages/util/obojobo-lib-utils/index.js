const path = require('path')

const flattenArray = (array) => {
	let result = []
	if(!array) return null
	array.forEach(data => {result = [...result].concat(data)})
	return result
}

const getOboNodeScriptPathsByType = (oboNodePackage, type) => {
	const registration = require(oboNodePackage) // load package index index.js
	let scripts

	switch(type){
		case 'viewer':
			scripts = registration.obojoboViewerScripts
			break;

		case 'editor':
			scripts = registration.obojoboEditorScripts
			break;

		case 'server':
			scripts = registration.obojoboServerScripts
			break;

		case 'middleware':
			scripts = registration.obojoboExpressMiddleware
			break;
	}

	if(!scripts) return null

	// allow scriptss to be a single string - convert to an array to conform to the rest of this method
	if(!Array.isArray(scripts)) scripts = [scripts]

	// filter any missing values
	scripts = scripts.filter(a => a != null)

	// node is just a string name, convert it to a full path
	return scripts.map(s => require.resolve(`${oboNodePackage}${path.sep}${s}`))
}

const getAllOboNodeScriptPathsByType = (oboNodePackages, type) => {
	const scripts = oboNodePackages.map(node => getOboNodeScriptPathsByType(node, type))
	const flat =  flattenArray(scripts)
	return flat.filter(a => a != null)
}


module.exports = {
	getOboNodeScriptPathsByType,
	getAllOboNodeScriptPathsByType
}
