import _ from 'underscore'
import {
  startAttempt,
  getQuestionBankProperties,
  createAssessmentUsedQuestionMap,
  initAssessmentUsedQuestions,
  chooseUnseenQuestionsSequentially,
  chooseAllQuestionsRandomly,
  chooseUnseenQuestionsRandomly,
  createChosenQuestionTree,
  getNodeQuestions,
  getSendToClientPromises
} from '../../server/attempt-start.js';
import testJson from '../../test-object.json'

const Draft = oboRequire('models/draft')
const DraftNode = oboRequire('models/draft_node')
const QUESTION_BANK_NODE_TYPE = 'ObojoboDraft.Chunks.QuestionBank'
const QUESTION_NODE_TYPE = 'ObojoboDraft.Chunks.Question'

jest.mock('../../../../db')
jest.mock('../../../../config', () => {
  return {
    lti: {
      keys: {
        testkey: 'testsecret'
      }
    }
  }
})

describe('start attempt route', () => {
  let mockDraft
  let mockUsedQuestionMap

  beforeEach(() => {
    mockDraft = new Draft(testJson)
    mockUsedQuestionMap = new Map()

    mockUsedQuestionMap.set('qb1', 0)
    mockUsedQuestionMap.set('qb1.q1', 0)
    mockUsedQuestionMap.set('qb1.q2', 0)
    mockUsedQuestionMap.set('qb2', 0)
    mockUsedQuestionMap.set('qb2.q1', 0)
    mockUsedQuestionMap.set('qb2.q2', 0)
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
    // TODO: Mock each of the question choosing methods and expect them to have been called.
    const assessmentNode = mockDraft.getChildNodeById('assessment')
    const assessmentQbTree = assessmentNode.children[1].toObject()

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

  test.skip('startAttempt inserts a new attempt, creates events and replies with an expected object', () => {
    //@TODO
  })

  test.skip('calling startAttempt when no attempts remain rejects with an expected error', () => {
    //@TODO
  })

  test.skip('an unexpected error in startAttempt calls logAndRespondToUnexpected with expected values', () => {
    //@TODO
  })
})
