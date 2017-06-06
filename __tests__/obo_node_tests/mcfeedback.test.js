const fs = require('fs')
const xmlToDraftObject = require('../../xml-to-draft-object')

it('Correctly converts xml to MCFeedback node', () => {
  const xml = fs.readFileSync('./__tests__/obo_node_xml/mcfeedback.xml', 'utf8')
  expect(xmlToDraftObject(xml)).toMatchSnapshot()
})