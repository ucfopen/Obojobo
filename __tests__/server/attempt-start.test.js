import { start } from 'pm2';

jest.mock('../../../../insert_event')
jest.mock('../../../../logger.js')
jest.mock('../../server/assessment')
jest.mock('../../../../routes/api/events/create_caliper_event')
jest.mock('../../../../db', () => {
  return {
    one: jest.fn(),
    manyOrNone: jest.fn(),
    any: jest.fn(),
    none: jest.fn()
  }
})
jest.mock('../../../../config', () => {
  return {
    lti: {
      keys: {
        testkey: 'testsecret'
      }
    }
  }
})

const _ = require('underscore')
const {
  startAttempt,
  getQuestionBankProperties,
  createAssessmentUsedQuestionMap,
  initAssessmentUsedQuestions,
  chooseUnseenQuestionsSequentially,
  chooseAllQuestionsRandomly,
  chooseUnseenQuestionsRandomly,
  createChosenQuestionTree,
  getNodeQuestions,
  getSendToClientPromises,
  insertAttemptStartCaliperEvent
} = require('../../server/attempt-start.js')
const testJson = require('../../test-object.json')
const Assessment = require('../../server/assessment')
const insertEvent = require('../../../../insert_event')
const db = require('../../../../db')
const Draft = oboRequire('models/draft')
const DraftNode = oboRequire('models/draft_node')
const createCaliperEvent = oboRequire('routes/api/events/create_caliper_event')
const logAndRespondToUnexpected = require('../../server/util').logAndRespondToUnexpected
const QUESTION_BANK_NODE_TYPE = 'ObojoboDraft.Chunks.QuestionBank'
const QUESTION_NODE_TYPE = 'ObojoboDraft.Chunks.Question'
const ERROR_ATTEMPT_LIMIT_REACHED = 'Attempt limit reached'
const ERROR_UNEXPECTED_DB_ERROR = 'Unexpected DB error'

