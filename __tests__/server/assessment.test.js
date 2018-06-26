const db = oboRequire('db')
const lti = oboRequire('lti')
const Assessment = require('../../server/assessment')

const logger = oboRequire('logger')

describe('Assessment', () => {
	beforeEach(() => {
		jest.restoreAllMocks()
		db.one.mockReset()
		db.manyOrNone.mockReset()
	})

	let makeMockAttempt = () => ({
		attempt_id: 'mockAttemptId',
		assessment_id: 'mockAssessmentId',
		created_at: 'mockCreatedAt',
		completed_at: 'mockCompletedAt',
		state: 'mockState',
		result: {
			attemptScore: 'mockResult',
			questionScores: ['mockScore']
		},
		assessment_score: '15',
		score_details: 'mockScoreDeails',
		assessment_score_id: 'scoreId',
		attempt_number: '12'
	})

	test('getCompletedAssessmentAttemptHistory calls db', () => {
		Assessment.getCompletedAssessmentAttemptHistory(0, 1, 2)

		expect(db.manyOrNone).toHaveBeenCalled()
		expect(db.manyOrNone.mock.calls[0][1]).toEqual({
			userId: 0,
			draftId: 1,
			assessmentId: 2
		})
	})

	test('getNumberAttemptsTaken calls db', done => {
		expect.assertions(1)
		db.one.mockResolvedValueOnce({ count: 123 })

		return Assessment.getNumberAttemptsTaken(0, 1, 2).then(n => {
			expect(n).toBe(123)
			done()
		})
	})

	test('createUserAttempt returns attempt object', () => {
		let mockAttempt = makeMockAttempt()
		let res = Assessment.createUserAttempt('mockUserId', 'mockDraftId', mockAttempt)
		expect(res).toEqual({
			assessmentId: 'mockAssessmentId',
			assessmentScore: 15,
			assessmentScoreDetails: 'mockScoreDeails',
			assessmentScoreId: 'scoreId',
			attemptId: 'mockAttemptId',
			responses: {},
			attemptNumber: 12,
			attemptScore: 'mockResult',
			draftId: 'mockDraftId',
			finishTime: 'mockCompletedAt',
			isFinished: true,
			questionScores: ['mockScore'],
			startTime: 'mockCreatedAt',
			state: 'mockState',
			userId: 'mockUserId'
		})
	})

	test('createUserAttempt returns attempt object with default values', () => {
		let mockAttempt = makeMockAttempt()
		mockAttempt.result = null
		let res = Assessment.createUserAttempt('mockUserId', 'mockDraftId', mockAttempt)
		expect(res).toEqual({
			assessmentId: 'mockAssessmentId',
			assessmentScore: 15,
			assessmentScoreDetails: 'mockScoreDeails',
			assessmentScoreId: 'scoreId',
			attemptId: 'mockAttemptId',
			responses: {},
			attemptNumber: 12,
			attemptScore: null,
			draftId: 'mockDraftId',
			finishTime: 'mockCompletedAt',
			isFinished: true,
			questionScores: [],
			startTime: 'mockCreatedAt',
			state: 'mockState',
			userId: 'mockUserId'
		})
	})

	test('getAttempts returns attempts object without response history', () => {
		db.manyOrNone.mockResolvedValueOnce([makeMockAttempt()])

		// there's no response history
		jest.spyOn(Assessment, 'getResponseHistory')
		Assessment.getResponseHistory.mockResolvedValueOnce({})

		// there's no lti state
		lti.getLTIStatesByAssessmentIdForUserAndDraft.mockResolvedValueOnce({})

		return Assessment.getAttempts('mockUserId', 'mockDraftId', 'mockAssessmentId').then(result => {
			expect(result).toMatchSnapshot()
		})
	})

	test('getAttempts returns attempts object without assessmentId', () => {
		db.manyOrNone.mockResolvedValueOnce([makeMockAttempt()])

		// there's no response history
		jest.spyOn(Assessment, 'getResponseHistory')
		Assessment.getResponseHistory.mockResolvedValueOnce({})

		// there's no lti state
		lti.getLTIStatesByAssessmentIdForUserAndDraft.mockResolvedValueOnce({})

		return Assessment.getAttempts('mockUserId', 'mockDraftId').then(result => {
			expect(result).toMatchSnapshot()
		})
	})

	test('getAttempts returns empty object if assessment isnt found', () => {
		db.manyOrNone.mockResolvedValueOnce([])

		// there's no response history
		jest.spyOn(Assessment, 'getResponseHistory')
		Assessment.getResponseHistory.mockResolvedValueOnce({})

		// there's no lti state
		lti.getLTIStatesByAssessmentIdForUserAndDraft.mockResolvedValueOnce({})

		return Assessment.getAttempts('mockUserId', 'mockDraftId', 'badAssessmentId').then(result => {
			expect(result).toMatchSnapshot()
		})
	})

	test('getAttempts returns attempts object with response history', () => {
		// mock the results of the query to just return an object in an array
		db.manyOrNone.mockResolvedValueOnce([makeMockAttempt()])

		// create a mock history
		jest.spyOn(Assessment, 'getResponseHistory')
		let mockHistory = {
			mockAttemptId: [
				{
					id: 'mockResponseId',
					assessment_id: 'mockAssessmentId',
					repsonse: 'mockResponse',
					attempt_id: 'mockAttemptId',
					question_id: 'mockQuestionId',
					response: 'mockResponse'
				}
			]
		}
		Assessment.getResponseHistory.mockResolvedValueOnce(mockHistory)

		lti.getLTIStatesByAssessmentIdForUserAndDraft.mockResolvedValueOnce({
			mockAssessmentId: {
				scoreSent: 0,
				sentDate: 'mockSentDate',
				status: 'mockStatus',
				gradebookStatus: 'mockGradeBookStatus',
				statusDetails: 'mockStatusDetails'
			}
		})

		return Assessment.getAttempts('mockUserId', 'mockDraftId', 'mockAssessmentId').then(result => {
			expect(result).toMatchSnapshot()
		})
	})

	test('getAttempts returns multiple attempts with same assessment', () => {
		// mock the results of the query to just return an object in an array
		let first = makeMockAttempt()
		first.attempt_id = 'mockFirst'
		let second = makeMockAttempt()
		second.attempt_id = 'mockSecond'
		db.manyOrNone.mockResolvedValueOnce([first, second])

		// create a mock history
		jest.spyOn(Assessment, 'getResponseHistory')
		let mockHistory = {
			mockAttemptId: [
				{
					id: 'mockResponseId',
					assessment_id: 'mockAssessmentId',
					repsonse: 'mockResponse',
					attempt_id: 'mockAttemptId',
					question_id: 'mockQuestionId',
					response: 'mockResponse'
				}
			]
		}
		Assessment.getResponseHistory.mockResolvedValueOnce(mockHistory)

		lti.getLTIStatesByAssessmentIdForUserAndDraft.mockResolvedValueOnce({
			mockAssessmentId: {
				scoreSent: 0,
				sentDate: 'mockSentDate',
				status: 'mockStatus',
				gradebookStatus: 'mockGradeBookStatus',
				statusDetails: 'mockStatusDetails'
			}
		})

		return Assessment.getAttempts('mockUserId', 'mockDraftId', 'mockAssessmentId').then(result => {
			expect(result).toMatchSnapshot()
		})
	})

	test('getAttempts returns no history when assessmentIds for attempt and history dont match', () => {
		// mock the results of the query to just return an object in an array
		db.manyOrNone.mockResolvedValueOnce([makeMockAttempt()])

		// create a mock history
		jest.spyOn(Assessment, 'getResponseHistory')
		let mockHistory = {
			mockAttemptId: [
				{
					id: 'mockResponseId',
					assessment_id: 'mockOtherAssessmentId',
					repsonse: 'mockResponse',
					attempt_id: 'mockAttemptId',
					question_id: 'mockQuestionId',
					response: 'mockResponse'
				}
			]
		}
		Assessment.getResponseHistory.mockResolvedValueOnce(mockHistory)

		lti.getLTIStatesByAssessmentIdForUserAndDraft.mockResolvedValueOnce({
			mockAssessmentId: {
				scoreSent: 0,
				sentDate: 'mockSentDate',
				status: 'mockStatus',
				gradebookStatus: 'mockGradeBookStatus',
				statusDetails: 'mockStatusDetails'
			}
		})

		return Assessment.getAttempts('mockUserId', 'mockDraftId').then(result => {
			expect(result).toMatchSnapshot()
		})
	})

	test('getAttempts throws error if attempt is not found', () => {
		// mock the results of the query to just return an object in an array
		db.manyOrNone.mockResolvedValueOnce([makeMockAttempt()])

		// create a mock history
		jest.spyOn(Assessment, 'getResponseHistory')
		let mockHistory = {
			mockAttemptId: [
				{
					id: 'mockResponseId',
					assessment_id: 'mockAssessmentId',
					repsonse: 'mockResponse',
					attempt_id: 'mockBadAttemptId',
					question_id: 'mockQuestionId',
					response: 'mockResponse'
				}
			]
		}
		Assessment.getResponseHistory.mockResolvedValueOnce(mockHistory)

		lti.getLTIStatesByAssessmentIdForUserAndDraft.mockResolvedValueOnce({
			mockAssessmentId: {
				scoreSent: 0,
				sentDate: 'mockSentDate',
				status: 'mockStatus',
				gradebookStatus: 'mockGradeBookStatus',
				statusDetails: 'mockStatusDetails'
			}
		})

		return Assessment.getAttempts('mockUserId', 'mockDraftId', 'mockAssessmentId').then(result => {
			expect(result).toMatchSnapshot()
			expect(logger.warn).toHaveBeenCalledWith(
				"Couldn't find an attempt I was looking for ('mockUserId', 'mockDraftId', 'mockAttemptId', 'mockResponseId', 'mockAssessmentId') - Shouldn't get here!"
			)
		})
	})

	test('getAttemptIdsForUserForDraft calls db with expected fields', () => {
		Assessment.getAttemptIdsForUserForDraft('mockUserId', 'mockDraftId')

		expect(db.manyOrNone.mock.calls[0][1]).toEqual({
			userId: 'mockUserId',
			draftId: 'mockDraftId'
		})
	})

	test('getAttemptNumber returns the attempt_number property', () => {
		jest.spyOn(Assessment, 'getAttemptIdsForUserForDraft')
		Assessment.getAttemptIdsForUserForDraft.mockResolvedValueOnce([
			{ id: 3, attempt_number: 999 },
			{ id: 'attemptId', attempt_number: 777 },
			{ id: 111, attempt_number: 227 }
		])

		return Assessment.getAttemptNumber('userId', 'draftId', 'attemptId').then(result => {
			expect(result).toEqual(777)
		})
	})

	test('getAttemptNumber returns null when theres no matching attemptId', () => {
		jest.spyOn(Assessment, 'getAttemptIdsForUserForDraft')
		Assessment.getAttemptIdsForUserForDraft.mockResolvedValueOnce([
			{ id: 3, attempt_number: 999 },
			{ id: 999, attempt_number: 777 },
			{ id: 111, attempt_number: 227 }
		])

		return Assessment.getAttemptNumber('userId', 'draftId', 'attemptId').then(result => {
			expect(result).toEqual(null)
		})
	})

	test('getAttempt retrieves the Attempt by its id', () => {
		Assessment.getAttempt('mockAttemptId')

		expect(db.oneOrNone.mock.calls[0][1]).toEqual({
			attemptId: 'mockAttemptId'
		})
	})

	test('getResponseHistory calls the database and loops through the result', done => {
		db.manyOrNone.mockResolvedValueOnce([
			{
				attempt_id: 'mockAttemptId'
			},
			{
				attempt_id: 'secondMockAttemptId'
			}
		])

		return Assessment.getResponseHistory('mockUserId', 'mockDraftId').then(result => {
			expect(db.manyOrNone.mock.calls[0][1]).toEqual({
				userId: 'mockUserId',
				draftId: 'mockDraftId',
				optionalAssessmentId: null
			})

			expect(result).toEqual({
				mockAttemptId: [{ attempt_id: 'mockAttemptId' }],
				secondMockAttemptId: [{ attempt_id: 'secondMockAttemptId' }]
			})

			return done()
		})
	})

	test('getResponseHistory returns array with identical attemptIds', done => {
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

		return Assessment.getResponseHistory('mockUserId', 'mockDraftId').then(result => {
			expect(db.manyOrNone.mock.calls[0][1]).toEqual({
				userId: 'mockUserId',
				draftId: 'mockDraftId',
				optionalAssessmentId: null
			})

			expect(result).toEqual({
				mockAttemptId: [
					{
						attempt_id: 'mockAttemptId',
						question_id: 'mockQuestionId'
					}
				],
				secondMockAttemptId: [
					{
						attempt_id: 'secondMockAttemptId',
						question_id: 'mockQuestionId'
					},
					{
						attempt_id: 'secondMockAttemptId',
						question_id: 'mockOtherQuestionId'
					}
				]
			})

			return done()
		})
	})

	test('getResponseHistory calls the database with optionalAssessmentId', done => {
		db.manyOrNone.mockResolvedValueOnce([
			{
				attempt_id: 'mockAttemptId'
			},
			{
				attempt_id: 'secondMockAttemptId'
			}
		])

		return Assessment.getResponseHistory('mockUserId', 'mockDraftId', 'mockAssessmentId').then(
			result => {
				expect(db.manyOrNone.mock.calls[0][1]).toEqual({
					userId: 'mockUserId',
					draftId: 'mockDraftId',
					optionalAssessmentId: 'mockAssessmentId'
				})

				expect(result).toEqual({
					mockAttemptId: [{ attempt_id: 'mockAttemptId' }],
					secondMockAttemptId: [{ attempt_id: 'secondMockAttemptId' }]
				})

				return done()
			}
		)
	})

	test('getResponsesForAttempt calls the database with the expected value', () => {
		Assessment.getResponsesForAttempt('mockAttemptId')

		expect(db.manyOrNone.mock.calls[0][1]).toEqual({
			attemptId: 'mockAttemptId'
		})
	})

	test('insertNewAttempt', () => {
		Assessment.insertNewAttempt(
			'mockUserId',
			'mockDraftId',
			'mockAssessmentId',
			'mockState',
			'mockPreviewing'
		)

		expect(db.one).toHaveBeenCalled()
		expect(db.one.mock.calls[0][1]).toEqual({
			userId: 'mockUserId',
			draftId: 'mockDraftId',
			assessmentId: 'mockAssessmentId',
			state: 'mockState',
			isPreview: 'mockPreviewing'
		})
	})

	test('insertAssessmentScore calls db with expected values', () => {
		Assessment.insertAssessmentScore(
			'mockUserId',
			'mockDraftId',
			'mockAssessmentId',
			'mockLaunchId',
			'mockScore',
			'mockPreviewing'
		)

		expect(db.one.mock.calls[0][1]).toEqual({
			userId: 'mockUserId',
			draftId: 'mockDraftId',
			assessmentId: 'mockAssessmentId',
			launchId: 'mockLaunchId',
			score: 'mockScore',
			isPreview: 'mockPreviewing'
		})
	})

	test('completeAttempt calls UPDATE/INSERT queries with expected values and returns data object', () => {
		expect.assertions(3)
		db.one.mockResolvedValueOnce('attemptData')
		db.one.mockResolvedValueOnce({ id: 'assessmentScoreId' })

		return Assessment.completeAttempt(1, 2, 3, 4, {}, {}, false).then(result => {
			expect(result).toEqual({
				assessmentScoreId: 'assessmentScoreId',
				attemptData: 'attemptData'
			})

			expect(db.one.mock.calls[0][0]).toContain('UPDATE attempts')
			expect(db.one.mock.calls[1][0]).toContain('INSERT INTO assessment_scores')
		})
	})

	test('updateAttemptState calls db', () => {
		Assessment.updateAttemptState(0, {})

		expect(db.none).toHaveBeenCalled()
		expect(db.none.mock.calls[0][1]).toEqual({
			state: {},
			attemptId: 0
		})
	})

	test('insertNewAssessmentScore calls the db with expected values', () => {
		db.one.mockResolvedValueOnce({
			id: 'mockId'
		})

		Assessment.insertNewAssessmentScore(
			'mockUserId',
			'mockDraftId',
			'mockAssessmentId',
			'mockScore',
			'mockPreviewing'
		)

		expect(db.one.mock.calls[0][1]).toEqual({
			userId: 'mockUserId',
			draftId: 'mockDraftId',
			assessmentId: 'mockAssessmentId',
			score: 'mockScore',
			preview: 'mockPreviewing'
		})
	})

	test('creates its own instance correctly', () => {
		Assessment.prototype.registerEvents = jest.fn()

		let assessment = new Assessment(
			{
				draftTree: true
			},
			{
				node: true
			},
			jest.fn()
		)

		expect(assessment.registerEvents).toHaveBeenCalledWith({
			'internal:sendToClient': assessment.onSendToClient,
			'internal:startVisit': assessment.onStartVisit
		})
	})

	test('onSendToClient yells', () => {
		let assessment = new Assessment(
			{
				draftTree: true
			},
			{
				node: true
			},
			jest.fn()
		)

		jest.spyOn(assessment, 'yell')
		assessment.onSendToClient('req', 'res')

		expect(assessment.yell).toHaveBeenCalledWith(
			'ObojoboDraft.Sections.Assessment:sendToClient',
			'req',
			'res'
		)
	})

	test('onStartVisit inserts value into extensionsProps', () => {
		let req = {
			requireCurrentUser: jest.fn().mockResolvedValue({ id: 'mockUser' })
		}
		jest.spyOn(Assessment, 'getAttempts').mockResolvedValueOnce('mockAttempts')
		let extensionsProps = {}

		let assessment = new Assessment(
			{
				draftTree: true
			},
			{
				node: true
			},
			jest.fn()
		)

		return assessment.onStartVisit(req, {}, 'mockDraftId', '', extensionsProps).then(res => {
			expect(extensionsProps[':ObojoboDraft.Sections.Assessment:attemptHistory']).toEqual(
				'mockAttempts'
			)
		})
	})
})
