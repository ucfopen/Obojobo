/* eslint no-extend-native: 0 */

const originalFetch = global.fetch
const originalToISOString = Date.prototype.toISOString
const API = require('../../../src/scripts/viewer/util/api')
import mockConsole from 'jest-mock-console'
let restoreConsole

describe('API', () => {
	let mockJsonResult
	let post
	let postMultiPart
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

		postMultiPart = jest.spyOn(API, 'postWithFormat')
		postMultiPart.mockResolvedValueOnce({
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

	test('post fetches with a non-object body', () => {
		post.mockRestore() // disable our mock
		API.post('mockEndpoint', 'mock-body')
		expect(fetch).toHaveBeenCalled()
		const calledEndpoint = fetch.mock.calls[0][0]
		const calledOptions = fetch.mock.calls[0][1]
		expect(calledEndpoint).toBe('mockEndpoint')
		expect(calledOptions).toEqual({
			body: '"mock-body"',
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

	test('postWithFormat fetches with the correct args', () => {
		postMultiPart.mockRestore() // disable our mock
		API.postWithFormat('mockEndpoint', '{"arg":"value"}', 'application/json')
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

	test('postWithFormat fetches with blank body', () => {
		postMultiPart.mockRestore() // disable our mock
		API.postWithFormat('mockEndpoint', null, 'application/json')
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

	test('processJsonResults logs json value on error', async () => {
		fetch.mockResolvedValueOnce({
			json: jest.fn().mockResolvedValueOnce({
				status: 'error',
				value: 'mockError'
			})
		})

		await API.postMultiPart('mock/endpoint')
		expect(fetch).toHaveBeenCalled()
		expect(console.error).toHaveBeenCalledWith('mockError') //eslint-disable-line no-console
	})

	test('postMultiPart calls fetch and returns json', async () => {
		fetch.mockResolvedValueOnce({
			json: jest.fn().mockResolvedValueOnce({ mediaId: 'mockMediaId' })
		})
		const response = await API.postMultiPart('mock/endpoint')
		expect(fetch).toHaveBeenCalled()
		expect(fetch.mock.calls[0][0]).toBe('mock/endpoint')
		expect(fetch.mock.calls[0][1]).toEqual({
			body: expect.anything(),
			credentials: 'include',
			method: 'POST'
		})
		expect(response).toEqual({ mediaId: 'mockMediaId' })
	})

	test('postMultiPart calls fetch with passed in formData', async () => {
		const mockFormData = new FormData()
		fetch.mockResolvedValueOnce({
			json: jest.fn().mockResolvedValueOnce({ mediaId: 'mockMediaId' })
		})
		const response = await API.postMultiPart('mock/endpoint', mockFormData)
		expect(fetch).toHaveBeenCalled()
		expect(fetch.mock.calls[0][0]).toBe('mock/endpoint')
		expect(fetch.mock.calls[0][1]).toEqual({
			body: mockFormData,
			credentials: 'include',
			method: 'POST'
		})
		expect(response).toEqual({ mediaId: 'mockMediaId' })
	})
})
