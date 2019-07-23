const fs = require('fs')
const jsonToXmlParser = require('../json-to-xml-parser')

describe('JSON to XML Parser', () => {
	expect.hasAssertions()

	const basePath = `${__dirname}/sample-node-json/`
	const sampleJson = fs.readdirSync(basePath).filter(s => s.includes('.json'))

	for (const file of sampleJson) {
		it(`Converts ${file} to xml`, () => {
			const json = require(`${basePath}${file}`)
			expect(jsonToXmlParser(json)).toMatchSnapshot()
		})
	}
})
