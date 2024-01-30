const db = oboRequire('server/db')

function getNotifications(ids) {
	if (ids !== 0) {
		return db.manyOrNone(
			`
				SELECT title,text 
				FROM notifications
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
			FROM notifications
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
			INSERT INTO users (id, last_login)
			VALUES ($[userId], $[today])
			ON CONFLICT (id) DO UPDATE
			SET last_login = EXCLUDED.last_login
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
