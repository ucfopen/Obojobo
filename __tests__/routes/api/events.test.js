jest.mock('../../../models/draft')
jest.mock('../../../db')

let mockExpressMethods = {}
let mockRouterMethods = {}
let mockInsertNewDraft = mockVirtual('./routes/api/drafts/insert_new_draft')
let mockUpdateDraft = mockVirtual('./routes/api/drafts/update_draft')


let mockExpress = () => {
	jest.mock('express', () => {
		let module = () => {
			let methods = ['on', 'use', 'get', 'post', 'put', 'delete', 'all', 'static']
			let obj = {}
			methods.forEach(m => {
				obj[m] = mockExpressMethods[m]= jest.fn()
			})
			return obj
		}

		module.Router = () => {
			let methods = ['all', 'get', 'post', 'delete', 'put']
			let obj = {}
			methods.forEach(m => {
				obj[m] = mockRouterMethods[m] = jest.fn()
			})
			return obj
		}

		return module
	}, {virtual: true});
}


describe('api draft events route', () => {

	beforeAll(() => {})
	afterAll(() => {})
	beforeEach(() => {});
	afterEach(() => {});

	test('registers the expected routes ', () => {
		mockExpress()
		require('express')
		oboRequire('routes/api/events')
		expect(mockRouterMethods.post).toHaveBeenCalledTimes(1)
		expect(mockRouterMethods.post).toBeCalledWith('/', expect.any(Function))
	})

	test('requires current user', () => {
		expect.assertions(3)
		mockExpress()
		require('express')

		oboRequire('routes/api/events')
		let routeFunction = mockRouterMethods.post.mock.calls[0][1]

		let mockReq = {
			requireCurrentUser: () => { return Promise.reject('no current user')},
		}

		let mockRes = {
			unexpected: jest.fn(),
			notAuthorized: jest.fn()
		}

		let mockNext = jest.fn()

		return routeFunction(mockReq, mockRes, mockNext)
		.then(() => {
			expect(true).toBe('never called')
		})
		.catch(err => {
			console.log(err)
			expect(mockRes.notAuthorized).toBeCalledWith('no current user')
			expect(mockRes.unexpected).not.toBeCalled()
			expect(mockNext).toBeCalledWith()
		})
	})

	test('inserts event', () => {
		expect.assertions(2)
		mockExpress()
		require('express')
		let db = oboRequire('db')
		db.one.mockImplementationOnce(() => {return Promise.resolve({created_at: 1})})

		oboRequire('routes/api/events')
		let routeFunction = mockRouterMethods.post.mock.calls[0][1]

		let mockReq = {
			connection: {remoteAddress: 5},
			body: {
				event: {
					actor_time: 1,
					action: 'none',
					payload: 'none',
					draft_id: 88
				}
			},
			requireCurrentUser: () => { return Promise.resolve({id:5})},
		}

		let mockRes = {
			success: jest.fn()
		}

		let mockNext = jest.fn()

		return routeFunction(mockReq, mockRes, mockNext)
		.then(() => {
			expect(mockRes.success).toBeCalledWith({"createdAt": 1})
			expect(mockNext).toBeCalledWith()

		})
		.catch(err => {
			expect(err).toBe('never called')
			console.error(err)
		})
	})


	test('calls next when insert fails', () => {
		expect.assertions(2)
		mockExpress()
		require('express')
		let db = oboRequire('db')
		db.one.mockImplementationOnce(() => {return Promise.reject('db fail')})

		oboRequire('routes/api/events')
		let routeFunction = mockRouterMethods.post.mock.calls[0][1]

		let mockReq = {
			connection: {remoteAddress: 5},
			body: {
				event: {
					actor_time: 1,
					action: 'none',
					payload: 'none',
					draft_id: 88
				}
			},
			requireCurrentUser: () => { return Promise.resolve({id:5})},
		}

		let mockRes = {
			unexpected: jest.fn()
		}

		let mockNext = jest.fn()

		return routeFunction(mockReq, mockRes, mockNext)
		.then(() => {
			expect(mockRes.unexpected).toBeCalledWith("db fail")
			expect(mockNext).toBeCalledWith()
		})
		.catch(err => {
			expect(true).toBe('never called')
		})
	})

})
