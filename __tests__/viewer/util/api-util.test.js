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
		let calledEndpoint = fetch.mock.calls[0][0]
		let calledOptions = fetch.mock.calls[0][1]
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
		let calledEndpoint = fetch.mock.calls[0][0]
		let calledOptions = fetch.mock.calls[0][1]
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

	test('postEvent fetches with the correct args', () => {
		let lo = {
			get: requestedProp => requestedProp // this will just return the prop as the value
		}

		fetch.mockResolvedValueOnce({
			json: () => ({
				status: 'ok',
				value: 'mockValue'
			})
		})

		return APIUtil.postEvent(lo, 'mockAction', 'eventVersion', 'mockPayload').then(res => {
			expect(fetch).toHaveBeenCalled()
			let calledEndpoint = fetch.mock.calls[0][0]
			let calledOptions = fetch.mock.calls[0][1]
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
					draft_id: 'draftId',
					event_version: 'eventVersion',
					payload: 'mockPayload'
				}
			})
		})
	})

	test('postEvent sends a postmessage when status is ok', () => {
		expect.assertions(2)
		let lo = {
			get: requestedProp => requestedProp // this will just return the prop as the value
		}

		fetch.mockResolvedValueOnce({
			json: () => ({
				status: 'ok',
				value: 'mockValue'
			})
		})

		return APIUtil.postEvent(lo, 'mockAction', 'eventVersion', 'mockPayload').then(res => {
			expect(fetch).toHaveBeenCalled()
			expect(window.parent.postMessage).toHaveBeenCalledWith('mockValue', '*')
		})
	})

	test('postEvent doesnt send a postmessage when status is error', () => {
		expect.assertions(2)
		let lo = {
			get: requestedProp => requestedProp // this will just return the prop as the value
		}

		fetch.mockResolvedValueOnce({
			json: () => ({
				status: 'error',
				value: 'mockValue'
			})
		})

		return APIUtil.postEvent(lo, 'mockAction', 'eventVersion', 'mockPayload').then(res => {
			expect(fetch).toHaveBeenCalled()
			expect(window.parent.postMessage).not.toHaveBeenCalled()
		})
	})

	test('saveState calls postEvent', () => {
		let lo = {
			get: requestedProp => requestedProp // this will just return the prop as the value
		}

		fetch.mockResolvedValueOnce({
			json: () => ({
				status: 'error',
				value: 'mockValue'
			})
		})

		// mock this result so we can assure that saveState returns it's value
		jest.spyOn(APIUtil, 'postEvent').mockReturnValueOnce('postEventResult')

		let res = APIUtil.saveState(lo, 'mockState')
		expect(APIUtil.postEvent).toHaveBeenCalledWith(lo, 'saveState', 'mockState')
		expect(res).toBe('postEventResult')
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
			let calledEndpoint = fetch.mock.calls[0][0]
			let calledOptions = fetch.mock.calls[0][1]
			expect(calledEndpoint).toBe('/api/drafts/mockId')
			expect(calledOptions).toBe()
		})
	})

	test('getAttempts calls fetch', () => {
		expect.assertions(3)
		let lo = {
			get: requestedProp => requestedProp // this will just return the prop as the value
		}
		fetch.mockResolvedValueOnce({
			json: () => ({
				status: 'ok',
				value: 'mockValue'
			})
		})

		return APIUtil.getAttempts(lo).then(res => {
			expect(fetch).toHaveBeenCalled()
			let calledEndpoint = fetch.mock.calls[0][0]
			let calledOptions = fetch.mock.calls[0][1]
			expect(calledEndpoint).toBe('/api/drafts/draftId/attempts')
			expect(calledOptions).toEqual({
				credentials: 'include',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json'
				},
				method: 'GET'
			})
		})
	})

	test('requestStart calls fetch', () => {
		expect.assertions(4)
		let lo = {
			get: requestedProp => requestedProp // this will just return the prop as the value
		}
		fetch.mockResolvedValueOnce({
			json: () => ({
				status: 'ok',
				value: 'mockValue'
			})
		})

		return APIUtil.requestStart('mockVisitId', 'mockDraftId').then(res => {
			expect(fetch).toHaveBeenCalled()
			let calledEndpoint = fetch.mock.calls[0][0]
			let calledOptions = fetch.mock.calls[0][1]
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
				draftId: 'mockDraftId',
				visitId: 'mockVisitId'
			})
		})
	})

	test('startAttempt calls fetch', () => {
		expect.assertions(4)
		let lo = {
			get: requestedProp => requestedProp // this will just return the prop as the value
		}
		let assessment = {
			get: prop => prop
		}
		fetch.mockResolvedValueOnce({
			json: () => ({
				status: 'ok',
				value: 'mockValue'
			})
		})

		return APIUtil.startAttempt(lo, assessment).then(res => {
			expect(fetch).toHaveBeenCalled()
			let calledEndpoint = fetch.mock.calls[0][0]
			let calledOptions = fetch.mock.calls[0][1]
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
				assessmentId: 'id',
				draftId: 'draftId'
			})
		})
	})

	test('endAttempt calls fetch', () => {
		expect.assertions(3)
		fetch.mockResolvedValueOnce({
			json: () => ({
				status: 'ok',
				value: 'mockValue'
			})
		})

		return APIUtil.endAttempt({ attemptId: 999 }).then(res => {
			expect(fetch).toHaveBeenCalled()
			let calledEndpoint = fetch.mock.calls[0][0]
			let calledOptions = fetch.mock.calls[0][1]
			expect(calledEndpoint).toBe('/api/assessments/attempt/999/end')
			expect(calledOptions).toEqual({
				body: '{}',
				credentials: 'include',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json'
				},
				method: 'POST'
			})
		})
	})

	test('resendLTIAssessmentScore calls fetch', () => {
		expect.assertions(4)
		let lo = {
			get: requestedProp => requestedProp // this will just return the prop as the value
		}
		let assessment = {
			get: prop => prop
		}
		fetch.mockResolvedValueOnce({
			json: () => ({
				status: 'ok',
				value: 'mockValue'
			})
		})

		return APIUtil.resendLTIAssessmentScore(lo, assessment).then(res => {
			expect(fetch).toHaveBeenCalled()
			let calledEndpoint = fetch.mock.calls[0][0]
			let calledOptions = fetch.mock.calls[0][1]
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
				assessmentId: 'id',
				draftId: 'draftId'
			})
		})
	})

	test('clearPreviewScores calls fetch', () => {
		expect.assertions(4)
		let assessment = {
			get: prop => prop
		}
		fetch.mockResolvedValueOnce({
			json: () => ({
				status: 'ok',
				value: 'mockValue'
			})
		})

		return APIUtil.clearPreviewScores('mockDraftId').then(res => {
			expect(fetch).toHaveBeenCalled()
			let calledEndpoint = fetch.mock.calls[0][0]
			let calledOptions = fetch.mock.calls[0][1]
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
				draftId: 'mockDraftId'
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
