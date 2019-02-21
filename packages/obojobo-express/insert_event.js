const db = oboRequire('db')

module.exports = insertObject => {
	return db
		.one(
			`
		INSERT INTO events
		(actor_time, action, actor, ip, metadata, payload, draft_id, draft_content_id, version, is_preview)
		VALUES ($[actorTime], $[action], $[userId], $[ip], $[metadata], $[payload], $[draftId], $[contentId], $[eventVersion], $[isPreview])
		RETURNING *`,
			insertObject
		)
		.then(createdEvent => {
			if (insertObject.caliperPayload) {
				// Add in internal event id to extensions object:
				if (!insertObject.caliperPayload.extensions) {
					insertObject.caliperPayload.extensions = {}
				}
				insertObject.caliperPayload.extensions.internalEventId = createdEvent.id

				db.none(
					`
					INSERT INTO caliper_store
					(payload, is_preview)
					VALUES ($[caliperPayload], $[isPreview])`,
					insertObject
				)
			}

			return createdEvent
		})
}
