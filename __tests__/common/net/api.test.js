const mockAddEventListener = jest.fn()
const mockOpen = jest.fn()
const mockSend = jest.fn()

const mockXMLHttpRequest = jest.fn()
mockXMLHttpRequest.prototype.open = mockOpen
mockXMLHttpRequest.prototype.send = mockSend
mockXMLHttpRequest.prototype.addEventListener = mockAddEventListener

let originalXMLHttpRequest
const API = require('../../../src/scripts/common/net/api').default

describe('Net API', () => {
	beforeAll(() => {
		window.XMLHttpRequest = mockXMLHttpRequest
	})
	afterAll(() => {
		window.XMLHttpRequest = originalXMLHttpRequest
	})
	beforeEach(() => {
		jest.resetAllMocks()
	})
	afterEach(() => {})

	test('has expected properties', () => {
		expect(API).toHaveProperty('module', {})
		expect(API).toHaveProperty('chunk', {})
		expect(API.module).toHaveProperty('get', expect.any(Function))
		expect(API.chunk).toHaveProperty('move', expect.any(Function))
	})

	test('APIModule get makes expected request and executes callback', () => {
		const callback = jest.fn()
		API.module.get('mockId', callback)

		expect(mockAddEventListener).toHaveBeenCalledWith('load', expect.any(Function))
		expect(mockOpen).toHaveBeenCalledWith('GET', '/api/draft/mockId/chunks', true)
		expect(mockSend).toHaveBeenCalledWith(null)

		const internalCallback = mockAddEventListener.mock.calls[0][1]
		internalCallback({
			target: {
				responseText: '{"mock":"mockResponseText"}'
			}
		})

		expect(callback).toHaveBeenCalledWith({
			chunks: {
				mock: 'mockResponseText'
			},
			id: 'mockId'
		})
	})

	test('APIChunk move makes expected request and executes callback', () => {
		const callback = jest.fn()
		const chunkMoved = {
			get: jest.fn(() => 'movedId')
		}
		const chunkBefore = {
			get: jest.fn(() => 'beforeId')
		}
		API.chunk.move(chunkMoved, chunkBefore, callback)

		expect(mockAddEventListener).toHaveBeenCalledWith('load', expect.any(Function))
		expect(mockOpen).toHaveBeenCalledWith('POST', '/api/chunk/movedId/move_before', true)
		expect(mockSend).toHaveBeenCalledWith('before_chunk_id=beforeId')

		const internalCallback = mockAddEventListener.mock.calls[0][1]
		internalCallback('callbackArg')

		expect(callback).toHaveBeenCalledWith('callbackArg')
	})

	test('APIChunk with null values', () => {
		const chunkMoved = {
			get: jest.fn(() => 'movedId')
		}
		const chunkBefore = {
			get: jest.fn(() => 'beforeId')
		}

		mockAddEventListener.mockImplementationOnce((name, callback) => {
			return callback()
		})

		API.chunk.move(chunkMoved, null, null)

		expect(mockAddEventListener).toHaveBeenCalledWith('load', expect.any(Function))
		expect(mockOpen).toHaveBeenCalledWith('POST', '/api/chunk/movedId/move_before', true)
		expect(mockSend).toHaveBeenCalledWith('before_chunk_id=null')
	})
})
