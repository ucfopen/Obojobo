const fs = require('fs')
const path = require('path')
const glob = require('glob')
const logger = oboRequire('logger')
const config = oboRequire('config')

const memoizedValues = {}

// collect installed obojobo assets
const getInstalledModules = (configEnv = 'production') => {
	if (memoizedValues.hasOwnProperty(configEnv)) return memoizedValues[configEnv]

	// WHERE SHOULD WE LOOK FOR obojobo.json files
	const searchPaths = ['../../node_modules/*/obojobo.json']
	const packageNameRegex = new RegExp(/node_modules[\\/](.+?)[\\/].*/i)
	const assetFiles = new Set()
	const expressFiles = new Set()
	const draftNodes = new Map()

	/*
	  Find which modules to exclude
	  Builds an excludeMap where the key is the node module and the value is an array of obojobo chunk names
	  node_module or chunk name's value can be *, indicating all
	*/
	const excludeMap = new Map()
	if (config.draft.hasOwnProperty('excludeModules')) {
		config.draft.excludeModules.forEach(item => {
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
	const allModuleExcludeRoles = excludeMap.has('*') ? excludeMap.get('*') : []


	logger.info('Loading installed Obojobo Modules...')
	searchPaths.forEach(search => {
		const files = glob.sync(search)
		files.forEach(file => {
			let moduleExludeRules = [].concat(allModuleExcludeRoles) // add rules set for all modules
			const match = file.match(packageNameRegex)
			const moduleName = match ? match[1] : null

			// add rules set for this module
			if (moduleName && excludeMap.has(moduleName)) {
				moduleExludeRules = moduleExludeRules.concat(excludeMap.get(moduleName))
			}

			const content = fs.readFileSync(file)
			const json = JSON.parse(content)
			if (json.hasOwnProperty('modules')) {
				const libDir = path.dirname(file)

				json['express'].forEach(express => {
					expressFiles.add(path.resolve(libDir, express))
				})

				json['modules'].forEach(module => {
					const name = module.name
					delete module.name

					// Should we exclude this module?
					if (moduleExludeRules.length) {
						if (moduleExludeRules.includes('*') || moduleExludeRules.includes(name)) {
							logger.info(`🚫 Excluded ${moduleName}:${name}`)
							return
						}
					}

					// verify the files exist
					for (const i in module) {
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
