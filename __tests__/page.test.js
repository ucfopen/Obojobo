const fs = require('fs')
const xmlToDraftObject = require('../xml-to-draft-object')

const expectedJsonOutput = {
  id: null,
  type: 'ObojoboDraft.Pages.Page',
  content: {
    title: 'test'
  },
  children: [{
    id: null,
    type: 'ObojoboDraft.Chunks.Text',
    content: {},
    children: []
  }]
}

it('Correctly converts xml to Page node', () => {
  fs.readFile('./__tests__/xml/page.xml', 'utf8', (err, data) => {
    expect(xmlToDraftObject(data)).toEqual(expectedJsonOutput)
  })
})