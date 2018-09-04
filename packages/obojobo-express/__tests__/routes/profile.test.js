const { mockExpressMethods, mockRouterMethods } = require('../../__mocks__/__mock_express')

describe('lti route', () => {
	beforeAll(() => {})
	afterAll(() => {})
	beforeEach(() => {})
	afterEach(() => {})

	test('registers the expected routes ', () => {
		let editor = oboRequire('routes/profile')
		expect(mockRouterMethods.get).toHaveBeenCalledTimes(1)
		expect(mockRouterMethods.get).toBeCalledWith('/', expect.any(Function))
	})

	test('index calls send', () => {
		expect.assertions(1)

		let editor = oboRequire('routes/profile')
		let User = oboRequire('models/user')
		let routeFunction = mockRouterMethods.get.mock.calls[0][1]

		let mockReq = {
			getCurrentUser: () => {
				return Promise.resolve(new User())
			}
		}

		let mockRes = {
			status: jest.fn(),
			render: jest.fn(),
			send: jest.fn()
		}

		let mockNext = jest.fn()

		return routeFunction(mockReq, mockRes, mockNext).then(() => {
			expect(mockRes.send).toBeCalledWith('Hello guest!')
		})
	})
})
