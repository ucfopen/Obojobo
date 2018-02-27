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

const DraftNode = oboRequire('models/draft_node')
const QUESTION_BANK_NODE_TYPE = 'ObojoboDraft.Chunks.QuestionBank'
const QUESTION_NODE_TYPE = 'ObojoboDraft.Chunks.Question'

jest.mock('../../../../db')

describe('start attempt route', () => {
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
    let i = 0
    const types = [QUESTION_BANK_NODE_TYPE, QUESTION_NODE_TYPE]
    const mockGetChildNodeById = jest.fn(() => ({
      // Flip between q/qb types, .set() should be called w/ both.
      node: { type: types[i === 1 ? --i : ++i] }
    }))
    const mockAssessmentProperties = {
      nodeChildrenIds: ['test', 'test1', 'test2', 'test3'],
      draftTree: { getChildNodeById: mockGetChildNodeById }
    }

    const assessmentChildrenMap = getAssessmentChildrenMap(mockAssessmentProperties)

    expect(assessmentChildrenMap.size).toEqual(4)
    expect(assessmentChildrenMap).toMatchSnapshot()
  })

  // incrementUsedQuestionIds test
  it('can track use of assessment questions using an initialized question map', () => {

  })

  // chooseQuestionsSequentiallyTest
  it('can choose questions sequentially', () => {

  })
})