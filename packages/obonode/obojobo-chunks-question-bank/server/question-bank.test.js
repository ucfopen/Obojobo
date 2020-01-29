jest.mock('obojobo-express/server/logger')
jest.mock(
	'./util',
	() => ({
		getRandom: jest.fn().mockReturnValue(0)
	}),
	{ virtual: false }
)

jest.setMock(
	'obojobo-express/server/models/draft_node',
	require('obojobo-document-engine/__mocks__/models/draft_node')
)

const QuestionBank = require('./question-bank')
const _ = require('underscore')
const logger = require('obojobo-express/server/logger')
const { getRandom } = require('./util')
const SELECT_SEQUENTIAL = 'sequential'
const SELECT_RANDOM = 'random'
const SELECT_RANDOM_UNSEEN = 'random-unseen'

describe('QuestionBank', () => {
	/*
	|QB (choose=Infinity)
	|-QB1 (choose=1)
	|  |-qA
	|  |-qB
	|
	|-QB2 (choose=2)
	|  |-qC
	|  |-qD
	|  |-QB3 (choose=1)
	|    |-qE
	|    |-qF
	|
	|-qG
	|-qH
   */
	const buildQuestionBankForTest = select => {
		const draftTree = {
			getChildNodeById: jest.fn(id => nodes.find(c => c.id === id))
		}
		const nodes = []
		const newQ = id => {
			const q = {
				id: id,
				buildAssessment: () => 'mockBuiltQuestion-' + id,
				toObject: () => 'mockObj-' + id
			}
			nodes.push(q)
			return q
		}
		const newQb = (id, choose, children = []) => {
			const node = {
				content: {
					choose: choose,
					select: select
				}
			}
			const qb = new QuestionBank(draftTree, node)
			qb.id = id
			qb.type = 'ObojoboDraft.Chunks.QuestionBank'
			qb.children = children
			children.forEach(c => qb.immediateChildrenSet.add(c.id))
			nodes.push(qb)
			return qb
		}

		const qA = newQ('qA')
		const qB = newQ('qB')
		const qC = newQ('qC')
		const qD = newQ('qD')
		const qE = newQ('qE')
		const qF = newQ('qF')
		const qG = newQ('qG')
		const qH = newQ('qH')
		const QB1 = newQb('QB1', 1, [qA, qB])
		const QB3 = newQb('QB3', 1, [qE, qF])
		const QB2 = newQb('QB2', 2, [qC, qD, QB3])
		const QB = newQb('QB', Infinity, [QB1, QB2, qG, qH])

		return QB
	}

	beforeEach(() => {
		jest.resetAllMocks()
	})

	test('nodeName is expected value', () => {
		expect(QuestionBank.nodeName).toBe('ObojoboDraft.Chunks.QuestionBank')
	})

	test('removes children on sendToClient', () => {
		const questionBank = buildQuestionBankForTest(0)
		questionBank.children = 'mockChildren'
		questionBank.onSendToClient()
		expect(questionBank.children).toEqual([])
	})

	// Tree building tests - checks that child recursion works as expected
	// SELECT_UNSEEN_RANDOM follows a similar selection pattern to SELECT_SEQUENTIAL
	test('buildAssessment picks expected questions in order for FIRST attempt in sequential mode', () => {
		// uses | Tree
		//      |QB (choose=Infinity)
		//    0 |-QB1 (choose=1)
		//    0 |  |-qA <------------- EXPECT CHOSEN
		//    0 |  |-qB
		//      |
		//    0 |-QB2 (choose=2)
		//    0 |  |-qC <------------- EXPECT CHOSEN
		//    0 |  |-qD <------------- EXPECT CHOSEN
		//    0 |  |-QB3 (choose=1)
		//    0 |    |-qE
		//    0 |    |-qF
		//      |
		//    0 |-qG <---------------- EXPECT CHOSEN
		//    0 |-qH <---------------- EXPECT CHOSEN

		// preserve indentation structure
		// prettier-ignore
		const usageMap = new Map()
			.set('QB1',         0)
				.set('qA',      0)
				.set('qB',      0)
			.set('QB2',         0)
				.set('qC',      0)
				.set('qD',      0)
				.set('QB3',     0)
					.set('qE',  0)
					.set('qF',  0)
			.set('qG',          0)
			.set('qH',          0)

		const mockQuestionBank = buildQuestionBankForTest(SELECT_SEQUENTIAL)
		const chosenAssessment = mockQuestionBank.buildAssessment(usageMap)

		const expectedChosenAssessment = [
			'mockBuiltQuestion-qA',
			{ id: 'QB1', type: 'ObojoboDraft.Chunks.QuestionBank' },
			'mockBuiltQuestion-qC',
			'mockBuiltQuestion-qD',
			{ id: 'QB2', type: 'ObojoboDraft.Chunks.QuestionBank' },
			'mockBuiltQuestion-qG',
			'mockBuiltQuestion-qH',
			{ id: 'QB', type: 'ObojoboDraft.Chunks.QuestionBank' }
		]

		expect(chosenAssessment).toEqual(expectedChosenAssessment)
	})

	test('createChosenQuestionTree picks expected questions in order for SECOND attempt in sequential mode', () => {
		// uses | Tree
		//      |QB (choose=Infinity)
		//    1 |-QB1 (choose=1)
		//    1 |  |-qA
		//    0 |  |-qB <------------- EXPECT CHOSEN
		//      |
		//    1 |-QB2 (choose=2)
		//    1 |  |-qC <------------- EXPECT CHOSEN
		//    1 |  |-qD
		//    0 |  |-QB3 (choose=1)
		//    0 |    |-qE <----------- EXPECT CHOSEN
		//    0 |    |-qF
		//      |
		//    1 |-qG <---------------- EXPECT CHOSEN
		//    1 |-qH <---------------- EXPECT CHOSEN

		// preserve indentation structure
		// prettier-ignore
		const usageMap = new Map()
			.set('QB1',         1)
				.set('qA',      1)
				.set('qB',      0)
			.set('QB2',         1)
				.set('qC',      1)
				.set('qD',      1)
				.set('QB3',     0)
					.set('qE',  0)
					.set('qF',  0)
			.set('qG',          1)
			.set('qH',          1)

		const mockQuestionBank = buildQuestionBankForTest(SELECT_SEQUENTIAL)
		const chosenAssessment = mockQuestionBank.buildAssessment(usageMap)

		const expectedChosenAssessment = [
			'mockBuiltQuestion-qB',
			{ id: 'QB1', type: 'ObojoboDraft.Chunks.QuestionBank' },
			'mockBuiltQuestion-qE',
			{ id: 'QB3', type: 'ObojoboDraft.Chunks.QuestionBank' },
			'mockBuiltQuestion-qC',
			{ id: 'QB2', type: 'ObojoboDraft.Chunks.QuestionBank' },
			'mockBuiltQuestion-qG',
			'mockBuiltQuestion-qH',
			{ id: 'QB', type: 'ObojoboDraft.Chunks.QuestionBank' }
		]

		expect(chosenAssessment).toEqual(expectedChosenAssessment)
	})

	test('createChosenQuestionTree picks expected questions in order for THIRD attempt in sequential mode', () => {
		// uses | Tree
		//      |QB (choose=Infinity)
		//    2 |-QB1 (choose=1)
		//    1 |  |-qA <------------ EXPECT CHOSEN
		//    1 |  |-qB
		//      |
		//    2 |-QB2 (choose=2)
		//    2 |  |-qC
		//    1 |  |-qD <------------ EXPECT CHOSEN
		//    1 |  |-QB3 (choose=1)
		//    1 |    |-qE
		//    0 |    |-qF <---------- EXPECT CHOSEN
		//      |
		//    2 |-qG <--------------- EXPECT CHOSEN
		//    2 |-qH <--------------- EXPECT CHOSEN

		// preserve indentation structure
		// prettier-ignore
		const usageMap = new Map()
			.set('QB1',         2)
				.set('qA',      1)
				.set('qB',      1)
			.set('QB2',         2)
				.set('qC',      2)
				.set('qD',      1)
				.set('QB3',     1)
					.set('qE',  1)
					.set('qF',  0)
			.set('qG',          2)
			.set('qH',          2)

		const mockQuestionBank = buildQuestionBankForTest(SELECT_SEQUENTIAL)
		const chosenAssessment = mockQuestionBank.buildAssessment(usageMap)

		const expectedChosenAssessment = [
			'mockBuiltQuestion-qA',
			{ id: 'QB1', type: 'ObojoboDraft.Chunks.QuestionBank' },
			'mockBuiltQuestion-qD',
			'mockBuiltQuestion-qF',
			{ id: 'QB3', type: 'ObojoboDraft.Chunks.QuestionBank' },
			{ id: 'QB2', type: 'ObojoboDraft.Chunks.QuestionBank' },
			'mockBuiltQuestion-qG',
			'mockBuiltQuestion-qH',
			{ id: 'QB', type: 'ObojoboDraft.Chunks.QuestionBank' }
		]

		// test the ids and order of the results
		expect(chosenAssessment).toEqual(expectedChosenAssessment)
	})

	test('createChosenQuestionTree picks expected questions in order for FOURTH attempt in sequential mode', () => {
		// uses | Tree
		//      |QB (choose=Infinity)
		//    3 |-QB1 (choose=1)
		//    2 |  |-qA
		//    1 |  |-qB <------------ EXPECT CHOSEN
		//      |
		//    3 |-QB2 (choose=2)
		//    2 |  |-qC <------------ EXPECT CHOSEN
		//    2 |  |-qD <------------ EXPECT CHOSEN
		//    2 |  |-QB3 (choose=1)
		//    1 |    |-qE
		//    1 |    |-qF
		//      |
		//    3 |-qG <--------------- EXPECT CHOSEN
		//    3 |-qH <--------------- EXPECT CHOSEN

		// preserve indentation structure
		// prettier-ignore
		const usageMap = new Map()
			.set('QB1',         3)
				.set('qA',      2)
				.set('qB',      1)
			.set('QB2',         3)
				.set('qC',      2)
				.set('qD',      2)
				.set('QB3',     2)
					.set('qE',  1)
					.set('qF',  1)
			.set('qG',          3)
			.set('qH',          3)

		const mockQuestionBank = buildQuestionBankForTest(SELECT_SEQUENTIAL)
		const chosenAssessment = mockQuestionBank.buildAssessment(usageMap)

		const expectedChosenAssessment = [
			'mockBuiltQuestion-qB',
			{ id: 'QB1', type: 'ObojoboDraft.Chunks.QuestionBank' },
			'mockBuiltQuestion-qC',
			'mockBuiltQuestion-qD',
			{ id: 'QB2', type: 'ObojoboDraft.Chunks.QuestionBank' },
			'mockBuiltQuestion-qG',
			'mockBuiltQuestion-qH',
			{ id: 'QB', type: 'ObojoboDraft.Chunks.QuestionBank' }
		]

		// test the ids and order of the results
		expect(chosenAssessment).toEqual(expectedChosenAssessment)
	})

	test('buildAssessment creates a random-all group', () => {
		_.shuffle = jest.fn(array => array)

		const usageMap = new Map()

		const mockQBNode = buildQuestionBankForTest(SELECT_RANDOM)
		const chosenAssessment = mockQBNode.buildAssessment(usageMap)

		const expectedChosenAssessment = [
			'mockBuiltQuestion-qA',
			{ id: 'QB1', type: 'ObojoboDraft.Chunks.QuestionBank' },
			'mockBuiltQuestion-qC',
			'mockBuiltQuestion-qD',
			{ id: 'QB2', type: 'ObojoboDraft.Chunks.QuestionBank' },
			'mockBuiltQuestion-qG',
			'mockBuiltQuestion-qH',
			{ id: 'QB', type: 'ObojoboDraft.Chunks.QuestionBank' }
		]

		// test the ids and order of the results
		expect(chosenAssessment).toEqual(expect.arrayContaining(expectedChosenAssessment))
	})

	test('buildAssessment creates a random-unseen group', () => {
		const usageMap = new Map()
			.set('QB1', 0)
			.set('qA', 0)
			.set('qB', 0)
			.set('QB2', 0)
			.set('qC', 0)
			.set('qD', 0)
			.set('QB3', 0)
			.set('qE', 0)
			.set('qF', 0)
			.set('qG', 0)
			.set('qH', 0)

		const mockQBNode = buildQuestionBankForTest(SELECT_RANDOM_UNSEEN)
		const chosenAssessment = mockQBNode.buildAssessment(usageMap)

		const expectedChosenAssessment = [
			'mockBuiltQuestion-qA',
			{ id: 'QB1', type: 'ObojoboDraft.Chunks.QuestionBank' },
			'mockBuiltQuestion-qC',
			'mockBuiltQuestion-qD',
			{ id: 'QB2', type: 'ObojoboDraft.Chunks.QuestionBank' },
			'mockBuiltQuestion-qG',
			'mockBuiltQuestion-qH',
			{ id: 'QB', type: 'ObojoboDraft.Chunks.QuestionBank' }
		]

		// test the ids and order of the results
		expect(chosenAssessment).toEqual(expect.arrayContaining(expectedChosenAssessment))
	})

	test('buildAssessment creates a sequential group and logs an error when select is unknown', () => {
		const usageMap = new Map()
			.set('QB1', 0)
			.set('qA', 0)
			.set('qB', 0)
			.set('QB2', 0)
			.set('qC', 0)
			.set('qD', 0)
			.set('QB3', 0)
			.set('qE', 0)
			.set('qF', 0)
			.set('qG', 0)
			.set('qH', 0)

		const mockQBNode = buildQuestionBankForTest('mock-invalid-selection')
		const assessmentArray = mockQBNode.buildAssessment(usageMap)

		// test the ids and order of the results
		const expectedAssessmentArray = [
			'mockBuiltQuestion-qA',
			{ id: 'QB1', type: 'ObojoboDraft.Chunks.QuestionBank' },
			'mockBuiltQuestion-qC',
			'mockBuiltQuestion-qD',
			{ id: 'QB2', type: 'ObojoboDraft.Chunks.QuestionBank' },
			'mockBuiltQuestion-qG',
			'mockBuiltQuestion-qH',
			{ id: 'QB', type: 'ObojoboDraft.Chunks.QuestionBank' }
		]

		expect(assessmentArray.length).toBe(8)
		expect(assessmentArray).toEqual(expectedAssessmentArray)
		expect(logger.error.mock.calls[0]).toEqual([
			'Invalid Select Type for QuestionBank: mock-invalid-selection'
		])
	})

	test('getContentValues returns values for choose and select', () => {
		const mockNode = {
			content: {
				choose: 7,
				select: SELECT_RANDOM
			}
		}
		const mockQBNode = new QuestionBank({}, mockNode)
		const content = mockQBNode.getContentValues()

		expect(content).toEqual({
			choose: 7,
			select: SELECT_RANDOM
		})
	})

	test('getContentValues returns default values when not provided', () => {
		const mockNode = {
			content: {}
		}
		const mockQBNode = new QuestionBank({}, mockNode)
		const content = mockQBNode.getContentValues()

		expect(content).toEqual({
			choose: Infinity,
			select: SELECT_SEQUENTIAL
		})
	})

	test('getContentValues allows "all" as an alias for Infinity in choose', () => {
		const mockNode = {
			content: {
				choose: 'all'
			}
		}
		const mockQBNode = new QuestionBank({}, mockNode)
		const content = mockQBNode.getContentValues()

		expect(content).toEqual({
			choose: Infinity,
			select: SELECT_SEQUENTIAL
		})
	})

	test('buildFromArray calls the draft document to get nodes from ids', () => {
		const mockDraftDocument = {
			getChildNodeById: jest.fn(id => 'mockObject-' + id)
		}

		const node = {
			content: {
				choose: 3,
				select: null
			}
		}
		const mockQBNode = new QuestionBank(mockDraftDocument, node)

		const mockchosen = ['qb1.q1', 'qb1.q2', 'qb1.q3']

		// Test for children without buildAssessment
		let chosenChildren = mockQBNode.buildFromArray(mockchosen, {})
		expect(chosenChildren).toEqual([])

		// Test for children with buildAssessment
		const mockBuildAssessment = jest.fn().mockImplementation(() => 'mockBuiltObject')
		mockDraftDocument.getChildNodeById.mockImplementation(id => {
			return {
				id: id,
				buildAssessment: mockBuildAssessment
			}
		})
		chosenChildren = mockQBNode.buildFromArray(mockchosen, {})
		expect(chosenChildren).toEqual(['mockBuiltObject', 'mockBuiltObject', 'mockBuiltObject'])
		expect(mockBuildAssessment).toHaveBeenCalledTimes(3)
	})

	// build array tests
	test('displays unseen question banks and questions sequentially', () => {
		const mockUsedQuestionMap = new Map()
		mockUsedQuestionMap.set('qb1', 1)
		mockUsedQuestionMap.set('qb1.q1', 1)
		mockUsedQuestionMap.set('qb1.q2', 1)
		mockUsedQuestionMap.set('qb1.q3', 1)

		const mockChildrenIds = ['qb1.q1', 'qb1.q2', 'qb1.q3']

		const node = {
			content: {
				choose: 0,
				select: null
			}
		}
		const mockQBNode = new QuestionBank(null, node)
		mockQBNode.immediateChildrenSet = mockChildrenIds

		// Choosing questions where numQuestionsPerAttempt = 1.
		mockQBNode.choose = 1
		let chosen = mockQBNode.createChosenArraySequentially(mockUsedQuestionMap)
		expect(chosen).toEqual(['qb1.q1'])

		// Choosing questions where numQuestionsPerAttempt is more than 1.
		mockQBNode.choose = 2
		chosen = mockQBNode.createChosenArraySequentially(mockUsedQuestionMap)
		expect(chosen).toEqual(['qb1.q1', 'qb1.q2'])

		// Case to test sorting of question banks.
		mockQBNode.choose = Infinity
		chosen = mockQBNode.createChosenArraySequentially(mockUsedQuestionMap)
		expect(chosen).toEqual(['qb1.q1', 'qb1.q2', 'qb1.q3'])

		// Case where questions need to be reordered (q2 should now come first).
		mockUsedQuestionMap.set('qb1.q1', 2)
		chosen = mockQBNode.createChosenArraySequentially(mockUsedQuestionMap, 3)
		expect(chosen).toEqual(['qb1.q2', 'qb1.q3', 'qb1.q1'])
	})

	test('display all question banks and questions randomly', () => {
		_.shuffle = jest.fn(() => ['qb1.q2', 'qb1.q1', 'qb1.q3'])

		const mockChildrenIds = ['qb1.q1', 'qb1.q2', 'qb1.q3']

		const node = {
			content: {
				choose: 1,
				select: null
			}
		}
		const mockQBNode = new QuestionBank(null, node)
		mockQBNode.immediateChildrenSet = mockChildrenIds

		// Choosing questions where numQuestionsPerAttempt = 1.
		mockQBNode.choose = 1
		let chosen = mockQBNode.createChosenArrayRandomly()
		expect(chosen).toEqual(['qb1.q2'])
		expect(_.shuffle).toHaveBeenCalled()

		// Choosing questions where numQuestionsPerAttempt is more than 1.
		mockQBNode.choose = 2
		chosen = mockQBNode.createChosenArrayRandomly()
		expect(chosen).toEqual(['qb1.q2', 'qb1.q1'])
		expect(_.shuffle).toHaveBeenCalled()

		// Case to test sorting of question banks.
		mockQBNode.choose = Infinity
		chosen = mockQBNode.createChosenArrayRandomly()
		expect(chosen).toEqual(['qb1.q2', 'qb1.q1', 'qb1.q3'])
		expect(_.shuffle).toHaveBeenCalled()
	})

	test('display unseen question banks and questions randomly', () => {
		const mockUsedQuestionMap = new Map()
		mockUsedQuestionMap.set('qb1', 1)
		mockUsedQuestionMap.set('qb1.q1', 1)
		mockUsedQuestionMap.set('qb1.q2', 1)
		mockUsedQuestionMap.set('qb1.q3', 1)

		const mockChildrenIds = ['qb1.q1', 'qb1.q2', 'qb1.q3']

		const node = {
			content: {
				choose: 1,
				select: null
			}
		}
		const mockQBNode = new QuestionBank(null, node)
		mockQBNode.immediateChildrenSet = mockChildrenIds

		// Choosing questions where numQuestionsPerAttempt = 1.
		mockQBNode.choose = 1
		let chosen = mockQBNode.createChosenArrayUnseenRandomly(mockUsedQuestionMap)
		expect(chosen).toEqual(['qb1.q1'])
		expect(getRandom).toHaveBeenCalled()

		// Choosing questions where numQuestionsPerAttempt is more than 1.
		mockQBNode.choose = 2
		chosen = mockQBNode.createChosenArrayUnseenRandomly(mockUsedQuestionMap)
		expect(chosen).toEqual(['qb1.q1', 'qb1.q2'])
		expect(getRandom).toHaveBeenCalled()

		// Case to test sorting of question banks.
		mockQBNode.choose = 3
		chosen = mockQBNode.createChosenArrayUnseenRandomly(mockUsedQuestionMap)
		expect(chosen).toEqual(['qb1.q1', 'qb1.q2', 'qb1.q3'])
		expect(getRandom).toHaveBeenCalled()

		// Case where questions need to be reordered (q2 should now come first).
		mockQBNode.choose = 3
		mockUsedQuestionMap.set('qb1.q1', 2)
		chosen = mockQBNode.createChosenArrayUnseenRandomly(mockUsedQuestionMap)
		expect(chosen).toEqual(['qb1.q2', 'qb1.q3', 'qb1.q1'])
	})
})
