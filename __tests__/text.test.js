const fs = require('fs')
const xmlToDraftObject = require('../xml-to-draft-object')

const expectedJsonOutput = {
  id: null,
  type: 'ObojoboDraft.Chunks.Text',
  content: {
    textGroup: []
  },
  children: []
}

it('Correctly converts xml to Text node', () => {
  fs.readFile('./__tests__/xml/text.xml', 'utf8', (err, data) => {
    expect(xmlToDraftObject(data)).toEqual(expectedJsonOutput)
  })
})