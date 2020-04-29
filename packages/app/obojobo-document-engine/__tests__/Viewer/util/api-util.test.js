/* eslint no-extend-native: 0 */

const originalFetch = global.fetch
const originalToISOString = Date.prototype.toISOString
const APIUtil = require('../../../src/scripts/viewer/util/api-util')
const API = require('../../../src/scripts/viewer/util/api')
import mockConsole from 'jest-mock-console'
let restoreConsole

describe('apiutil', () => {
	let mockJsonResult
	let post
	let postWithFormat
	let deleteMethod
	let get

	beforeEach(() => {
		jest.clearAllMocks()
		jest.restoreAllMocks()
		restoreConsole = mockConsole('error')
		jest.spyOn(window.parent, 'postMessage')

		mockJsonResult = {}
		post = jest.spyOn(API, 'post')
		post.mockResolvedValueOnce({
			json: () => mockJsonResult,
			text: () => JSON.stringify(mockJsonResult)
		})

		get = jest.spyOn(API, 'get')
		get.mockResolvedValueOnce({
			json: () => mockJsonResult,
			text: () => JSON.stringify(mockJsonResult)
		})

		postWithFormat = jest.spyOn(API, 'postWithFormat')
		postWithFormat.mockResolvedValueOnce({
			json: () => mockJsonResult,
			text: () => JSON.stringify(mockJsonResult)
		})

		deleteMethod = jest.spyOn(API, 'delete')
		deleteMethod.mockResolvedValueOnce({
			json: () => mockJsonResult,
			text: () => JSON.stringify(mockJsonResult)
		})
	})

	afterEach(() => {
		restoreConsole()
	})

	beforeAll(() => {
		global.fetch = jest.fn()
		Date.prototype.toISOString = () => 'mockDate'
	})
	afterAll(() => {
		global.fetch = originalFetch
		Date.prototype.toISOString = originalToISOString
	})

	test('get fetches with the correct args', () => {
		get.mockRestore() // disable our mock
		API.get('mockEndpoint', 'json')

		expect(fetch).toHaveBeenCalled()
		const calledEndpoint = fetch.mock.calls[0][0]
		const calledOptions = fetch.mock.calls[0][1]
		expect(calledEndpoint).toBe('mockEndpoint')
		expect(calledOptions).toEqual({
			credentials: 'include',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			method: 'GET'
		})
	})

	test('post fetches with the correct args', () => {
		post.mockRestore() // disable our mock
		API.post('mockEndpoint', { arg: 'value' })
		expect(fetch).toHaveBeenCalled()
		const calledEndpoint = fetch.mock.calls[0][0]
		const calledOptions = fetch.mock.calls[0][1]
		expect(calledEndpoint).toBe('mockEndpoint')
		expect(calledOptions).toEqual({
			body: JSON.stringify({ arg: 'value' }),
			credentials: 'include',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			method: 'POST'
		})
	})

	test('post fetches with blank body', () => {
		post.mockRestore() // disable our mock
		API.post('mockEndpoint')
		expect(fetch).toHaveBeenCalled()
		const calledEndpoint = fetch.mock.calls[0][0]
		const calledOptions = fetch.mock.calls[0][1]
		expect(calledEndpoint).toBe('mockEndpoint')
		expect(calledOptions).toEqual({
			body: JSON.stringify({}),
			credentials: 'include',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			method: 'POST'
		})
	})

	test('delete fetches with the correct args', () => {
		deleteMethod.mockRestore() // disable our mock
		API.delete('mockEndpoint', 'json')

		expect(fetch).toHaveBeenCalled()
		const calledEndpoint = fetch.mock.calls[0][0]
		const calledOptions = fetch.mock.calls[0][1]
		expect(calledEndpoint).toBe('mockEndpoint')
		expect(calledOptions).toEqual({
			credentials: 'include',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			method: 'DELETE'
		})
	})

	test('postEvent fetches with the correct args', () => {
		expect.hasAssertions()

		post.mockReset()
		post.mockResolvedValueOnce({
			json: () => ({
				status: 'ok',
				value: 'mockValue'
			})
		})

		return APIUtil.postEvent({
			draftId: 'mockDraftId',
			action: 'mockAction',
			eventVersion: 'eventVersion',
			visitId: 'mockVisitId',
			payload: 'mockPayload'
		}).then(() => {
			expect(post).toHaveBeenCalledWith('/api/events', {
				draftId: 'mockDraftId',
				visitId: 'mockVisitId',
				event: {
					action: 'mockAction',
					draft_id: 'mockDraftId',
					actor_time: 'mockDate',
					event_version: 'eventVersion',
					visitId: 'mockVisitId',
					payload: 'mockPayload'
				}
			})
		})
	})

	test('postEvent provides a default payload', () => {
		expect.hasAssertions()

		post.mockReset()
		post.mockResolvedValueOnce({
			json: () => ({
				status: 'ok',
				value: 'mockValue'
			})
		})

		return APIUtil.postEvent({
			draftId: 'mockDraftId',
			action: 'mockAction',
			eventVersion: 'eventVersion',
			visitId: 'mockVisitId'
		}).then(() => {
			expect(post).toHaveBeenCalledWith('/api/events', {
				draftId: 'mockDraftId',
				visitId: 'mockVisitId',
				event: {
					action: 'mockAction',
					draft_id: 'mockDraftId',
					actor_time: 'mockDate',
					event_version: 'eventVersion',
					visitId: 'mockVisitId',
					payload: {}
				}
			})
		})
	})

	test('postEvent posts with the correct args', () => {
		expect.hasAssertions()

		post.mockReset()
		post.mockResolvedValueOnce({
			json: () => ({
				status: 'ok',
				value: 'mockValue'
			})
		})

		return APIUtil.postEvent({
			draftId: 'mockDraftId',
			action: 'mockAction',
			eventVersion: 'eventVersion',
			visitId: 'mockVisitId',
			payload: 'mockPayload'
		}).then(() => {
			expect(post).toHaveBeenCalledWith('/api/events', {
				draftId: 'mockDraftId',
				visitId: 'mockVisitId',
				event: {
					action: 'mockAction',
					draft_id: 'mockDraftId',
					actor_time: 'mockDate',
					event_version: 'eventVersion',
					visitId: 'mockVisitId',
					payload: 'mockPayload'
				}
			})
		})
	})

	test('postEvent sends a postmessage when status is ok', () => {
		expect.hasAssertions()

		post.mockReset()
		post.mockResolvedValueOnce({
			json: () => ({
				status: 'ok',
				value: 'mockValue'
			})
		})

		return APIUtil.postEvent({
			draftId: 'mockDraftId',
			action: 'mockAction',
			eventVersion: 'eventVersion',
			visitId: 'mockVisitId',
			payload: 'mockPayload'
		}).then(() => {
			expect(post).toHaveBeenCalled()

			expect(window.parent.postMessage).toHaveBeenCalledWith('mockValue', '*')
		})
	})

	test('postEvent skips a postmessage when status is not ok', () => {
		expect.hasAssertions()

		post.mockReset()
		post.mockResolvedValueOnce({
			json: () => ({
				status: 'not-ok',
				value: 'mockValue'
			})
		})

		return APIUtil.postEvent({
			draftId: 'mockDraftId',
			action: 'mockAction',
			eventVersion: 'eventVersion',
			visitId: 'mockVisitId',
			payload: 'mockPayload'
		}).then(() => {
			expect(post).toHaveBeenCalled()

			expect(window.parent.postMessage).not.toHaveBeenCalledWith('mockValue', '*')
		})
	})

	test('postEvent doesnt send a postmessage when status is error', () => {
		expect.hasAssertions()

		post.mockResolvedValueOnce({
			json: () => ({
				status: 'error',
				value: 'mockValue'
			})
		})

		return APIUtil.postEvent({
			draftId: 'mockDraftId',
			action: 'mockAction',
			eventVersion: 'eventVersion',
			payload: 'mockPayload'
		}).then(() => {
			expect(post).toHaveBeenCalled()
			expect(window.parent.postMessage).not.toHaveBeenCalled()
		})
	})

	test('getDraft calls fetch', () => {
		expect.hasAssertions()

		return APIUtil.getDraft('mockId').then(result => {
			expect(get).toHaveBeenCalledWith('/api/drafts/mockId', 'json')
			expect(result).toEqual(mockJsonResult)
		})
	})

	test('getFullDraft calls fetch', () => {
		expect.hasAssertions()

		return APIUtil.getFullDraft('mockId').then(result => {
			expect(get).toHaveBeenCalledWith('/api/drafts/mockId/full', 'json')
			expect(result).toEqual(JSON.stringify(mockJsonResult))
		})
	})

	test('requestStart calls fetch', () => {
		expect.hasAssertions()

		return APIUtil.requestStart('mockVisitId', 'mockDraftId').then(result => {
			expect(post).toHaveBeenCalledWith('/api/visits/start', {
				draftId: 'mockDraftId',
				visitId: 'mockVisitId'
			})
			expect(result).toEqual(mockJsonResult)
		})
	})

	test('startAttempt calls fetch', () => {
		expect.hasAssertions()

		return APIUtil.startAttempt({
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

		return APIUtil.resumeAttempt({ attemptId: 999 }).then(result => {
			expect(post).toHaveBeenCalledWith('/api/assessments/attempt/999/resume', { attemptId: 999 })
			expect(result).toEqual(mockJsonResult)
		})
	})

	test('endAttempt calls fetch', () => {
		expect.hasAssertions()

		return APIUtil.endAttempt({ attemptId: 999, visitId: 'mockVisitId' }).then(result => {
			expect(post).toHaveBeenCalledWith('/api/assessments/attempt/999/end', {
				visitId: 'mockVisitId'
			})
			expect(result).toEqual(mockJsonResult)
		})
	})

	test('reviewAttempt calls fetch', () => {
		expect.hasAssertions()
		mockJsonResult = [
			{
				attemptId: 'mock-attempt-id',
				questions: [
					{
						id: 'mock-question-id'
					}
				]
			},
			{
				attemptId: 'mock-attempt-id2',
				questions: [{ id: 'mock-question-id-2' }, { id: 'mock-question-id-3' }]
			}
		]

		return APIUtil.reviewAttempt('mockAttemptIds', {}).then(result => {
			expect(post).toHaveBeenCalledWith('/api/assessments/attempt/review', {
				attemptIds: 'mockAttemptIds'
			})

			expect(result).toEqual({
				'mock-attempt-id': { 'mock-question-id': { id: 'mock-question-id' } },
				'mock-attempt-id2': {
					'mock-question-id-2': { id: 'mock-question-id-2' },
					'mock-question-id-3': { id: 'mock-question-id-3' }
				}
			})
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

		return APIUtil.resendLTIAssessmentScore({
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

	test('clearPreviewScores calls post', () => {
		expect.hasAssertions()

		post.mockResolvedValueOnce({
			json: () => ({
				status: 'ok',
				value: 'mockValue'
			})
		})

		return APIUtil.clearPreviewScores({
			draftId: 'mockDraftId',
			visitId: 'mockVisitId'
		}).then(result => {
			expect(post).toHaveBeenCalledWith('/api/assessments/clear-preview-scores', {
				draftId: 'mockDraftId',
				visitId: 'mockVisitId'
			})

			expect(result).toEqual(mockJsonResult)
		})
	})

	test('requestStart handles json parsing error', () => {
		expect.hasAssertions()

		post.mockReset()
		post.mockResolvedValueOnce({
			json: () => {
				throw 'json parsing error'
			}
		})

		return APIUtil.requestStart(10, 20).catch(err => {
			expect(err).toBe('json parsing error')
		})
	})

	test('postDraft calls fetch', () => {
		expect.hasAssertions()

		post.mockResolvedValueOnce({
			json: () => ({
				status: 'ok',
				value: 'mockValue'
			})
		})

		return APIUtil.postDraft('mockDraftId', {}).then(result => {
			expect(postWithFormat).toHaveBeenCalledWith('/api/drafts/mockDraftId', {}, 'application/json')

			expect(result).toEqual(mockJsonResult)
		})
	})

	test('processJsonResults logs json value on error', () => {
		expect.hasAssertions()

		postWithFormat.mockReset()
		postWithFormat.mockResolvedValueOnce({
			json: () => ({
				status: 'error',
				value: 'mockError'
			})
		})

		return APIUtil.postDraft('mockDraftId', {}).then(() => {
			expect(postWithFormat).toHaveBeenCalledWith('/api/drafts/mockDraftId', {}, 'application/json')
			expect(console.error).toHaveBeenCalledWith('mockError') //eslint-disable-line no-console
		})
	})

	test('getVisitSessionStatus calls fetch and returns', async () => {
		expect.hasAssertions()

		return APIUtil.getVisitSessionStatus('mock-draft-id').then(result => {
			expect(get).toHaveBeenCalledWith('/api/visits/mock-draft-id/status', 'json')
			expect(result).toEqual(mockJsonResult)
		})
	})

	test('createNewDraft calls fetch and returns', () => {
		expect.hasAssertions()

		return APIUtil.createNewDraft('mock_content', 'mock_format').then(result => {
			expect(post).toHaveBeenCalledWith('/api/drafts/new', {
				content: 'mock_content',
				format: 'mock_format'
			})
			expect(result).toEqual(mockJsonResult)
		})
	})

	test('deleteDraft calls fetch and returns', async () => {
		expect.hasAssertions()

		return APIUtil.deleteDraft('mock-draft-id').then(result => {
			expect(deleteMethod).toHaveBeenCalledWith('/api/drafts/mock-draft-id')
			expect(result).toEqual(mockJsonResult)
		})
	})

	test('getAllDrafts calls fetch and returns', async () => {
		expect.hasAssertions()

		return APIUtil.getAllDrafts('mock-draft-id').then(result => {
			expect(get).toHaveBeenCalledWith('/api/drafts', 'json')
			expect(result).toEqual(mockJsonResult)
		})
	})
})
