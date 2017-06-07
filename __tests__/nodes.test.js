const fs = require('fs')
const xmlToDraftObject = require('../xml-to-draft-object')

const nodes = [
  'actionbutton',
  'assessment',
  'break',
  'code',
  'content',
  'figure',
  'heading',
  'html',
  'list',
  'mathequation',
  'mcanswer',
  'mcassessment',
  'mcchoice',
  'mcfeedback',
  'module',
  'page',
  'question',
  'questionbank',
  'table',
  'text',
  'youtube'
]

const shorthandNodes = [
  'break',
  'code',
  'heading',
  'list',
  'table',
  'text'
]

describe('XML to Draft Object Tranformation', () => {
  for (let node of nodes) {
    it(`Converts ${node} xml to ${node} node`, () => {
      const xml = fs.readFileSync(`./__tests__/obo_node_xml/${node}.xml`, 'utf8')
      expect(xmlToDraftObject(xml)).toMatchSnapshot()
    })
  }

  for (let node of shorthandNodes) {
    it(`Converts ${node} html notation to ${node} node`, () => {
      const xml = fs.readFileSync(`./__tests__/obo_node_xml/${node}.xml`, 'utf8')
      const xmlShorthand = fs.readFileSync(`./__tests__/obo_node_shorthand/${node}.xml`, 'utf8')
      expect(xmlToDraftObject(xml)).toEqual(xmlToDraftObject(xmlShorthand))
    })
  }
})
