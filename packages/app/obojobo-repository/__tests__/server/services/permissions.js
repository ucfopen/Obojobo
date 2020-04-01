describe('Permissions Services', () => {
	jest.mock('obojobo-express/server/db')
	jest.mock('obojobo-express/server/models/user')

	let db
	let PermissionsServices
	let UserModel

	const publicLibCollectionId = require('../../../shared/publicLibCollectionId')

	const mockRawUser = {
		id: 0,
		firstName: 'first',
		lastName: 'last',
		email: 'email@obojobo.com',
		username: 'username',
		createdAt: new Date().toISOString(),
		roles: '{Instructor}'
	}

	const publicDraftQueryString = `
		SELECT draft_id
		FROM repository_map_drafts_to_collections
		WHERE draft_id = $[draftId] AND collection_id = $[publicLibCollectionId]
		`
	const userDraftPermissionQueryString = `SELECT user_id
		FROM repository_map_user_to_draft
		WHERE draft_id = $[draftId]
		AND user_id = $[userId]`
	const userCollectionPermissionQueryString = `SELECT user_id
		FROM repository_collections
		WHERE id = $[collectionId]
		AND user_id = $[userId]`

	beforeEach(() => {
		jest.resetModules()
		jest.resetAllMocks()
		db = require('obojobo-express/server/db')
		PermissionsServices = require('../../../server/services/permissions')
		UserModel = require('obojobo-express/server/models/user')
	})
	afterEach(() => {})

	test('fetchAllUsersWithPermissionToDraft returns a list of UserModels', () => {
		db.manyOrNone = jest.fn()
		db.manyOrNone.mockResolvedValueOnce([mockRawUser])

		expect.hasAssertions()

		const queryString = `SELECT
			users.id,
			users.first_name AS "firstName",
			users.last_name AS "lastName",
			users.email,
			users.username,
			users.created_at AS "createdAt",
			users.roles
		FROM repository_map_user_to_draft
		JOIN users
		ON users.id = user_id
		WHERE draft_id = $[draftId]
		ORDER BY users.first_name, users.last_name`

		PermissionsServices.fetchAllUsersWithPermissionToDraft('whatever').then(response => {
			expect(db.manyOrNone).toHaveBeenCalledWith(queryString, { draftId: 'whatever' })
			expect(response.length).toBe(1)
			const um = response[0]
			expect(um).toBeInstanceOf(UserModel)
			expect(um.id).toBe(0)
			expect(um.firstName).toBe('first')
			expect(um.lastName).toBe('last')
			expect(um.email).toBe('email@obojobo.com')
		})
	})

	test('userHasPermissionToCopy returns true when a draft is public, but a user does not have access', () => {
		db.oneOrNone = jest.fn()
		db.oneOrNone.mockResolvedValueOnce('whatever').mockResolvedValueOnce(null)

		expect.hasAssertions()

		PermissionsServices.userHasPermissionToCopy(1, 'whatever').then(response => {
			expect(db.oneOrNone).toHaveBeenCalledTimes(2)
			expect(db.oneOrNone.mock.calls).toStrictEqual([
				[publicDraftQueryString, { draftId: 'whatever' }],
				[userDraftPermissionQueryString, { userId: 1 }]
			])
			expect(response).toBe(true)
		})
	})

	test('userHasPermissionToCopy returns true when a draft is not public, but a user has access', () => {
		db.oneOrNone = jest.fn()
		db.oneOrNone.mockResolvedValueOnce(null).mockResolvedValueOnce(1)

		expect.hasAssertions()

		PermissionsServices.userHasPermissionToCopy(1, 'whatever').then(response => {
			expect(db.oneOrNone).toHaveBeenCalledTimes(2)
			expect(db.oneOrNone.mock.calls).toStrictEqual([
				[publicDraftQueryString, { draftId: 'whatever', publicLibCollectionId }],
				[userDraftPermissionQueryString, { userId: 1, draftId: 'whatever' }]
			])
			expect(response).toBe(true)
		})
	})

	test('userHasPermissionToCopy returns false when a draft is not public and a user does not have access', () => {
		db.oneOrNone = jest.fn()
		db.oneOrNone.mockResolvedValueOnce(null).mockResolvedValueOnce(null)

		expect.hasAssertions()

		PermissionsServices.userHasPermissionToCopy(1, 'whatever').then(response => {
			expect(db.oneOrNone).toHaveBeenCalledTimes(2)
			expect(db.oneOrNone.mock.calls).toStrictEqual([
				[publicDraftQueryString, { draftId: 'whatever', publicLibCollectionId }],
				[userDraftPermissionQueryString, { userId: 1, draftId: 'whatever' }]
			])
			expect(response).toBe(false)
		})
	})

	test('userHasPermissionToDraft returns a boolean value', () => {
		db.oneOrNone = jest.fn()
		db.oneOrNone.mockResolvedValueOnce(1)

		expect.hasAssertions()

		PermissionsServices.userHasPermissionToDraft(1, 'whatever').then(response => {
			expect(db.oneOrNone).toHaveBeenCalledTimes(1)
			expect(db.oneOrNone).toHaveBeenCalledWith(userDraftPermissionQueryString, {
				userId: 1,
				draftId: 'whatever'
			})
			expect(response).toBe(false)
		})
	})

	test('userHasPermissionToCollection returns a boolean value', () => {
		db.oneOrNone = jest.fn()
		db.oneOrNone.mockResolvedValueOnce(1)

		expect.hasAssertions()

		PermissionsServices.userHasPermissionToCollection(1, 'whatever').then(response => {
			expect(db.oneOrNone).toHaveBeenCalledTimes(1)
			expect(db.oneOrNone).toHaveBeenCalledWith(userCollectionPermissionQueryString, {
				userId: 1,
				collectionId: 'whatever'
			})
			expect(response).toBeInstanceOf(Boolean)
		})
	})

	test('addUserPermissionToDraft runs the correct query', () => {
		db.none = jest.fn()

		expect.hasAssertions()

		const queryString = `INSERT
		INTO repository_map_user_to_draft
		(draft_id, user_id)
		VALUES($[draftId], $[userId])
		ON CONFLICT DO NOTHING`

		PermissionsServices.addUserPermissionToDraft(1, 'whatever').then(() => {
			expect(db.none).toHaveBeenCalledTimes(1)
			expect(db.none).toHaveBeenCalledWith(queryString, { userId: 1, draftId: 'whatever' })
		})
	})

	test('removeUserPermissionToDraft runs the correct query', () => {
		db.none = jest.fn()

		expect.hasAssertions()

		const queryString = `DELETE
		FROM repository_map_user_to_draft
		WHERE draft_id = $[draftId]
		AND user_id = $[userId]
		`

		PermissionsServices.removeUserPermissionToDraft(1, 'whatever').then(() => {
			expect(db.none).toHaveBeenCalledTimes(1)
			expect(db.none).toHaveBeenCalledWith(queryString, { userId: 1, draftId: 'whatever' })
		})
	})
})
