jest.mock('../../db')

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
		let editor = oboRequire('routes/lti')
		expect(mockRouterMethods.get).toHaveBeenCalledTimes(2)
		expect(mockRouterMethods.get).toBeCalledWith('/', expect.any(Function))
		expect(mockRouterMethods.get).toBeCalledWith('/config.xml', expect.any(Function))
	})

	test('index calls next', () => {
		mockExpress()
		let express = require('express')
		let editor = oboRequire('routes/lti')
		let routeFunction = mockRouterMethods.get.mock.calls[0][1]

		let mockReq = {
			app:{
				locals:{
					paths:'test',
					modules:'test'
				},
				get: jest.fn()
			}
		}

		let mockRes = {
			status: jest.fn(),
			render: jest.fn()
		}

		let mockNext = jest.fn()

		routeFunction(mockReq, mockRes, mockNext)
		expect(mockNext).toBeCalledWith()
	})

	test('index calls render', () => {
		mockExpress()
		let express = require('express')
		let editor = oboRequire('routes/lti')
		let routeFunction = mockRouterMethods.get.mock.calls[0][1]

		let mockReq = {
			app:{
				locals:{
					paths:'test',
					modules:'test'
				},
				get: jest.fn()
			}
		}

		let mockRes = {
			status: jest.fn(),
			render: jest.fn()
		}

		let mockNext = jest.fn()

		routeFunction(mockReq, mockRes, mockNext)
		expect(mockRes.render).toBeCalledWith(expect.any(String), expect.any(Object))
	})

	test('config calls render', () => {
		mockExpress()
		let express = require('express')
		let editor = oboRequire('routes/lti')
		let routeFunction = mockRouterMethods.get.mock.calls[1][1]

		let mockReq = {
			app:{
				locals:{
					paths:'test',
					modules:'test'
				},
				get: jest.fn()
			}
		}

		let mockRes = {
			type: jest.fn(),
			status: jest.fn(),
			render: jest.fn()
		}

		let mockNext = jest.fn()

		routeFunction(mockReq, mockRes, mockNext)
		expect(mockRes.render).toBeCalledWith(expect.any(String), expect.any(Object))
	})

	test('config calls next', () => {
		mockExpress()
		let express = require('express')
		let editor = oboRequire('routes/lti')
		let routeFunction = mockRouterMethods.get.mock.calls[1][1]

		let mockReq = {
			app:{
				locals:{
					paths:'test',
					modules:'test'
				}
			}
		}

		let mockRes = {
			type: jest.fn(),
			status: jest.fn(),
			render: jest.fn()
		}

		let mockNext = jest.fn()

		routeFunction(mockReq, mockRes, mockNext)
		expect(mockNext).toBeCalledWith()
	})

	test('config sets response type to xml', () => {
		mockExpress()
		let express = require('express')
		let editor = oboRequire('routes/lti')
		let routeFunction = mockRouterMethods.get.mock.calls[1][1]

		let mockReq = {
			app:{
				locals:{
					paths:'test',
					modules:'test'
				}
			}
		}

		let mockRes = {
			type: jest.fn(),
			status: jest.fn(),
			render: jest.fn()
		}

		let mockNext = jest.fn()

		routeFunction(mockReq, mockRes, mockNext)
		expect(mockRes.type).toBeCalledWith('xml')
	})

})
