import {
  startAttempt,
  getQuestionBankProperties,
  getAssessmentChildrenMap,
  incrementUsedQuestionIds,
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
  const createTestAssessmentChildMap = () => {
    const types = [QUESTION_BANK_NODE_TYPE, QUESTION_NODE_TYPE]
    let i = 0
    return getAssessmentChildrenMap({
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

    incrementUsedQuestionIds(mockQbTree, assessmentChildrenMap)
    expect(assessmentChildrenMap).toMatchSnapshot()
  })

  it('can choose to display questions sequentially', () => {
    // const root = new Draft(testJson)
    // const fakeTree = { 'test': new DraftNode({}, {}, {}) }
    // fakeTree['test'].children = [

    // ]

    // const mockAssessmentProperties = {
    //   childrenMap: createTestAssessmentChildMap(),
    //   node: {
    //     draftTree: {
    //       getChildNodeById: jest.fn(id => {

    //       })
    //     }
    //   }
    // }
    // const testTree = createTestTree()

    // console.log();
  })
})