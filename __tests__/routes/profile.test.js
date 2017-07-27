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
		let express = require('express')
		let editor = oboRequire('routes/profile')
		expect(mockRouterMethods.get).toHaveBeenCalledTimes(1)
		expect(mockRouterMethods.get).toBeCalledWith('/', expect.any(Function))
	})

	test('index calls next', () => {
		expect.assertions(1)

		mockExpress()
		let express = require('express')
		let editor = oboRequire('routes/profile')
		let User = oboRequire('models/user')
		let routeFunction = mockRouterMethods.get.mock.calls[0][1]

		let mockReq = {
			getCurrentUser: () => { return Promise.resolve(new User()) }
		}

		let mockRes = {
			status: jest.fn(),
			render: jest.fn(),
			send: jest.fn()
		}

		let mockNext = jest.fn()

		return routeFunction(mockReq, mockRes, mockNext)
		.then(() => {
			expect(mockNext).toBeCalledWith()
		})

	})

	test('index calls send', () => {
		expect.assertions(1)

		mockExpress()
		let express = require('express')
		let editor = oboRequire('routes/profile')
		let User = oboRequire('models/user')
		let routeFunction = mockRouterMethods.get.mock.calls[0][1]

		let mockReq = {
			getCurrentUser: () => { return Promise.resolve(new User()) }
		}

		let mockRes = {
			status: jest.fn(),
			render: jest.fn(),
			send: jest.fn()
		}

		let mockNext = jest.fn()

		return routeFunction(mockReq, mockRes, mockNext)
		.then(() => {
			expect(mockRes.send).toBeCalledWith("Hello guest!")
		})

	})

})
