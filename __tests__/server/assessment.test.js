jest.mock('../../../../lti', () => ({
	getLTIStatesByAssessmentIdForUserAndDraft: jest.fn()
}))

jest.mock('../../../../db')
const Assessment = require('../../server/assessment')
const db = oboRequire('db')
const lti = oboRequire('lti')

describe('Assessment', () => {
	beforeEach(() => {
		jest.restoreAllMocks()
		db.one.mockReset()
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

	test('createAttemptResponse returns attempt object', () => {
		let mockAttempt = {
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
		}
		let res = Assessment.createAttemptResponse('mockUserId', 'mockDraftId', mockAttempt)
		expect(res).toEqual({
			assessmentId: 'mockAssessmentId',
			assessmentScore: 15,
			assessmentScoreDetails: 'mockScoreDeails',
			assessmentScoreId: 'scoreId',
			attemptId: 'mockAttemptId',
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

	test('getAttempts returns attempts object', () => {
		db.manyOrNone.mockResolvedValueOnce([
			{
				assessmentId: 3
			}
		])

		lti.getLTIStatesByAssessmentIdForUserAndDraft.mockResolvedValueOnce({
			3: {
				scoreSent: 3,
				sentDate: 3,
				status: 3,
				gradebookStatus: 3,
				statusDetails: 'f'
			}
		})

		jest.spyOn(Assessment, 'createAttemptResponse')
		Assessment.createAttemptResponse.mockReturnValue('mockAttemptResponse')

		return Assessment.getAttempts('mockUserId', 'mockDraftId', 'assessmentId').then(result => {
			expect(result).toEqual({
				assessmentId: undefined,
				attempts: ['mockAttemptResponse'],
				ltiState: null
			})
		})
	})

	test('getAttempts returns attempts object', () => {
		db.manyOrNone.mockResolvedValueOnce([
			{
				// assessmentId: 3
			}
		])

		lti.getLTIStatesByAssessmentIdForUserAndDraft.mockResolvedValueOnce({
			3: {
				scoreSent: 0,
				sentDate: 'mockSentDate',
				status: 'mockStatus',
				gradebookStatus: 'mockGradeBookSatus',
				statusDetails: 'mockStatusDtails'
			}
		})

		jest.spyOn(Assessment, 'createAttemptResponse')
		Assessment.createAttemptResponse.mockReturnValue({
			mock: 'mockCreateAttemptResponse',
			assessmentId: 3
		})

		return Assessment.getAttempts('mockUserId', 'mockDraftId', 'assessmentId').then(result => {
			expect(result).toEqual({
				assessmentId: 3,
				attempts: [
					{
						mock: 'mockCreateAttemptResponse',
						assessmentId: 3
					}
				],
				ltiState: {
					gradebookStatus: 'mockGradeBookSatus',
					scoreSent: 0,
					sentDate: 'mockSentDate',
					status: 'mockStatus',
					statusDetails: 'mockStatusDtails'
				}
			})
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
})
