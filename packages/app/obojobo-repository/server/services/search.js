const db = require('obojobo-express/db')
const UserModel = require('obojobo-express/models/user')

const searchForUserByString = async searchString => {
	// creates a function to make searching firstname and lastname together faster
	await db.none(
		`CREATE OR REPLACE FUNCTION obo_immutable_concat_ws(s text, t1 text, t2 text)
			RETURNS text AS
			$func$
			SELECT concat_ws(s, t1, t2)
			$func$ LANGUAGE sql IMMUTABLE;
			`
	)

	const users = await db.manyOrNone(
		`SELECT
				id,
				first_name AS "firstName",
				last_name AS "lastName",
				email,
				username,
				created_at AS "createdAt",
				roles
			FROM users
			WHERE obo_immutable_concat_ws(' ', first_name, last_name) ILIKE $[search]
			OR email ILIKE $[search]
			OR username ILIKE $[search]
			ORDER BY first_name, last_name
			LIMIT 25`,
		{ search: `%${searchString}%` }
	)

	return users.map(u => new UserModel(u))
}

module.exports = {
	searchForUserByString
}
