describe('Permissions Services', () => {
	jest.mock('obojobo-express/server/db')
	jest.mock('obojobo-express/server/models/user')

	let db
	let PermissionsServices
	let UserModel

	const publicLibCollectionId = require('../../shared/publicLibCollectionId')

	const mockRawUser = {
		id: 1,
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

	beforeEach(() => {
		jest.resetModules()
		jest.resetAllMocks()
		db = require('obojobo-express/server/db')
		PermissionsServices = require('./permissions')
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

		return PermissionsServices.fetchAllUsersWithPermissionToDraft('mockDraftId').then(response => {
			expect(db.manyOrNone).toHaveBeenCalledWith(queryString, { draftId: 'mockDraftId' })
			expect(response.length).toBe(1)
			const um = response[0]
			expect(um).toBeInstanceOf(UserModel)
			expect(um.id).toBe(mockRawUser.id)
			expect(um.firstName).toBe(mockRawUser.firstName)
			expect(um.lastName).toBe(mockRawUser.lastName)
			expect(um.email).toBe(mockRawUser.email)
		})
	})

	test('userHasPermissionToCopy returns true when a draft is public, but a user does not have access', () => {
		db.oneOrNone = jest.fn()
		db.oneOrNone.mockResolvedValueOnce('mockDraftId').mockResolvedValueOnce(null)

		expect.hasAssertions()

		return PermissionsServices.userHasPermissionToCopy(mockRawUser.id, 'mockDraftId').then(
			response => {
				expect(db.oneOrNone).toHaveBeenCalledTimes(2)

				expect(db.oneOrNone.mock.calls[0]).toEqual([
					publicDraftQueryString,
					{ draftId: 'mockDraftId', publicLibCollectionId }
				])
				expect(db.oneOrNone.mock.calls[1]).toEqual([
					userDraftPermissionQueryString,
					{ userId: mockRawUser.id, draftId: 'mockDraftId' }
				])

				expect(response).toBe(true)
			}
		)
	})

	test('userHasPermissionToCopy returns true when a draft is not public, but a user has access', () => {
		db.oneOrNone = jest.fn()
		db.oneOrNone.mockResolvedValueOnce(null).mockResolvedValueOnce(1)

		expect.hasAssertions()

		return PermissionsServices.userHasPermissionToCopy(mockRawUser.id, 'mockDraftId').then(
			response => {
				expect(db.oneOrNone).toHaveBeenCalledTimes(2)

				expect(db.oneOrNone.mock.calls[0]).toEqual([
					publicDraftQueryString,
					{ draftId: 'mockDraftId', publicLibCollectionId }
				])
				expect(db.oneOrNone.mock.calls[1]).toEqual([
					userDraftPermissionQueryString,
					{ userId: mockRawUser.id, draftId: 'mockDraftId' }
				])

				expect(response).toBe(true)
			}
		)
	})

	test('userHasPermissionToCopy returns false when a draft is not public and a user does not have access', () => {
		db.oneOrNone = jest.fn()
		db.oneOrNone.mockResolvedValueOnce(null).mockResolvedValueOnce(null)

		expect.hasAssertions()

		return PermissionsServices.userHasPermissionToCopy(mockRawUser.id, 'mockDraftId').then(
			response => {
				expect(db.oneOrNone).toHaveBeenCalledTimes(2)

				expect(db.oneOrNone.mock.calls[0]).toEqual([
					publicDraftQueryString,
					{ draftId: 'mockDraftId', publicLibCollectionId }
				])
				expect(db.oneOrNone.mock.calls[1]).toEqual([
					userDraftPermissionQueryString,
					{ userId: mockRawUser.id, draftId: 'mockDraftId' }
				])

				expect(response).toBe(false)
			}
		)
	})

	test('userHasPermissionToDraft returns true when the user has permission', () => {
		db.oneOrNone = jest.fn()
		db.oneOrNone.mockResolvedValueOnce(mockRawUser.id)

		expect.hasAssertions()

		return PermissionsServices.userHasPermissionToDraft(mockRawUser.id, 'mockDraftId').then(
			response => {
				expect(db.oneOrNone).toHaveBeenCalledTimes(1)
				expect(db.oneOrNone).toHaveBeenCalledWith(userDraftPermissionQueryString, {
					userId: mockRawUser.id,
					draftId: 'mockDraftId'
				})
				expect(response).toBe(true)
			}
		)
	})

	test('userHasPermissionToDraft returns false when the user does not have permission', () => {
		db.oneOrNone = jest.fn()
		db.oneOrNone.mockResolvedValueOnce(null)

		expect.hasAssertions()

		return PermissionsServices.userHasPermissionToDraft(mockRawUser.id, 'mockDraftId').then(
			response => {
				expect(db.oneOrNone).toHaveBeenCalledTimes(1)
				expect(db.oneOrNone).toHaveBeenCalledWith(userDraftPermissionQueryString, {
					userId: mockRawUser.id,
					draftId: 'mockDraftId'
				})
				expect(response).toBe(false)
			}
		)
	})

	test('addUserPermissionToDraft runs the correct query', () => {
		db.none = jest.fn()

		expect.hasAssertions()

		const queryString = `INSERT
		INTO repository_map_user_to_draft
		(draft_id, user_id)
		VALUES($[draftId], $[userId])
		ON CONFLICT DO NOTHING`

		return PermissionsServices.addUserPermissionToDraft(mockRawUser.id, 'mockDraftId').then(() => {
			expect(db.none).toHaveBeenCalledTimes(1)
			expect(db.none).toHaveBeenCalledWith(queryString, {
				userId: mockRawUser.id,
				draftId: 'mockDraftId'
			})
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

		return PermissionsServices.removeUserPermissionToDraft(mockRawUser.id, 'mockDraftId').then(
			() => {
				expect(db.none).toHaveBeenCalledTimes(1)
				expect(db.none).toHaveBeenCalledWith(queryString, {
					userId: mockRawUser.id,
					draftId: 'mockDraftId'
				})
			}
		)
	})
})
