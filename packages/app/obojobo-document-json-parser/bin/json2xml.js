#!/usr/bin/env node

const argv = process.argv.slice(2)
const jsonToXml = require('../json-to-xml-parser')

let json
if (argv.length >= 1) {
    try {
        json = require(argv[0])
    } catch (err) {
        throw Error('Invalid path for json file');
    }
} else {
    json = require('../examples/test-object.json')
}

console.log(jsonToXml(json))
