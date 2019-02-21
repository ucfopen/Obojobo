const db = oboRequire('db')

module.exports = insertObject => {
	return db
		.one(
			`
		INSERT INTO events
		(actor_time, action, actor, ip, metadata, payload, draft_id, draft_content_id, version, is_preview)
		VALUES ($[actorTime], $[action], $[userId], $[ip], $[metadata], $[payload], $[draftId], $[contentId], $[eventVersion], $[isPreview])
		RETURNING created_at`,
			insertObject
		)
		.then(createdAt => {
			if (insertObject.caliperPayload) {
				db.none(
					`
					INSERT INTO caliper_store
					(payload, is_preview)
					VALUES ($[caliperPayload], $[isPreview])`,
					insertObject
				)
			}

			return createdAt
		})
}
