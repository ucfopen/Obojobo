const db = oboRequire('server/db')

function getNotifications(ids) {
	if (ids !== 0) {
		return db.manyOrNone(
			`
				SELECT title,text 
				FROM notification_status
				WHERE id IN ($[ids:csv])
				ORDER BY id ASC
			`,
			{
				ids
			}
		)
	}
}

function getRecentNotifications(date) {
	return db.manyOrNone(
		`
			SELECT id
			FROM notification_status
			WHERE created_at >= $[date]
			ORDER BY created_at ASC
		`,
		{
			date
		}
	)
}

function setLastLogin(userId, today) {
	return db.none(
		`
			INSERT INTO users (last_login)
			VALUES ($[today])]
			ON CONFLICT (last_login) DO UPDATE
			WHERE id == $[userId]
		`,
		{
			userId,
			today
		}
	)
}

module.exports = {
	getNotifications,
	getRecentNotifications,
	setLastLogin
}
