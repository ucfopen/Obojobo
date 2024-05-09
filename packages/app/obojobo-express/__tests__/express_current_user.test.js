let mockArgs // array of mocked express middleware request arguments
const userFunctions = ['setCurrentUser', 'getCurrentUser', 'requireCurrentUser']

jest.mock('test_node')
jest.mock('../server/models/user')
jest.mock('../server/viewer/viewer_notification_state')

const viewerNotificationState = require('../server/viewer/viewer_notification_state')

jest.mock('../server/viewer/viewer_state', () => ({
	get: jest.fn()
}))

const viewerState = require('../server/viewer/viewer_state')

describe('current user middleware', () => {
	beforeAll(() => {})
	afterAll(() => {})
	beforeEach(() => {
		jest.clearAllMocks()
		mockArgs = (() => {
			const res = {
				cookie: jest.fn()
			}
			const req = {
				session: {}
			}
			const mockJson = jest.fn().mockImplementation(() => {
				return true
			})
			const mockStatus = jest.fn().mockImplementation(() => {
				return { json: mockJson }
			})
			const mockNext = jest.fn()
			res.status = mockStatus

			const currentUserMiddleware = oboRequire('server/express_current_user')
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
		const User = oboRequire('server/models/user')
		const mockUser = new User({ id: 999 })
		req.setCurrentUser(mockUser)
		expect(req.session.currentUserId).toBe(999)
	})

	test('unsets the curent user', () => {
		expect.hasAssertions()
		const { req } = mockArgs
		const User = oboRequire('server/models/user')
		const mockUser = new User({ id: 8 })
		const GuestUser = oboRequire('server/models/guest_user')

		User.fetchById = jest.fn().mockResolvedValue(mockUser)
		req.setCurrentUser(mockUser)

		return req
			.getCurrentUser()
			.then(user => {
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
		expect.hasAssertions()

		const { req } = mockArgs
		const User = oboRequire('server/models/user')
		const mockUser = new User({ id: 8 })
		User.fetchById = jest.fn().mockResolvedValue(mockUser)
		req.setCurrentUser(mockUser)

		return req.getCurrentUser().then(user => {
			expect(user).toBe(mockUser)
			expect(user.id).toBe(8)
			expect(user).toBeInstanceOf(User)
			expect(req.currentUser).toBe(mockUser)
			expect(req.currentUser).toBe(user)
		})
	})

	test('getCurrentUser loads the user if not already loaded', () => {
		expect.hasAssertions()

		const { req } = mockArgs
		const User = oboRequire('server/models/user')
		const mockUser = new User({ id: 8 })
		User.fetchById = jest.fn().mockResolvedValue(mockUser)
		req.session.currentUserId = mockUser.id // only set the id, don't set req.currentUser

		return req.getCurrentUser().then(user => {
			expect(User.fetchById).toBeCalledWith(8)
			expect(user.id).toBe(8)
			expect(user).toBeInstanceOf(User)
			expect(req.currentUser).toBe(mockUser)
			expect(req.currentUser).toBe(user)
		})
	})

	test('getCurrentUser gets a guest user', () => {
		expect.hasAssertions()

		const { req } = mockArgs
		const GuestUser = oboRequire('server/models/guest_user')

		return req.getCurrentUser().then(user => {
			expect(user.id).toBe(0)
			expect(user).toBeInstanceOf(GuestUser)
			expect(user.isGuest()).toBe(true)
			expect(req.currentUser).toBe(user)
		})
	})

	test('getCurrentUser returns a guest user when fetchById fails', () => {
		expect.assertions(2)

		const { req } = mockArgs
		const User = oboRequire('server/models/user')
		const GuestUser = oboRequire('server/models/guest_user')
		User.fetchById = jest.fn().mockRejectedValueOnce('mock-fetch-id-error')
		req.session.currentUserId = 9

		return req.getCurrentUser().then(user => {
			expect(User.fetchById).toBeCalledWith(9)
			expect(user).toBeInstanceOf(GuestUser)
		})
	})

	test('requireCurrentUser rejects when fetchById fails and login is required', () => {
		const { req } = mockArgs
		const User = oboRequire('server/models/user')
		User.fetchById = jest.fn().mockRejectedValueOnce('mock-fetch-id-error')
		req.session.currentUserId = 9

		return expect(req.requireCurrentUser()).rejects.toThrow('Login Required')
	})

	test('requireCurrentUser rejects with no current user', () => {
		expect.assertions(1)
		const { req } = mockArgs

		return expect(req.requireCurrentUser()).rejects.toThrow('Login Required')
	})

	test('requireCurrentUser rejects current user as guest', () => {
		expect.assertions(1)
		const GuestUser = oboRequire('server/models/guest_user')
		const mockUser = new GuestUser({ id: 999 })
		const { req } = mockArgs
		req.setCurrentUser(mockUser)

		return expect(req.requireCurrentUser()).rejects.toThrow('Login Required')
	})

	test('requireCurrentUser returns current user when logged in', () => {
		expect.assertions(1)
		const User = oboRequire('server/models/user')
		const mockUser = new User({ id: 999 })
		const { req } = mockArgs
		req.setCurrentUser(mockUser)

		return expect(req.requireCurrentUser()).resolves.toBe(mockUser)
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
	test('getNotifications sets notifications in cookies when notifications are available', async () => {
		expect.assertions(6)

		const { req, res } = mockArgs
		const User = oboRequire('server/models/user')
		const mockUser = new User({ id: 8, lastLogin: '2019-01-01' })
		User.fetchById = jest.fn().mockResolvedValue(mockUser)
		req.currentUserId = mockUser.id
		req.currentUser = mockUser
		req.currentUser.lastLogin = mockUser.lastLogin
		jest.useFakeTimers('modern')
		jest.setSystemTime(new Date(2024, 3, 1)) //mock the date so that runtime does not affect the date/time

		const mockNotifications = [
			{ id: 1, title: 'Notification 1', text: 'Message 1' },
			{ id: 2, title: 'Notification 2', text: 'Message 2' }
		]
		//simulate what would be added to the cookie
		const mockNotificationsToCookie = [
			{ title: 'Notification 1', text: 'Message 1' },
			{ title: 'Notification 2', text: 'Message 2' }
		]

		viewerState.get.mockResolvedValueOnce(req.currentUserId)
		viewerNotificationState.getRecentNotifications.mockResolvedValueOnce(
			mockNotifications.map(n => ({ id: n.id }))
		)
		viewerNotificationState.getNotifications.mockResolvedValueOnce(mockNotifications)

		return req.getNotifications(req, res).then(() => {
			const today = new Date()
			expect(viewerState.get).toHaveBeenCalledWith(8)
			expect(viewerNotificationState.getRecentNotifications).toHaveBeenCalled()
			expect(viewerNotificationState.getNotifications).toHaveBeenCalledWith([1, 2])

			expect(res.cookie).toHaveBeenCalledWith(
				'notifications',
				JSON.stringify(mockNotificationsToCookie)
			)
			expect(req.currentUser.lastLogin).toStrictEqual(today)
			expect(viewerNotificationState.setLastLogin).toHaveBeenCalledWith(8, today)

			jest.useRealTimers()
		})
	})
	test('getNotifications returns empty when there are no notifications', async () => {
		expect.assertions(6)
		const { req, res } = mockArgs
		const User = oboRequire('server/models/user')
		const mockUser = new User({ id: 8, lastLogin: '2019-01-01' })
		User.fetchById = jest.fn().mockResolvedValue(mockUser)
		req.currentUserId = mockUser.id
		req.currentUser = mockUser
		req.currentUser.lastLogin = mockUser.lastLogin
		jest.useFakeTimers('modern')
		jest.setSystemTime(new Date(2024, 3, 1)) //mock the date so that runtime does not affect the date/time

		viewerState.get.mockResolvedValueOnce(req.currentUserId)
		viewerNotificationState.getRecentNotifications.mockResolvedValueOnce(null)

		return req.getNotifications(req, res).then(() => {
			const today = new Date()
			expect(viewerState.get).toHaveBeenCalledWith(8)
			expect(viewerNotificationState.getRecentNotifications).toHaveBeenCalled() //With(req.currentUser.lastLogin)
			expect(viewerNotificationState.getNotifications).not.toHaveBeenCalled()
			expect(res.cookie).not.toHaveBeenCalled()
			expect(req.currentUser.lastLogin).toStrictEqual(today)
			expect(viewerNotificationState.setLastLogin).toHaveBeenCalledWith(8, today)

			jest.useRealTimers()
		})
	})
})
