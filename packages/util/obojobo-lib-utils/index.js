const path = require('path')

const flattenArray = (array) => {
	let result = []
	if(!array) return null
	array.forEach(data => {result = [...result].concat(data)})
	return result
}

const { oboNodePackages } = require('../../../obojobo') // load obojob.js from main repo


const cachedOboNodeList = []
const searchNodeModulesForOboNodes = (forceReload = false) => {
	if(cachedOboNodeList.length > 0 && !forceReload) return cachedOboNodeList
	cachedOboNodeList.length = 0 // clear the array
	// use yarn to get a list of obojobo-* node_modules
	const packageSearchOut = require('child_process').execSync('yarn list --pattern obojobo-')
	const pattern = /obojobo-[^@]+/ig
	const packages = packageSearchOut.toString().match(pattern)

	packages.forEach(pkg => {
		try{
			const manifest = require(pkg)
			if(manifest.obojobo) cachedOboNodeList.push(pkg)
		} catch(error){
			// do nothing - it's ok if one of these packages has no index.js
		}
	})


	return [... cachedOboNodeList]
}

const getOboNodeScriptPathsFromPackageByType = (oboNodePackage, type) => {
	const manifest = require(oboNodePackage) // load package index index.js
	if(!manifest.obojobo) return null
	let scripts

	switch(type){
		case 'viewer':
			scripts = manifest.obojobo.viewerScripts
			break;

		case 'editor':
			scripts = manifest.obojobo.editorScripts
			break;

		case 'obonodes':
			scripts = manifest.obojobo.serverScripts
			break;

		case 'middleware':
			scripts = manifest.obojobo.expressMiddleware
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


const getAllOboNodeScriptPathsByType = (type) => {
	const nodes = searchNodeModulesForOboNodes()
	const scripts = nodes.map(node => getOboNodeScriptPathsFromPackageByType(node, type))
	const flat =  flattenArray(scripts)
	return flat.filter(a => a != null)
}


module.exports = {
	getOboNodeScriptPathsFromPackageByType,
	searchNodeModulesForOboNodes,
	getAllOboNodeScriptPathsByType
}
