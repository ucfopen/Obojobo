const db = require('../server/db')
const {
	getNotifications,
	getRecentNotifications
} = require('../server/viewer/viewer_notification_state')

jest.mock('../server/db')

describe('getNotifications', () => {
	test('returns notifications when passed ids', async () => {
		const fakeNotifications = [
			{ title: 'Notification 1', text: 'This is notification 1' },
			{ title: 'Notification 2', text: 'This is notification 2' }
		]
		db.manyOrNone.mockResolvedValue(fakeNotifications)

		const result = await getNotifications([1, 2])

		expect(result).toEqual(fakeNotifications)
		expect(db.manyOrNone).toHaveBeenCalledWith(expect.any(String), { ids: [1, 2] })
	})

	test('returns undefined when passed ids as 0', async () => {
		const result = await getNotifications(0)

		expect(result).toBeUndefined()
		//expect(db.manyOrNone).not.toHaveBeenCalled(1)
	})
})

describe('getRecentNotifications', () => {
	test('returns notifications created after a given date', async () => {
		const fakeNotifications = [{ id: 1 }, { id: 2 }]
		db.manyOrNone.mockResolvedValue(fakeNotifications)

		const result = await getRecentNotifications('2022-01-01')

		expect(result).toEqual(fakeNotifications)
		expect(db.manyOrNone).toHaveBeenCalledWith(expect.any(String), { date: '2022-01-01' })
	})
})
