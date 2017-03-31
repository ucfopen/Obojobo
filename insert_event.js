let db = require('./db')

module.exports = (insertObject) => {
	return db.one(
		"INSERT INTO events(actor_time, action, actor, ip, metadata, payload) VALUES (${actorTime}, ${action}, ${userId}, ${ip}, ${metadata}, ${payload}) RETURNING created_at", insertObject
		, insertObject
	)
}
