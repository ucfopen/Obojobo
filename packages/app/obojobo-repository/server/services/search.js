/* eslint-disable no-console */
const db = require('obojobo-express/server/db')
const UserModel = require('obojobo-express/server/models/user')

const searchForUserByString = async searchString => {
	return db
		.manyOrNone(
			`SELECT
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
		LIMIT 25`,
			{ search: `%${searchString}%` }
		)
		.then(users => users.map(u => new UserModel(u)))
}

module.exports = {
	searchForUserByString
}
