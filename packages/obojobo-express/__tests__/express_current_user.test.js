let mockArgs // array of mocked express middleware request arguments
const userFunctions = ['setCurrentUser', 'getCurrentUser', 'requireCurrentUser']

jest.mock('test_node')
jest.mock('../models/user')

describe('current user middleware', () => {
	beforeAll(() => {})
	afterAll(() => {})
	beforeEach(() => {
		mockArgs = (() => {
			const res = {}
			const req = { session: {} }
			const mockJson = jest.fn().mockImplementation(() => {
				return true
			})
			const mockStatus = jest.fn().mockImplementation(() => {
				return { json: mockJson }
			})
			const mockNext = jest.fn()
			res.status = mockStatus

			const currentUserMiddleware = oboRequire('express_current_user')
			currentUserMiddleware(req, res, mockNext)
			return { res, req, mockJson, mockStatus, mockNext }
		})()
	})
	afterEach(() => {
		const { mockJson, mockStatus, mockNext } = mockArgs
		mockNext.mockClear()
		mockStatus.mockClear()
		mockJson.mockClear()
	})

	test('calls next', () => {
		const { mockNext } = mockArgs
		expect(mockNext).toBeCalledWith()
	})

	test('sets the expected properties on req', () => {
		expect.assertions(userFunctions.length * 2)

		const { req } = mockArgs

		userFunctions.forEach(func => {
			expect(req).toHaveProperty(func)
			expect(req[func]).toBeInstanceOf(Function)
		})
	})

	test('sets the current user on req.session', () => {
		expect.assertions(1)

		const { req } = mockArgs
		const User = oboRequire('models/user')
		const mockUser = new User({ id: 999 })
		req.setCurrentUser(mockUser)
		expect(req.session.currentUserId).toBe(999)
	})

	test('unsets the curent user', () => {
		expect.assertions(6)
		const { req } = mockArgs
		const User = oboRequire('models/user')
		const mockUser = new User({ id: 8 })
		const GuestUser = oboRequire('models/guest_user')

		User.fetchById = jest.fn().mockResolvedValue(mockUser)
		req.setCurrentUser(mockUser)

		return req
			.getCurrentUser()
			.then(user => {
				expect(User.fetchById).toBeCalledWith(8)
				expect(user.id).toBe(8)
				expect(user).toBeInstanceOf(User)
				req.resetCurrentUser()
				return req.getCurrentUser()
			})
			.then(user => {
				expect(user.id).toBe(0)
				expect(user).toBeInstanceOf(GuestUser)
				expect(user.isGuest()).toBe(true)
			})
	})

	test('setCurrentUser throws when not using a User', () => {
		expect.assertions(1)

		const { req } = mockArgs
		const mockUser = {}
		expect(() => {
			req.setCurrentUser(mockUser)
		}).toThrow()
	})

	test('getCurrentUser gets the current user', () => {
		expect.assertions(3)

		const { req } = mockArgs
		const User = oboRequire('models/user')
		const mockUser = new User({ id: 8 })
		User.fetchById = jest.fn().mockResolvedValue(mockUser)
		req.setCurrentUser(mockUser)

		return req.getCurrentUser().then(user => {
			expect(User.fetchById).toBeCalledWith(8)
			expect(user.id).toBe(8)
			expect(user).toBeInstanceOf(User)
		})
	})

	test('getCurrentUser gets the current user when required', () => {
		expect.assertions(3)

		const { req } = mockArgs
		const User = oboRequire('models/user')
		const mockUser = new User({ id: 8 })
		User.fetchById = jest.fn().mockResolvedValue(mockUser)
		req.setCurrentUser(mockUser)

		return req.getCurrentUser(true).then(user => {
			expect(User.fetchById).toBeCalledWith(8)
			expect(user.id).toBe(8)
			expect(user).toBeInstanceOf(User)
		})
	})

	test('getCurrentUser gets a guest user', () => {
		expect.assertions(3)

		const { req } = mockArgs
		const GuestUser = oboRequire('models/guest_user')

		return req.getCurrentUser().then(user => {
			expect(user.id).toBe(0)
			expect(user).toBeInstanceOf(GuestUser)
			expect(user.isGuest()).toBe(true)
		})
	})

	test('getCurrentUser rejects when required', () => {
		expect.assertions(1)

		const { req } = mockArgs

		return req
			.getCurrentUser(true)
			.then(() => {
				expect(false).toBe('never_called')
			})
			.catch(err => {
				expect(err.message).toBe('Login Required')
			})
	})

	test('gets currentUser if already set on req', () => {
		expect.assertions(2)

		const { req } = mockArgs
		const User = oboRequire('models/user')
		const mockUser = new User({ id: 8 })
		User.fetchById = jest.fn().mockResolvedValue(mockUser)
		req.setCurrentUser(mockUser)

		return req
			.requireCurrentUser()
			.then(user => {
				expect(user.id).toBe(8)
				return req.getCurrentUser()
			})
			.then(secondUser => {
				expect(secondUser.id).toBe(8)
			})
	})

	test('getCurrentUser returns a guest user when fetchById fails', () => {
		expect.assertions(2)

		const { req } = mockArgs
		const User = oboRequire('models/user')
		const GuestUser = oboRequire('models/guest_user')
		User.fetchById = jest.fn().mockRejectedValueOnce('die rebel scum')
		req.session.currentUserId = 9
		return req.getCurrentUser().then(user => {
			expect(User.fetchById).toBeCalledWith(9)
			expect(user).toBeInstanceOf(GuestUser)
		})
	})

	test('getCurrentUser returns rejects when fetchById fails and login is required', () => {
		expect.assertions(3)

		const { req } = mockArgs
		const User = oboRequire('models/user')
		User.fetchById = jest.fn().mockRejectedValueOnce('die rebel scum')

		req.session.currentUserId = 9
		return req
			.getCurrentUser(true)
			.then(() => {
				expect(true).toBe('this should never happen')
			})
			.catch(err => {
				expect(User.fetchById).toBeCalledWith(9)
				expect(err).toBeInstanceOf(Error)
				expect(err.message).toBe('Login Required')
			})
	})

	test('getCurrentUser gets the current user', () => {
		expect.assertions(3)

		const { req } = mockArgs
		const User = oboRequire('models/user')
		const mockUser = new User({ id: 8 })
		User.fetchById = jest.fn().mockResolvedValue(mockUser)
		req.setCurrentUser(mockUser)

		return req.getCurrentUser().then(user => {
			expect(User.fetchById).toBeCalledWith(8)
			expect(user.id).toBe(8)
			expect(user).toBeInstanceOf(User)
		})
	})

	test('requireCurrentUser rejects when expected', () => {
		expect.assertions(1)

		const { req } = mockArgs

		return req
			.requireCurrentUser()
			.then(() => {
				expect(false).toBe('never_called')
			})
			.catch(err => {
				expect(err.message).toBe('Login Required')
			})
	})

	test('saveSessionPromise resolves when session saves', () => {
		expect.assertions(1)
		const { req } = mockArgs
		req.session.save = jest.fn().mockImplementation(cb => {
			cb()
		})
		return expect(req.saveSessionPromise()).resolves.toBeUndefined()
	})

	test('saveSessionPromise rejects when session save fails', () => {
		expect.assertions(1)
		const { req } = mockArgs
		req.session.save = jest.fn().mockImplementation(cb => {
			cb('mock-error')
		})
		return expect(req.saveSessionPromise()).rejects.toEqual('mock-error')
	})
})
