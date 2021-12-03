const db = oboRequire('server/db')

module.exports = async insertObject => {
	insertObject.visitId = insertObject.visitId || null

	return db.taskIf(async t => {
		const insertEventResult = await t.one(
			`INSERT INTO events
			(actor_time, action, actor, ip, metadata, payload, draft_id, draft_content_id, version, is_preview, visit_id)
			VALUES ($[actorTime], $[action], $[userId], $[ip], $[metadata], $[payload], $[draftId], $[contentId], $[eventVersion], $[isPreview], $[visitId])
			RETURNING *`,
			insertObject
		)

		return insertEventResult
	})
}
