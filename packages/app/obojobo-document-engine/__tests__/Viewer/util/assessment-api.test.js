const originalFetch = global.fetch
const originalToISOString = Date.prototype.toISOString
const APIUtil = require('../../../src/scripts/viewer/util/api-util').default
const AssessmentAPI = require('../../../src/scripts/viewer/util/assessment-api').default

describe('apiutil', () => {
	let mockJsonResult
	let post
	let postWithFormat
	let deleteMethod
	let get

	beforeEach(() => {
		jest.clearAllMocks()
		jest.restoreAllMocks()
		jest.spyOn(window.parent, 'postMessage')

		mockJsonResult = {}
		post = jest.spyOn(APIUtil, 'post')
		post.mockResolvedValueOnce({
			json: () => mockJsonResult,
			text: () => JSON.stringify(mockJsonResult)
		})

		get = jest.spyOn(APIUtil, 'get')
		get.mockResolvedValueOnce({
			json: () => mockJsonResult,
			text: () => JSON.stringify(mockJsonResult)
		})

		postWithFormat = jest.spyOn(APIUtil, 'postWithFormat')
		postWithFormat.mockResolvedValueOnce({
			json: () => mockJsonResult,
			text: () => JSON.stringify(mockJsonResult)
		})

		deleteMethod = jest.spyOn(APIUtil, 'delete')
		deleteMethod.mockResolvedValueOnce({
			json: () => mockJsonResult,
			text: () => JSON.stringify(mockJsonResult)
		})
	})

	beforeAll(() => {
		global.fetch = jest.fn()
		Date.prototype.toISOString = () => 'mockDate'
	})
	afterAll(() => {
		global.fetch = originalFetch
		Date.prototype.toISOString = originalToISOString
	})

	test('startAttempt calls fetch', () => {
		expect.hasAssertions()

		return AssessmentAPI.startAttempt({
			draftId: 'mockDraftId',
			assessmentId: 'mockAssessmentId',
			visitId: 'mockVisitId'
		}).then(result => {
			expect(post).toHaveBeenCalledWith('/api/assessments/attempt/start', {
				assessmentId: 'mockAssessmentId',
				draftId: 'mockDraftId',
				visitId: 'mockVisitId'
			})
			expect(result).toEqual(mockJsonResult)
		})
	})

	test('resumeAttempt calls fetch', () => {
		expect.hasAssertions()

		return AssessmentAPI.resumeAttempt({ attemptId: 999 }).then(result => {
			expect(post).toHaveBeenCalledWith('/api/assessments/attempt/999/resume', { attemptId: 999 })
			expect(result).toEqual(mockJsonResult)
		})
	})

	test('endAttempt calls fetch', () => {
		expect.hasAssertions()

		return AssessmentAPI.endAttempt({ attemptId: 999, visitId: 'mockVisitId' }).then(result => {
			expect(post).toHaveBeenCalledWith('/api/assessments/attempt/999/end', {
				visitId: 'mockVisitId'
			})
			expect(result).toEqual(mockJsonResult)
		})
	})

	test('reviewAttempt calls fetch', () => {
		expect.hasAssertions()

		return AssessmentAPI.reviewAttempt('mockAttemptIds', {}).then(result => {
			expect(post).toHaveBeenCalledWith('/api/assessments/attempt/review', {
				attemptIds: 'mockAttemptIds'
			})
			expect(result).toEqual(mockJsonResult)
		})
	})

	test('resendLTIAssessmentScore calls fetch', () => {
		expect.hasAssertions()

		post.mockResolvedValueOnce({
			json: () => ({
				status: 'ok',
				value: 'mockValue'
			})
		})

		return AssessmentAPI.resendLTIAssessmentScore({
			draftId: 'mockDraftId',
			assessmentId: 'mockAssessmentId',
			visitId: 'mockVisitId'
		}).then(result => {
			expect(post).toHaveBeenCalledWith('/api/lti/send-assessment-score', {
				draftId: 'mockDraftId',
				assessmentId: 'mockAssessmentId',
				visitId: 'mockVisitId'
			})

			expect(result).toEqual(mockJsonResult)
		})
	})

})
