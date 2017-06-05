const fs = require('fs')
const xmlToDraftObject = require('../../xml-to-draft-object')

it('Correctly converts xml to Table node', () => {
  const xml = fs.readFileSync('./__tests__/obo_node_xml/table.xml', 'utf8')
  expect(xmlToDraftObject(xml)).toMatchSnapshot()
})