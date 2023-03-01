const db = oboRequire('server/db')
//const logger = oboRequire('server/logger')

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
/*
function setLastLogin(userId){
	const date = new Date();
	const today = date.getDate();
	return db
		.none(
			`
				INSERT INTO users
				(id, last_login)
				VALUES($[userId], $[today])
				ON CONFLICT (id) DO UPDATE
				SET last_login = $[today]
				WHERE users.id = $[userId]
			`,
			{
				userId,
				today
			}
		)
		.catch(error => {
			logger.error('DB UNEXPECTED on users.set', error, error.toString())
		})
}
function getLastLogin(userId){
	return db
		.oneOrNone(
			`
            SELECT last_login FROM users
            WHERE id = $[userId]
			LIMIT 1
			`,
			{
				userId,
			}
		)
		.catch(error => {
			logger.error('DB UNEXPECTED on users.set', error, error.toString())
		})
    }
function getId(lastLoginDate){
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
*/
module.exports = {
	getStatus,
	getTitle,
	getText
	// setLastLogin,
	// getLastLogin,
	//getId
}
