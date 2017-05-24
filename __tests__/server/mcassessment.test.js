const MCAssessment = require('../../server/mcassessment')
const testJson     = require('../../test-object.json')
const Draft        = oboRequire('models/draft')
const DraftNode    = oboRequire('models/draft_node')

jest.mock('../../../../db')

describe('MCAssessment', () => {
  let rootNode
  let mcAssessment
  let responseRecord
  let score
  const events = { onCalculateScore: 'ObojoboDraft.Chunks.Question:calculateScore' }
  const setScore = s => { score = s }
  const getChildNodeByIdMock = jest.fn(() => responseRecord)

  beforeEach(() => {
    rootNode = new Draft(testJson)

    mcAssessment = new MCAssessment({ getChildNodeById: getChildNodeByIdMock })
    mcAssessment.children = [new DraftNode({}, { id: 'test' }, {})]
    mcAssessment.node = { id: 'test' }

    rootNode.root.children.push(mcAssessment)

    responseRecord = new DraftNode({}, { content: { score: 100 } })
    responseRecord.response = { set: true },
    responseRecord.responder_id = 'test'

    score = null
  })

  it("returns if question doesn't contain 'this' node on calulate score", () => {
    rootNode.root.children = []
    expect(mcAssessment.yell(events.onCalculateScore, {}, rootNode.root, {}, setScore)).toEqual([])
    expect(score).toBe(null)
  })

  it('throws error if multiple answers chosen on non pick-all assessment', () => {
    mcAssessment.node.content = { responseType: 'pick-one' }
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
    mcAssessment.node = {
      content: { responseType: 'pick-all' },
      id: 'test'
    }
    mcAssessment.children = [
      new DraftNode({}, { id: 'test' }, {}),
      new DraftNode({}, { id: 'test2' }, {})
    ]
    mcAssessment.yell(events.onCalculateScore, {}, rootNode.root, responseRecords, setScore)
    expect(score).toEqual(0)
  })

  it('sets score to 0 if any chosen answers are not the correct answer (pick-all)', () => {
    let responseRecords = [responseRecord]
    mcAssessment.node = { content: { responseType: 'pick-all' }, id: 'test' }
    // ID of chosen !== ID of correct ('test')
    // TODO: Set score of this test node to 0?
    mcAssessment.children[0].node = { id: 'test123' }
    mcAssessment.yell(events.onCalculateScore, {}, rootNode.root, responseRecords, setScore)
    expect(score).toEqual(0)
  })

  it('sets score to 100 on correct answers chosen (pick-all)', () => {
    let responseRecords = [responseRecord]
    mcAssessment.node = { content: { responseType: 'pick-all' }, id: 'test' }
    // Chosen answer ID will now match correct answer ID
    mcAssessment.children[0].node = { id: 'test' }
    mcAssessment.yell(events.onCalculateScore, {}, rootNode.root, responseRecords, setScore)
    expect(score).toEqual(100)
  })

  it('sets score to 100 on ALL correct answers chosen (pick-all)', () => {
    let responseRecords = [responseRecord, Object.assign({}, responseRecord, { responder_id: 'test2' })]
    responseRecords[1].responder_id = 'test2'
    mcAssessment.node = {
      content: { responseType: 'pick-all' },
      id: 'test'
    }
    mcAssessment.children = [
      new DraftNode({}, { id: 'test' }, {}),
      new DraftNode({}, { id: 'test2' }, {})
    ]
    mcAssessment.yell(events.onCalculateScore, {}, rootNode.root, responseRecords, setScore)
    expect(score).toEqual(100)
  })
})