global.oboRequire = require('../../../obo_require')
const MCChoice    = require('./question') // Naming error here, currently an issue.
const testJson    = require('../test-object.json')
const Draft       = oboRequire('models/draft')

describe('Question', () => {
  const rootNode = new Draft(testJson)
  const mcChoice = new MCChoice()
  const events = {
    sendToAssessment: 'ObojoboDraft.Sections.Assessment:sendToAssessment',
    attemptEnd: 'ObojoboDraft.Sections.Assessment:attemptEnd'
  }

  it('has event listeners', () => {
    expect(mcChoice._listeners).toBeTruthy()
  })

  it('disables practice on send to assessment', () => {
    mcChoice.node.content = { practice: true }
    mcChoice._listeners.get(events.sendToAssessment)()
    expect(mcChoice.node.content.practice).toBeFalsy()
  })

  it('returns if assessment contains \'this\' node on attempt end', () => {
    mcChoice.node.id = 'test12345'
    expect(mcChoice.yell(events.attemptEnd, {}, {}, rootNode.root, {}, {})).toEqual([])
  })

  it('returns if there are no question responses', () => {
    mcChoice.node.id = 'the-content'
    let responseHistory = []
    expect(mcChoice.yell(events.attemptEnd, {}, {}, rootNode.root, responseHistory, {})).toEqual([])
  })

  it('emits calculate score event when necessary', () => {
    let responseRecord = { question_id: mcChoice.node.id }
    responseHistory = [responseRecord]
    expect(mcChoice.yell(events.attemptEnd, {}, {}, rootNode.root, responseHistory, {})).toEqual([[]])
  })
})