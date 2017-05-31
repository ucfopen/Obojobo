const fs = require('fs')
const xmlToDraftObject = require('../xml-to-draft-object')

const expectedJsonOutput = {
  id: null,
  type: 'ObojoboDraft.Sections.Assessment',
  content: {
    scoreActions: [{
      from: '0',
      to: '99',
      page: {
        id: null,
        type: 'ObojoboDraft.Pages.Page',
        content: {},
        children: []
      }
    }]
  },
  children: [
    {
      id: null,
      type: 'ObojoboDraft.Pages.Page',
      content: {},
      children: []
    },
    {
      id: null,
      type: 'ObojoboDraft.Chunks.QuestionBank',
      content: {},
      children: []
    }
  ]
}

it('Correctly converts xml to Assessment node', () => {
  fs.readFile('./__tests__/xml/assessment.xml', 'utf8', (err, data) => {
    expect(xmlToDraftObject(data)).toEqual(expectedJsonOutput)
  })
})