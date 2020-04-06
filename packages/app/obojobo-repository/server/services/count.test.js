describe('Count Services', () => {
	jest.mock('obojobo-express/server/db')

	let db
	let CountServices

	beforeEach(() => {
		jest.resetModules()
		jest.resetAllMocks()
		db = require('obojobo-express/server/db')
		CountServices = require('./count')
	})
	afterEach(() => {})

	test('getUserModuleCount returns a list of collection objects', () => {
		db.one = jest.fn()
		db.one.mockResolvedValueOnce(1)

		expect.hasAssertions()

		const queryString = `
		SELECT COUNT(id) AS count
		FROM drafts
		WHERE deleted = false
		AND user_id = $[userId]
	`

		CountServices.getUserModuleCount('whatever').then(response => {
			expect(db.one).toHaveBeenCalledWith(queryString)
			expect(response).toBe(1)
		})
	})
})
