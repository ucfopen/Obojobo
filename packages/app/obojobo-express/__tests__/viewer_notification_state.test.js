const db = require('../server/db')
const {
	getNotifications,
	getRecentNotifications,
	setLastLogin
} = require('../server/viewer/viewer_notification_state')

jest.mock('../server/db')
describe('db', () => {
	beforeEach(() => {
		jest.resetAllMocks()
		jest.resetModules()
	})

	test('returns notifications when passed ids', () => {
		const fakeNotifications = [
			{ title: 'Notification 1', text: 'This is notification 1' },
			{ title: 'Notification 2', text: 'This is notification 2' }
		]
		db.manyOrNone.mockResolvedValue(fakeNotifications)

		return getNotifications([1, 2]).then(result => {
			expect(result).toEqual(fakeNotifications)
			expect(db.manyOrNone).toHaveBeenCalledWith(expect.any(String), { ids: [1, 2] })
		})
	})

	test('returns undefined when passed ids as 0', () => {
		return expect(getNotifications(0)).toBeUndefined()
	})

	test('returns notifications created after a given date', () => {
		const fakeNotifications = [{ id: 1 }, { id: 2 }]
		db.manyOrNone.mockResolvedValue(fakeNotifications)

		return getRecentNotifications('2022-01-01').then(result => {
			expect(result).toEqual(fakeNotifications)
			expect(db.manyOrNone).toHaveBeenCalledWith(expect.any(String), { date: '2022-01-01' })
		})
	})

	test('should insert a new record if the user does not exist', () => {
		db.none.mockResolvedValue()

		const userId = 1
		const today = '2023-09-13'

		return setLastLogin(userId, today).then(() => {
			expect(db.none).toHaveBeenCalledWith(expect.stringContaining('INSERT INTO users'), {
				userId,
				today
			})
		})
	})

	test('should handle other errors from db.none', () => {
		const errorMessage = 'Database error'
		db.none.mockRejectedValue(new Error(errorMessage))

		const userId = 1
		const today = '2023-09-13'

		return expect(setLastLogin(userId, today)).rejects.toThrow(errorMessage)
	})
})
