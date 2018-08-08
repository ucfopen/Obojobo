jest.mock('../../server/assessment')
jest.mock('underscore')
jest.mock('../../server/util')

jest.mock(
	'../../__mocks__/models/visit',
	() => ({
		fetchById: jest.fn()
	}),
	{ virtual: true }
)

jest.mock(
	'../../server/util',
	() => ({
		getRandom: jest.fn().mockReturnValue(0),
		logAndRespondToUnexpected: jest.fn()
	}),
	{ virtual: false }
)

const { getRandom, logAndRespondToUnexpected } = require('../../server/util')

const AS = require('../../server/attempt-start.js')
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
	insertAttemptStartCaliperEvent,
	getState,
	loadChildren
} = require('../../server/attempt-start.js')
const _ = require('underscore')
const testJson = require('../../test-object.json')
const Assessment = require('../../server/assessment')
const insertEvent = oboRequire('insert_event')
const db = oboRequire('db')
const Draft = oboRequire('models/draft')
const DraftNode = oboRequire('models/draft_node')
const createCaliperEvent = oboRequire('routes/api/events/create_caliper_event')
const Visit = oboRequire('models/visit')

const QUESTION_BANK_NODE_TYPE = 'ObojoboDraft.Chunks.QuestionBank'
const QUESTION_NODE_TYPE = 'ObojoboDraft.Chunks.Question'
const ERROR_ATTEMPT_LIMIT_REACHED = 'Attempt limit reached'
const ERROR_UNEXPECTED_DB_ERROR = 'Unexpected DB error'

