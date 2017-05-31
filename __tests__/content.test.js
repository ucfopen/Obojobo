const fs = require('fs')
const xmlToDraftObject = require('../xml-to-draft-object')

const expectedJsonOutput = {
  id: null,
  type: 'ObojoboDraft.Sections.Content',
  content: {},
  children: [{
    children: [],
    content: {},
    id: null,
    type: 'ObojoboDraft.Pages.Page'
  }]
}

it('Correctly converts xml to Content node', () => {
  fs.readFile('./__tests__/xml/content.xml', 'utf8', (err, data) => {
    expect(xmlToDraftObject(data)).toEqual(expectedJsonOutput)
  })
})