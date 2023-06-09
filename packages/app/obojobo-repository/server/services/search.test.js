describe('Search Services', () => {
	jest.mock('obojobo-express/server/db')
	jest.mock('obojobo-express/server/models/user')

	let db
	let SearchServices
	let UserModel

	const mockRawUser = {
		id: 1,
		firstName: 'first',
		lastName: 'last',
		email: 'email@obojobo.com',
		username: 'username',
		createdAt: new Date().toISOString(),
		roles: '{Instructor}'
	}

	beforeEach(() => {
		jest.resetModules()
		jest.resetAllMocks()
		db = require('obojobo-express/server/db')
		SearchServices = require('./search')
		UserModel = require('obojobo-express/server/models/user')
	})
	afterEach(() => {})

	test('searchForUserByString returns a list of UserModel objects', () => {
		const mockResponse = [{ ...mockRawUser }, { ...mockRawUser, id: 2 }, { ...mockRawUser, id: 3 }]

		db.manyOrNone.mockResolvedValueOnce(mockResponse)

		db.taskIf = jest.fn()
		db.taskIf.mockImplementation(cb => cb(db))

		expect.hasAssertions()

		const manyOrNoneQueryString = `SELECT
			users.id,
			users.first_name AS "firstName",
			users.last_name AS "lastName",
			users.email,
			users.username,
			users.created_at AS "createdAt",
			users.roles,
			user_perms.perms
		FROM users
		LEFT JOIN user_perms
			ON users.id = user_perms.user_id
		WHERE obo_immutable_concat_ws(' ', users.first_name, users.last_name) ILIKE $[search]
		OR users.email ILIKE $[search]
		OR users.username ILIKE $[search]
		ORDER BY users.first_name, users.last_name
		LIMIT 25`

		return SearchServices.searchForUserByString('searchString').then(response => {
			expect(db.manyOrNone).toHaveBeenCalledWith(manyOrNoneQueryString, {
				search: '%searchString%'
			})

			expect(response[0]).toBeInstanceOf(UserModel)
			expect(response[0].id).toBe(1)
			expect(response[0].firstName).toBe('first')
			expect(response[0].lastName).toBe('last')
			expect(response[0].email).toBe('email@obojobo.com')

			expect(response[1]).toBeInstanceOf(UserModel)
			expect(response[1].id).toBe(2)

			expect(response[2]).toBeInstanceOf(UserModel)
			expect(response[2].id).toBe(3)
		})
	})
})
