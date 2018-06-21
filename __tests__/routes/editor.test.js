jest.mock('../../db')
jest.mock('../../models/user')

mockVirtual('../../express_validators')
let expressValidators = oboRequire('express_validators')
expressValidators.requireCanViewEditor = 'requireCanViewEditor'

const { mockExpressMethods, mockRouterMethods } = require('../../__mocks__/__mock_express')

describe('editor route', () => {
	beforeAll(() => {})
	afterAll(() => {})
	beforeEach(() => {})
	afterEach(() => {})

	test('registers the expected routes ', () => {
		let editor = oboRequire('routes/editor')
		expect(mockRouterMethods.route).toHaveBeenCalledTimes(1)
		expect(mockRouterMethods.route).toBeCalledWith('/')

		expect(mockRouterMethods.post).toHaveBeenCalledTimes(1)
		expect(mockRouterMethods.all).toHaveBeenCalledTimes(1)
		expect(mockRouterMethods.get).toHaveBeenCalledTimes(1)
	})

	test('applies expected validators to each route', () => {
		let editor = oboRequire('routes/editor')
		expect(mockRouterMethods.all).toHaveBeenCalledTimes(1)
		expect(mockRouterMethods.all).toHaveBeenCalledWith(expressValidators.requireCanViewEditor)
	})

	test('loads the expected draft ', () => {
		expect.assertions(1)

		let db = oboRequire('db')

		// mock the launch insert
		db.any.mockResolvedValueOnce({ draft: true })

		let User = oboRequire('models/user')
		let editor = oboRequire('routes/editor')
		let displayEditor = mockRouterMethods.post.mock.calls[0][0]

		let mockReq = {
			currentUser:{
				id: new User()
			}
		}

		let mockRes = {
			status: jest.fn(),
			render: jest.fn()
		}

		let mockNext = jest.fn()

		return displayEditor(mockReq, mockRes, mockNext).then(() => {
			expect(mockRes.render).toBeCalledWith(
				expect.any(String),
				expect.objectContaining({
					drafts: { draft: true }
				})
			)
		})
	})

})
