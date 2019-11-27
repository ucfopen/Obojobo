const db = oboRequire('db')
const permissions = oboRequire('config').permissions
const crypto = require('crypto')
const oboEvents = oboRequire('obo_events')

class User {
	constructor({
		id = null,
		firstName = null,
		lastName = null,
		email = null,
		username = null,
		createdAt = Date.now(),
		roles = []
	} = {}) {
		if (firstName === null) throw 'Missing first name for new user'
		if (lastName === null) throw 'Missing last name for new user'
		if (email === null) throw 'Missing email for new user'
		if (username === null) throw 'Missing username for new user'

		this.id = id
		this.firstName = firstName
		this.lastName = lastName
		this.email = email
		this.username = username
		this.createdAt = createdAt
		this.roles = roles

		// creates 'canEditDrafts' getter if 'canEditDrafts' is set in config/role_groups.json
		for (const permName in permissions) {
			Object.defineProperty(this, permName, {
				get: this.hasPermission.bind(this, permName)
			})
		}
	}

	static dbResultToModel(result){
		return new User({
			id: result.id,
			firstName: result.first_name,
			lastName: result.last_name,
			email: result.email,
			username: result.username,
			createdAt: result.created_at,
			roles: result.roles
		})
	}

	static fetchById(userId) {
		return db
			.one(
				`
				SELECT *
				FROM users
				WHERE id =  $[userId]
				`,
				{userId}
			)
			.then(User.dbResultToModel)
			.catch(error => {
				throw logger.logError('Error fetchById', error)
			})
	}

	static clearSessionsForUserById(id) {
		return db.none(`DELETE FROM sessions WHERE sess ->> 'currentUserId' = $[id]`, { id })
			.catch(error => {
				throw logger.logError('Error clearSessionsForUserById', error)
			})
	}

	// searches by firstname, lastname, and email
	static searchForUsers(searchInput){
		// Create a quick function for quickly searching users (if missing)
		// @TODO - this COULD be in a migration?
		return db
			.none(
				`CREATE OR REPLACE FUNCTION obo_immutable_concat_ws(s text, t1 text, t2 text)
				RETURNS text AS
				$func$
				SELECT concat_ws(s, t1, t2)
				$func$ LANGUAGE sql IMMUTABLE;
				`)
			.then(() => {
				return db.manyOrNone(
					`SELECT
						*
					FROM users
					WHERE obo_immutable_concat_ws(' ', first_name, last_name)ILIKE $[searchInput]
					OR email ILIKE $[searchInput]
					OR username ILIKE $[searchInput]
					ORDER BY first_name, last_name
					LIMIT 25`,
					{ searchInput }
				)
			})
			.then(results => results.map(r => User.dbResultToModel(r)))
			.catch(error => {
				throw logger.logError('Error searchForUsers', error)
			})
	}

	saveOrCreate() {
		return db
			.one(
				`
			INSERT INTO users
				(username, email, first_name, last_name, roles)
				VALUES($[username], $[email], $[firstName], $[lastName], $[roles])
			ON CONFLICT (username) DO UPDATE SET
				email = $[email],
				first_name = $[firstName],
				last_name = $[lastName],
				roles = $[roles]
			RETURNING id
			`,
				this
			)
			.then(insertUserResult => {
				let eventName = User.EVENT_UPDATE_USER
				if (!this.id) {
					eventName = User.EVENT_NEW_USER
					// populate my id from the result
					this.id = insertUserResult.id
				}
				oboEvents.emit(eventName, this)
				return this
			})
			.catch(error => {
				throw logger.logError('Error saveOrCreate', error)
			})
	}

	isGuest() {
		return false
	}

	hasRole(expectedRole) {
		return this.roles.indexOf(expectedRole) > -1
	}

	hasRoles(expectedRoles) {
		return (
			expectedRoles.length ===
			this.roles.filter(role => {
				return expectedRoles.indexOf(role) > -1
			}).length
		)
	}

	hasOneOfRole(expectedRoles) {
		return (
			this.roles.filter(role => {
				return expectedRoles.indexOf(role) > -1
			}).length > 0
		)
	}

	hasPermission(permName) {
		if (!permissions[permName]) return false
		return this.hasOneOfRole(permissions[permName])
	}

	get avatarUrl() {
		const size = 120
		const md5Email = crypto
			.createHash('md5')
			.update(this.email)
			.digest('hex')
		return `https://secure.gravatar.com/avatar/${md5Email}?s=${size}&d=retro`
	}

	toJSON() {
		const userObj = {}
		Object.keys(this).forEach(k => {
			userObj[k] = this[k]
		})
		userObj.avatarUrl = this.avatarUrl
		return userObj
	}
}

User.EVENT_NEW_USER = 'EVENT_NEW_USER'
User.EVENT_UPDATE_USER = 'EVENT_UPDATE_USER'

module.exports = User
