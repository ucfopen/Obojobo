jest.mock('./api')
const API = require('./api')
const AssessmentAPI = require('./assessment-api').default

describe('assessment-api', () => {
	let mockJsonResult

	beforeEach(() => {
		jest.clearAllMocks()
		jest.restoreAllMocks()

		// keep an obj reference of a mock result from calling res.json() from fetch
		mockJsonResult = {}
		// build the object that resolves from fetch calls for our json requests
		const jsonResolve = { json: () => mockJsonResult }
		API.post.mockResolvedValueOnce(jsonResolve)
		API.get.mockResolvedValueOnce(jsonResolve)
		API.postWithFormat.mockResolvedValueOnce(jsonResolve)
		API.delete.mockResolvedValueOnce(jsonResolve)

		// simplify/mock what processJsonResults does
		API.processJsonResults.mockImplementation(vars => vars.json())
	})

	test('startAttempt calls fetch', () => {
		expect.hasAssertions()

		const args = {
			draftId: 'mockDraftId',
			assessmentId: 'mockAssessmentId',
			visitId: 'mockVisitId'
		}
		return AssessmentAPI.startAttempt(args).then(result => {
			expect(API.post).toHaveBeenCalledWith('/api/assessments/attempt/start', args)
			expect(API.processJsonResults).toHaveBeenCalled()
			expect(result).toEqual(mockJsonResult)
		})
	})

	test('resumeAttempt calls fetch', () => {
		expect.hasAssertions()
		const args = { attemptId: 999 }
		return AssessmentAPI.resumeAttempt(args).then(result => {
			expect(API.post).toHaveBeenCalledWith('/api/assessments/attempt/999/resume', args)
			expect(API.processJsonResults).toHaveBeenCalled()
			expect(result).toEqual(mockJsonResult)
		})
	})

	test('endAttempt calls fetch', () => {
		expect.hasAssertions()
		const args = { attemptId: 999, visitId: 'mockVisitId' }
		return AssessmentAPI.endAttempt(args).then(result => {
			expect(API.post).toHaveBeenCalledWith('/api/assessments/attempt/999/end', {
				visitId: 'mockVisitId'
			})
			expect(API.processJsonResults).toHaveBeenCalled()
			expect(result).toEqual(mockJsonResult)
		})
	})

	test('reviewAttempt calls fetch', () => {
		expect.hasAssertions()

		API.processJsonResults.mockResolvedValueOnce([
			{ attemptId: 'a-id', questions: [{ id: 'q-id' }, { id: 'q-id2' }] }
		])
		return AssessmentAPI.reviewAttempt('mockAttemptIds', {}).then(result => {
			expect(API.post).toHaveBeenCalledWith('/api/assessments/attempt/review', {
				attemptIds: 'mockAttemptIds'
			})
			expect(API.processJsonResults).toHaveBeenCalled()
			expect(result).toEqual({
				'a-id': {
					'q-id': {
						id: 'q-id'
					},
					'q-id2': {
						id: 'q-id2'
					}
				}
			})
		})
	})

	test('resendLTIAssessmentScore calls fetch', () => {
		expect.hasAssertions()

		const args = {
			draftId: 'mockDraftId',
			assessmentId: 'mockAssessmentId',
			visitId: 'mockVisitId'
		}

		return AssessmentAPI.resendLTIAssessmentScore(args).then(result => {
			expect(API.post).toHaveBeenCalledWith('/api/lti/send-assessment-score', args)
			expect(API.processJsonResults).toHaveBeenCalled()
			expect(result).toEqual(mockJsonResult)
		})
	})

	test('importScore calls fetch', async () => {
		expect.hasAssertions()

		const args = {
			draftId: 'mockDraftId',
			assessmentId: 'mockAssessmentId',
			visitId: 'mockVisitId',
			importedAssessmentScoreId: 'mockImportedAssessmentScoreId'
		}

		const result = await AssessmentAPI.importScore(args)
		expect(API.post).toHaveBeenCalledWith(
			'/api/assessments/mockDraftId/mockAssessmentId/import-score',
			{ importedAssessmentScoreId: 'mockImportedAssessmentScoreId', visitId: 'mockVisitId' }
		)
		expect(API.processJsonResults).toHaveBeenCalled()
		expect(result).toEqual(mockJsonResult)
	})

	test('getAttemptHistory calls fetch', async () => {
		expect.hasAssertions()

		const args = {
			draftId: 'mockDraftId',
			visitId: 'mockVisitId'
		}

		API.processJsonResults.mockResolvedValueOnce([])
		const result = await AssessmentAPI.getAttemptHistory(args)
		expect(API.get).toHaveBeenCalledWith(
			'/api/assessments/mockDraftId/attempts?visitId=mockVisitId'
		)
		expect(API.processJsonResults).toHaveBeenCalled()
		expect(result).toEqual([])
	})
})
