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

  // TODO: This is the implementation for the last argument
  const currentAttempt = {
    addScore: jest.fn()
  }

  it('disables practice on send to assessment', () => {
    let responseHistory = []
    mcChoice.node.content = { practice: true }
    mcChoice.yell(events.sendToAssessment, {}, {}, rootNode.root, responseHistory, currentAttempt)
    expect(mcChoice.node.content.practice).toBe(false)
  })

  // TODO: The last argument is an object containing an addScore method. Create
  //       a mock function for addScore and pass it in, then ensure it is not
  //       called.

  it("returns if assessment doesn't contain 'this' node on attempt end", () => {
    mcChoice.node.id = 'test12345'
    expect(mcChoice.yell(events.attemptEnd, {}, {}, rootNode.root, {}, currentAttempt)).toEqual([])
    expect(currentAttempt.addScore).not.toHaveBeenCalled()
  })

  it('returns if there are no question responses', () => {
    mcChoice.node.id = 'the-content'
    let responseHistory = []
    expect(mcChoice.yell(events.attemptEnd, {}, {}, rootNode.root, responseHistory, currentAttempt)).toEqual([])
    expect(currentAttempt.addScore).not.toHaveBeenCalled()
  })

  // TODO: This is not specific enough. Intead, mock addScore like above and
  //       check that it is called the expected number of times witht the
  //       expected number of arguments.

  it('emits calculate score event when necessary', () => {
    let responseRecord = { question_id: mcChoice.node.id }
    responseHistory = [responseRecord]
    expect(mcChoice.yell(events.attemptEnd, {}, {}, rootNode.root, responseHistory, currentAttempt)).toEqual([[]])
    expect(currentAttempt.addScore).toHaveBeenCalledTimes(1)
  })
})