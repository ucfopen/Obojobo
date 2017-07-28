let db = oboRequire('db')

module.exports = insertObject => {
	return db.one(
		`
		INSERT INTO events
		(actor_time, action, actor, ip, metadata, payload, draft_id)
		VALUES ($[actorTime], $[action], $[userId], $[ip], $[metadata], $[payload], $[draftId])
		RETURNING created_at`,
		insertObject
	)
}
