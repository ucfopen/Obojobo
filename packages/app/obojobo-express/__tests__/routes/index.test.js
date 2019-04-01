const { mockRouterMethods } = require('../../__mocks__/__mock_express')

describe('index route', () => {
	beforeAll(() => {})
	afterAll(() => {})
	beforeEach(() => {})
	afterEach(() => {})

	test('registers the expected routes ', () => {
		oboRequire('routes/index')
		expect(mockRouterMethods.get).toBeCalledWith('/', expect.any(Function))
	})

	test('renders the expected stuff', () => {
		oboRequire('routes/index')
		const routeFunction = mockRouterMethods.get.mock.calls[0][1]

		const mockReq = {
			app: {
				locals: {
					paths: 'test1',
					modules: 'test2'
				}
			}
		}

		const mockRes = {
			status: jest.fn(),
			render: jest.fn()
		}

		const mockNext = jest.fn()

		routeFunction(mockReq, mockRes, mockNext)
		expect(mockRes.render).toBeCalledWith(
			expect.any(String),
			expect.objectContaining({
				title: 'Obojobo Next'
			})
		)
	})
})
