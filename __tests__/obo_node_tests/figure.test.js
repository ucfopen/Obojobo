const fs = require('fs')
const xmlToDraftObject = require('../../xml-to-draft-object')

it('Correctly converts xml to Figure node', () => {
  const xml = fs.readFileSync('./__tests__/obo_node_xml/figure.xml', 'utf8')
  expect(xmlToDraftObject(xml)).toMatchSnapshot()
})