const fs = require('fs')
const jsonToXmlParser = require('../json-to-xml-parser')

const filterFileType = arr =>
	arr.filter(s => s.includes('.json')).map(s => s.substring(0, s.length - 4))

const nodes = filterFileType(fs.readdirSync(`${__dirname}/obo_node_json/`))

describe('JSON to XML Test', () => {
	for (let node of nodes) {
		it(`Converts ${node}json to ${node}xml`, () => {
			const json = require(`${__dirname}/obo_node_json/${node}json`)
			expect(jsonToXmlParser(json)).toMatchSnapshot()
		})
	}
})
