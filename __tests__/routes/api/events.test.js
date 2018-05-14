jest.mock('../../../models/draft')
jest.mock('../../../db')
const { mockExpressMethods, mockRouterMethods } = require('../../../__mocks__/__mock_express')

let mockInsertNewDraft = mockVirtual('./routes/api/drafts/insert_new_draft')

describe('api draft events route', () => {
	beforeAll(() => {})
	afterAll(() => {})
	beforeEach(() => {})
	afterEach(() => {})

	test('registers the expected routes ', () => {
		oboRequire('routes/api/events')
		expect(mockRouterMethods.post).toHaveBeenCalledTimes(1)
		expect(mockRouterMethods.post).toBeCalledWith('/', expect.any(Function))
	})

	test('requires current user', () => {
		expect.assertions(1)

		oboRequire('routes/api/events')
		let routeFunction = mockRouterMethods.post.mock.calls[0][1]

		let mockReq = {
			requireCurrentUser: () => Promise.reject('no current user')
		}

		let mockRes = {
			unexpected: jest.fn(),
			notAuthorized: jest.fn()
		}

		let mockNext = jest.fn()

		return routeFunction(mockReq, mockRes, mockNext)
			.then(() => {
				expect(mockRes.notAuthorized).toBeCalledWith('no current user')
			})
			.catch(err => {
				expect(true).toBe(false) // shouldn't get here
			})
	})

	test('inserts event', () => {
		expect.assertions(1)

		let db = oboRequire('db')
		db.one.mockResolvedValueOnce({ created_at: 1 })

		oboRequire('routes/api/events')
		let routeFunction = mockRouterMethods.post.mock.calls[0][1]

		let mockReq = {
			connection: { remoteAddress: 5 },
			body: {
				event: {
					actor_time: 1,
					action: 'none',
					payload: 'none',
					draft_id: 88
				}
			},
			requireCurrentUser: () => Promise.resolve({ id: 5 })
		}

		let mockRes = {
			success: jest.fn()
		}

		let mockNext = jest.fn()

		return routeFunction(mockReq, mockRes, mockNext)
			.then(() => {
				expect(mockRes.success).toBeCalledWith(null)
			})
			.catch(err => {
				expect(err).toBe('never called')
			})
	})

	test('calls res.unexpected when insert fails', () => {
		expect.assertions(1)

		let db = oboRequire('db')
		db.one.mockRejectedValueOnce('db fail')

		oboRequire('routes/api/events')
		let routeFunction = mockRouterMethods.post.mock.calls[0][1]

		let mockReq = {
			connection: { remoteAddress: 5 },
			body: {
				event: {
					actor_time: 1,
					action: 'none',
					payload: 'none',
					draft_id: 88
				}
			},
			requireCurrentUser: () => Promise.resolve({ id: 5 })
		}

		let mockRes = {
			unexpected: jest.fn()
		}

		let mockNext = jest.fn()

		return routeFunction(mockReq, mockRes, mockNext)
			.then(() => {
				expect(mockRes.unexpected).toBeCalledWith('db fail')
			})
			.catch(err => {
				expect(err).toBe('never called')
			})
	})
})
