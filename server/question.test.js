global.oboRequire = require('../../../obo_require')
const MCChoice    = require('./question')
const testJson    = require('../test-object.json')
const Draft       = oboRequire('models/draft')

describe('question', () => {
  const mcChoice = new MCChoice()
  const events = {
    sendToAssessment: 'ObojoboDraft.Sections.Assessment:sendToAssessment',
    attemptEnd: 'ObojoboDraft.Sections.Assessment:attemptEnd'
  }

  it('has event listeners', () => {
    expect(mcChoice._listeners).toBeTruthy()
  })

  it('handles sending to assessment', () => {
    mcChoice.node.content = {practice: true}
    mcChoice._listeners.get(events.sendToAssessment)()
    expect(mcChoice.node.content.practice).toBeFalsy()
  })

  it('handles ending of an attempt', () => {
    const rootNode = new Draft(testJson)
    mcChoice.node.id = '12345test'
    expect(mcChoice.yell(events.attemptEnd, {}, {}, rootNode.root, {}, {})).toEqual([])
  })
})