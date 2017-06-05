const fs = require('fs')
const xmlToDraftObject = require('../../xml-to-draft-object')

it('Correctly converts xml to ActionButton node', () => {
  const xml = fs.readFileSync('./__tests__/obo_node_xml/actionbutton.xml', 'utf8')
  expect(xmlToDraftObject(xml)).toMatchSnapshot()
})