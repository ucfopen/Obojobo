const db = require('obojobo-express/server/db')
const logger = require('obojobo-express/server/logger')

const User = require('obojobo-express/server/models/user')

const { PERMS_PER_ROLE } = require('../../shared/util/implicit-perms')

class AdminInterface {
	static addPermission(userId, permission) {
		return new Promise((resolve, reject) => {
			User.fetchById(userId)
				.then(u => {
					let perms = u.perms
					if (perms.includes(permission)) return resolve(u)

					perms = [...u.perms, permission]

					const allRolePerms = new Set()

					u.roles.forEach(role => {
						PERMS_PER_ROLE[role].forEach(perm => allRolePerms.add(perm))
					})

					perms = perms.filter(p => !allRolePerms.has(p))

					const dedupedPerms = new Set([...u.perms, ...perms])
					u.perms = [...dedupedPerms]

					// Then add new permission (if it is new)
					this._updateUserPerms(userId, perms)
						.then(() => resolve(u))
						.catch(() => {
							reject(logger.logError(`AdminInterface error adding permission`))
						})
				})
				.catch(() => {
					reject(logger.logError(`AdminInterface error finding user with id ${userId}`))
				})
		})
	}

	static removePermission(userId, permission) {
		return new Promise((resolve, reject) => {
			User.fetchById(userId)
				.then(u => {
					const allRolePerms = new Set()

					u.roles.forEach(role => {
						PERMS_PER_ROLE[role].forEach(perm => allRolePerms.add(perm))
					})

					const perms = u.perms.filter(p => !allRolePerms.has(p))

					const ix = perms.indexOf(permission)
					if (ix === -1) return resolve(u)
					perms.splice(ix, 1)

					// add any remaining perms to the 'allRolePerms' set so we can use it to set the user's new combined perms
					perms.forEach(p => allRolePerms.add(p))

					u.perms = [...allRolePerms]

					// Then remove permission (if present)
					this._updateUserPerms(userId, perms)
						.then(() => resolve(u))
						.catch(() => {
							reject(logger.logError(`AdminInterface error removing permission`))
						})
				})
				.catch(() => {
					reject(logger.logError(`AdminInterface error finding user with id ${userId}`))
				})
		})
	}

	static _updateUserPerms(userId, perms) {
		return new Promise((resolve, reject) => {
			db.oneOrNone(
				`
				INSERT INTO user_perms (user_id, perms)
				VALUES ($[userId], $[perms])
				ON CONFLICT (user_id)
				DO UPDATE SET perms = $[perms]
				WHERE user_perms.user_id = $[userId]
			`,
				{ userId, perms }
			)
				.then(() => resolve(userId))
				.catch(error => {
					reject(logger.logError('AdminInterface _updateUserPerms error', error))
				})
		})
	}
}

module.exports = AdminInterface
