const db = oboRequire('server/db')

module.exports = async insertObject => {
	insertObject.visitId = insertObject.visitId || null

	// if (insertObject.action === 'question:setResponse') {
	// 	const r = Math.random()
	// 	console.log('r', r)
	// 	if (r < 0.333) {
	// 		await new Promise(r => setTimeout(r, 16000))
	// 	} else if (r > 0.666) {
	// 		throw 'Failed to insert event'
	// 	}
	// }

	return db.taskIf(async t => {
		const insertEventResult = await t.one(
			`INSERT INTO events
			(actor_time, action, actor, ip, metadata, payload, draft_id, draft_content_id, version, is_preview, visit_id)
			VALUES ($[actorTime], $[action], $[userId], $[ip], $[metadata], $[payload], $[draftId], $[contentId], $[eventVersion], $[isPreview], $[visitId])
			RETURNING *`,
			insertObject
		)

		if (insertObject.caliperPayload) {
			// Add in internal event id to extensions object:
			if (!insertObject.caliperPayload.extensions) {
				insertObject.caliperPayload.extensions = {}
			}
			insertObject.caliperPayload.extensions.internalEventId = insertEventResult.id

			// Don't bother including this in the promise chain
			// It's considered a non-essential insert and we're
			// not going to wait for it
			await t.none(
				`
				INSERT INTO caliper_store
				(payload, is_preview)
				VALUES ($[caliperPayload], $[isPreview])`,
				insertObject
			)
		}

		return insertEventResult
	})
}
