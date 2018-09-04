jest.mock('../../models/user')

const { mockExpressMethods, mockRouterMethods } = require('../../__mocks__/__mock_express')

describe('lti route', () => {
	beforeAll(() => {})
	afterAll(() => {})
	beforeEach(() => {})
	afterEach(() => {})

	test('registers the expected routes ', () => {
		let editor = oboRequire('routes/profile')
		expect(mockRouterMethods.get).toHaveBeenCalledTimes(2)
		expect(mockRouterMethods.get).toBeCalledWith('/', expect.any(Function))
		expect(mockRouterMethods.get).toBeCalledWith('/logout', expect.any(Function))
	})

	test('logout calls resetCurrentUser', () => {
		expect.assertions(4)
		let editor = oboRequire('routes/profile')
		let routeFunction = mockRouterMethods.get.mock.calls[1][1]
		expect(mockRouterMethods.get.mock.calls[1][0]).toBe('/logout')

		let mockReq = {
			resetCurrentUser: jest.fn()
		}

		let mockRes = {
			status: jest.fn(),
			render: jest.fn(),
			send: jest.fn()
		}

		let mockNext = jest.fn()

		routeFunction(mockReq, mockRes, mockNext)
		expect(mockReq.resetCurrentUser).toHaveBeenCalledTimes(1)
		expect(mockRes.send).toHaveBeenCalledTimes(1)
		expect(mockRes.send).toBeCalledWith('Logged out')
	})

	test('index calls send', () => {
		expect.assertions(4)

		let editor = oboRequire('routes/profile')
		let User = oboRequire('models/user')
		let routeFunction = mockRouterMethods.get.mock.calls[0][1]
		expect(mockRouterMethods.get.mock.calls[0][0]).toBe('/')

		let mockReq = {
			getCurrentUser: jest.fn(() => Promise.resolve(new User()))
		}

		let mockRes = {
			status: jest.fn(),
			render: jest.fn(),
			send: jest.fn()
		}

		let mockNext = jest.fn()

		return routeFunction(mockReq, mockRes, mockNext).then(() => {
			expect(mockReq.getCurrentUser).toHaveBeenCalledTimes(1)
			expect(mockRes.send).toHaveBeenCalledTimes(1)
			expect(mockRes.send).toBeCalledWith('Hello guest!')
		})
	})
})
