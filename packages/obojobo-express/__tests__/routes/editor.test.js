jest.mock('../../db')
jest.mock('../../models/user')

const { mockExpressMethods, mockRouterMethods } = require('../../__mocks__/__mock_express')

describe('editor route', () => {
	beforeAll(() => {})
	afterAll(() => {})
	beforeEach(() => {})
	afterEach(() => {})

	test('registers the expected routes ', () => {
		let editor = oboRequire('routes/editor')
		expect(mockRouterMethods.post).toBeCalledWith('/', expect.any(Function))
	})

	test('loads the expected draft ', () => {
		expect.assertions(1)

		let db = oboRequire('db')

		// mock the launch insert
		db.any.mockResolvedValueOnce({ draft: true })

		let User = oboRequire('models/user')
		let editor = oboRequire('routes/editor')
		let displayEditor = mockRouterMethods.post.mock.calls[0][1]

		let mockReq = {
			getCurrentUser: jest.fn().mockImplementationOnce(() => {
				let u = new User()
				u.canViewEditor = true
				return Promise.resolve(u)
			})
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

	test('rejects for guests', () => {
		expect.assertions(2)

		let db = oboRequire('db')

		// mock the launch insert
		db.any.mockResolvedValueOnce({ draft: true })

		let GuestUser = oboRequire('models/guest_user')
		let editor = oboRequire('routes/editor')
		let displayEditor = mockRouterMethods.post.mock.calls[0][1]

		let mockReq = {
			getCurrentUser: jest.fn().mockImplementationOnce(() => {
				let u = new GuestUser()
				return Promise.resolve(u)
			})
		}

		let mockRes = {
			status: jest.fn(),
			render: jest.fn()
		}

		let mockNext = jest.fn()

		return displayEditor(mockReq, mockRes, mockNext).then(() => {
			expect(mockNext).toBeCalledWith(expect.any(Error))
			expect(mockNext.mock.calls[0][0].message).toBe('Login Required')
		})
	})

	test('rejects for users without editor permissions', () => {
		expect.assertions(1)

		let db = oboRequire('db')

		// mock the launch insert
		db.any.mockResolvedValueOnce({ draft: true })

		let User = oboRequire('models/user')
		let editor = oboRequire('routes/editor')
		let displayEditor = mockRouterMethods.post.mock.calls[0][1]

		let mockReq = {
			getCurrentUser: jest.fn().mockImplementationOnce(() => {
				let u = new User()
				u.canViewEditor = false
				return Promise.resolve(u)
			})
		}

		let mockRes = {
			status: jest.fn(),
			render: jest.fn()
		}

		let mockNext = jest.fn()

		return displayEditor(mockReq, mockRes, mockNext).then(() => {
			expect(mockNext).toBeCalledWith()
		})
	})
})
