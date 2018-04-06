jest.mock('../../../../insert_event')
jest.mock('../../../../models/draft')
jest.mock('../../../../routes/api/events/create_caliper_event')
jest.mock('../../../../config', () => ({
	db: {
		host: 'host',
		port: 'port',
		database: 'database',
		user: 'user',
		password: 'password'
	}
}))

jest.mock('../../../../lti', () => ({
	replaceResult: jest.fn(),
	sendHighestAssessmentScore: jest.fn()
}))
jest.mock('../../server/assessment-rubric')
jest.mock('../../server/assessment', () => ({
	getAttempt: jest.fn().mockResolvedValue({
		assessment_id: 10,
		attemptNumber: 12,
		state: 'mockState',
		draft_id: 13
	}),
	getAttempts: jest.fn().mockResolvedValue('attempts'),
	getAttemptNumber: jest.fn().mockResolvedValue(6),
	getCompletedAssessmentAttemptHistory: jest.fn().mockReturnValue('super bat dad'),
	completeAttempt: jest.fn().mockReturnValue('mockCompleteAttemptResult')
}))

const config = oboRequire('config')
const db = oboRequire('db')
const DraftModel = oboRequire('models/draft')
const lti = oboRequire('lti')
const insertEvent = oboRequire('insert_event')
const createCaliperEvent = oboRequire('routes/api/events/create_caliper_event') //@TODO
const originalToISOString = Date.prototype.toISOString
const AssessmentRubric = require('../../server/assessment-rubric')
import Assessment from '../../server/assessment'

import {
	endAttempt,
	getAttempt,
	getAttemptHistory,
	getResponsesForAttempt,
	getCalculatedScores,
	calculateScores,
	completeAttempt,
	insertAttemptEndEvents,
	sendLTIHighestAssessmentScore,
	insertAttemptScoredEvents
} from '../../server/attempt-end'

