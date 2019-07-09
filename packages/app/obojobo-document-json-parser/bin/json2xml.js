#!/usr/bin/env node

const jsonToXml = require('../json-to-xml-parser')

const json = require('../examples/test-object.json')

console.log(jsonToXml(json))
