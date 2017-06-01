const fs = require('fs')
const xmlToDraftObject = require('../xml-to-draft-object')

it('Correctly converts xml to Text node', () => {
  const xml = fs.readFileSync('./__tests__/xml/text.xml', 'utf8')
  expect(xmlToDraftObject(xml)).toMatchSnapshot()
})