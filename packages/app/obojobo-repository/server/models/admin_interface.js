const db = require('obojobo-express/server/db')
const logger = require('obojobo-express/server/logger')

const User = require('obojobo-express/server/models/user')

class AdminInterface {
	static addPermission(userId, permission) {
		// First fetch user
		User.fetchById(userId)
		.then(u => {
			let perms = u.perms
			if (perms.includes(permission)) return
			perms = [...perms, permission]

			// Then add new permission (if it is new)
			return this._updateUserPerms(userId, perms)
		})
		.catch(() => {
			throw logger.logError(`AdminInterface error finding user with id ${userId}`)
		})
	}

	static removePermission(userId, permission) {
		// First fetch user
		User.fetchById(userId)
		.then(u => {
			const perms = u.perms

			const ix = perms.indexOf(permission)
			if (ix === -1) return
			perms.splice(ix, 1)

			// Then remove permission (if present)
			return this._updateUserPerms(userId, perms)
		})
		.catch(() => {
			throw logger.logError(`AdminInterface Error finding user with id ${userId}`)
		})
	}

	static _updateUserPerms(userId, perms) {
		return db
			.oneOrNone(`
				UPDATE user_perms
				SET perms = $[perms]
				WHERE user_id = $[userId]
			`,
			{ userId, perms })
			.catch(error => {
				throw logger.logError('AdminInterface _updateUserPerms Error', error)
			})
	}
}

module.exports = AdminInterface