global.fetch = jest.fn()

const originalToISOString = Date.prototype.toISOString

const APIUtil = require('../../../src/scripts/viewer/util/api-util').default

describe('apiutil', () => {
	beforeEach(() => {
		jest.resetAllMocks()
	})

	beforeAll(() => {
		Date.prototype.toISOString = () => 'mockDate'
		jest.spyOn(window.parent, 'postMessage')
	})
	afterAll(() => {
		Date.prototype.toISOString = originalToISOString
	})

	test('get fetches with the correct args', () => {
		APIUtil.get('mockEndpoint')

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
		APIUtil.post('mockEndpoint', { arg: 'value' })
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
		APIUtil.post('mockEndpoint')
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

	test('postEvent fetches with the correct args', () => {
		const obj = {
			draftId: 'mockDraftId',
			action: 'mockAction',
			eventVersion: 'mockEventVersion',
			visitId: 'mockVisitId'
		}

		fetch.mockResolvedValueOnce({
			json: () => ({
				status: 'ok',
				value: 'mockValue'
			})
		})

		return APIUtil.postEvent(obj).then(res => {
			expect(fetch).toHaveBeenCalled()
			const calledEndpoint = fetch.mock.calls[0][0]
			const calledOptions = fetch.mock.calls[0][1]

			expect(calledEndpoint).toBe('/api/events')

			expect(calledOptions).toEqual({
				body: expect.anything(),
				credentials: 'include',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json'
				},
				method: 'POST'
			})

			expect(JSON.parse(calledOptions.body)).toEqual({
				event: {
					action: 'mockAction',
					actor_time: 'mockDate',
					event_version: 'mockEventVersion',
					payload: {}
				},
				visitId: 'mockVisitId'
			})
		})
	})

	test('postEvent sends a postmessage when status is ok', () => {
		expect.assertions(2)

		fetch.mockResolvedValueOnce({
			json: () => ({
				status: 'ok',
				value: 'mockValue'
			})
		})

		return APIUtil.postEvent({
			draftId: 'mockDraftId',
			action: 'mockAction',
			eventVersion: 'eventVersion',
			payload: 'mockPayload'
		}).then(() => {
			expect(fetch).toHaveBeenCalled()
			expect(window.parent.postMessage).toHaveBeenCalledWith('mockValue', '*')
		})
	})

	test('postEvent doesnt send a postmessage when status is error', () => {
		expect.assertions(2)

		fetch.mockResolvedValueOnce({
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
			expect(fetch).toHaveBeenCalled()
			expect(window.parent.postMessage).not.toHaveBeenCalled()
		})
	})

	test('getDraft calls fetch', () => {
		expect.assertions(3)

		fetch.mockResolvedValueOnce({
			json: () => ({
				status: 'ok',
				value: 'mockValue'
			})
		})

		return APIUtil.getDraft('mockId').then(res => {
			expect(fetch).toHaveBeenCalled()
			const calledEndpoint = fetch.mock.calls[0][0]
			const calledOptions = fetch.mock.calls[0][1]
			expect(calledEndpoint).toBe('/api/drafts/mockId')
			expect(calledOptions).toBe()
		})
	})

	test('requestStart calls fetch', () => {
		expect.assertions(4)

		fetch.mockResolvedValueOnce({
			json: () => ({
				status: 'ok',
				value: 'mockValue'
			})
		})

		return APIUtil.requestStart({ visitId: 'mockVisitId' }).then(() => {
			expect(fetch).toHaveBeenCalled()
			const calledEndpoint = fetch.mock.calls[0][0]
			const calledOptions = fetch.mock.calls[0][1]
			expect(calledEndpoint).toBe('/api/visits/start')
			expect(calledOptions).toEqual({
				body: expect.anything(),
				credentials: 'include',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json'
				},
				method: 'POST'
			})

			expect(JSON.parse(calledOptions.body)).toEqual({
				visitId: 'mockVisitId'
			})
		})
	})

	test('startAttempt calls fetch', () => {
		expect.assertions(4)

		fetch.mockResolvedValueOnce({
			json: () => ({
				status: 'ok',
				value: 'mockValue'
			})
		})

		return APIUtil.startAttempt({
			draftId: 'mockDraftId',
			assessmentId: 'mockAssessmentId',
			visitId: 'mockVisitId'
		}).then(res => {
			expect(fetch).toHaveBeenCalled()
			const calledEndpoint = fetch.mock.calls[0][0]
			const calledOptions = fetch.mock.calls[0][1]
			expect(calledEndpoint).toBe('/api/assessments/attempt/start')
			expect(calledOptions).toEqual({
				body: expect.anything(),
				credentials: 'include',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json'
				},
				method: 'POST'
			})

			expect(JSON.parse(calledOptions.body)).toEqual({
				assessmentId: 'mockAssessmentId',
				visitId: 'mockVisitId'
			})
		})
	})

	test('endAttempt calls fetch', () => {
		expect.assertions(4)

		fetch.mockResolvedValueOnce({
			json: () => ({
				status: 'ok',
				value: 'mockValue'
			})
		})

		return APIUtil.endAttempt({ attemptId: 999, visitId: 'mockVisitId' }).then(() => {
			expect(fetch).toHaveBeenCalled()
			const calledEndpoint = fetch.mock.calls[0][0]
			const calledOptions = fetch.mock.calls[0][1]
			expect(calledEndpoint).toBe('/api/assessments/attempt/999/end')
			expect(calledOptions).toEqual({
				body: expect.anything(),
				credentials: 'include',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json'
				},
				method: 'POST'
			})
			expect(JSON.parse(calledOptions.body)).toEqual({
				visitId: 'mockVisitId'
			})
		})
	})

	test('resendLTIAssessmentScore calls fetch', () => {
		expect.assertions(4)

		fetch.mockResolvedValueOnce({
			json: () => ({
				status: 'ok',
				value: 'mockValue'
			})
		})

		return APIUtil.resendLTIAssessmentScore({
			draftId: 'mockDraftId',
			assessmentId: 'mockAssessmentId',
			visitId: 'mockVisitId'
		}).then(() => {
			expect(fetch).toHaveBeenCalled()
			const calledEndpoint = fetch.mock.calls[0][0]
			const calledOptions = fetch.mock.calls[0][1]
			expect(calledEndpoint).toBe('/api/lti/sendAssessmentScore')
			expect(calledOptions).toEqual({
				body: expect.anything(),
				credentials: 'include',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json'
				},
				method: 'POST'
			})
			expect(JSON.parse(calledOptions.body)).toEqual({
				assessmentId: 'mockAssessmentId',
				visitId: 'mockVisitId'
			})
		})
	})

	test('clearPreviewScores calls fetch', () => {
		expect.assertions(4)

		fetch.mockResolvedValueOnce({
			json: () => ({
				status: 'ok',
				value: 'mockValue'
			})
		})

		return APIUtil.clearPreviewScores('mockVisitId').then(() => {
			expect(fetch).toHaveBeenCalled()
			const calledEndpoint = fetch.mock.calls[0][0]
			const calledOptions = fetch.mock.calls[0][1]
			expect(calledEndpoint).toBe('/api/assessments/clear-preview-scores')
			expect(calledOptions).toEqual({
				body: expect.anything(),
				credentials: 'include',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json'
				},
				method: 'POST'
			})
			expect(JSON.parse(calledOptions.body)).toEqual({
				visitId: 'mockVisitId'
			})
		})
	})

	test('requestStart handles json parsing error', () => {
		expect.assertions(1)

		fetch.mockResolvedValueOnce({
			json: () => {
				throw 'json parsing error'
			}
		})

		return APIUtil.requestStart(10, 20).catch(err => {
			expect(err).toBe('json parsing error')
		})
	})
})
