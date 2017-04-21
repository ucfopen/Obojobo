jest.mock('../models/draft')

let mockExpressMethods = {}
let mockRouterMethods = {}


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


describe('lti route', () => {

	beforeAll(() => {})
	afterAll(() => {})
	beforeEach(() => {});
	afterEach(() => {});

	test('registers the expected routes ', () => {
		mockExpress()
		require('express')
		oboRequire('routes/viewer')
		expect(mockRouterMethods.all).toHaveBeenCalledTimes(2)
		expect(mockRouterMethods.all).toBeCalledWith('/example', expect.any(Function))
		expect(mockRouterMethods.all).toBeCalledWith('/:draftId*', expect.any(Function))
	})

	test('example calls next', () => {
		expect.assertions(2)

		mockExpress()
		require('express')
		oboRequire('routes/viewer')
		let routeFunction = mockRouterMethods.all.mock.calls[0][1]

		let mockReq = {
			app: {get: jest.fn()}
		}

		let mockRes = {
			status: jest.fn(),
			render: jest.fn(),
			send: jest.fn(),
			redirect: jest.fn()
		}

		let mockNext = jest.fn()

		routeFunction(mockReq, mockRes, mockNext)
		expect(mockRes.redirect).not.toBeCalled()
		expect(mockNext).toBeCalledWith()
	})

	test('example in dev redirects to view', () => {
		expect.assertions(1)

		mockExpress()
		let express = require('express')
		let editor = oboRequire('routes/viewer')
		let User = oboRequire('models/user')
		let routeFunction = mockRouterMethods.all.mock.calls[0][1]

		//  mock app.get('env') to reutrn 'development'
		let mockReq = {
			getCurrentUser: () => { return Promise.resolve(new User()) },
			app: {get: jest.fn().mockImplementationOnce(() => { return 'development'})}
		}

		let mockRes = {
			status: jest.fn(),
			render: jest.fn(),
			send: jest.fn(),
			redirect: jest.fn()
		}

		let mockNext = jest.fn()

		routeFunction(mockReq, mockRes, mockNext)
		expect(mockRes.redirect).toBeCalledWith('/view/00000000-0000-0000-0000-000000000000')
	})

	test('view draft rejects guest', () => {
		expect.assertions(2)

		mockExpress()
		let express = require('express')
		let editor = oboRequire('routes/viewer')
		let GuestUser = oboRequire('models/guest_user')
		let routeFunction = mockRouterMethods.all.mock.calls[1][1]

		let mockReq = {
			getCurrentUser: () => { return Promise.resolve(new GuestUser()) },
			app: {get: jest.fn().mockImplementationOnce(() => { return 'development'})}
		}

		let mockRes = {
			status: jest.fn(),
			render: jest.fn(),
			send: jest.fn(),
			redirect: jest.fn()
		}

		let mockNext = jest.fn()

		return routeFunction(mockReq, mockRes, mockNext)
		.then((result) => {
			expect(result).toBe('never called')
		})
		.catch(err => {
			expect(err).toBeInstanceOf(Error)
			expect(err.message).toBe('Login Required')
		})
	})


	test('view draft rejects guest', () => {
		expect.assertions(1)

		mockExpress()
		require('express')
		oboRequire('routes/viewer')
		let routeFunction = mockRouterMethods.all.mock.calls[1][1]

		let mockReq = {
			getCurrentUser: () => { return Promise.reject('not logged in') },
		}

		let mockRes = {
			status: jest.fn(),
			render: jest.fn(),
			send: jest.fn(),
			redirect: jest.fn()
		}

		let mockNext = jest.fn()

		return routeFunction(mockReq, mockRes, mockNext)
		.then((result) => {
			expect(result).toBe('never called')
		})
		.catch(err => {
			expect(err).toBe('not logged in')
		})
	})

	test('view draft calls render', () => {
		expect.assertions(2)

		mockExpress()
		require('express')
		oboRequire('routes/viewer')
		let DraftModel = oboRequire('models/draft')
		let User = oboRequire('models/user')
		let routeFunction = mockRouterMethods.all.mock.calls[1][1]

		let mockReq = {
			getCurrentUser: () => { return Promise.resolve(new User()) },
			params: {draftId: 555},
			app: {locals:{paths:'paths', modules:'modules'}}
			// getCurrentUser: () => { return Promise.reject('not logged in') },
		}

		let mockRes = {
			status: jest.fn(),
			render: jest.fn(),
			send: jest.fn(),
			redirect: jest.fn()
		}

		let mockNext = jest.fn()
		let mockYell = jest.fn().mockImplementationOnce(() => {
			return {
				document: `{"json":"value"}`,
				yell: jest.fn().mockImplementationOnce(() => {return 'fake draft'})
			}
		})

		DraftModel.__setMockYell(mockYell)

		return routeFunction(mockReq, mockRes, mockNext)
		.then((result) => {
			expect(mockYell).toBeCalled()
			expect(mockRes.render).toBeCalledWith(expect.any(String), expect.objectContaining({
				title: 'Obojobo 3',
				paths: 'paths',
				modules: 'modules',
				oboGlobals: expect.objectContaining({
					entries:{
						draft: `"{\"json\":\"value\"}"`,
						draftId: 555
					}
				})
			}))
		})
		.catch(err => {
			expect(err).toBe('never called')

		})
	})

	// test('index calls send', () => {
	// 	expect.assertions(1)

	// 	mockExpress()
	// 	let express = require('express')
	// 	let editor = oboRequire('routes/profile')
	// 	let User = oboRequire('models/user')
	// 	let routeFunction = mockRouterMethods.get.mock.calls[0][1]

	// 	let mockReq = {
	// 		getCurrentUser: () => { return Promise.resolve(new User()) }
	// 	}

	// 	let mockRes = {
	// 		status: jest.fn(),
	// 		render: jest.fn(),
	// 		send: jest.fn()
	// 	}

	// 	let mockNext = jest.fn()

	// 	return routeFunction(mockReq, mockRes, mockNext)
	// 	.then(() => {
	// 		expect(mockRes.send).toBeCalledWith("Hello guest!")
	// 	})

	// })

})
