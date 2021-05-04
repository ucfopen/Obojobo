const fs = require('fs')
const path = require('path')

let targetValue = process.argv[2]
if(!targetValue) {
	targetValue = '^' + require('../lerna.json').version
	console.log('missing version argument: node update-version.js "^v12.0.0" ')
	console.log(`using lerna version ${targetValue}`)
}

const packageSearchOut = require('child_process').execSync('yarn list --pattern obojobo-')
const pattern = /obojobo-[^@]+/gi
const packages = packageSearchOut.toString().match(pattern)


packages.forEach(pkg => {
	pkg = pkg.trim()
	const jsonPath = require.resolve(`${pkg}/package.json`)
	const json = require(`${pkg}/package.json`)
	const findIn = ['dependencies', 'peerDependencies', 'devDependencies']

	findIn.forEach(key => {
		if(typeof json[key] != 'object') return

		for(const [pkgKey, value] of Object.entries(json[key])){
			if(!packages.includes(pkgKey)) continue
			console.log(`updating ${pkg}.${key}.${pkgKey} from ${value} to ${targetValue}`)
			json[key][pkgKey] = targetValue

		}
	})

	const data = JSON.stringify(json, null, '\t')+"\n"
	fs.writeFileSync(jsonPath, data, {flag: 'w'})
})
