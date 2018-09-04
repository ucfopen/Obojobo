jest.mock('../../db')
const { mockExpressMethods, mockRouterMethods } = require('../../__mocks__/__mock_express')

describe('lti route', () => {
	beforeAll(() => {})
	afterAll(() => {})
	beforeEach(() => {})
	afterEach(() => {})

	test('registers the expected routes ', () => {
		let editor = oboRequire('routes/lti')
		expect(mockRouterMethods.get).toHaveBeenCalledTimes(2)
		expect(mockRouterMethods.post).toHaveBeenCalledTimes(4)
		expect(mockRouterMethods.delete).toHaveBeenCalledTimes(0)
		expect(mockRouterMethods.all).toHaveBeenCalledTimes(0)
		expect(mockRouterMethods.get).toBeCalledWith('/', expect.any(Function))
		expect(mockRouterMethods.get).toBeCalledWith('/config.xml', expect.any(Function))
		expect(mockRouterMethods.post).toBeCalledWith('/canvas/course_navigation', expect.any(Function))
		expect(mockRouterMethods.post).toBeCalledWith('/canvas/editor_button', expect.any(Function))
		expect(mockRouterMethods.post).toBeCalledWith(
			'/canvas/assignment_selection',
			expect.any(Function)
		)
	})

	test('index calls render', () => {
		let editor = oboRequire('routes/lti')

		let routeFunction = mockRouterMethods.get.mock.calls[0][1]

		let mockReq = {
			app: {
				locals: {
					paths: 'test',
					modules: 'test'
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
		let editor = oboRequire('routes/lti')
		let routeFunction = mockRouterMethods.get.mock.calls[1][1]

		let mockReq = {
			app: {
				locals: {
					paths: 'test',
					modules: 'test'
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

	test('config sets response type to xml', () => {
		let editor = oboRequire('routes/lti')
		let routeFunction = mockRouterMethods.get.mock.calls[1][1]

		let mockReq = {
			app: {
				locals: {
					paths: 'test',
					modules: 'test'
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
