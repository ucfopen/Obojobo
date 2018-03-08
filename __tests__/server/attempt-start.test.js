import {
  startAttempt,
  getQuestionBankProperties,
  createAssessmentUsedQuestionMap,
  initAssessmentUsedQuestions,
  chooseQuestionsSequentially,
  createChosenQuestionTree,
  getNodeQuestions,
  getSendToClientPromises,
  updateAssessmentProperties
} from '../../server/attempt-start.js';
import testJson from '../../test-object.json'

const Draft = oboRequire('models/draft')
const DraftNode = oboRequire('models/draft_node')
const QUESTION_BANK_NODE_TYPE = 'ObojoboDraft.Chunks.QuestionBank'
const QUESTION_NODE_TYPE = 'ObojoboDraft.Chunks.Question'

jest.mock('../../../../db')

describe('start attempt route', () => {
  // Create an assessment children map with some test data passed in.
  // TODO: This is kind of hacky, find a better way to test.
  const createTestAssessmentChildMap = () => {
    const types = [QUESTION_BANK_NODE_TYPE, QUESTION_NODE_TYPE]
    let i = 0
    return createAssessmentUsedQuestionMap({
      nodeChildrenIds: ['test', 'test1', 'test2', 'test3'],
      draftTree: {
        getChildNodeById: jest.fn(() => ({
          node: { type: types[i === 1 ? --i : ++i] }
        }))
      }
    })
  }

  // Use to quickly create a one-level deep tree.
  const createTestTree = () => {
    const root = new DraftNode({}, { id: 'root' }, {})
    root.children = [
      new DraftNode({}, { id: 'child1' }, {}),
      new DraftNode({}, { id: 'child2' }, {}),
      new DraftNode({}, { id: 'child3' }, {})
    ]

    return root
  }

  it('can retrieve question bank properties with attributes set', () => {
    const mockQuestionBankNode = new DraftNode({}, {
      content: {
        choose: 2,
        select: 'sequential'
      }
    }, {})

    expect(getQuestionBankProperties(mockQuestionBankNode.node)).toMatchSnapshot()
  })

  it('can retrieve question bank properties with NO attributes set', () => {
    const mockQuestionBankNode = new DraftNode({}, { content: {} }, {})

    expect(getQuestionBankProperties(mockQuestionBankNode.node)).toMatchSnapshot()
  })

  it('can initialize a map to track use of assessment questions', () => {
    const assessmentChildrenMap = createTestAssessmentChildMap()
    expect(assessmentChildrenMap).toMatchSnapshot()
  })

  it('can track use of assessment questions using an initialized question map', () => {
    const assessmentChildrenMap = createTestAssessmentChildMap()
    const fakeChildNodes = [
      { id: 'test1', children: [] },
      { id: 'test2', children: [] },
      { id: 'test3', children: [] }
    ]
    const mockQbTree = { id: 'test', children: fakeChildNodes }

    initAssessmentUsedQuestions(mockQbTree, assessmentChildrenMap)
    expect(assessmentChildrenMap).toMatchSnapshot()
  })

  it('can choose to display questions sequentially', () => {
    const mockDraft = new Draft(testJson)
    const mockUsedQuestionMap = new Map()
    const mockAssessmentProperties = {
      node: { draftTree: mockDraft },
      childrenMap: mockUsedQuestionMap
    }

    mockUsedQuestionMap.set('qb1', 1)
    mockUsedQuestionMap.set('qb1.q1', 0)
    mockUsedQuestionMap.set('qb1.q2', 0)
    mockUsedQuestionMap.set('qb2', 1)
    mockUsedQuestionMap.set('qb2.q1', 1)
    mockUsedQuestionMap.set('qb2.q2', 1)

    // TODO: Choose questions sequentially chooses the question banks to show
    // sequentially AS WELL as the questions within those question banks. So
    // create some probable scenarios for varying uses of each to fully test
    // functionality.

    // Choosing questions where numQuestionsPerAttempt = 1.
    expect(chooseQuestionsSequentially(mockAssessmentProperties, 'qb1', 1)).toMatchSnapshot()

  })
})