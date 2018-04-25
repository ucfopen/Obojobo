const db = oboRequire('db')
const lti = oboRequire('lti')
const Assessment = require('../../server/assessment')

describe('Assessment', () => {
	beforeEach(() => {
		jest.restoreAllMocks()
		db.one.mockReset()
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

	test.skip('getAttemptHistory', () => {
		Assessment.getAttemptHistory(0, 1)

		expect(db.manyOrNone).toHaveBeenCalled()
		expect(db.manyOrNone.mock.calls[0][1]).toEqual({
			userId: 0,
			draftId: 1
		})
	})

	test('insertNewAttempt', () => {
		Assessment.insertNewAttempt(0, 1, 2, 3, 4)

		expect(db.one).toHaveBeenCalled()
		expect(db.one.mock.calls[0][1]).toEqual({
			userId: 0,
			draftId: 1,
			assessmentId: 2,
			state: 3,
			isPreview: 4
		})
	})

	test.skip('updateAttempt', () => {
		Assessment.updateAttempt(0, 1)

		expect(db.one).toHaveBeenCalled()
		expect(db.one.mock.calls[0][1]).toEqual({
			result: 0,
			attemptId: 1
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

	//@TODO: SKIP
	test.skip('onRenderView sets global attemptHistory', done => {
		Assessment.getAttemptHistory = () => Promise.resolve({ history: 'test123' })

		let assessment = new Assessment(
			{
				draftTree: true
			},
			{
				node: true
			},
			jest.fn()
		)

		let requireCurrentUser = () => Promise.resolve({ id: 1 })

		let oboGlobalsMockSetFn = jest.fn()

		assessment
			.onRenderViewer(
				{
					requireCurrentUser: requireCurrentUser,
					params: {
						draftId: 123
					}
				},
				'res',
				{
					set: oboGlobalsMockSetFn
				}
			)
			.then(() => {
				expect(oboGlobalsMockSetFn).toHaveBeenCalledWith(
					'ObojoboDraft.Sections.Assessment:attempts',
					{
						history: 'test123'
					}
				)

				done()
			})
			.catch(e => {
				expect(1).toBe(2) // shouldn't get here
			})
	})

	test('getNumberAttemptsTaken calls db', () => {
		expect.assertions(1)
		db.one.mockResolvedValueOnce({ count: 123 })

		return Assessment.getNumberAttemptsTaken(0, 1, 2).then(n => {
			expect(n).toBe(123)
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

	test('getAttempts returns attempts object without response history', () => {
		db.manyOrNone.mockResolvedValueOnce([makeMockAttempt()])

		// there's no response history
		jest.spyOn(Assessment, 'getResponseHistory')
		Assessment.getResponseHistory.mockResolvedValueOnce({})

		// there's no lti state
		lti.getLTIStatesByAssessmentIdForUserAndDraft.mockResolvedValueOnce({})

		return Assessment.getAttempts('mockUserId', 'mockDraftId', 'assessmentId').then(result => {
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
					repsonse: 'mockResponse'
				}
			]
		}
		Assessment.getResponseHistory.mockResolvedValueOnce(mockHistory)

		lti.getLTIStatesByAssessmentIdForUserAndDraft.mockResolvedValueOnce({
			mockAssessmentId: {
				scoreSent: 0,
				sentDate: 'mockSentDate',
				status: 'mockStatus',
				gradebookStatus: 'mockGradeBookSatus',
				statusDetails: 'mockStatusDtails'
			}
		})

		return Assessment.getAttempts('mockUserId', 'mockDraftId', 'mockAssessmentId').then(result => {
			expect(result).toMatchSnapshot()
		})
	})

	test('getAttemptNumber returns the attempt_number property', () => {
		jest.spyOn(Assessment, 'getAttemptIdsForUserForDraft')
		Assessment.getAttemptIdsForUserForDraft.mockResolvedValue([
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
		Assessment.getAttemptIdsForUserForDraft.mockResolvedValue([
			{ id: 3, attempt_number: 999 },
			{ id: 999, attempt_number: 777 },
			{ id: 111, attempt_number: 227 }
		])

		return Assessment.getAttemptNumber('userId', 'draftId', 'attemptId').then(result => {
			expect(result).toEqual(null)
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

	test('updateAttemptState calls db', () => {
		Assessment.updateAttemptState(0, {})

		expect(db.none).toHaveBeenCalled()
		expect(db.none.mock.calls[0][1]).toEqual({
			state: {},
			attemptId: 0
		})
	})
})
