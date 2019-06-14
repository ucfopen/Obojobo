const flattenArray = array => {
	let result = []
	if (!array) return null
	array.forEach(data => {
		result = [...result].concat(data)
	})
	return result
}

const searchNodeModulesForOboNodesCache = []
const searchNodeModulesForOboNodes = (forceReload = false) => {
	if (searchNodeModulesForOboNodesCache.length > 0 && !forceReload) return [...searchNodeModulesForOboNodesCache]
	searchNodeModulesForOboNodesCache.length = 0 // clear the array
	// use yarn to get a list of obojobo-* node_modules
	const packageSearchOut = require('child_process').execSync('yarn list --pattern obojobo-')
	const pattern = /obojobo-[^@]+/gi
	const packages = packageSearchOut.toString().match(pattern)
	packages.forEach(pkg => {
		try {
			pkg = pkg.trim()
			const manifest = require(pkg)
			if (manifest.obojobo) searchNodeModulesForOboNodesCache.push(pkg)
		} catch (error) {
			if(!error.message.includes('Cannot find module')){
				console.log(error)
			}
			// do nothing if there's no index.js
		}
	})
	return [...searchNodeModulesForOboNodesCache]
}

const getOboNodeScriptPathsFromPackage = (oboNodePackage, type) => {
	const manifest = require(oboNodePackage) // load package index index.js
	if (!manifest.obojobo) return null
	let scripts
	if(type =='obonodes') type = 'server'

	if(type == 'middleware') scripts = manifest.obojobo.expressMiddleware
	else if(manifest.obojobo[`${type}Scripts`]){
		scripts = manifest.obojobo[`${type}Scripts`]
	}

	if (!scripts) return null
	return scripts
}

const getOboNodeScriptPathsFromPackageByTypeCache = new Map()
const getOboNodeScriptPathsFromPackageByType = (oboNodePackage, type) => {
	const cacheKey = `${oboNodePackage}-${type}`
	if(getOboNodeScriptPathsFromPackageByTypeCache.has(cacheKey)) return [...getOboNodeScriptPathsFromPackageByTypeCache.get(cacheKey)]
	let scripts = getOboNodeScriptPathsFromPackage(oboNodePackage, type)
	if (!scripts) return null
	// allow scriptss to be a single string - convert to an array to conform to the rest of this method
	if (!Array.isArray(scripts)) scripts = [scripts]

	// filter any missing values
	scripts = scripts.filter(a => a !== null)
	// node is just a string name, convert it to a full path
	const resolved = scripts.map(s => require.resolve(`${oboNodePackage}/${s}`))
	getOboNodeScriptPathsFromPackageByTypeCache.set(cacheKey, resolved)
	return [...resolved]
}


const getAllOboNodeScriptPathsByType = type => {
	const nodes = searchNodeModulesForOboNodes()
	const scripts = nodes.map(node => getOboNodeScriptPathsFromPackageByType(node, type))
	const flat = flattenArray(scripts)
	return flat.filter(a => a !== null)
}


const gatherClientScriptsFromModules = () => {
	const defaultOrderKey = '500'
	const modules = searchNodeModulesForOboNodes()
	const entries = {}

	/*
		gather all the clients scripts to build an object like:
		{
			// this is the entry name
			viewer:{
				// the keys here represent the sort position that is requested
				// note: 2 scripts that request the same sort position are not
				// guaranteed to be in order within that sort position
				0: ['path/to/script.js', 'path/to/another/script.js'],
				100: ['path/to/script.js', 'path/to/another/script.js'],

				// clientscripts with no sort order are all lumped into 500
				500: ['path/to/all/unordered/scripts.js', ...],
				...
			}
		}
	 */
	modules.forEach(oboNodePackage => {
		let items = getOboNodeScriptPathsFromPackage(oboNodePackage, 'client')
		for(let item in items){
			let key = item.toLowerCase()
			if(!entries[key]){
				entries[key] = {}
				entries[key][defaultOrderKey] = []
			}
			let script = items[item]

			// convert to array if not an array
			if (!Array.isArray(script)) script = [script]

			script.forEach(single => {
				if(typeof single === 'string'){
					entries[key][defaultOrderKey].push(require.resolve(`${oboNodePackage}/${single}`))
				}
				if(single.hasOwnProperty('file') && single.hasOwnProperty('position')){
					if(!entries[key][single.position]) entries[key][single.position] = []
					entries[key][single.position].push(require.resolve(`${oboNodePackage}/${single.file}`))
				}
			})
		}
	})

	// flatten the entries object above into a single dimensional array
	// using the sort keys to define the order
	let scripts = {}
	Object.keys(entries).forEach(entryName => {
		const entry = entries[entryName]
		const sortedOrderKeys = Object.keys(entry).sort((a,b) => a - b)
		scripts[entryName] = []
		sortedOrderKeys.forEach(key => {
			scripts[entryName] = [...scripts[entryName], ...entry[key]]
		})
	})

	return scripts
}

module.exports = {
	getOboNodeScriptPathsFromPackageByType,
	searchNodeModulesForOboNodes,
	getAllOboNodeScriptPathsByType,
	flattenArray,
	gatherClientScriptsFromModules
}
