const fs = require('fs')
const xmlToDraftObject = require('../xml-to-draft-object')

const expectedJsonOutput = {
  id: null,
  type: 'ObojoboDraft.Modules.Module',
  content: { title: 'test' },
  children: [{
    children: [],
    content: {},
    id: null,
    type: 'ObojoboDraft.Sections.Content' // This could also be Assessment
  }]
}

it('Correctly converts xml to Module node', () => {
  fs.readFile('./__tests__/xml/module.xml', 'utf8', (err, data) => {
    expect(xmlToDraftObject(data)).toEqual(expectedJsonOutput)
  })
})