const db = require('obojobo-express/server/db')

const getUserModuleCount = async userId => {
	const countQuery = await db.one(
		`
		SELECT COUNT(id) AS count
		FROM drafts
		WHERE deleted = FALSE
		AND user_id = $[userId]
	`,
		{ userId }
	)

	return parseInt(countQuery.count, 10)
}

module.exports = {
	getUserModuleCount
}
