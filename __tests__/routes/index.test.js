const { mockExpressMethods, mockRouterMethods } = require('../../__mocks__/__mock_express')

describe('index route', () => {
	beforeAll(() => {})
	afterAll(() => {})
	beforeEach(() => {})
	afterEach(() => {})

	test('registers the expected routes ', () => {
		let editor = oboRequire('routes/index')
		expect(mockRouterMethods.get).toBeCalledWith('/', expect.any(Function))
	})

	test('renders the expected stuff', () => {
		let editor = oboRequire('routes/index')
		let routeFunction = mockRouterMethods.get.mock.calls[0][1]

		let mockReq = {
			app: {
				locals: {
					paths: 'test1',
					modules: 'test2'
				}
			}
		}

		let mockRes = {
			status: jest.fn(),
			render: jest.fn()
		}

		let mockNext = jest.fn()

		routeFunction(mockReq, mockRes, mockNext)
		expect(mockRes.render).toBeCalledWith(
			expect.any(String),
			expect.objectContaining({
				title: 'Obojobo Next'
			})
		)
	})
})
