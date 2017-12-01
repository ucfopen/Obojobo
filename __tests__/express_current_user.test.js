let mockArgs // array of mocked express middleware request arguments
const userFunctions = ['setCurrentUser', 'getCurrentUser', 'requireCurrentUser']

jest.mock('test_node')
jest.mock('../models/user')

describe('current user middleware', () => {
	beforeAll(() => {})
	afterAll(() => {})
	beforeEach(() => {
		mockArgs = (() => {
			let res = {}
			let req = { session: {} }
			let mockJson = jest.fn().mockImplementation(obj => {
				return true
			})
			let mockStatus = jest.fn().mockImplementation(code => {
				return { json: mockJson }
			})
			let mockNext = jest.fn()
			res.status = mockStatus

			let currentUserMiddleware = oboRequire('express_current_user')
			currentUserMiddleware(req, res, mockNext)
			return [res, req, mockJson, mockStatus, mockNext]
		})()
	})
	afterEach(() => {
		let [res, req, mockJson, mockStatus, mockNext] = mockArgs
		mockNext.mockClear()
		mockStatus.mockClear()
		mockJson.mockClear()
	})

	it('calls next', () => {
		let [res, req, mockJson, mockStatus, mockNext] = mockArgs
		expect(mockNext).toBeCalledWith()
	})

	it('sets the expected properties on req', () => {
		expect.assertions(userFunctions.length * 2)

		let [res, req, mockJson, mockStatus, mockNext] = mockArgs

		userFunctions.forEach(func => {
			expect(req).toHaveProperty(func)
			expect(req[func]).toBeInstanceOf(Function)
		})
	})

	it('sets the current user on req.session', () => {
		expect.assertions(1)

		let [res, req, mockJson, mockStatus, mockNext] = mockArgs
		let User = oboRequire('models/user')
		let mockUser = new User({ id: 999 })
		req.setCurrentUser(mockUser)
		expect(req.session.currentUserId).toBe(999)
	})

	it('unsets the curent user', () => {
		expect.assertions(6)
		let [res, req, mockJson, mockStatus, mockNext] = mockArgs
		let User = oboRequire('models/user')
		let mockUser = new User({ id: 8 })
		let GuestUser = oboRequire('models/guest_user')

		User.fetchById = jest.fn().mockImplementation(id => {
			return Promise.resolve(mockUser)
		})
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

	it('setCurrentUser throws when not using a User', () => {
		expect.assertions(1)

		let [res, req, mockJson, mockStatus, mockNext] = mockArgs
		let mockUser = {}
		expect(() => {
			req.setCurrentUser(mockUser)
		}).toThrow()
	})

	it('getCurrentUser gets the current user', () => {
		expect.assertions(3)

		let [res, req, mockJson, mockStatus, mockNext] = mockArgs
		let User = oboRequire('models/user')
		let mockUser = new User({ id: 8 })
		User.fetchById = jest.fn().mockImplementation(id => {
			return Promise.resolve(mockUser)
		})
		req.setCurrentUser(mockUser)

		return req.getCurrentUser().then(user => {
			expect(User.fetchById).toBeCalledWith(8)
			expect(user.id).toBe(8)
			expect(user).toBeInstanceOf(User)
		})
	})

	it('getCurrentUser gets the current user when required', () => {
		expect.assertions(3)

		let [res, req, mockJson, mockStatus, mockNext] = mockArgs
		let User = oboRequire('models/user')
		let mockUser = new User({ id: 8 })
		User.fetchById = jest.fn().mockImplementation(id => {
			return Promise.resolve(mockUser)
		})
		req.setCurrentUser(mockUser)

		return req.getCurrentUser(true).then(user => {
			expect(User.fetchById).toBeCalledWith(8)
			expect(user.id).toBe(8)
			expect(user).toBeInstanceOf(User)
		})
	})

	it('getCurrentUser gets a guest user', () => {
		expect.assertions(3)

		let [res, req, mockJson, mockStatus, mockNext] = mockArgs
		let User = oboRequire('models/user')
		let GuestUser = oboRequire('models/guest_user')

		return req.getCurrentUser().then(user => {
			expect(user.id).toBe(0)
			expect(user).toBeInstanceOf(GuestUser)
			expect(user.isGuest()).toBe(true)
		})
	})

	it('getCurrentUser rejects when required', () => {
		expect.assertions(1)

		let [res, req, mockJson, mockStatus, mockNext] = mockArgs
		let User = oboRequire('models/user')

		return req
			.getCurrentUser(true)
			.then(user => {
				expect(false).toBe('never_called')
			})
			.catch(err => {
				expect(err.message).toBe('Login Required')
			})
	})

	it('gets currentUser if already set on req', () => {
		expect.assertions(2)

		let [res, req, mockJson, mockStatus, mockNext] = mockArgs
		let User = oboRequire('models/user')
		let mockUser = new User({ id: 8 })
		User.fetchById = jest.fn().mockImplementation(id => {
			return Promise.resolve(mockUser)
		})
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

	it('getCurrentUser returns a guest user when fetchById fails', () => {
		expect.assertions(2)

		let [res, req, mockJson, mockStatus, mockNext] = mockArgs
		let User = oboRequire('models/user')
		let GuestUser = oboRequire('models/guest_user')
		User.fetchById = jest.fn().mockImplementation(id => {
			return Promise.reject('die rebel scum')
		})
		req.session.currentUserId = 9
		return req.getCurrentUser().then(user => {
			expect(User.fetchById).toBeCalledWith(9)
			expect(user).toBeInstanceOf(GuestUser)
		})
	})

	it('getCurrentUser returns rejects when fetchById fails and login is required', () => {
		expect.assertions(3)

		let [res, req, mockJson, mockStatus, mockNext] = mockArgs
		let User = oboRequire('models/user')
		let GuestUser = oboRequire('models/guest_user')
		User.fetchById = jest.fn().mockImplementation(id => {
			return Promise.reject('die rebel scum')
		})
		req.session.currentUserId = 9
		return req
			.getCurrentUser(true)
			.then(user => {
				expect(true).toBe('this should never happen')
			})
			.catch(err => {
				expect(User.fetchById).toBeCalledWith(9)
				expect(err).toBeInstanceOf(Error)
				expect(err.message).toBe('Login Required')
			})
	})

	it('getCurrentUser gets the current user', () => {
		expect.assertions(3)

		let [res, req, mockJson, mockStatus, mockNext] = mockArgs
		let User = oboRequire('models/user')
		let mockUser = new User({ id: 8 })
		User.fetchById = jest.fn().mockImplementation(id => {
			return Promise.resolve(mockUser)
		})
		req.setCurrentUser(mockUser)

		return req.getCurrentUser().then(user => {
			expect(User.fetchById).toBeCalledWith(8)
			expect(user.id).toBe(8)
			expect(user).toBeInstanceOf(User)
		})
	})

	it('requireCurrentUser rejects when expected', () => {
		expect.assertions(1)

		let [res, req, mockJson, mockStatus, mockNext] = mockArgs
		let User = oboRequire('models/user')

		return req
			.requireCurrentUser()
			.then(user => {
				expect(false).toBe('never_called')
			})
			.catch(err => {
				expect(err.message).toBe('Login Required')
			})
	})
})
