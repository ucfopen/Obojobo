const db = oboRequire('server/db')

function getStatus(id) {
	return db.oneOrNone(
		`
		SELECT status FROM notification_status
		WHERE
			id = $[id]
	`,
		{
			id
		}
	)
}
function getTitle(id) {
	return db.oneOrNone(
		`
		SELECT title FROM notification_status
		WHERE
			id = $[id]
	`,
		{
			id
		}
	)
}
function getText(id) {
	return db.oneOrNone(
		`
		SELECT text FROM notification_status
		WHERE
			id = $[id]
	`,
		{
			id
		}
	)
}
function getId(lastLoginDate) {
	return db.oneOrNone(
		`
			SELECT id FROM notification_status
			WHERE created_at >= $[lastLoginDate]
			LIMIT 1
		`,
		{
			lastLoginDate
		}
	)
}

module.exports = {
	getStatus,
	getTitle,
	getText,
	getId
}