describe('start attempt route', () => {
	let originalRandom
	let mockDraft
	let mockUsedQuestionMap
	let mockReq
	let mockRes

	const mockGetChildNodeByIdForRootNode = () => {
		// mock the initial request to get the root node
		mockDraft.getChildNodeById.mockReturnValueOnce({
			immediateChildrenSet: mockUsedQuestionMap.keys()
		})
	}

	const convertChosenTreeToIdArray = (tree, assessmentNode) => {
		// pluck out questions into an array
		const chosenQuestions = getNodeQuestions(tree, assessmentNode)

		// convert to array of ids for simplicity
		return chosenQuestions.map(q => q.id)
	}

	const runAttemptThroughCreateChosenQuestionTree = useageMap => {
		// mock the structure
		const { QB, assessmentProperties } = buildTreeForTest()

		// override the usage map
		assessmentProperties.questionUsesMap = useageMap

		// select/filter nodes
		createChosenQuestionTree(QB, assessmentProperties)

		return convertChosenTreeToIdArray(QB, assessmentProperties.oboNode)
	}

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
	const buildTreeForTest = () => {
		const draftTree = {
			getChildNodeById: jest.fn(id => nodes.find(c => c.id == id))
		}
		const nodes = []
		const usesMap = new Map()
		const newQ = id => {
			const q = new DraftNode(draftTree)
			q.id = id
			q.type = 'ObojoboDraft.Chunks.Question'
			usesMap.set(q.id, 0)
			nodes.push(q)
			return q
		}
		const newQb = (id, choose, children = []) => {
			const qb = new DraftNode(draftTree)
			qb.id = id
			qb.type = 'ObojoboDraft.Chunks.QuestionBank'
			qb.children = children
			qb.content = { choose: choose }
			children.forEach(c => qb.immediateChildrenSet.add(c.id))
			usesMap.set(qb.id, 0)
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

		return {
			QB,
			usesMap,
			assessmentProperties: {
				oboNode: QB,
				questionUsesMap: usesMap
			}
		}
	}

	beforeEach(() => {
		jest.resetAllMocks()
		getRandom.mockReturnValue(0)
		Visit.fetchById.mockReturnValue({ is_preview: false })

		// mock _.shuffle by always returning the same array
		// just check to make sure shuffle.toHaveBeenCalled
		_.shuffle.mockImplementation(arr => arr)
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

	test('startAttempt calls database, inserts events, and returns expected object', done => {
		mockRes = {
			success: jest.fn(),
			reject: jest.fn()
		}

		const mockAssessmentNode = {
			getChildNodeById: jest.fn(() => ({
				node: {
					content: {
						attempts: 3
					}
				},
				children: [
					{},
					{
						childrenSet: [],
						toObject: jest.fn().mockReturnValueOnce({
							children: [
								{
									id: 'mockQuestion',
									type: QUESTION_NODE_TYPE,
									children: [],
									yell: jest.fn(),
									toObject: jest.fn().mockReturnValueOnce({})
								}
							]
						})
					}
				],
				draftTree: {
					getChildNodeById: jest.fn().mockReturnValueOnce({
						id: 'mockQuestion',
						type: QUESTION_NODE_TYPE,
						children: [],
						yell: jest.fn(),
						toObject: jest.fn().mockReturnValueOnce({})
					})
				}
			}))
		}

		mockReq = {
			requireCurrentDocument: jest.fn(() => Promise.resolve(mockAssessmentNode)),
			requireCurrentUser: jest.fn(() =>
				Promise.resolve({
					canViewEditor: true
				})
			),
			body: {
				draftId: 'mockDraftId',
				assessmentId: 'mockAssessmentId'
			},
			hostname: 'mockHostname',
			connection: {
				remoteAddress: 'mockRemoteAddress'
			}
		}

		// Set dummy versions of methods called by startAttempt
		Assessment.getCompletedAssessmentAttemptHistory = jest.fn().mockResolvedValueOnce([])
		Assessment.getNumberAttemptsTaken = jest.fn(() => 1)
		Assessment.insertNewAttempt = jest.fn().mockReturnValueOnce({
			attemptId: 'mockAttemptId'
		})
		const createAssessmentAttemptStartedEvent = jest.fn().mockReturnValue('mockCaliperPayload')
		insertEvent.mockReturnValueOnce('mockInsertResult')
		createCaliperEvent.mockReturnValueOnce({
			createAssessmentAttemptStartedEvent
		})

		return startAttempt(mockReq, mockRes).then(() => {
			expect(mockReq.requireCurrentDocument).toHaveBeenCalled()
			expect(Assessment.getCompletedAssessmentAttemptHistory).toHaveBeenCalled()
			expect(Assessment.insertNewAttempt).toHaveBeenCalled()

			return done()
		})
	})

	test('startAttempt rejects with an expected error when no attempts remain', done => {
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

		mockReq = {
			requireCurrentDocument: jest.fn(() => Promise.resolve(mockAssessmentNode)),
			requireCurrentUser: jest.fn(() =>
				Promise.resolve({
					user: {}
				})
			),
			body: {
				draftId: 'mockDraftId',
				assessmentId: 'mockAssessmentId'
			}
		}

		Assessment.getCompletedAssessmentAttemptHistory = jest
			.fn()
			.mockResolvedValueOnce(['oneAttempt'])

		startAttempt(mockReq, mockRes).then(() => {
			expect(mockRes.reject).toHaveBeenCalledWith(ERROR_ATTEMPT_LIMIT_REACHED)
			done()
		})
	})

	test('startAttempt calls logAndRespondToUnexpected with unexpected error', done => {
		mockReq = {
			requireCurrentDocument: jest.fn(() => {
				throw new Error(ERROR_UNEXPECTED_DB_ERROR)
			}),
			requireCurrentUser: jest.fn(() =>
				Promise.resolve({
					user: {}
				})
			)
		}

		mockRes = { unexpected: jest.fn() }

		startAttempt(mockReq, mockRes).then(() => {
			expect(logAndRespondToUnexpected).toHaveBeenCalled()
			done()
		})
	})

	test('getState calls qb.buildAssessment and returns the expected state', () => {
		const fakeChildNodes = [
			{
				id: 'qb1.q1',
				type: 'ObojoboDraft.Chunks.Question',
				children: []
			},
			{
				id: 'qb1.q2',
				type: 'ObojoboDraft.Chunks.Question',
				children: []
			}
		]
		const mockQbTree = { id: 'qb1', children: [], type: 'no-type' }
		const mockAssessmentProperties = {
			nodeChildrenIds: [],
			draftTree: mockDraft,
			attemptHistory: [],
			oboNode: {
				draftTree: mockDraft
			},
			assessmentQBTree: mockQbTree
		}
		// mock child lookup
		mockDraft.getChildNodeById.mockImplementation(id => {
			return {
				node: {
					id: id,
					type: 'ObojoboDraft.Chunks.Question'
				}
			}
		})

		const state = getState(mockAssessmentProperties)

		expect(state.questions).toEqual([])
	})

	test('loadChildren builds a full map of used questions', () => {
		const fakeChildNodes = [{ id: 'qb1.q1', children: [] }, { id: 'qb1.q2', children: [] }]
		const mockQbTree = { id: 'qb1', children: fakeChildNodes }
		const mockAssessmentProperties = {
			nodeChildrenIds: ['qb1', 'qb1.q1', 'qb1.q2', 'qb2', 'qb2.q1', 'qb2.q2'],
			draftTree: mockDraft,
			attemptHistory: [
				{
					state: {
						qb: mockQbTree
					}
				}
			]
		}
		// mock child lookup
		mockDraft.getChildNodeById.mockReturnValue({ node: { type: 'ObojoboDraft.Chunks.Question' } })

		const map = loadChildren(mockAssessmentProperties)

		expect(map.get('qb1')).toBe(1)
		expect(map.get('qb1.q1')).toBe(1)
		expect(map.get('qb1.q2')).toBe(1)
		expect(map.get('qb2')).toBe(0)
		expect(map.get('qb2.q1')).toBe(0)
		expect(map.get('qb2.q2')).toBe(0)
	})

	test('loadChildren does not alter the map when an attempt does not have a qb', () => {
		const mockAssessmentProperties = {
			nodeChildrenIds: ['qb1', 'qb1.q1', 'qb1.q2', 'qb2', 'qb2.q1', 'qb2.q2'],
			draftTree: mockDraft,
			attemptHistory: [
				{
					state: {}
				}
			]
		}
		// mock child lookup
		mockDraft.getChildNodeById.mockReturnValue({ node: { type: 'ObojoboDraft.Chunks.Question' } })

		const map = loadChildren(mockAssessmentProperties)

		expect(map.get('qb1')).toBe(0)
		expect(map.get('qb1.q1')).toBe(0)
		expect(map.get('qb1.q2')).toBe(0)
		expect(map.get('qb2')).toBe(0)
		expect(map.get('qb2.q1')).toBe(0)
		expect(map.get('qb2.q2')).toBe(0)
	})

	test('getQuestionBankProperties retrieves question bank properties with attributes set', () => {
		const mockQuestionBankNode = new DraftNode({}, { content: { choose: 2, select: 'test' } }, {})
		const qbProperties = getQuestionBankProperties(mockQuestionBankNode.node)

		expect(Object.keys(qbProperties).length).toBe(2)
		expect(qbProperties.choose).toBe(2)
		expect(qbProperties.select).toBe('test')
	})

	test('getQuestionBankProperties can retrieve question bank properties with NO attributes set', () => {
		const mockQuestionBankNode = new DraftNode({}, { content: {} }, {})
		const qbProperties = getQuestionBankProperties(mockQuestionBankNode.node)

		expect(Object.keys(qbProperties).length).toBe(2)
		expect(qbProperties.choose).toBe(Infinity)
		expect(qbProperties.select).toBe('sequential')
	})

	test('createAssessmentUsedQuestionMap initializes a map of questions', () => {
		const mockAssessmentProperties = {
			nodeChildrenIds: ['qb1', 'qb1.q1', 'qb1.q2', 'qb2', 'qb2.q1', 'qb2.q2'],
			draftTree: mockDraft
		}

		// mock child lookup
		mockDraft.getChildNodeById.mockReturnValue({ node: { type: 'ObojoboDraft.Chunks.Question' } })
		mockDraft.getChildNodeById.mockReturnValueOnce({
			node: { type: 'ObojoboDraft.Chunks.QuestionBank' }
		})
		mockDraft.getChildNodeById.mockReturnValueOnce({ node: { type: 'none' } })

		const usedQuestionMap = createAssessmentUsedQuestionMap(mockAssessmentProperties)

		expect(usedQuestionMap.constructor).toBe(Map)
		expect(usedQuestionMap.size).toBe(5)
		expect(usedQuestionMap.get('qb1')).toBe(0)
		expect(usedQuestionMap.get('qb1.q2')).toBe(0)
		expect(usedQuestionMap.get('qb2')).toBe(0)
		expect(usedQuestionMap.get('qb2.q1')).toBe(0)
		expect(usedQuestionMap.get('qb2.q2')).toBe(0)
	})

	test('initAssessmentUsedQuestions tracks question use from initalized map', () => {
		const fakeChildNodes = [
			{
				id: 'qb1.q1',
				children: []
			},
			{
				id: 'qb1.q2',
				children: []
			},
			{
				id: 'mockId',
				children: []
			}
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

	test('createAssessmentUsedQuestionMap can initialize a map to track use of assessment questions', () => {
		const mockAssessmentProperties = {
			nodeChildrenIds: ['qb1', 'qb1.q1', 'qb1.q2', 'qb2', 'qb2.q1', 'qb2.q2'],
			draftTree: mockDraft
		}

		// mock child lookup
		mockDraft.getChildNodeById.mockReturnValue({ node: { type: 'ObojoboDraft.Chunks.Question' } })

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

	test('initAssessmentUsedQuestions can track use of assessment questions using an initialized question map', () => {
		const fakeChildNodes = [{ id: 'qb1.q1', children: [] }, { id: 'qb1.q2', children: [] }]
		const mockQbTree = { id: 'qb1', children: fakeChildNodes }

		initAssessmentUsedQuestions(mockQbTree, mockUsedQuestionMap)

		expect(mockUsedQuestionMap.get('qb1')).toBe(1)
		expect(mockUsedQuestionMap.get('qb1.q1')).toBe(1)
		expect(mockUsedQuestionMap.get('qb1.q2')).toBe(1)
		expect(mockUsedQuestionMap.get('qb2')).toBe(0)
		expect(mockUsedQuestionMap.get('qb2.q1')).toBe(0)
		expect(mockUsedQuestionMap.get('qb2.q2')).toBe(0)
	})

	test('chooseUnseenQuestionsSequentially can choose to display unseen question banks and questions sequentially', () => {
		const mockAssessmentProperties = {
			oboNode: { draftTree: mockDraft },
			questionUsesMap: mockUsedQuestionMap
		}

		mockUsedQuestionMap.set('qb2', 1)
		mockUsedQuestionMap.set('qb2.q1', 1)
		mockUsedQuestionMap.set('qb2.q2', 1)

		// mock most requests to get each question (by default)
		mockDraft.getChildNodeById.mockImplementation(id => ({ toObject: () => `fakeObject-${id}` }))

		// Choosing questions where numQuestionsPerAttempt is 0 (no quesitons should be chosen).
		mockGetChildNodeByIdForRootNode()
		expect(chooseUnseenQuestionsSequentially(mockAssessmentProperties, 'qb1', 0)).toEqual([])

		// Case to test sorting of question banks (qb1 should come first).
		mockGetChildNodeByIdForRootNode()
		expect(chooseUnseenQuestionsSequentially(mockAssessmentProperties, 'qb', 3)).toEqual([
			'fakeObject-qb1',
			'fakeObject-qb1.q1',
			'fakeObject-qb1.q2'
		])

		// Choosing questions where numQuestionsPerAttempt = 1.
		mockGetChildNodeByIdForRootNode()
		expect(chooseUnseenQuestionsSequentially(mockAssessmentProperties, 'qb1', 1)).toEqual([
			'fakeObject-qb1'
		])

		// Choosing questions where numQuestionsPerAttempt is more than 1.
		mockGetChildNodeByIdForRootNode()
		expect(chooseUnseenQuestionsSequentially(mockAssessmentProperties, 'qb1', 3)).toEqual([
			'fakeObject-qb1',
			'fakeObject-qb1.q1',
			'fakeObject-qb1.q2'
		])

		// Case where questions need to be reordered (q2 should now come first).
		mockGetChildNodeByIdForRootNode()
		mockUsedQuestionMap.set('qb1.q1', 1)
		expect(chooseUnseenQuestionsSequentially(mockAssessmentProperties, 'qb1', 3)).toEqual([
			'fakeObject-qb1',
			'fakeObject-qb1.q2',
			'fakeObject-qb1.q1'
		])
	})

	test('chooseAllQuestionsRandomly can choose to display all question banks and questions randomly', () => {
		_.shuffle = jest.fn(() => ['qb2', 'qb1'])

		const mockAssessmentProperties = {
			oboNode: { draftTree: mockDraft },
			questionUsesMap: {}
		}

		// mock most requests to get each question (by default)
		mockDraft.getChildNodeById.mockImplementation(id => ({ toObject: () => `fakeObject-${id}` }))

		mockGetChildNodeByIdForRootNode()
		expect(chooseAllQuestionsRandomly(mockAssessmentProperties, 'qb', 2)).toEqual([
			'fakeObject-qb2',
			'fakeObject-qb1'
		])
		expect(_.shuffle).toHaveBeenCalled()
	})

	test('chooseAllQuestionsRandomly can choose to display unseen question banks and questions randomly', () => {
		getRandom.mockReturnValue(1)
		// Unseen questions will come first, if we've seen an equal
		// number of times, we use Math.random.
		mockUsedQuestionMap.set('qb1', 1)
		mockUsedQuestionMap.set('qb2', 1)

		const mockAssessmentProperties = {
			oboNode: { draftTree: mockDraft },
			questionUsesMap: mockUsedQuestionMap
		}

		// mock most requests to get each question (by default)
		mockDraft.getChildNodeById.mockImplementation(id => ({ toObject: () => `fakeObject-${id}` }))

		mockGetChildNodeByIdForRootNode()
		expect(chooseUnseenQuestionsRandomly(mockAssessmentProperties, 'qb', 2)).toEqual([
			'fakeObject-qb2.q2',
			'fakeObject-qb2.q1'
		])
		expect(getRandom).toHaveBeenCalled()
	})

	test('createChosenQuestionTree picks expected questions in order for FIRST attempt in sequential mode', () => {
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
		//    0 |-qG <--------------- EXPECT CHOSEN
		//    0 |-qH <--------------- EXPECT CHOSEN

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

		const ids = runAttemptThroughCreateChosenQuestionTree(usageMap)

		// test the ids and order of the results
		expect(ids).toEqual(['qA', 'qC', 'qD', 'qG', 'qH'])
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
		//    1 |-qG <--------------- EXPECT CHOSEN
		//    1 |-qH <--------------- EXPECT CHOSEN

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

		const ids = runAttemptThroughCreateChosenQuestionTree(usageMap)

		expect(ids).toEqual(['qB', 'qE', 'qC', 'qG', 'qH'])
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

		const ids = runAttemptThroughCreateChosenQuestionTree(usageMap)

		// test the ids and order of the results
		expect(ids).toEqual(['qA', 'qD', 'qF', 'qG', 'qH'])
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

		const ids = runAttemptThroughCreateChosenQuestionTree(usageMap)

		// test the ids and order of the results
		expect(ids).toEqual(['qB', 'qC', 'qD', 'qG', 'qH'])
	})

	test('createChosenQuestionTree creates a sequential group with no limit', () => {
		const { QB, assessmentProperties } = buildTreeForTest()
		QB.content.select = 'sequential'
		QB.content.choose = Infinity
		createChosenQuestionTree(QB, assessmentProperties)
		const ids = convertChosenTreeToIdArray(QB, assessmentProperties.oboNode)

		expect(ids).toEqual(['qA', 'qC', 'qD', 'qG', 'qH'])
	})

	test('createChosenQuestionTree creates a random-all group with no limit', () => {
		const { QB, assessmentProperties } = buildTreeForTest()
		QB.content.select = 'random-all'
		QB.content.choose = Infinity
		expect(_.shuffle).not.toHaveBeenCalled()
		createChosenQuestionTree(QB, assessmentProperties)

		// make sure shuffle's called on the top level children
		expect(_.shuffle).toHaveBeenCalledTimes(1)
		expect(_.shuffle).toHaveBeenCalledWith(['QB1', 'QB2', 'qG', 'qH'])
		const ids = convertChosenTreeToIdArray(QB, assessmentProperties.oboNode)

		// mock _.shuffle doesn't alter the order, expect the same as sequential
		expect(ids).toEqual(['qA', 'qC', 'qD', 'qG', 'qH'])
	})

	test('createChosenQuestionTree creates a sequential group with a limit', () => {
		//|QB (choose=2)
		//|-QB1 (choose=1)
		//|  |-qA <------------ EXPECT CHOSEN
		//|  |-qB
		//|
		//|-QB2 (choose=2)
		//|  |-qC <------------ EXPECT CHOSEN
		//|  |-qD <------------ EXPECT CHOSEN
		//|  |-QB3 (choose=1)
		//|    |-qE
		//|    |-qF
		//|
		//|-qG
		//|-qH
		const { QB, assessmentProperties } = buildTreeForTest()
		QB.content.select = 'sequential'
		QB.content.choose = 2
		createChosenQuestionTree(QB, assessmentProperties)
		const ids = convertChosenTreeToIdArray(QB, assessmentProperties.oboNode)

		expect(ids).toEqual(['qA', 'qC', 'qD'])
	})

	test('createChosenQuestionTree creates a random-all group with a limit', () => {
		const { QB, assessmentProperties } = buildTreeForTest()
		QB.content.select = 'random-all'
		QB.content.choose = 2
		expect(_.shuffle).not.toHaveBeenCalled()
		createChosenQuestionTree(QB, assessmentProperties)
		expect(_.shuffle).toHaveBeenCalled()
		const ids = convertChosenTreeToIdArray(QB, assessmentProperties.oboNode)

		expect(ids).toEqual(['qA', 'qC', 'qD'])
	})

	test('createChosenQuestionTree creates a random-unseen group with no limit', () => {
		const { QB, assessmentProperties } = buildTreeForTest()
		QB.content.select = 'random-unseen'
		QB.content.choose = Infinity
		expect(getRandom).not.toHaveBeenCalled()
		createChosenQuestionTree(QB, assessmentProperties)
		expect(getRandom).toHaveBeenCalled()
		const ids = convertChosenTreeToIdArray(QB, assessmentProperties.oboNode)

		expect(ids).toEqual(['qA', 'qC', 'qD', 'qG', 'qH'])
	})

	test('createChosenQuestionTree creates a random-unseen group with a limit', () => {
		const { QB, assessmentProperties } = buildTreeForTest()
		QB.content.select = 'random-unseen'
		QB.content.choose = 2
		expect(getRandom).not.toHaveBeenCalled()
		createChosenQuestionTree(QB, assessmentProperties)
		expect(getRandom).toHaveBeenCalled()
		const ids = convertChosenTreeToIdArray(QB, assessmentProperties.oboNode)

		expect(ids).toEqual(['qA', 'qC', 'qD'])
	})

	test('can retrieve an array of question type nodes from a node tree', () => {
		let n = 0
		const newQ = () => {
			const q = new DraftNode()
			q.id = n++
			q.type = 'ObojoboDraft.Chunks.Question'
			return q
		}

		const node = new DraftNode({ getChildNodeById: jest.fn(id => `q${id}`) })
		const q1 = newQ()
		const q2 = newQ()
		const q3 = newQ()
		const q4 = newQ()
		const q5 = newQ()
		const q6 = newQ()
		node.children = [q1, q5]
		q1.children = [q2, q3]
		q2.children = [q4, q6]
		q6.type = 'not-a-question'

		const questions = getNodeQuestions(node, node, [])

		expect(questions).toHaveLength(5)
		expect(questions).toEqual(['q0', 'q1', 'q3', 'q2', 'q4'])
	})

	test('getSendToClientPromises calls and returns array of yell results from all questions', () => {
		const attemptState = { questions: [] }
		expect(getSendToClientPromises(attemptState, {}, {})).toEqual([])

		let n = 0
		const mockYell = jest.fn(() => n++)
		attemptState.questions = [{ yell: mockYell }, { yell: mockYell }]

		const result = getSendToClientPromises(attemptState, 'mockReq', 'mockRes')
		// yell is called?
		expect(mockYell).toHaveBeenCalledTimes(2)
		expect(mockYell).toHaveBeenCalledWith(
			'ObojoboDraft.Sections.Assessment:sendToAssessment',
			'mockReq',
			'mockRes'
		)

		// returns from yell come back?
		expect(result).toEqual([0, 1])
	})

	test('insertAttemptStartCaliperEvent inserts a new attempt, creates events and replies with an expected object', () => {
		const createAssessmentAttemptStartedEvent = jest.fn().mockReturnValue('mockCaliperPayload')
		insertEvent.mockReturnValueOnce('mockInsertResult')
		createCaliperEvent.mockReturnValueOnce({
			createAssessmentAttemptStartedEvent
		})
		Date.prototype.toISOString = () => 'date'

		const mockDraft = {
			draftId: 'mockDraftId',
			contentId: 'mockContentId'
		}

		const r = insertAttemptStartCaliperEvent(
			'mockAttemptId',
			1,
			'mockUserId',
			mockDraft,
			'mockAssessmentId',
			true,
			'mockHostname',
			'mockRemoteAddress'
		)

		expect(r).toBe('mockInsertResult')

		// Make sure insertEvent was called
		expect(insertEvent).toHaveBeenCalledTimes(1)

		expect(createAssessmentAttemptStartedEvent).toHaveBeenCalledWith({
			actor: {
				id: 'mockUserId',
				type: 'user'
			},
			assessmentId: 'mockAssessmentId',
			attemptId: 'mockAttemptId',
			draftId: 'mockDraftId',
			contentId: 'mockContentId',
			extensions: {
				count: 1
			}
		})

		expect(insertEvent).toHaveBeenCalledWith({
			action: 'assessment:attemptStart',
			actorTime: 'date',
			caliperPayload: 'mockCaliperPayload',
			draftId: 'mockDraftId',
			contentId: 'mockContentId',
			eventVersion: '1.1.0',
			ip: 'mockRemoteAddress',
			metadata: {},
			isPreview: true,
			payload: {
				attemptCount: 1,
				attemptId: 'mockAttemptId'
			},
			userId: 'mockUserId'
		})
	})
	// <<<<<<< HEAD

	// 	test('calling startAttempt when no attempts remain rejects with an expected error', () => {
	// 		mockReq = {
	// 			requireCurrentUser: jest.fn(() =>
	// 				Promise.resolve({
	// 					user: {
	// 						canViewEditor: true
	// 					}
	// 				})
	// 			),
	// 			body: {
	// 				draftId: 'mockDraftId',
	// 				assessmentId: 'mockAssessmentId'
	// 			}
	// 		}

	// 		mockRes = { reject: jest.fn() }

	// 		const mockAssessmentNode = {
	// 			getChildNodeById: jest.fn(() => ({
	// 				node: {
	// 					content: {
	// 						// Number of attempts the user is allowed (what we're testing here).
	// 						attempts: 1
	// 					}
	// 				},
	// 				children: [
	// 					{},
	// 					{
	// 						childrenSet: ['test', 'test1'],
	// 						toObject: jest.fn()
	// 					}
	// 				]
	// 			}))
	// 		}

	// 		Assessment.getCompletedAssessmentAttemptHistory = jest.fn().mockResolvedValue(new Array(2))
	// 		Draft.fetchById = jest.fn(() => Promise.resolve(mockAssessmentNode))

	// 		return startAttempt(mockReq, mockRes).then(() => {
	// 			expect(mockRes.reject).toHaveBeenCalledWith(ERROR_ATTEMPT_LIMIT_REACHED)
	// 		})
	// 	})

	// 	test('an unexpected error in startAttempt calls logAndRespondToUnexpected with expected values', () => {
	// 		mockReq = {
	// 			requireCurrentUser: jest.fn().mockResolvedValue()
	// 		}

	// 		mockRes = { unexpected: jest.fn() }

	// 		Draft.fetchById = jest.fn(() => {
	// 			throw new Error(ERROR_UNEXPECTED_DB_ERROR)
	// 		})

	// 		return startAttempt(mockReq, mockRes).then(() => {
	// 			expect(mockRes.unexpected).toHaveBeenCalledWith(ERROR_UNEXPECTED_DB_ERROR)
	// 		})
	// 	})
	// =======
	// >>>>>>> origin/dev/4-amethyst
})
