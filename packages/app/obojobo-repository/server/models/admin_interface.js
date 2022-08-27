const db = require('obojobo-express/server/db')
const logger = require('obojobo-express/server/logger')

const User = require('obojobo-express/server/models/user')

class AdminInterface {
	static addPermission(userId, permission) {
		return new Promise((resolve, reject) => {
			// First fetch user
			User.fetchById(userId)
			.then(u => {
				let perms = u.perms
				if (perms.includes(permission)) return
				perms = [...perms, permission]

				// Then add new permission (if it is new)
				this._updateUserPerms(userId, perms)
				.then(id => resolve(id))
				.catch(() => {
					reject()
					throw logger.logError(`AdminInterface error adding permission`)
				})
			})
			.catch(err => {
				reject()
				throw logger.logError(`AdminInterface error finding user with id ${userId}`)
			})
		})
	}

	static removePermission(userId, permission) {
		return new Promise((resolve, reject) => {
			// First fetch user
			User.fetchById(userId)
			.then(u => {
				const perms = u.perms

				const ix = perms.indexOf(permission)
				if (ix === -1) return
				perms.splice(ix, 1)

				// Then remove permission (if present)
				this._updateUserPerms(userId, perms)
				.then(id => resolve(id))
				.catch(() => {
					reject()
					throw logger.logError(`AdminInterface error removing permission`)
				})
			})
			.catch(() => {
				reject()
				throw logger.logError(`AdminInterface Error finding user with id ${userId}`)
			})
		})
	}

	static _updateUserPerms(userId, perms) {
		return new Promise((resolve, reject) => {
			db.oneOrNone(`
				UPDATE user_perms
				SET perms = $[perms]
				WHERE user_id = $[userId]
			`,
			{ userId, perms })
			.then(() => resolve(userId))
			.catch(error => {
				reject()
				throw logger.logError('AdminInterface _updateUserPerms Error', error)
			})
		})
	}
}

module.exports = AdminInterface