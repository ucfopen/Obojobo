let db = oboRequire('db')

module.exports = insertObject => {
	return db
		.one(
			`
		INSERT INTO events
		(actor_time, action, actor, ip, metadata, payload, draft_id, version)
		VALUES ($[actorTime], $[action], $[userId], $[ip], $[metadata], $[payload], $[draftId], $[eventVersion])
		RETURNING created_at`,
			insertObject
		)
		.then(createdAt => {
			if (insertObject.caliperPayload) {
				db.none(
					`
					INSERT INTO caliper_store
					(payload)
					VALUES ($[caliperPayload])`,
					insertObject
				)
			}

			return createdAt
		})
}
