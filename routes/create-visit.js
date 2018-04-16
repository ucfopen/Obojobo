let db = oboRequire('db')

let deactivateOldVisitsAndCreateNewVisit = (userId, draftId, resourceLinkId, launchId, preview) => {
	return db
		.none(
			`UPDATE visits
		SET is_active = false
		WHERE user_id = $[userId]
		AND draft_id = $[draftId]`,
			{
				draftId,
				userId
			}
		)
		.then(() => {
			return db.one(
				`SELECT *
				FROM drafts_content
				WHERE draft_id = $[draftId]
				ORDER BY created_at DESC
				LIMIT 1`,
				{
					draftId
				}
			)
		})
		.then(draftsContent => {
			return db.one(
				`INSERT INTO visits
				(draft_id, draft_content_id, user_id, launch_id, resource_link_id, is_active, preview)
				VALUES ($[draftId], $[draftContentId], $[userId], $[launchId], $[resourceLinkId], true, $[preview])
				RETURNING id`,
				{
					draftId,
					draftContentId: draftsContent.id,
					userId,
					resourceLinkId,
					launchId,
					preview
				}
			)
		})
}

let createVisit = (userId, draftId, resourceLinkId, launchId) => {
	return deactivateOldVisitsAndCreateNewVisit(userId, draftId, resourceLinkId, launchId, false)
}

let createPreviewVisit = (userId, draftId) => {
	return deactivateOldVisitsAndCreateNewVisit(userId, draftId, null, null, true)
}

module.exports = { createVisit, createPreviewVisit }
