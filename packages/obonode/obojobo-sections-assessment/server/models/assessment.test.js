jest.mock('obojobo-express/server/db')

const AssessmentModel = require('./assessment')
const db = require('obojobo-express/server/db')
const makeMockAttempt = () => ({
	attempt_id: 'mockAttemptId',
	assessment_id: 'mockAssessmentId',
	draft_content_id: 'mockContentId',
	created_at: 'mockCreatedAt',
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
	beforeEach(() => {
		jest.clearAllMocks()
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
		    "createdAt": "mockCreatedAt",
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

	test('completeAttempt calls UPDATE/INSERT queries with expected values and returns data object', () => {
		expect.assertions(3)
		db.one.mockResolvedValueOnce('attemptData')
		db.one.mockResolvedValueOnce({ id: 'assessmentScoreId' })

		return AssessmentModel.completeAttempt(1, 2, 3, 4, {}, {}, false).then(result => {
			expect(result).toEqual({
				assessmentScoreId: 'assessmentScoreId',
				attemptData: 'attemptData'
			})

			expect(db.one.mock.calls[0][0]).toContain('UPDATE attempts')
			expect(db.one.mock.calls[1][0]).toContain('INSERT INTO assessment_scores')
		})
	})
})
