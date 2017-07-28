const fs = require('fs')
const path = require('path')
const glob = require('glob')
const logger = oboRequire('logger')

let memoizedValues = {}

// collect installed obojobo assets
let getInstalledModules = (configEnv = 'production') => {
	if (memoizedValues.hasOwnProperty(configEnv)) return memoizedValues[configEnv]

	// WHERE SHOULD WE LOOK FOR obojobo.json files
	let searchPaths = ['./node_modules/*/obojobo.json']
	let packageNameRegex = new RegExp(/node_modules[\\\/](.+?)[\\\/].*/i)
	let assetFiles = new Set()
	let expressFiles = new Set()
	let draftNodes = new Map()

	/*
	  Find which modules to exclude
	  Builds an excludeMap where the key is the node module and the value is an array of obojobo chunk names
	  node_module or chunk name's value can be *, indicating all
	*/
	let excludeMap = new Map()
	let excludeConfig = JSON.parse(fs.readFileSync('./config/draft.json'))[configEnv]
	if (excludeConfig.hasOwnProperty('excludeModules')) {
		excludeConfig.excludeModules.forEach(item => {
			let [module, name] = item.split(':')
			if (excludeMap.has(module)) {
				excludeMap.get(module).push(name)
			} else {
				excludeMap.set(module, [name])
			}
		})
	}

	/*
	  Loop through each obojobo.json in the search path, adding assets
	*/
	let allModuleExcludeRoles = excludeMap.has('*') ? excludeMap.get('*') : []

	searchPaths.forEach(search => {
		files = glob.sync(search)
		files.forEach(file => {
			let moduleExludeRules = [].concat(allModuleExcludeRoles) // add rules set for all modules
			let match = file.match(packageNameRegex)
			let moduleName = match ? match[1] : null

			// add rules set for this module
			if (moduleName && excludeMap.has(moduleName)) {
				moduleExludeRules = moduleExludeRules.concat(excludeMap.get(moduleName))
			}

			let content = fs.readFileSync(file)
			let json = JSON.parse(content)
			if (json.hasOwnProperty('modules')) {
				let libDir = path.dirname(file)

				json['express'].forEach(express => {
					expressFiles.add(path.resolve(libDir, express))
				})

				json['modules'].forEach(module => {
					let name = module.name
					delete module.name

					// Should we exclude this module?
					if (moduleExludeRules.length) {
						if (moduleExludeRules.includes('*') || moduleExludeRules.includes(name)) {
							logger.info(`🚫 Excluded ${moduleName}:${name}`)
							return
						}
					}

					// verify the files exist
					for (let i in module) {
						module[i] = path.resolve(libDir, module[i])
						if (!fs.existsSync(module[i])) {
							throw new Error(
								`File Missing: "${path.basename(
									module[i]
								)}" for "${name}" registered in ${libDir}/obojobo.json`
							)
						}
					}

					// add to the manifest
					logger.info(`➕ Added ${moduleName}:${name}`)
					if (module.hasOwnProperty('viewerScript')) assetFiles.add(module.viewerScript)
					if (module.hasOwnProperty('viewerCSS')) assetFiles.add(module.viewerCSS)
					if (module.hasOwnProperty('draftNode')) draftNodes.set(name, module.draftNode)
				})
			}
		})
	})

	memoizedValues[configEnv] = {
		express: Array.from(expressFiles),
		assets: Array.from(assetFiles),
		draftNodes: draftNodes
	}

	return memoizedValues[configEnv]
}

module.exports = getInstalledModules
