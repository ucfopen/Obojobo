#!/usr/bin/env node
/* eslint-disable no-console */

const path = require('path')
const jsonToXml = require('../json-to-xml-parser')

if (process.argv.length !== 3) {
	console.error('Usage: obojobo-json2xml.js <path-to-json-file.json>')
	console.error(`Recieved ${process.argv.length - 2} arguments, expected 1`)
	process.exit(1)
}

let json
try {
	const jsonFile = path.resolve(process.argv[2])
	json = require(jsonFile)
} catch (err) {
	console.error('There was a problem loading your json file')
	process.exit(1)
}

console.log(jsonToXml(json))
