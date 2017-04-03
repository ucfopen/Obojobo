let db = require('./db')

module.exports = (insertObject) => {
	console.log('INSERT EVENT', insertObject)
	return db.one(
		"INSERT INTO events(actor_time, action, actor, ip, metadata, payload, draft_id) VALUES (${actorTime}, ${action}, ${userId}, ${ip}, ${metadata}, ${payload}, ${draftId}) RETURNING created_at", insertObject
		, insertObject
	)
}
