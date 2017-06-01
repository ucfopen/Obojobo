const fs = require('fs')
const xmlToDraftObject = require('../xml-to-draft-object')

it('Correctly converts xml to Assessment node', () => {
  const xml = fs.readFileSync('./__tests__/xml/assessment.xml', 'utf8')
  expect(xmlToDraftObject(xml)).toMatchSnapshot()
})