describe('Attempt End', () => {
	beforeAll(() => {
		Date.prototype.toISOString = () => 'mockDate'
	})
	afterAll(() => {
		Date.prototype.toISOString = originalToISOString
	})
	beforeEach(() => {
		jest.restoreAllMocks()
		insertEvent.mockReset()
		AssessmentRubric.mockGetAssessmentScoreInfoForAttempt.mockReset()
		AssessmentRubric.mockGetAssessmentScoreInfoForAttempt.mockReturnValue('mockScoreForAttempt')
	})

	test('endAttempt returns an object of attempt info', () => {
		expect.assertions(6)

		return getAttempt(1).then(attempt => {
			expect(attempt).toHaveProperty('assessmentId', 10)
			expect(attempt).toHaveProperty('number', 6)
			expect(attempt).toHaveProperty('attemptState', 'mockState')
			expect(attempt).toHaveProperty('draftId', 13)
			expect(attempt).toHaveProperty('model', expect.any(DraftModel))
			expect(attempt).toHaveProperty('assessmentModel', 'mockChild')
		})
	})

	test('getAttemptHistory calls Assessment method', () => {
		let result = getAttemptHistory('userId', 'draftId', 'assessmentId')
		expect(Assessment.getCompletedAssessmentAttemptHistory).toHaveBeenLastCalledWith(
			'userId',
			'draftId',
			'assessmentId'
		)
		expect(result).toBe('super bat dad')
	})

	test('getCalculatedScores', () => {
		// Setup: Assessment with two questions (q1 and q2)
		// First attempt: q1 = 60%, q2 = 100%, attempt = 80%
		// This attempt: q1 = 0%, q2 = 100%, attempt should be 50%
		// Result should be an assessment score of 80% (highest)
		// but this attempt should be a 50%

		let req = jest.fn()
		let res = jest.fn()
		let assessmentModel = {
			yell: (eventType, req, res, assessmentModel, responseHistory, event) => {
				event.addScore('q1', 0)
				event.addScore('q2', 100)
				return []
			},
			node: {
				content: {
					attempts: 10
				}
			}
		}
		let attemptState = {
			questions: [
				{
					id: 'q1'
				},
				{
					id: 'q2'
				}
			]
		}
		let attemptHistory = [
			{
				result: {
					scores: [
						{
							id: 'q1',
							score: 60
						},
						{
							id: 'q2',
							score: 100
						}
					],
					attemptScore: 80,
					assessmentScore: 0
				}
			}
		]
		let responseHistory = jest.fn()

		return getCalculatedScores(
			req,
			res,
			assessmentModel,
			attemptState,
			attemptHistory,
			responseHistory
		).then(result => {
			expect(result).toEqual({
				assessmentScoreDetails: 'mockScoreForAttempt',
				attempt: {
					attemptScore: 50,
					questionScores: [
						{
							id: 'q1',
							score: 0
						},
						{
							id: 'q2',
							score: 100
						}
					]
				}
			})
		})
	})

	test('insertAttemptEndEvents calls insertEvent with expected params (preview mode = true)', () => {
		// mock the caliperEvent method
		let createAssessmentAttemptSubmittedEvent = jest.fn().mockReturnValue('mockCaliperPayload')
		insertEvent.mockReturnValueOnce('mockInsertResult')
		createCaliperEvent.mockReturnValueOnce({
			createAssessmentAttemptSubmittedEvent
		})

		let r = insertAttemptEndEvents(
			{ id: 'mockUserId' },
			'mockDraftId',
			'mockAssessmentId',
			'mockAttemptId',
			'mockAttemptNumber',
			'mockIsPreviewing',
			'mockHostname',
			'mockRemoteAddress'
		)

		// make sure we get the result of insertEvent back
		expect(r).toBe('mockInsertResult')

		// make sure insert event is called
		expect(insertEvent).toHaveBeenCalledTimes(1)

		// make sure insert event is called with the arguments we expect
		expect(insertEvent).toHaveBeenCalledWith({
			action: 'assessment:attemptEnd',
			actorTime: 'mockDate',
			payload: {
				attemptId: 'mockAttemptId',
				attemptCount: 'mockAttemptNumber'
			},
			userId: 'mockUserId',
			ip: 'mockRemoteAddress',
			metadata: {},
			draftId: 'mockDraftId',
			eventVersion: '1.1.0',
			caliperPayload: 'mockCaliperPayload'
		})

		// make sure the caliper payload gets the expected inputs
		expect(createAssessmentAttemptSubmittedEvent).toHaveBeenCalledWith({
			actor: {
				id: 'mockUserId',
				type: 'user'
			},
			assessmentId: 'mockAssessmentId',
			attemptId: 'mockAttemptId',
			draftId: 'mockDraftId',
			isPreviewMode: 'mockIsPreviewing'
		})
	})

	test('insertAttemptScoredEvents calls insertEvent with expected params (preview mode = false, isScoreSent = false)', () => {
		// mock the caliperEvent method
		let createAssessmentAttemptScoredEvent = jest.fn().mockReturnValue('mockCaliperPayload')
		insertEvent.mockReturnValueOnce('mockInsertResult')
		createCaliperEvent.mockReturnValueOnce({
			createAssessmentAttemptScoredEvent
		})

		let r = insertAttemptScoredEvents(
			{ id: 'userId' },
			'mockDraftId',
			'mockAssessmentId',
			'mockAssessmentScoreId',
			'mockAttemptId',
			'mockAttemptNumber',
			'mockAttemptScore',
			'mockAssessmentScore',
			'mockIsPreviewing',
			'mockLtiScoreSent',
			'mockLtiScoreStatus',
			'mockLtiScoreError',
			'mockLtiScoreErrorDetails',
			'mockLtiAssessmentScoreId',
			'mockHostname',
			'mockRemoteAddress'
		)

		// make sure we get the result of insertEvent back
		expect(r).toBe('mockInsertResult')

		// make sure insert event is called
		expect(insertEvent).toHaveBeenCalledTimes(1)

		// make sure insert event is called with the arguments we expect
		expect(insertEvent).toHaveBeenCalledWith({
			action: 'assessment:attemptScored',
			actorTime: 'mockDate',
			caliperPayload: 'mockCaliperPayload',
			draftId: 'mockDraftId',
			eventVersion: '2.0.0',
			ip: 'mockRemoteAddress',
			metadata: {},
			payload: {
				assessmentScore: 'mockAssessmentScore',
				assessmentScoreId: 'mockAssessmentScoreId',
				attemptCount: 'mockAttemptNumber',
				attemptId: 'mockAttemptId',
				attemptScore: 'mockAttemptScore',
				ltiAssessmentScoreId: 'mockLtiAssessmentScoreId',
				ltiScoreError: 'mockLtiScoreError',
				ltiScoreErrorDetails: 'mockLtiScoreErrorDetails',
				ltiScoreSent: 'mockLtiScoreSent',
				ltiScoreStatus: 'mockLtiScoreStatus'
			},
			userId: 'userId'
		})

		// make sure the caliper payload gets the expected inputs
		expect(createAssessmentAttemptScoredEvent).toHaveBeenCalledWith({
			actor: {
				type: 'serverApp'
			},
			assessmentId: 'mockAssessmentId',
			attemptId: 'mockAttemptId',
			attemptScore: 'mockAttemptScore',
			draftId: 'mockDraftId',
			extensions: {
				assessmentScore: 'mockAssessmentScore',
				attemptCount: 'mockAttemptNumber',
				attemptScore: 'mockAttemptScore',
				ltiScoreSent: 'mockLtiScoreSent'
			},
			isPreviewMode: 'mockIsPreviewing'
		})
	})

	test('sendLTIHighestAssessmentScore calls lti.sendLTIHighestAssessmentScore', () => {
		expect(lti.sendHighestAssessmentScore).toHaveBeenCalledTimes(0)
		sendLTIHighestAssessmentScore()
		expect(lti.sendHighestAssessmentScore).toHaveBeenCalledTimes(1)
	})

	test('calculateScores keeps all scores in order', () => {
		let assessmentModel = { node: { content: {} } }

		let attemptHistory = [
			{
				result: {
					attemptScore: 25
				}
			}
		]

		let scoreInfo = {
			questions: [{ id: 4 }, { id: 5 }, { id: 6 }],
			scoresByQuestionId: { 4: 50, 5: 75, 6: 27 },
			scores: [50, 75, 27]
		}

		let result = calculateScores(assessmentModel, attemptHistory, scoreInfo)

		// make sure the questionScores are in the same order
		expect(result.attempt.questionScores).toEqual([
			{ id: 4, score: 50 },
			{ id: 5, score: 75 },
			{ id: 6, score: 27 }
		])
	})

	test('calculateScores calculates expected attemptScore', () => {
		let assessmentModel = { node: { content: {} } }

		let attemptHistory = [
			{
				result: {
					attemptScore: 25
				}
			}
		]

		let scoreInfo = {
			questions: [{ id: 4 }, { id: 5 }, { id: 6 }],
			scoresByQuestionId: { 4: 50, 5: 75, 6: 27 },
			scores: [50, 75, 27]
		}

		let result = calculateScores(assessmentModel, attemptHistory, scoreInfo)
		expect(result.attempt.attemptScore).toBe(50.666666666666664)
	})

	test('calculateScores calls AssessmentRubric.getAssessmentScoreInfoForAttempt with expected values', () => {
		expect(AssessmentRubric.mockGetAssessmentScoreInfoForAttempt).toHaveBeenCalledTimes(0)
		let assessmentModel = { node: { content: { attempts: 'mockContentAttempts' } } }

		let attemptHistory = [{ result: { attemptScore: 25 } }]

		let scoreInfo = {
			questions: [{ id: 4 }, { id: 5 }],
			scoresByQuestionId: { 4: 50, 5: 75 },
			scores: [50, 75]
		}

		let result = calculateScores(assessmentModel, attemptHistory, scoreInfo)

		expect(result).toHaveProperty('assessmentScoreDetails', 'mockScoreForAttempt')
		expect(AssessmentRubric.mockGetAssessmentScoreInfoForAttempt).toHaveBeenCalledTimes(1)
		expect(AssessmentRubric.mockGetAssessmentScoreInfoForAttempt).toHaveBeenCalledWith(
			'mockContentAttempts',
			[25, 62.5]
		)
	})

	test.skip('@TODO - Need to make sure that these tests log correct', () => {
		//Don't actually write this test - this is just a reminder
		//that we need to add log mocks to the other tests in this file
	})

	test('getCalculatedScores calls calculateScores with expected values', () => {
		let attemptHistory = [
			{
				result: {
					attemptScore: 25
				}
			}
		]

		let attemptState = {
			questions: [{ id: 4 }, { id: 5 }, { id: 6 }]
		}

		let x = new DraftModel({ content: { rubric: 1 } })

		// now we have to mock yell so that we can call addScore()
		x.yell.mockImplementationOnce((event, req, res, model, history, funcs) => {
			funcs.addScore(4, 10)
			funcs.addScore(5, 66)
			funcs.addScore(6, 77)
			return [Promise.resolve()]
		})

		return getCalculatedScores({}, {}, x, attemptState, attemptHistory, 'rh').then(result => {
			expect(result).toEqual({
				assessmentScoreDetails: 'mockScoreForAttempt',
				attempt: {
					attemptScore: 51,
					questionScores: [
						{
							id: 4,
							score: 10
						},
						{
							id: 5,
							score: 66
						},
						{
							id: 6,
							score: 77
						}
					]
				}
			})

			expect()
		})
	})

	test('completeAttempt calls Assessment.completeAttempt with expected values', () => {
		let r = completeAttempt(
			'mockAssessmentId',
			'mockAttemptId',
			'mockUserId',
			'mockDraftId',
			{ attempt: 'mockCalculatedScores', assessmentScoreDetails: 'mockScoreDeets' },
			'mockPreview'
		)

		// make sure we get the result of insertEvent back
		expect(r).toBe('mockCompleteAttemptResult')

		// make sure Assessment.completeAttempt is called
		expect(Assessment.completeAttempt).toHaveBeenLastCalledWith(
			'mockAssessmentId',
			'mockAttemptId',
			'mockUserId',
			'mockDraftId',
			'mockCalculatedScores',
			'mockScoreDeets',
			'mockPreview'
		)
	})

	test('insertAttemptEndEvents creates a correct caliper event and internal event', () => {
		// mock the caliperEvent method
		let createAssessmentAttemptSubmittedEvent = jest.fn().mockReturnValue('mockCaliperPayload')
		insertEvent.mockReturnValueOnce('mockInsertResult')
		createCaliperEvent.mockReturnValueOnce({
			createAssessmentAttemptSubmittedEvent
		})

		let r = insertAttemptEndEvents(
			{ id: 1 },
			'mockDraftId',
			'mockAssessmentId',
			'mockAttemptId',
			'mockAttemptNumber',
			'mockIsPreviewing',
			'mockHostname',
			'mockRemoteAddress'
		)

		// make sure we get the result of insertEvent back
		expect(r).toBe('mockInsertResult')

		// make sure insert event is called
		expect(insertEvent).toHaveBeenCalledTimes(1)

		// make sure insert event is called with the arguments we expect
		expect(insertEvent).toHaveBeenCalledWith({
			action: 'assessment:attemptEnd',
			actorTime: 'mockDate',
			caliperPayload: 'mockCaliperPayload',
			draftId: 'mockDraftId',
			eventVersion: '1.1.0',
			ip: 'mockRemoteAddress',
			metadata: {},
			payload: {
				attemptCount: 'mockAttemptNumber',
				attemptId: 'mockAttemptId'
			},
			userId: 1
		})
	})
})
