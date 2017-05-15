global.oboRequire  = require('../../../obo_require')
const MCAssessment = require('./mcassessment')
const testJson     = require('../test-object.json')
const Draft        = oboRequire('models/draft')
const DraftNode    = oboRequire('models/draft_node')

describe('MCAssessment', () => {
  let rootNode
  let mcAssessment
  let responseRecord
  let score
  const events = { onCalculateScore: 'ObojoboDraft.Chunks.Question:calculateScore' }
  const setScore = s => { score = s }

  beforeEach(() => {
    rootNode = new Draft(testJson)
    mcAssessment = new MCAssessment(
      draftTree = { findNodeClass: jest.fn().mockImplementation(() => responseRecord) }
      children = [new DraftNode()]
    )
    responseRecord = {
      node: { content: { score: 100 } },
      response: { set: true },
      responder_id: 'test'
    }
    score = null
  })

  it('returns if question doesn\'t contain \'this\' node on calculate score', () => {
    mcAssessment.node.id = 'test12345'
    expect(mcAssessment.yell(events.onCalculateScore, {}, rootNode.root, {}, {})).toEqual([])
  })

  it('throws error if multiple answers chosen on non pick-all assessment', () => {
    mcAssessment.node.content = { responseType: 'pick-one' }
    mcAssessment.node.id = 'the-content'
    let responseRecords = [responseRecord, responseRecord]
    let errorMessage = 'Impossible response to non pick-all MCAssessment response'
    let calculateScore = () => mcAssessment.yell(events.onCalculateScore, {}, rootNode.root, responseRecords, {})
    expect(calculateScore).toThrow(errorMessage)
  })

  it('sets score to 0 if no answer is chosen', () => {
    let responseRecords = []
    mcAssessment.node.content = { responseType: 'pick-one' }
    mcAssessment.yell(events.onCalculateScore, {}, rootNode.root, responseRecords, setScore)
    expect(score).toEqual(0)
  })

  it('sets appropriate score based on selected answer', () => {
    let responseRecords = [responseRecord]
    let nodesById = new Map()
    mcAssessment.node.content = { responseType: 'pick-one' }
    nodesById.set('test', 'test')
    mcAssessment.draftTree.nodesById = nodesById
    mcAssessment.yell(events.onCalculateScore, {}, rootNode.root, responseRecords, setScore)
    expect(score).toEqual(100)
  })

  it('sets score to 0 if number of chosen !== number of correct answers (pick-all)', () => {
    let responseRecords = [responseRecord]
    mcAssessment.node.content = { responseType: 'pick-all' }
    mcAssessment.children = [new DraftNode(), new DraftNode()]
    mcAssessment.children[0].node = { id: 'test' }
    mcAssessment.yell(events.onCalculateScore, {}, rootNode.root, responseRecords, setScore)
    expect(score).toEqual(0)
  })

  it('sets score to 0 if any chosen answers are not the correct answer (pick-all)', () => {
    let responseRecords = [responseRecord]
    mcAssessment.node = { content: { responseType: 'pick-all' } }
    // ID of chosen !== ID of correct ('test')
    mcAssessment.children[0].node = { id: 'test123' }
    mcAssessment.yell(events.onCalculateScore, {}, rootNode.root, responseRecords, setScore)
    expect(score).toEqual(0)
  })

  it('sets score to 100 on correct answers chosen (pick-all)', () => {
    let responseRecords = [responseRecord]
    mcAssessment.node = { content: { responseType: 'pick-all' } }
    // Chosen answer ID will now match correct answer ID
    mcAssessment.children[0].node = { id: 'test' }
    mcAssessment.yell(events.onCalculateScore, {}, rootNode.root, responseRecords, setScore)
    expect(score).toEqual(100)
  })
})