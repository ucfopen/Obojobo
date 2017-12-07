let db = oboRequire('db')

module.exports = insertObject => {
	//@TODO - Delete me when every call to this method includes a caliperPayload
	if (insertObject && !insertObject.caliperPayload)
		insertObject.caliperPayload = { todo: 'send caliper event!' }

	return db.one(
		`
		INSERT INTO events
		(actor_time, action, actor, ip, metadata, payload, draft_id, caliper_payload, version)
		VALUES ($[actorTime], $[action], $[userId], $[ip], $[metadata], $[payload], $[draftId], $[caliperPayload], $[eventVersion])
		RETURNING created_at`,
		insertObject
	)
}
