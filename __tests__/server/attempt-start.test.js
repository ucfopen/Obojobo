jest.mock('../../server/assessment')
jest.mock('underscore')

const AS = require('../../server/attempt-start.js')
const {
	startAttempt,
	getQuestionBankProperties,
	createAssessmentUsedQuestionMap,
	initAssessmentUsedQuestions,
	loadChildren,
	getState,
	chooseUnseenQuestionsSequentially,
	chooseAllQuestionsRandomly,
	chooseUnseenQuestionsRandomly,
	createChosenQuestionTree,
	getNodeQuestions,
	getSendToClientPromises,
	insertAttemptStartCaliperEvent
} = require('../../server/attempt-start.js')
const _ = require('underscore')
const testJson = require('../../test-object.json')
const Assessment = require('../../server/assessment')
const insertEvent = oboRequire('insert_event')
const db = oboRequire('db')
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
		jest.resetAllMocks()

		// mock _.shuffle by allways returning the same array
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

	it('can initialize a map to track use of assessment questions', () => {
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

	it('can track use of assessment questions using an initialized question map', () => {
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

	it('can retrieve an array of question type nodes from a node tree', () => {
		let n = 0
		const newQ = () => {
			let q = new DraftNode()
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

	it('getSendToClientPromises calls and returns array of yell results from all questions', () => {
		const attemptState = { questions: [] }
		expect(getSendToClientPromises(attemptState, {}, {})).toEqual([])

		let n = 0
		let mockYell = jest.fn(() => n++)
		attemptState.questions = [{ yell: mockYell }, { yell: mockYell }]

		let result = getSendToClientPromises(attemptState, 'mockReq', 'mockRes')
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
			actor: {
				id: 'mockUserId',
				type: 'user'
			},
			assessmentId: 'mockAssessmentId',
			attemptId: 'mockAttemptId',
			draftId: 'mockDraftId',
			extensions: {
				count: 1
			},
			isPreviewMode: true
		})

		expect(insertEvent).toHaveBeenCalledWith({
			action: 'assessment:attemptStart',
			actorTime: 'date',
			caliperPayload: 'mockCaliperPayload',
			draftId: 'mockDraftId',
			eventVersion: '1.1.0',
			ip: 'mockRemoteAddress',
			metadata: {},
			payload: {
				attemptCount: 1,
				attemptId: 'mockAttemptId'
			},
			userId: 'mockUserId'
		})
	})

	test('calling startAttempt when no attempts remain rejects with an expected error', done => {
		mockReq = {
			requireCurrentUser: jest.fn(() =>
				Promise.resolve({
					user: {
						canViewEditor: true
					}
				})
			),
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
			requireCurrentUser: jest.fn(() =>
				Promise.resolve({
					user: {
						canViewEditor: true
					}
				})
			)
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
		const mockQbTree = { id: 'qb1', children: fakeChildNodes }
		const mockBuildAssessment = jest.fn(() => mockQbTree)
		const mockAssessmentProperties = {
			nodeChildrenIds: ['qb1', 'qb1.q1', 'qb1.q2', 'qb2', 'qb2.q1', 'qb2.q2'],
			draftTree: mockDraft,
			attemptHistory: [
				{
					state: {
						qb: mockQbTree
					}
				}
			],
			questionBank: {
				buildAssessment: mockBuildAssessment
			},
			oboNode: {
				draftTree: mockDraft
			}
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

		expect(state.qb).toEqual(mockQbTree)
		expect(state.questions).toEqual([
			{
				node: {
					id: 'qb1.q1',
					type: 'ObojoboDraft.Chunks.Question'
				}
			},
			{
				node: {
					id: 'qb1.q2',
					type: 'ObojoboDraft.Chunks.Question'
				}
			}
		])
		expect(state.data).toEqual({})
	})
})
