const db = oboRequire('server/db')
//const logger = oboRequire('server/logger')
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
				WHERE id = $[userId]
			`,
			{
				userId,
				today
			}
		)
		.catch(error => {
			logger.error('DB UNEXPECTED on users.set', error, error.toString())
		})
} */
function getLastLogin(userId) {
	return db.oneOrNone(
		`
				SELECT created_at FROM users
				WHERE id = $[userId]
			`,
		{
			userId
		}
	)
}

module.exports = {
	//setLastLogin,
	getLastLogin
}
