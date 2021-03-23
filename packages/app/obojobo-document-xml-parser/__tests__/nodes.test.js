const fs = require('fs')

const filterFileType = arr =>
	arr.filter(s => s.includes('.xml')).map(s => s.substring(0, s.length - 4))

const nodes = filterFileType(fs.readdirSync(`${__dirname}/obo_node_xml/`))
const shorthandNodes = filterFileType(fs.readdirSync(`${__dirname}/obo_node_shorthand/`))

describe('XML to Draft Object Tranformation', () => {
	test.each(nodes)(`Converts %s xml to node`, nodeName => {
		const xml = fs.readFileSync(`${__dirname}/obo_node_xml/${nodeName}.xml`, 'utf8')
		const xmlToDraftObject = require('../xml-to-draft-object')
		expect(xmlToDraftObject(xml)).toMatchSnapshot()

		if (shorthandNodes.includes(nodeName)) {
			const xmlShorthand = fs.readFileSync(`${__dirname}/obo_node_shorthand/${nodeName}.xml`)
			expect(xmlToDraftObject(xml)).toEqual(xmlToDraftObject(xmlShorthand))
		}
	})
})
