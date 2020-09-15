/* eslint no-extend-native: 0 */

const originalFetch = global.fetch
const originalSendBeacon = navigator.sendBeacon
const originalToISOString = Date.prototype.toISOString
const ViewerAPI = require('../../../src/scripts/viewer/util/viewer-api').default
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
		navigator.sendBeacon = jest.fn()
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
		navigator.sendBeacon = originalSendBeacon
		global.fetch = originalFetch
		Date.prototype.toISOString = originalToISOString
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

		return ViewerAPI.postEvent({
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

		return ViewerAPI.postEvent({
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

		return ViewerAPI.postEvent({
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

		return ViewerAPI.postEvent({
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

		return ViewerAPI.postEvent({
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

		return ViewerAPI.postEvent({
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

		return ViewerAPI.getDraft('mockId').then(result => {
			expect(get).toHaveBeenCalledWith('/api/drafts/mockId', 'json')
			expect(result).toEqual(mockJsonResult)
		})
	})

	test('requestStart calls fetch', () => {
		expect.hasAssertions()

		return ViewerAPI.requestStart('mockVisitId', 'mockDraftId').then(result => {
			expect(post).toHaveBeenCalledWith('/api/visits/start', {
				draftId: 'mockDraftId',
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

		return ViewerAPI.clearPreviewScores({
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

		return ViewerAPI.requestStart(10, 20).catch(err => {
			expect(err).toBe('json parsing error')
		})
	})

	test('getVisitSessionStatus calls fetch and returns', async () => {
		expect.hasAssertions()

		return ViewerAPI.getVisitSessionStatus('mock-draft-id').then(result => {
			expect(get).toHaveBeenCalledWith('/api/visits/mock-draft-id/status', 'json')
			expect(result).toEqual(mockJsonResult)
		})
	})

	test('postEventBeacon sends navigator beacon', () => {
		expect.hasAssertions()

		const args = {
			draftId: 'mock-draft-id',
			action: 'mock-action',
			eventVersion: 'mock-event-version',
			visitId: 'mock-visit-id',
			payload: {
				someData: false
			}
		}
		ViewerAPI.postEventBeacon(args)
		expect(navigator.sendBeacon).toHaveBeenCalledTimes(1)
		expect(navigator.sendBeacon.mock.calls[0]).toMatchInlineSnapshot(`
		Array [
		  "/api/events",
		  "{\\"draftId\\":\\"mock-draft-id\\",\\"visitId\\":\\"mock-visit-id\\",\\"event\\":{\\"action\\":\\"mock-action\\",\\"draft_id\\":\\"mock-draft-id\\",\\"actor_time\\":\\"mockDate\\",\\"event_version\\":\\"mock-event-version\\",\\"visitId\\":\\"mock-visit-id\\",\\"payload\\":{\\"someData\\":false}}}",
		]
	`)
	})

	test('postEventBeacon provides a default payload', () => {
		expect.hasAssertions()

		const args = {
			draftId: 'mock-draft-id',
			action: 'mock-action',
			eventVersion: 'mock-event-version',
			visitId: 'mock-visit-id'
		}
		ViewerAPI.postEventBeacon(args)
		expect(navigator.sendBeacon).toHaveBeenCalledTimes(1)
		expect(navigator.sendBeacon.mock.calls[0]).toMatchInlineSnapshot(`
		Array [
		  "/api/events",
		  "{\\"draftId\\":\\"mock-draft-id\\",\\"visitId\\":\\"mock-visit-id\\",\\"event\\":{\\"action\\":\\"mock-action\\",\\"draft_id\\":\\"mock-draft-id\\",\\"actor_time\\":\\"mockDate\\",\\"event_version\\":\\"mock-event-version\\",\\"visitId\\":\\"mock-visit-id\\",\\"payload\\":{}}}",
		]
	`)
	})
})
