const fs = require('fs')
const xmlToDraftObject = require('../../xml-to-draft-object')

it('Correctly converts xml to MathEquation node', () => {
  const xml = fs.readFileSync('./__tests__/obo_node_xml/mathequation.xml', 'utf8')
  expect(xmlToDraftObject(xml)).toMatchSnapshot()
})