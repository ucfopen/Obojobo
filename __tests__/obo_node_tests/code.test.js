const fs = require('fs')
const xmlToDraftObject = require('../../xml-to-draft-object')

it('Correctly converts xml to Code node', () => {
  const xml = fs.readFileSync('./__tests__/obo_node_xml/code.xml', 'utf8')
  expect(xmlToDraftObject(xml)).toMatchSnapshot()
})