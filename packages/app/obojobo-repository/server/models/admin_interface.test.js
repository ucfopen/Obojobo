jest.mock('obojobo-express/server/db')
jest.mock('obojobo-express/server/logger')
jest.mock('obojobo-express/server/models/user')
jest.mock('../../shared/util/implicit-perms', () => ({
	PERMS_PER_ROLE: {
		mockRole: ['mockExistingPermission']
	}
}))

const db = require('obojobo-express/server/db')
const logger = require('obojobo-express/server/logger')

const User = require('obojobo-express/server/models/user')

const AdminInterface = require('./admin_interface')

describe('AdminInterface Model', () => {
	let expectedResponseUser

	beforeEach(() => {
		jest.resetModules()
		jest.resetAllMocks()

		expectedResponseUser = {
			perms: [],
			roles: []
		}

		// provide this by defualt, override in individual tests if necessary
		// if every test ends up overriding this, just remove this one
		User.fetchById = jest.fn().mockResolvedValueOnce(expectedResponseUser)
	})

	test('addPermission does nothing if trying to add a permission the given user already has', () => {
		expect.assertions(2)

		// set the user's permissions such that they already have the one we're trying to give them
		// ideally we could check implicit and explicit perms separately, but they're added to a single
		//  array inside the User model so our only option is to check the one location
		expectedResponseUser.perms = ['someExistingPermission']
		User.fetchById = jest.fn().mockResolvedValueOnce(expectedResponseUser)

		return AdminInterface.addPermission(5, 'someExistingPermission').then(u => {
			expect(u).toEqual(expectedResponseUser)
			expect(db.oneOrNone).not.toHaveBeenCalled()
		})
	})

	test('addPermission only saves explicitly granted permissions', () => {
		expect.assertions(3)

		db.oneOrNone.mockResolvedValueOnce(5)

		// 'mockRole' will account for the 'mockExistingPermission' perm below
		expectedResponseUser.roles = ['mockRole']
		expectedResponseUser.perms = ['someExistingPermission', 'mockExistingPermission']
		User.fetchById = jest.fn().mockResolvedValueOnce(expectedResponseUser)

		return AdminInterface.addPermission(5, 'someNewPermission').then(u => {
			expect(u).toEqual({
				...expectedResponseUser,
				perms: ['someExistingPermission', 'mockExistingPermission', 'someNewPermission']
			})
			expect(db.oneOrNone).toHaveBeenCalledTimes(1)
			// first argument to db function is the query string, no need to check that
			expect(db.oneOrNone.mock.calls[0][1]).toEqual({
				userId: 5,
				// since 'mockExistingPermission' is a perm-based/implicit perm,
				//  it should not have been saved explicitly
				perms: ['someExistingPermission', 'someNewPermission']
			})
		})
	})

	test('addPermission catches error when fetching user with invalid id', () => {
		User.fetchById = jest.fn().mockRejectedValueOnce('mock-error')

		expect.hasAssertions()

		return AdminInterface.addPermission(123456, 'someNewPermission').catch(() => {
			expect(logger.logError).toHaveBeenCalledWith(
				'AdminInterface error finding user with id 123456'
			)
		})
	})

	test('addPermission catches error when updating user perms', () => {
		expect.hasAssertions()

		db.oneOrNone.mockRejectedValueOnce('mock-error')

		return AdminInterface.addPermission(5, 'someNewPermission').catch(() => {
			expect(logger.logError).toHaveBeenCalledTimes(2)
			expect(logger.logError).toHaveBeenCalledWith(
				'AdminInterface _updateUserPerms error',
				'mock-error'
			)
			expect(logger.logError).toHaveBeenCalledWith('AdminInterface error adding permission')
		})
	})

	test('removePermission does nothing if trying to remove a permission the given user does not have', () => {
		expect.assertions(2)

		// set the user's permissions such that they already have the one we're trying to give them
		// ideally we could check implicit and explicit perms separately, but they're added to a single
		//  array inside the User model so our only option is to check the one location
		expectedResponseUser.perms = ['someOtherPermission']
		User.fetchById = jest.fn().mockResolvedValueOnce(expectedResponseUser)

		return AdminInterface.removePermission(5, 'someExistingPermission').then(u => {
			expect(u).toEqual(expectedResponseUser)
			expect(db.oneOrNone).not.toHaveBeenCalled()
		})
	})

	test('removePermission does nothing if trying to remove a permission the given user has implicitly', () => {
		expect.assertions(2)

		expectedResponseUser.roles = ['mockRole']
		expectedResponseUser.perms = ['someExistingPermission', 'mockExistingPermission']
		User.fetchById = jest.fn().mockResolvedValueOnce(expectedResponseUser)

		return AdminInterface.removePermission(5, 'mockExistingPermission').then(u => {
			expect(u).toEqual(expectedResponseUser)
			expect(db.oneOrNone).not.toHaveBeenCalled()
		})
	})

	test('removePermission saves explicit permissions after removing one from the given user', () => {
		db.oneOrNone.mockResolvedValueOnce(5)

		// 'mockRole' will account for the 'mockExistingPermission' perm below
		expectedResponseUser.roles = ['mockRole']
		expectedResponseUser.perms = [
			'someExistingPermission',
			'someOtherExistingPermission',
			'mockExistingPermission'
		]
		User.fetchById = jest.fn().mockResolvedValueOnce(expectedResponseUser)

		return AdminInterface.removePermission(5, 'someOtherExistingPermission').then(u => {
			expect(u).toEqual({
				...expectedResponseUser,
				perms: ['mockExistingPermission', 'someExistingPermission']
			})
			expect(db.oneOrNone).toHaveBeenCalledTimes(1)
			expect(db.oneOrNone.mock.calls[0][1]).toEqual({
				userId: 5,
				perms: ['someExistingPermission']
			})
		})
	})

	test('removePermission catches error when fetching user with invalid id', () => {
		User.fetchById = jest.fn().mockRejectedValueOnce('mock-error')

		expect.hasAssertions()

		return AdminInterface.removePermission(123456, 'someExistingPermission').catch(() => {
			expect(logger.logError).toHaveBeenCalledWith(
				'AdminInterface error finding user with id 123456'
			)
		})
	})

	test('removePermission catches error when updating user perms', () => {
		expect.hasAssertions()

		db.oneOrNone.mockRejectedValueOnce('mock-error')

		expectedResponseUser.perms = ['someExistingPermission']

		return AdminInterface.removePermission(5, 'someExistingPermission').catch(() => {
			expect(logger.logError).toHaveBeenCalledTimes(2)
			expect(logger.logError).toHaveBeenCalledWith(
				'AdminInterface _updateUserPerms error',
				'mock-error'
			)
			expect(logger.logError).toHaveBeenCalledWith('AdminInterface error removing permission')
		})
	})
})
