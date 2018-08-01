jest.mock('../../db')
jest.mock('../../models/user')

const { mockRouterMethods } = require('../../__mocks__/__mock_express')

describe('editor route', () => {
	beforeAll(() => {})
	afterAll(() => {})
	beforeEach(() => {})
	afterEach(() => {})

	test('registers the expected routes ', () => {
		const editor = oboRequire('routes/editor')
		expect(mockRouterMethods.post).toBeCalledWith('/', expect.any(Function))
		expect(mockRouterMethods.post).toBeCalledWith('/:draftId/:page?', expect.any(Function))
		expect(mockRouterMethods.get).toBeCalledWith('/:draftId/:page?', expect.any(Function))
	})

	test('POST / loads the draftList', () => {
		expect.assertions(1)

		const db = oboRequire('db')

		// mock the launch insert
		db.any.mockResolvedValueOnce({ draft: true })

		const User = oboRequire('models/user')
		const editor = oboRequire('routes/editor')
		const displayEditor = mockRouterMethods.post.mock.calls[1][1]

		const mockReq = {
			getCurrentUser: jest.fn().mockImplementationOnce(() => {
				const u = new User()
				u.canViewEditor = true
				return Promise.resolve(u)
			})
		}

		const mockRes = {
			status: jest.fn(),
			render: jest.fn()
		}

		const mockNext = jest.fn()

		return displayEditor(mockReq, mockRes, mockNext).then(() => {
			expect(mockRes.render).toBeCalledWith(
				expect.any(String),
				expect.objectContaining({
					draftTitle: 'Editor',
					drafts: { draft: true }
				})
			)
		})
	})

	test('POST / rejects for guests', () => {
		expect.assertions(2)

		const GuestUser = oboRequire('models/guest_user')
		const editor = oboRequire('routes/editor')
		const displayEditor = mockRouterMethods.post.mock.calls[1][1]

		const mockReq = {
			getCurrentUser: jest.fn().mockImplementationOnce(() => {
				const u = new GuestUser()
				return Promise.resolve(u)
			})
		}

		const mockRes = {
			status: jest.fn(),
			render: jest.fn()
		}

		const mockNext = jest.fn()

		return displayEditor(mockReq, mockRes, mockNext).then(() => {
			expect(mockNext).toBeCalledWith(expect.any(Error))
			expect(mockNext.mock.calls[0][0].message).toBe('Login Required')
		})
	})

	test('POST / rejects for users without editor permissions', () => {
		expect.assertions(1)

		const User = oboRequire('models/user')
		const editor = oboRequire('routes/editor')
		const displayEditor = mockRouterMethods.post.mock.calls[1][1]

		const mockReq = {
			getCurrentUser: jest.fn().mockImplementationOnce(() => {
				const u = new User()
				u.canViewEditor = false
				return Promise.resolve(u)
			})
		}

		const mockRes = {
			status: jest.fn(),
			render: jest.fn()
		}

		const mockNext = jest.fn()

		return displayEditor(mockReq, mockRes, mockNext).then(() => {
			expect(mockNext).toBeCalledWith()
		})
	})

	test('POST /:draftId/:page? loads the expected draft', () => {
		expect.assertions(1)

		const User = oboRequire('models/user')
		const editor = oboRequire('routes/editor')
		const displayEditor = mockRouterMethods.post.mock.calls[0][1]

		const mockReq = {
			requireCurrentUser: jest.fn().mockImplementationOnce(() => {
				const u = new User()
				u.canViewEditor = true
				return Promise.resolve(u)
			}),
			requireCurrentDocument: jest.fn().mockReturnValueOnce('mockDraft')
		}

		const mockRes = {
			status: jest.fn(),
			render: jest.fn()
		}

		const mockNext = jest.fn()

		return displayEditor(mockReq, mockRes, mockNext).then(() => {
			expect(mockRes.render).toBeCalledWith(
				expect.any(String),
				expect.objectContaining({
					draftTitle: 'Editor',
					drafts: 'mockDraft'
				})
			)
		})
	})

	test('POST /:draftId/:page? rejects for guests', () => {
		expect.assertions(2)

		const GuestUser = oboRequire('models/guest_user')
		const editor = oboRequire('routes/editor')
		const displayEditor = mockRouterMethods.post.mock.calls[0][1]

		const mockReq = {
			requireCurrentUser: jest.fn().mockImplementationOnce(() => {
				const u = new GuestUser()
				return Promise.resolve(u)
			}),
			requireCurrentDocument: jest.fn().mockReturnValueOnce('mockDraft')
		}

		const mockRes = {
			status: jest.fn(),
			render: jest.fn()
		}

		const mockNext = jest.fn()

		return displayEditor(mockReq, mockRes, mockNext).then(() => {
			expect(mockNext).toBeCalledWith(expect.any(Error))
			expect(mockNext.mock.calls[0][0].message).toBe('Login Required')
		})
	})

	test('POST /:draftId/:page? rejects for users without editor permissions', () => {
		expect.assertions(1)

		const User = oboRequire('models/user')
		const editor = oboRequire('routes/editor')
		const displayEditor = mockRouterMethods.post.mock.calls[0][1]

		const mockReq = {
			requireCurrentUser: jest.fn().mockImplementationOnce(() => {
				const u = new User()
				u.canViewEditor = false
				return Promise.resolve(u)
			}),
			requireCurrentDocument: jest.fn().mockReturnValueOnce('mockDraft')
		}

		const mockRes = {
			status: jest.fn(),
			render: jest.fn()
		}

		const mockNext = jest.fn()

		return displayEditor(mockReq, mockRes, mockNext).then(() => {
			expect(mockNext).toBeCalledWith()
		})
	})

	test('GET /:draftId/:page? loads the expected draft', () => {
		expect.assertions(1)

		const User = oboRequire('models/user')
		const editor = oboRequire('routes/editor')
		const displayEditor = mockRouterMethods.get.mock.calls[0][1]

		const mockReq = {
			requireCurrentUser: jest.fn().mockImplementationOnce(() => {
				const u = new User()
				u.canViewEditor = true
				return Promise.resolve(u)
			}),
			requireCurrentDocument: jest.fn().mockReturnValueOnce('mockDraft')
		}

		const mockRes = {
			status: jest.fn(),
			render: jest.fn()
		}

		const mockNext = jest.fn()

		return displayEditor(mockReq, mockRes, mockNext).then(() => {
			expect(mockRes.render).toBeCalledWith(
				expect.any(String),
				expect.objectContaining({
					draftTitle: 'Editor',
					drafts: 'mockDraft'
				})
			)
		})
	})

	test('GET /:draftId/:page? rejects for guests', () => {
		expect.assertions(2)

		const GuestUser = oboRequire('models/guest_user')
		const editor = oboRequire('routes/editor')
		const displayEditor = mockRouterMethods.get.mock.calls[0][1]

		const mockReq = {
			requireCurrentUser: jest.fn().mockImplementationOnce(() => {
				const u = new GuestUser()
				return Promise.resolve(u)
			}),
			requireCurrentDocument: jest.fn().mockReturnValueOnce('mockDraft')
		}

		const mockRes = {
			status: jest.fn(),
			render: jest.fn()
		}

		const mockNext = jest.fn()

		return displayEditor(mockReq, mockRes, mockNext).then(() => {
			expect(mockNext).toBeCalledWith(expect.any(Error))
			expect(mockNext.mock.calls[0][0].message).toBe('Login Required')
		})
	})

	test('GET /:draftId/:page? rejects for users without editor permissions', () => {
		expect.assertions(1)

		const User = oboRequire('models/user')
		const editor = oboRequire('routes/editor')
		const displayEditor = mockRouterMethods.get.mock.calls[0][1]

		const mockReq = {
			requireCurrentUser: jest.fn().mockImplementationOnce(() => {
				const u = new User()
				u.canViewEditor = false
				return Promise.resolve(u)
			}),
			requireCurrentDocument: jest.fn().mockReturnValueOnce('mockDraft')
		}

		const mockRes = {
			status: jest.fn(),
			render: jest.fn()
		}

		const mockNext = jest.fn()

		return displayEditor(mockReq, mockRes, mockNext).then(() => {
			expect(mockNext).toBeCalledWith()
		})
	})
})
