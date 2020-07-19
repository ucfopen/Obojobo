jest.mock('obojobo-express/server/db')
jest.mock('obojobo-express/server/lti')
jest.mock('./assessment-score')

const makeMockAttempt = () => ({
	attempt_id: 'mockAttemptId',
	assessment_id: 'mockAssessmentId',
	draft_content_id: 'mockContentId',
	created_at: 'mockCreateAssessmentScoredAt',
	completed_at: 'mockCompletedAt',
	state: 'mockState',
	result: {
		attemptScore: 'mockResult',
		questionScores: ['mockScore']
	},
	assessment_score: '15',
	score_details: 'mockScoreDetails',
	assessment_score_id: 'scoreId',
	attempt_number: '12'
})

describe('AssessmentModel', () => {
	let db
	let lti
	let AssessmentModel
	let AssessmentScore

	beforeEach(() => {
		jest.resetModules()
		jest.resetAllMocks()
		db = require('obojobo-express/server/db')
		lti = require('obojobo-express/server/lti')
		AssessmentModel = require('./assessment')
		AssessmentScore = require('./assessment-score')
	})

	test('constructor initializes expected properties', () => {
		const m = new AssessmentModel({
			key_one: 1,
			keyTwo: 2,
			assessmentScore: '10.1',
			attemptNumber: '1.1',
			completedAt: null
		})
		expect(m).toMatchInlineSnapshot(`
		AssessmentModel {
		  "assessmentScore": 10.1,
		  "attemptNumber": 1,
		  "completedAt": null,
		  "isFinished": false,
		  "keyOne": 1,
		  "keyTwo": 2,
		  "questionResponses": Array [],
		  "result": Object {
		    "attemptScore": null,
		    "questionScores": Array [],
		  },
		}
	`)
	})

	test('constructor initializes expected properties', () => {
		const m = new AssessmentModel({
			assessmentScore: 100,
			attemptNumber: 1.5,
			completedAt: 10
		})
		expect(m).toMatchInlineSnapshot(`
		AssessmentModel {
		  "assessmentScore": 100,
		  "attemptNumber": 1,
		  "completedAt": 10,
		  "isFinished": true,
		  "questionResponses": Array [],
		  "result": Object {
		    "attemptScore": null,
		    "questionScores": Array [],
		  },
		}
	`)
	})

	test('constructor initializes expected properties with no props', () => {
		const m = new AssessmentModel({})
		expect(m).toMatchInlineSnapshot(`
		AssessmentModel {
		  "isFinished": true,
		  "questionResponses": Array [],
		  "result": Object {
		    "attemptScore": null,
		    "questionScores": Array [],
		  },
		}
	`)
	})

	test('getCompletedAssessmentAttemptHistory calls db.manyOrNone', () => {
		AssessmentModel.getCompletedAssessmentAttemptHistory(
			'mock-user-id',
			'mock-draft-id',
			'mock-assessment-id',
			'mock-is-preview',
			'mock-resource-link'
		)

		expect(db.manyOrNone).toHaveBeenCalledTimes(1)
		expect(db.manyOrNone.mock.calls[0][1]).toMatchInlineSnapshot(`
		Object {
		  "assessmentId": "mock-assessment-id",
		  "draftId": "mock-draft-id",
		  "isPreview": "mock-is-preview",
		  "resourceLinkId": "mock-resource-link",
		  "userId": "mock-user-id",
		}
	`)
	})

	test('fetchAttempts returns an array AssessmentModel', async () => {
		db.manyOrNone.mockResolvedValueOnce([makeMockAttempt()])

		const result = await AssessmentModel.fetchAttempts()
		expect(result).toMatchInlineSnapshot(`
		Array [
		  AssessmentModel {
		    "assessmentId": "mockAssessmentId",
		    "assessmentScore": 15,
		    "assessmentScoreId": "scoreId",
		    "attemptId": "mockAttemptId",
		    "attemptNumber": 12,
		    "completedAt": "mockCompletedAt",
		    "createdAt": "mockCreateAssessmentScoredAt",
		    "draftContentId": "mockContentId",
		    "isFinished": true,
		    "questionResponses": Array [],
		    "result": Object {
		      "attemptScore": "mockResult",
		      "questionScores": Array [
		        "mockScore",
		      ],
		    },
		    "scoreDetails": "mockScoreDetails",
		    "state": "mockState",
		  },
		]
	`)
	})

	test('fetchAttempts returns empty object if assessment isnt found', () => {
		db.manyOrNone.mockResolvedValueOnce([])

		return AssessmentModel.fetchAttempts(
			'mockUserId',
			'mockDraftId',
			false,
			null,
			'badAssessmentId'
		).then(result => {
			expect(result).toEqual([])
		})
	})

	test('getAttemptIdsForUserForDraft calls db with expected fields', () => {
		AssessmentModel.getAttemptIdsForUserForDraft(
			'mock-user-id',
			'mock-draft-id',
			'mock-resource-link',
			'mock-is-preview'
		)

		expect(db.manyOrNone).toHaveBeenCalledTimes(1)
		expect(db.manyOrNone.mock.calls[0][1]).toMatchInlineSnapshot(`
		Object {
		  "draftId": "mock-draft-id",
		  "isPreview": "mock-is-preview",
		  "resourceLinkId": "mock-resource-link",
		  "userId": "mock-user-id",
		}
	`)
	})

	test('removeAllButLastIncompleteAttempts handles empty array', () => {
		const attempts = []
		const res = AssessmentModel.removeAllButLastIncompleteAttempts(attempts)
		expect(res).not.toBe(attempts) // must be a new array
		expect(res).toHaveLength(0)
	})

	test('removeAllButLastIncompleteAttempts returns all completed attempts', () => {
		const attempts = [
			{
				isFinished: true,
				finishTime: new Date(),
				startTime: new Date()
			}
		]
		const res = AssessmentModel.removeAllButLastIncompleteAttempts(attempts)
		expect(res).not.toBe(attempts) // must be a new array
		expect(res).toHaveLength(1)
		expect(res).toEqual(attempts)
	})

	test('removeAllButLastIncompleteAttempts sorts completed attempts', () => {
		const attempts = [
			{
				isFinished: true,
				attemptNumber: 50,
				finishTime: new Date(101),
				startTime: new Date(300)
			},
			{
				isFinished: true,
				attemptNumber: 1,
				finishTime: new Date(301),
				startTime: new Date(100)
			},
			{
				isFinished: true,
				attemptNumber: 5,
				finishTime: new Date(201),
				startTime: new Date(200)
			}
		]
		const res = AssessmentModel.removeAllButLastIncompleteAttempts(attempts)
		expect(res).not.toBe(attempts) // must be a new array
		expect(res).toMatchInlineSnapshot(`
		Array [
		  Object {
		    "attemptNumber": 1,
		    "finishTime": 1970-01-01T00:00:00.301Z,
		    "isFinished": true,
		    "startTime": 1970-01-01T00:00:00.100Z,
		  },
		  Object {
		    "attemptNumber": 5,
		    "finishTime": 1970-01-01T00:00:00.201Z,
		    "isFinished": true,
		    "startTime": 1970-01-01T00:00:00.200Z,
		  },
		  Object {
		    "attemptNumber": 50,
		    "finishTime": 1970-01-01T00:00:00.101Z,
		    "isFinished": true,
		    "startTime": 1970-01-01T00:00:00.300Z,
		  },
		]
	`)
	})

	test('removeAllButLastIncompleteAttempts handles 1 incomplete attempt', () => {
		const attempts = [
			{
				isFinished: false,
				finishTime: null,
				startTime: new Date(300)
			}
		]
		const res = AssessmentModel.removeAllButLastIncompleteAttempts(attempts)
		expect(res).not.toBe(attempts) // must be a new array
		expect(res).toHaveLength(1)
		expect(res).toEqual(attempts)
	})

	test('removeAllButLastIncompleteAttempts only returns the newest incomplete attempt', () => {
		const attempts = [
			{
				isFinished: false,
				finishTime: null,
				attemptNumber: 8,
				startTime: new Date(300)
			},
			{
				isFinished: false,
				finishTime: null,
				attemptNumber: 7,
				startTime: new Date(600)
			},
			{
				isFinished: false,
				finishTime: null,
				attemptNumber: 1,
				startTime: new Date(200)
			}
		]
		const res = AssessmentModel.removeAllButLastIncompleteAttempts(attempts)
		expect(res).not.toBe(attempts) // must be a new array
		expect(res).toHaveLength(1)
		expect(res[0]).toBe(attempts[0])
	})

	test('removeAllButLastIncompleteAttempts removes incomplete attempts before the last completed attempt', () => {
		const attempts = [
			{
				isFinished: true,
				attemptNumber: 4,
				finishTime: new Date(302),
				startTime: new Date(300)
			},
			{
				isFinished: true,
				attemptNumber: 1,
				finishTime: new Date(102),
				startTime: new Date(100)
			},
			{
				isFinished: true,
				attemptNumber: 2,
				finishTime: new Date(202),
				startTime: new Date(200)
			},
			{
				isFinished: false,
				finishTime: null,
				attemptNumber: 3, // this is before the last attempt
				startTime: new Date(301)
			}
		]
		const res = AssessmentModel.removeAllButLastIncompleteAttempts(attempts)
		expect(res).not.toBe(attempts) // must be a new array
		expect(res).toHaveLength(3)
		expect(res).toEqual(expect.not.arrayContaining([attempts[3]]))
	})

	test('removeAllButLastIncompleteAttempts removes incomplete attempts before the last completed attempt but retains the most recent incompleted attempt if it has been started after the last completed attempt', () => {
		const attempts = [
			{
				isFinished: true,
				attemptNumber: 1,
				finishTime: new Date(102),
				startTime: new Date(100)
			},
			{
				isFinished: true,
				attemptNumber: 2,
				finishTime: new Date(202),
				startTime: new Date(200)
			},
			{
				isFinished: true,
				attemptNumber: 3,
				finishTime: new Date(302),
				startTime: new Date(300)
			},
			{
				isFinished: false,
				finishTime: null,
				attemptNumber: 5,
				startTime: new Date(303) // AFTER last finish time - should be returned
			},
			{
				isFinished: false,
				finishTime: null,
				attemptNumber: 4,
				startTime: new Date(301) // BEFORE last finish time - should be filtered out
			}
		]
		const res = AssessmentModel.removeAllButLastIncompleteAttempts(attempts)
		expect(res).not.toBe(attempts) // must be a new array
		expect(res).toHaveLength(4)
		expect(res).toMatchInlineSnapshot(`
		Array [
		  Object {
		    "attemptNumber": 1,
		    "finishTime": 1970-01-01T00:00:00.102Z,
		    "isFinished": true,
		    "startTime": 1970-01-01T00:00:00.100Z,
		  },
		  Object {
		    "attemptNumber": 2,
		    "finishTime": 1970-01-01T00:00:00.202Z,
		    "isFinished": true,
		    "startTime": 1970-01-01T00:00:00.200Z,
		  },
		  Object {
		    "attemptNumber": 3,
		    "finishTime": 1970-01-01T00:00:00.302Z,
		    "isFinished": true,
		    "startTime": 1970-01-01T00:00:00.300Z,
		  },
		  Object {
		    "attemptNumber": 5,
		    "finishTime": null,
		    "isFinished": false,
		    "startTime": 1970-01-01T00:00:00.303Z,
		  },
		]
	`)
	})

	test('getAttemptNumber returns the attempt_number property', () => {
		jest.spyOn(AssessmentModel, 'getAttemptIdsForUserForDraft')
		AssessmentModel.getAttemptIdsForUserForDraft.mockResolvedValueOnce([
			{ id: 3, attempt_number: 999 },
			{ id: 'attemptId', attempt_number: 777 },
			{ id: 111, attempt_number: 227 }
		])

		return AssessmentModel.getAttemptNumber('userId', 'draftId', 'attemptId').then(result => {
			expect(result).toEqual(777)
		})
	})

	test('getAttemptNumber returns null when theres no matching attemptId', () => {
		jest.spyOn(AssessmentModel, 'getAttemptIdsForUserForDraft')
		AssessmentModel.getAttemptIdsForUserForDraft.mockResolvedValueOnce([
			{ id: 3, attempt_number: 999 },
			{ id: 999, attempt_number: 777 },
			{ id: 111, attempt_number: 227 }
		])

		return AssessmentModel.getAttemptNumber('userId', 'draftId', 'attemptId').then(result => {
			expect(result).toEqual(null)
		})
	})

	test('fetchResponsesForAttempts calls the database and loops through the result', async () => {
		db.manyOrNone.mockResolvedValueOnce([
			{
				attempt_id: 'mockAttemptId'
			},
			{
				attempt_id: 'secondMockAttemptId'
			}
		])

		const result = await AssessmentModel.fetchResponsesForAttempts(['mockDraftId'])

		expect(result).toMatchInlineSnapshot(`
		Map {
		  "mockAttemptId" => Array [
		    Object {
		      "attempt_id": "mockAttemptId",
		    },
		  ],
		  "secondMockAttemptId" => Array [
		    Object {
		      "attempt_id": "secondMockAttemptId",
		    },
		  ],
		}
	`)
	})

	test('fetchResponsesForAttempts returns array with identical attemptIds', async () => {
		db.manyOrNone.mockResolvedValueOnce([
			{
				attempt_id: 'mockAttemptId',
				question_id: 'mockQuestionId'
			},
			{
				attempt_id: 'secondMockAttemptId',
				question_id: 'mockQuestionId'
			},
			{
				attempt_id: 'secondMockAttemptId',
				question_id: 'mockOtherQuestionId'
			}
		])

		const result = await AssessmentModel.fetchResponsesForAttempts('mockDraftId')

		expect(result).toMatchInlineSnapshot(`
		Map {
		  "mockAttemptId" => Array [
		    Object {
		      "attempt_id": "mockAttemptId",
		      "question_id": "mockQuestionId",
		    },
		  ],
		  "secondMockAttemptId" => Array [
		    Object {
		      "attempt_id": "secondMockAttemptId",
		      "question_id": "mockQuestionId",
		    },
		    Object {
		      "attempt_id": "secondMockAttemptId",
		      "question_id": "mockOtherQuestionId",
		    },
		  ],
		}
	`)
	})

	test('fetchResponsesForAttempts calls the database with the expected value', () => {
		db.manyOrNone.mockResolvedValueOnce([])
		AssessmentModel.fetchResponsesForAttempts(['mockAttemptId'])

		expect(db.manyOrNone.mock.calls[0][1]).toEqual({
			attemptIds: ['mockAttemptId']
		})
	})

	test('fetchResponsesForAttempts returns and empty array when sent no ids', () => {
		db.manyOrNone.mockResolvedValueOnce([])
		const result = AssessmentModel.fetchResponsesForAttempts([])
		expect(result).toEqual([])
	})

	test('createNewAttempt', () => {
		AssessmentModel.createNewAttempt(
			'mockUserId',
			'mockDraftId',
			'mockDraftContentId',
			'mockAssessmentId',
			'mockState',
			'mockPreviewing',
			'mockResourceLinkId'
		)

		expect(db.one).toHaveBeenCalledTimes(1)
		expect(db.one.mock.calls[0][1]).toMatchInlineSnapshot(`
		Object {
		  "assessmentId": "mockAssessmentId",
		  "draftContentId": "mockDraftContentId",
		  "draftId": "mockDraftId",
		  "isPreview": "mockPreviewing",
		  "resourceLinkId": "mockResourceLinkId",
		  "state": "mockState",
		  "userId": "mockUserId",
		}
	`)
	})

	test('completeAttempt calls UPDATE/INSERT queries with expected values and returns data object', async () => {
		expect.hasAssertions()
		AssessmentScore.prototype.create.mockResolvedValueOnce({ id: 'assessmentScoreId' })
		db.one.mockResolvedValueOnce('attemptData')
		db.one.mockResolvedValueOnce({ id: 'assessmentScoreId' })

		const result = await AssessmentModel.completeAttempt(1, 2, 3, 4, {}, {}, false)

		expect(result).toEqual({
			assessmentScoreId: 'assessmentScoreId',
			attemptData: 'attemptData'
		})

		expect(db.one).toHaveBeenCalledTimes(1) // complete attempt
		expect(AssessmentScore.prototype.create).toHaveBeenCalledTimes(1)
	})

	test('fetchAttemptByID queries and returns a model', async () => {
		db.oneOrNone.mockResolvedValueOnce(makeMockAttempt())
		const attempt = await AssessmentModel.fetchAttemptByID('mock-id')
		expect(attempt).toBeInstanceOf(AssessmentModel)
		expect(db.oneOrNone.mock.calls[0][1]).toEqual({ attemptId: 'mock-id' })
	})

	test('fetchAttemptByID errors', () => {
		db.oneOrNone.mockRejectedValueOnce('mock-error')
		return expect(AssessmentModel.fetchAttemptByID('mock-id')).rejects.toBe('mock-error')
	})

	test('fetchAttemptHistory errors', () => {
		jest.spyOn(AssessmentModel, 'fetchAttempts')
		AssessmentModel.fetchAttempts.mockRejectedValueOnce('mock-error')
		return expect(
			AssessmentModel.fetchAttemptHistory(
				'mock-user-id',
				'mock-draft-id',
				'is-preview',
				'mock-resource-link',
				'mock-assessment-id'
			)
		).rejects.toBe('mock-error')
	})

	test('fetchAttemptHistory returns all values', async () => {
		const mockAttempt = new AssessmentModel(makeMockAttempt())
		const mockLtiState = {
			scoreSent: 'scoreSent',
			sentDate: 'sentDate',
			status: 'status',
			gradebookStatus: 'gradebookStatus',
			statusDetails: 'statusDetails'
		}
		jest.spyOn(AssessmentModel, 'fetchAttempts')
		jest.spyOn(AssessmentModel, 'fetchResponsesForAttempts')
		jest.spyOn(AssessmentModel, 'removeAllButLastIncompleteAttempts')
		jest.spyOn(lti, 'getLTIStatesByAssessmentIdForUserAndDraftAndResourceLinkId')
		AssessmentModel.fetchAttempts.mockResolvedValueOnce([mockAttempt])
		AssessmentModel.fetchResponsesForAttempts.mockResolvedValueOnce([])
		lti.getLTIStatesByAssessmentIdForUserAndDraftAndResourceLinkId.mockResolvedValueOnce({
			mockAssessmentId: mockLtiState
		})

		const result = await AssessmentModel.fetchAttemptHistory(
			'mock-user-id',
			'mock-draft-id',
			'is-preview',
			'mock-resource-link'
		)
		expect(result).toHaveLength(1)
		expect(result[0]).toEqual({
			assessmentId: 'mockAssessmentId',
			attempts: [mockAttempt],
			ltiState: mockLtiState
		})
	})

	test('fetchAttemptHistory returns all values with multiple attempts', async () => {
		const mockAttempt = new AssessmentModel(makeMockAttempt())
		const mockLtiState = {
			scoreSent: 'scoreSent',
			sentDate: 'sentDate',
			status: 'status',
			gradebookStatus: 'gradebookStatus',
			statusDetails: 'statusDetails'
		}
		jest.spyOn(AssessmentModel, 'fetchAttempts')
		jest.spyOn(AssessmentModel, 'fetchResponsesForAttempts')
		jest.spyOn(AssessmentModel, 'removeAllButLastIncompleteAttempts')
		jest.spyOn(lti, 'getLTIStatesByAssessmentIdForUserAndDraftAndResourceLinkId')
		AssessmentModel.fetchAttempts.mockResolvedValueOnce([mockAttempt, mockAttempt])
		AssessmentModel.fetchResponsesForAttempts.mockResolvedValueOnce([])
		lti.getLTIStatesByAssessmentIdForUserAndDraftAndResourceLinkId.mockResolvedValueOnce({
			mockAssessmentId: mockLtiState
		})

		const result = await AssessmentModel.fetchAttemptHistory(
			'mock-user-id',
			'mock-draft-id',
			'is-preview',
			'mock-resource-link'
		)
		expect(result).toHaveLength(1)
		expect(result[0]).toEqual({
			assessmentId: 'mockAssessmentId',
			attempts: [mockAttempt, mockAttempt],
			ltiState: mockLtiState
		})
	})

	test('fetchAttemptHistory errors when responses dont match attempts', () => {
		const mockAttempt = new AssessmentModel(makeMockAttempt())
		const mockLtiState = {
			scoreSent: 'scoreSent',
			sentDate: 'sentDate',
			status: 'status',
			gradebookStatus: 'gradebookStatus',
			statusDetails: 'statusDetails'
		}
		const responseMap = new Map()
		responseMap.set('mockAttemptId', [
			{
				question_id: 1,
				response: 'mock-resp'
			}
		])
		jest.spyOn(AssessmentModel, 'fetchAttempts')
		jest.spyOn(AssessmentModel, 'fetchResponsesForAttempts')
		jest.spyOn(AssessmentModel, 'removeAllButLastIncompleteAttempts')
		jest.spyOn(lti, 'getLTIStatesByAssessmentIdForUserAndDraftAndResourceLinkId')
		AssessmentModel.fetchAttempts.mockResolvedValueOnce([mockAttempt, mockAttempt])
		AssessmentModel.fetchResponsesForAttempts.mockResolvedValueOnce(responseMap)
		lti.getLTIStatesByAssessmentIdForUserAndDraftAndResourceLinkId.mockResolvedValueOnce({
			mockAssessmentId: mockLtiState
		})

		return expect(
			AssessmentModel.fetchAttemptHistory(
				'mock-user-id',
				'mock-draft-id',
				'is-preview',
				'mock-resource-link'
			)
		).rejects.toThrow(
			"Missing attempt responses userid:'mock-user-id', draftId:'mock-draft-id', attemptId:'mockAttemptId'."
		)
	})

	test('fetchAttemptHistory errors when responses dont match attempts', async () => {
		const mockAttempt1 = new AssessmentModel(makeMockAttempt())
		mockAttempt1.id = 'mockAttemptId'

		// lets setup attempt2 to cover imported attempt lookups
		const mockAttempt2 = new AssessmentModel(makeMockAttempt())
		mockAttempt2.id = 'mockAttemptId2'
		mockAttempt2.isImported = true
		mockAttempt2.importedAttemptId = 'some-imported-attempt'

		const mockLtiState = {
			scoreSent: 'scoreSent',
			sentDate: 'sentDate',
			status: 'status',
			gradebookStatus: 'gradebookStatus',
			statusDetails: 'statusDetails'
		}
		const responseMap = new Map()
		responseMap.set('mockAttemptId', [
			{
				question_id: 1,
				response: 'mock-resp'
			}
		])
		jest.spyOn(AssessmentModel, 'fetchAttempts')
		jest.spyOn(AssessmentModel, 'fetchResponsesForAttempts')
		jest.spyOn(AssessmentModel, 'removeAllButLastIncompleteAttempts')
		jest.spyOn(lti, 'getLTIStatesByAssessmentIdForUserAndDraftAndResourceLinkId')
		AssessmentModel.fetchAttempts.mockResolvedValueOnce([mockAttempt1, mockAttempt2])
		AssessmentModel.fetchResponsesForAttempts.mockResolvedValueOnce(responseMap)
		lti.getLTIStatesByAssessmentIdForUserAndDraftAndResourceLinkId.mockResolvedValueOnce({
			mockAssessmentId: mockLtiState
		})

		const result = await AssessmentModel.fetchAttemptHistory(
			'mock-user-id',
			'mock-draft-id',
			'is-preview',
			'mock-resource-link'
		)
		expect(result).toHaveLength(1)
		expect(result[0]).toEqual({
			assessmentId: 'mockAssessmentId',
			attempts: [mockAttempt1, mockAttempt2],
			ltiState: mockLtiState
		})
	})

	test('fetchAttemptHistory returns a single value', async () => {
		const mockAttempt = new AssessmentModel(makeMockAttempt())
		const mockLtiState = {
			scoreSent: 'scoreSent',
			sentDate: 'sentDate',
			status: 'status',
			gradebookStatus: 'gradebookStatus',
			statusDetails: 'statusDetails'
		}
		jest.spyOn(AssessmentModel, 'fetchAttempts')
		jest.spyOn(AssessmentModel, 'fetchResponsesForAttempts')
		jest.spyOn(AssessmentModel, 'removeAllButLastIncompleteAttempts')
		jest.spyOn(lti, 'getLTIStatesByAssessmentIdForUserAndDraftAndResourceLinkId')
		AssessmentModel.fetchAttempts.mockResolvedValueOnce([mockAttempt])
		AssessmentModel.fetchResponsesForAttempts.mockResolvedValueOnce([])
		lti.getLTIStatesByAssessmentIdForUserAndDraftAndResourceLinkId.mockResolvedValueOnce({
			mockAssessmentId: mockLtiState
		})

		const result = await AssessmentModel.fetchAttemptHistory(
			'mock-user-id',
			'mock-draft-id',
			'is-preview',
			'mock-resource-link',
			'mockAssessmentId' // signifies we want one value back
		)

		expect(result).toEqual({
			assessmentId: 'mockAssessmentId',
			attempts: [mockAttempt],
			ltiState: mockLtiState
		})
	})

	test('fetchAttemptHistory returns a single value without ltiState', async () => {
		const mockAttempt = new AssessmentModel(makeMockAttempt())

		jest.spyOn(AssessmentModel, 'fetchAttempts')
		jest.spyOn(AssessmentModel, 'fetchResponsesForAttempts')
		jest.spyOn(AssessmentModel, 'removeAllButLastIncompleteAttempts')
		jest.spyOn(lti, 'getLTIStatesByAssessmentIdForUserAndDraftAndResourceLinkId')
		AssessmentModel.fetchAttempts.mockResolvedValueOnce([mockAttempt])
		AssessmentModel.fetchResponsesForAttempts.mockResolvedValueOnce([])
		lti.getLTIStatesByAssessmentIdForUserAndDraftAndResourceLinkId.mockResolvedValueOnce({})

		const result = await AssessmentModel.fetchAttemptHistory(
			'mock-user-id',
			'mock-draft-id',
			'is-preview',
			'mock-resource-link',
			'mockAssessmentId' // signifies we want one value back
		)

		expect(result).toEqual({
			assessmentId: 'mockAssessmentId',
			attempts: [mockAttempt],
			ltiState: null
		})
	})

	test('fetchAttemptHistory returns with no history', async () => {
		jest.spyOn(AssessmentModel, 'fetchAttempts')
		jest.spyOn(AssessmentModel, 'fetchResponsesForAttempts')
		jest.spyOn(AssessmentModel, 'removeAllButLastIncompleteAttempts')
		jest.spyOn(lti, 'getLTIStatesByAssessmentIdForUserAndDraftAndResourceLinkId')
		AssessmentModel.fetchAttempts.mockResolvedValueOnce([]) // no attempts
		AssessmentModel.fetchResponsesForAttempts.mockResolvedValueOnce([])

		const result = await AssessmentModel.fetchAttemptHistory(
			'mock-user-id',
			'mock-draft-id',
			'is-preview',
			'mock-resource-link',
			'mockAssessmentId' // signifies we want one value back
		)

		expect(result).toEqual({
			assessmentId: 'mockAssessmentId',
			attempts: [],
			ltiState: null
		})
	})

	test('deletePreviewAttempts returns nothing with no attempt found', async () => {
		db.manyOrNone.mockResolvedValueOnce([])
		const result = await AssessmentModel.deletePreviewAttempts({
			transaction: db,
			userId: 'mock-user-id',
			resourceLinkId: 'mock-resource-link'
		})
		expect(result).toEqual([])
	})

	test('deletePreviewAttempts returns 2 promises whith matching attempt', async () => {
		db.manyOrNone.mockResolvedValueOnce([{ id: 1 }, { id: 10 }])
		db.none.mockResolvedValueOnce('none-query-result-1')
		db.none.mockResolvedValueOnce('none-query-result-2')
		const result = await AssessmentModel.deletePreviewAttempts({
			transaction: db,
			userId: 'mock-user-id',
			resourceLinkId: 'mock-resource-link'
		})
		expect(result).toHaveLength(2)
		// they should both be 'then-able'
		expect(result[0]).toHaveProperty('then')
		expect(result[1]).toHaveProperty('then')
	})

	test('deletePreviewAttemptsAndScores returns with no history', async () => {
		jest.spyOn(AssessmentModel, 'deletePreviewAttempts')
		jest.spyOn(AssessmentScore, 'deletePreviewScores')
		AssessmentScore.deletePreviewScores.mockResolvedValueOnce(['mock-delete-scores-result'])
		AssessmentModel.deletePreviewAttempts.mockResolvedValueOnce(['mock-delete-attempts-result'])

		const result = await AssessmentModel.deletePreviewAttemptsAndScores(
			'mock-user-id',
			'mock-draft-id',
			'mock-resource-link'
		)

		expect(result).toEqual(['mock-delete-scores-result', 'mock-delete-attempts-result'])
		expect(AssessmentModel.deletePreviewAttempts).toHaveBeenCalledTimes(1)
		expect(AssessmentScore.deletePreviewScores).toHaveBeenCalledTimes(1)

		const expectedQueryArgs = {
			transaction: db,
			userId: 'mock-user-id',
			draftId: 'mock-draft-id',
			resourceLinkId: 'mock-resource-link'
		}

		expect(AssessmentModel.deletePreviewAttempts).toHaveBeenCalledWith(expectedQueryArgs)
		expect(AssessmentScore.deletePreviewScores).toHaveBeenCalledWith(expectedQueryArgs)
	})

	test('clone does', () => {
		const m = new AssessmentModel({
			key_one: 1,
			keyTwo: 2,
			assessmentScore: '10.1',
			attemptNumber: '1.1',
			completedAt: null
		})

		const copy = m.clone()

		expect(copy).toBeInstanceOf(AssessmentModel)
		expect(copy).not.toBe(m) // not ===
		expect(copy).toEqual(m) // properties are the same
	})

	test('create throws when the model has an id', () => {
		const m = new AssessmentModel({
			id: 'already-have-an-id',
			key_one: 1,
			keyTwo: 2,
			assessmentScore: '10.1',
			attemptNumber: '1.1',
			completedAt: null
		})

		expect(() => m.create()).toThrow('Cannot call create on a model that has an id.')
	})

	test('create updates after query', async () => {
		const m = new AssessmentModel({
			assessmentScore: '10.1',
			attemptNumber: '1.1',
			completedAt: null
		})

		db.one.mockResolvedValueOnce({
			id: 'mock-new-id',
			created_at: 'mock-created-at',
			updated_at: 'mock-updated-at',
			completed_at: 'mock-completed-at'
		})

		const result = await m.create()
		expect(result).toBe(m) // returns a ref to self
		expect(result).toHaveProperty('id', 'mock-new-id')
		expect(result).toHaveProperty('createdAt', 'mock-created-at')
		expect(result).toHaveProperty('updatedAt', 'mock-updated-at')
		expect(result).toHaveProperty('completedAt', 'mock-completed-at')
	})

	test('importAsNewAttempt clones and calls ', async () => {
		const m = new AssessmentModel({
			id: 'my-id',
			assessmentScore: '10.1',
			attemptNumber: '1.1',
			completedAt: null
		})

		db.one.mockResolvedValueOnce({
			id: 'mock-new-id',
			created_at: 'mock-created-at',
			updated_at: 'mock-updated-at',
			completed_at: 'mock-completed-at'
		})

		jest.spyOn(m, 'create')
		jest.spyOn(m, 'clone')
		m.create.mockReturnValueOnce('create-result')

		const result = await m.importAsNewAttempt('mock-resource-link', db)
		expect(result).toBe('create-result') // returns result of .create()

		const clonedM = m.clone.mock.results[0].value

		expect(clonedM).not.toHaveProperty('id')
		expect(clonedM).toHaveProperty('isImported', true)
		expect(clonedM).toHaveProperty('importedAttemptId', 'my-id')
		expect(clonedM).toHaveProperty('completedAt', expect.any(Date))
	})
})
