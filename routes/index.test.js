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


describe('index route', () => {

	beforeAll(() => {})
	afterAll(() => {})
	beforeEach(() => {});
	afterEach(() => {});

	test('registers the expected routes ', () => {
		mockExpress()
		let express = require('express')
		let editor = oboRequire('routes/index')
		expect(mockRouterMethods.get).toBeCalledWith('/', expect.any(Function))
	})

	test('calls next', () => {
		mockExpress()
		let express = require('express')
		let editor = oboRequire('routes/index')
		let routeFunction = mockRouterMethods.get.mock.calls[0][1]

		let mockReq = {
			app:{
				locals:{
					paths:'test',
					modules:'test'
				}
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

	test('renders the expected stuff', () => {
		mockExpress()
		let express = require('express')
		let editor = oboRequire('routes/index')
		let routeFunction = mockRouterMethods.get.mock.calls[0][1]

		let mockReq = {
			app:{
				locals:{
					paths:'test1',
					modules:'test2'
				}
			}
		}

		let mockRes = {
			status: jest.fn(),
			render: jest.fn()
		}

		let mockNext = jest.fn()

		routeFunction(mockReq, mockRes, mockNext)
		expect(mockRes.render).toBeCalledWith(expect.any(String), expect.objectContaining({
			title:"Obojobo 3"
		}))
	})


})
