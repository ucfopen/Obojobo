#!/usr/bin/env node
/* =============================================================
WHAT
Synchronize obojobo-* package dependency versions across the
entire monoropo.

WHY
Lerna version doesn't like to update peerDependencies for valid reasons.
As of right now, we rely on them to be able to build packages and
install them into our docker container w/o having to publish to npm first.

HOW
Sync with lerna.json
Ex: node update-version.js

Set to a specific version
Ex: node update-version.js v12.0.0
============================================================= */


const fs = require('fs')
const path = require('path')

let targetValue = process.argv[2] // EX: node update-version.js v12.0.0 <----- THIS ARG
if(!targetValue) {
	// Load version from lerna.json
	targetValue = '^' + require('../lerna.json').version
	console.log('missing version argument: node update-version.js "^v12.0.0" ')
	console.log(`using lerna version ${targetValue}`)
}

// Find all packages that start with obojobo-
const packageSearchOut = require('child_process').execSync('yarn list --pattern obojobo-')
const pattern = /obojobo-[^@]+/gi
const packages = packageSearchOut.toString().match(pattern)

// Update every package version in deps, peerDeps, and devDeps for obojobo-* packages
packages.forEach(npmPackage => {
	npmPackage = npmPackage.trim()
	const jsonPath = require.resolve(`${npmPackage}/package.json`)
	const json = require(`${npmPackage}/package.json`)
	const findIn = ['dependencies', 'peerDependencies', 'devDependencies']

	findIn.forEach(dependKey => {
		if(typeof json[dependKey] != 'object') return

		for(const [pkgKey, value] of Object.entries(json[dependKey])){
			if(!packages.includes(pkgKey)) continue // skip any packages that aren't an obojobo-* package

			console.log(`updating ${npmPackage}.${dependKey}.${pkgKey} from ${value} to ${targetValue}`)
			json[dependKey][pkgKey] = targetValue
		}
	})

	const data = JSON.stringify(json, null, '\t')+"\n"
	fs.writeFileSync(jsonPath, data, {flag: 'w'})
})
