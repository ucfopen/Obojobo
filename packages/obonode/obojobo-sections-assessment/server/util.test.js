jest.mock('obojobo-express/logger')

const Util = require('./util')
const logger = require('obojobo-express/logger')

const QUESTION_NODE_TYPE = 'ObojoboDraft.Chunks.Question'
const QUESTION_BANK_NODE_TYPE = 'ObojoboDraft.Chunks.QuestionBank'

describe('Util', () => {
	beforeEach(() => {
		jest.resetAllMocks()
	})

	test('getFullQuestionsFromDraftTree returns full questions', () => {
		const mockDraftTree = {
			getChildNodeById: jest.fn().mockReturnValueOnce({
				id: 'mockQuestion',
				type: QUESTION_NODE_TYPE,
				children: [],
				yell: jest.fn(),
				toObject: jest.fn().mockReturnValueOnce({})
			})
		}

		const mockQuestionsMetadata = [
			{
				id: 'mockQuestion',
				type: QUESTION_NODE_TYPE
			},
			{
				id: 'mockQuestionBank',
				type: QUESTION_BANK_NODE_TYPE
			}
		]

		const questions = Util.getFullQuestionsFromDraftTree(mockDraftTree, mockQuestionsMetadata)

		// The questions metadata contains a question bank and a question. getFullQuestionsFromDraftTree
		// should only act on questions and ignore question banks
		expect(mockDraftTree.getChildNodeById).toHaveBeenCalledTimes(1)
		expect(questions.length).toEqual(1)
	})

	test('getRandom calls Math.random', () => {
		jest.spyOn(Math, 'random')
		Util.getRandom()
		expect(Math.random).toHaveBeenCalled()
	})

	test('logAndRespondToUnexpected calls res.unexpected and logs error', () => {
		const res = {
			unexpected: jest.fn()
		}
		const req = {}
		const mockError = new Error('mockUnexpectedError')

		Util.logAndRespondToUnexpected(mockError.message, res, req, mockError)
		expect(res.unexpected).toHaveBeenCalledWith('mockUnexpectedError')
		expect(logger.error).toHaveBeenCalledWith(
			'logAndRespondToUnexpected',
			'mockUnexpectedError',
			mockError
		)
	})
})
