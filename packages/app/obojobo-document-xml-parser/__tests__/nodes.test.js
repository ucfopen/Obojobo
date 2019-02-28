const fs = require('fs')
const xmlToDraftObject = require('../xml-to-draft-object')

const filterFileType = arr => arr.filter(s => s.includes('.xml'))
                                  .map(s => s.substring(0, s.length - 4))

const nodes           = filterFileType(fs.readdirSync('./__tests__/obo_node_xml/'))
const shorthandNodes  = filterFileType(fs.readdirSync('./__tests__/obo_node_shorthand/'))

describe('XML to Draft Object Tranformation', () => {
  for (let node of nodes) {
    it(`Converts ${node} xml to ${node} node`, () => {
      const xml = fs.readFileSync(`./__tests__/obo_node_xml/${node}.xml`, 'utf8')
      expect(xmlToDraftObject(xml)).toMatchSnapshot()

      if (shorthandNodes.includes(`${node}`)) {
        const xmlShorthand = fs.readFileSync(`./__tests__/obo_node_shorthand/${node}.xml`)
        expect(xmlToDraftObject(xml)).toEqual(xmlToDraftObject(xmlShorthand))
      }
    })
  }
})