describe('start attempt route', () => {
  let mockDraft
  let mockUsedQuestionMap
  let mockReq
  let mockRes

  beforeEach(() => {
    mockDraft = new Draft(testJson)
    mockUsedQuestionMap = new Map()

    mockUsedQuestionMap.set('qb1', 0)
    mockUsedQuestionMap.set('qb1.q1', 0)
    mockUsedQuestionMap.set('qb1.q2', 0)
    mockUsedQuestionMap.set('qb2', 0)
    mockUsedQuestionMap.set('qb2.q1', 0)
    mockUsedQuestionMap.set('qb2.q2', 0)

    mockReq = {}
    mockRes = {}
  })

  it('can retrieve question bank properties with attributes set', () => {
    const mockQuestionBankNode = new DraftNode({}, { content: { choose: 2, select: 'test' } }, {})
    const qbProperties = getQuestionBankProperties(mockQuestionBankNode.node)

    expect(Object.keys(qbProperties).length).toBe(2)
    expect(qbProperties.choose).toBe(2)
    expect(qbProperties.select).toBe('test')
  })

  it('can retrieve question bank properties with NO attributes set', () => {
    const mockQuestionBankNode = new DraftNode({}, { content: {} }, {})
    const qbProperties = getQuestionBankProperties(mockQuestionBankNode.node)

    expect(Object.keys(qbProperties).length).toBe(2)
    expect(qbProperties.choose).toBe(Infinity)
    expect(qbProperties.select).toBe('sequential')
  })

  it('can initialize a map to track use of assessment questions', () => {
    const mockAssessmentProperties = {
      nodeChildrenIds: ['qb1', 'qb1.q1', 'qb1.q2', 'qb2', 'qb2.q1', 'qb2.q2'],
      draftTree: mockDraft
    }

    const usedQuestionMap = createAssessmentUsedQuestionMap(mockAssessmentProperties)

    expect(usedQuestionMap.constructor).toBe(Map)
    expect(usedQuestionMap.size).toBe(6)
    expect(usedQuestionMap.get('qb1')).toBe(0)
    expect(usedQuestionMap.get('qb1.q1')).toBe(0)
    expect(usedQuestionMap.get('qb1.q2')).toBe(0)
    expect(usedQuestionMap.get('qb2')).toBe(0)
    expect(usedQuestionMap.get('qb2.q1')).toBe(0)
    expect(usedQuestionMap.get('qb2.q2')).toBe(0)
  })

  it('can track use of assessment questions using an initialized question map', () => {
    const fakeChildNodes = [
      { id: 'qb1.q1', children: [] },
      { id: 'qb1.q2', children: [] }
    ]
    const mockQbTree = { id: 'qb1', children: fakeChildNodes }

    initAssessmentUsedQuestions(mockQbTree, mockUsedQuestionMap)

    expect(mockUsedQuestionMap.get('qb1')).toBe(1)
    expect(mockUsedQuestionMap.get('qb1.q1')).toBe(1)
    expect(mockUsedQuestionMap.get('qb1.q2')).toBe(1)
    expect(mockUsedQuestionMap.get('qb2')).toBe(0)
    expect(mockUsedQuestionMap.get('qb2.q1')).toBe(0)
    expect(mockUsedQuestionMap.get('qb2.q2')).toBe(0)
  })

  it('can choose to display unseen question banks and questions sequentially', () => {
    const mockAssessmentProperties = {
      oboNode: { draftTree: mockDraft },
      childrenMap: mockUsedQuestionMap
    }

    mockUsedQuestionMap.set('qb2', 1)
    mockUsedQuestionMap.set('qb2.q1', 1)
    mockUsedQuestionMap.set('qb2.q2', 1)

    // Case to test sorting of question banks (qb1 should come first).
    expect(chooseUnseenQuestionsSequentially(mockAssessmentProperties, 'qb', 2).map(node => node.id)).toEqual(['qb1', 'qb2'])
    expect(chooseUnseenQuestionsSequentially(mockAssessmentProperties, 'qb', 2)).toMatchSnapshot()

    // Choosing questions where numQuestionsPerAttempt is 0 (no quesitons should be chosen).
    expect(chooseUnseenQuestionsSequentially(mockAssessmentProperties, 'qb1', 0)).toEqual([]);

    // Choosing questions where numQuestionsPerAttempt = 1.
    expect(chooseUnseenQuestionsSequentially(mockAssessmentProperties, 'qb1', 1).map(node => node.id)).toEqual(['qb1.q1'])
    expect(chooseUnseenQuestionsSequentially(mockAssessmentProperties, 'qb1', 1)).toMatchSnapshot()

    // Choosing questions where numQuestionsPerAttempt is more than 1.
    expect(chooseUnseenQuestionsSequentially(mockAssessmentProperties, 'qb1', 2).map(node => node.id)).toEqual(['qb1.q1', 'qb1.q2'])
    expect(chooseUnseenQuestionsSequentially(mockAssessmentProperties, 'qb1', 2)).toMatchSnapshot()

    // Case where questions need to be reordered (q2 should now come first).
    mockUsedQuestionMap.set('qb1.q1', 1)
    expect(chooseUnseenQuestionsSequentially(mockAssessmentProperties, 'qb1', 2).map(node => node.id)).toEqual(['qb1.q2', 'qb1.q1'])
    expect(chooseUnseenQuestionsSequentially(mockAssessmentProperties, 'qb1', 2)).toMatchSnapshot()
  })

  it('can choose to display all question banks and questions randomly', () => {
    _.shuffle = jest.fn(() => (['qb2', 'qb1']))

    const mockAssessmentProperties = {
      oboNode: { draftTree: mockDraft },
      childrenMap: {}
    }

    expect(chooseAllQuestionsRandomly(mockAssessmentProperties, 'qb', 2).map(node => node.id)).toEqual(['qb2', 'qb1'])
    expect(_.shuffle).toHaveBeenCalled()
  })

  it('can choose to display unseen question banks and questions randomly', () => {
    Math.random = jest.fn(() => 1)
    // Unseen questions will come first, if we've seen an equal
    // number of times, we use Math.random.
    mockUsedQuestionMap.set('qb1', 1)
    mockUsedQuestionMap.set('qb2', 1)

    const mockAssessmentProperties = {
      oboNode: { draftTree: mockDraft },
      childrenMap: mockUsedQuestionMap
    }

    expect(chooseUnseenQuestionsRandomly(mockAssessmentProperties, 'qb', 2).map(node => node.id)).toEqual(['qb2', 'qb1'])
    expect(Math.random).toHaveBeenCalled()
  })

  // select options are added to attempt-start.
  it('can create a tree of chosen question banks/questions appropriate to a specified choose property', () => {
    const assessmentNode = mockDraft.getChildNodeById('assessment')
    let assessmentQbTree = assessmentNode.children[1].toObject()

    mockUsedQuestionMap.set('qb2', 1)
    mockUsedQuestionMap.set('qb2.q1', 1)
    mockUsedQuestionMap.set('qb2.q2', 1)

    const mockAssessmentProperties = {
      oboNode: assessmentNode,
      childrenMap: mockUsedQuestionMap
    }

    // Question bank should start with both children (qb1 and 1b2)
    expect(assessmentQbTree.id).toBe('qb')
    expect(assessmentQbTree.children.length).toBe(2)
    expect(assessmentQbTree.children[0].id).toBe('qb1')
    expect(assessmentQbTree.children[1].id).toBe('qb2')

    createChosenQuestionTree(assessmentQbTree, mockAssessmentProperties)

    // Question bank should now only have qb1 (choose is 1 and qb1 is next up sequentially)
    expect(assessmentQbTree.id).toBe('qb')
    expect(assessmentQbTree.children.length).toBe(1)
    expect(assessmentQbTree.children[0].id).toBe('qb1')

    // Reset qb tree and check if random-all works appropriately when called
    // through createChosenQuestionTree.
    assessmentQbTree = assessmentNode.children[1].toObject()
    assessmentQbTree.content.select = 'random-all'
    _.shuffle = jest.fn(() => (['qb2', 'qb1']))
    createChosenQuestionTree(assessmentQbTree, mockAssessmentProperties)
    expect(_.shuffle).toHaveBeenCalled()

    // Reset qb tree and check if random-unseen works appropriately when called
    // through createChosenQuestionTree
    assessmentQbTree = assessmentNode.children[1].toObject()
    assessmentQbTree.content.select = 'random-unseen'

    mockUsedQuestionMap.set('qb1', 2)
    mockUsedQuestionMap.set('qb1.q1', 2)
    mockUsedQuestionMap.set('qb1.q2', 2)

    // qb2 should come first here (it is next up in unseen priority)
    createChosenQuestionTree(assessmentQbTree, mockAssessmentProperties)
    expect(assessmentQbTree.children.map(node => node.id)).toEqual(['qb2'])
  })

  it('can retrieve an array of question type nodes from a node tree', () => {
    const assessmentNode = mockDraft.getChildNodeById('assessment')
    const assessmentQbTree = assessmentNode.children[1].toObject()
    const expectedQuestionIds = ['qb1.q1', 'qb1.q2', 'qb2.q1', 'qb2.q2']
    const questions = getNodeQuestions(assessmentQbTree, assessmentNode, [])

    // Should have 4 questions total: qb1.q1, qb1.q2, qb2.q1, qb2.q2
    expect(questions.length).toEqual(4)

    for (let q of questions) {
      expect(q.constructor).toBe(DraftNode)
      expect(q.node.type).toBe(QUESTION_NODE_TYPE)
      expect(expectedQuestionIds.includes(q.node.id)).toBeTruthy()
    }
  })

  it('can get promises that could be the result of yelling an assessment:sendToAssessment event', () => {
    const assessmentNode = mockDraft.getChildNodeById('assessment')
    const assessmentQbTree = assessmentNode.children[1].toObject()
    const mockAttemptState = {
      questions: getNodeQuestions(assessmentQbTree, assessmentNode, [])
    }

    // TODO: No promises should be returned in this case, however there may be instances
    // where there are.
    expect(getSendToClientPromises(mockAttemptState, {}, {})).toEqual([])
  })

  test('startAttempt inserts a new attempt, creates events and replies with an expected object', () => {
    const createAssessmentAttemptStartedEvent = jest.fn().mockReturnValue('mockCaliperPayload')
    insertEvent.mockReturnValueOnce('mockInsertResult')
    createCaliperEvent.mockReturnValueOnce({
      createAssessmentAttemptStartedEvent
    })
    Date.prototype.toISOString = () => 'date'

    const r = insertAttemptStartCaliperEvent(
      'mockAttemptId',
      1,
      'mockUserId',
      'mockDraftId',
      'mockAssessmentId',
      true,
      'mockHostname',
      'mockRemoteAddress'
    )

    // Make sure we get the result of insertEvent back
    expect(r).toBe('mockInsertResult')

    // Make sure insertEvent was called
    expect(insertEvent).toHaveBeenCalledTimes(1)

    expect(createAssessmentAttemptStartedEvent).toHaveBeenCalledWith({
      "actor": {
        "id": "mockUserId",
        "type": "user"
      },
      "assessmentId": "mockAssessmentId",
      "attemptId": "mockAttemptId",
      "draftId": "mockDraftId",
      "extensions": {
        "count": 1
      },
      "isPreviewMode": true
    })

    expect(insertEvent).toHaveBeenCalledWith({
      "action": "assessment:attemptStart",
      "actorTime": "date",
      "caliperPayload": "mockCaliperPayload",
      "draftId": "mockDraftId",
      "eventVersion": "1.1.0",
      "ip": "mockRemoteAddress",
      "metadata": {},
      "payload": {
        "attemptCount": 1,
        "attemptId":
          "mockAttemptId"
      },
      "userId": "mockUserId"
    })
  })

  test('calling startAttempt when no attempts remain rejects with an expected error', done => {
    mockReq = {
      requireCurrentUser: jest.fn(() => Promise.resolve({
        user: {
          canViewEditor: true
        }
      })),
      body: {
        draftId: 'mockDraftId',
        assessmentId: 'mockAssessmentId'
      }
    }

    mockRes = { reject: jest.fn() }

    const mockAssessmentNode = {
      getChildNodeById: jest.fn(() => ({
        node: {
          content: {
            // Number of attempts the user is allowed (what we're testing here).
            attempts: 1
          }
        },
        children: [
          {},
          {
            childrenSet: ['test', 'test1'],
            toObject: jest.fn()
          }
        ]
      }))
    }

    Draft.fetchById = jest.fn(() => Promise.resolve(mockAssessmentNode))
    Assessment.getNumberAttemptsTaken = jest.fn(() => 1)

    startAttempt(mockReq, mockRes).then(() => {
      expect(mockRes.reject).toHaveBeenCalledWith(ERROR_ATTEMPT_LIMIT_REACHED)
      done()
    })
  })

  test('an unexpected error in startAttempt calls logAndRespondToUnexpected with expected values', done => {
    mockReq = {
      requireCurrentUser: jest.fn(() => Promise.resolve({
        user: {
          canViewEditor: true
        }
      }))
    }

    mockRes = { unexpected: jest.fn() }

    Draft.fetchById = jest.fn(() => {
      throw new Error(ERROR_UNEXPECTED_DB_ERROR)
    })

    startAttempt(mockReq, mockRes).then(() => {
      expect(mockRes.unexpected).toHaveBeenCalledWith(ERROR_UNEXPECTED_DB_ERROR)
      done()
    })
  })
})
