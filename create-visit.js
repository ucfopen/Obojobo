let db = oboRequire('db')

// use to initiate a new visit for a draft
// this will deactivate old visits, preventing
// them from being used again
let deactivateOldVisitsAndCreateNewVisit = (userId, draftId, resourceLinkId, launchId, isPreview) => {
	return db.none(
			// deactivate all my visits for this draft
			`UPDATE visits
			SET is_active = false
			WHERE user_id = $[userId]
			AND draft_id = $[draftId]`,
			{
				draftId,
				userId
			}
		)
		.then(() => db.one(
			// get id of the newest version of the draft
			`SELECT id
			FROM drafts_content
			WHERE draft_id = $[draftId]
			ORDER BY created_at DESC
			LIMIT 1`,
			{
				draftId
			}
		))
		.then(draftsContent => db.one(
			// Create a new visit
			`INSERT INTO visits
			(draft_id, draft_content_id, user_id, launch_id, resource_link_id, is_active, is_preview)
			VALUES ($[draftId], $[draftContentId], $[userId], $[launchId], $[resourceLinkId], true, $[isPreview])
			RETURNING id`,
			{
				draftId,
				draftContentId: draftsContent.id,
				userId,
				resourceLinkId,
				launchId,
				isPreview
			}
		))
}

// create a student visit
// deactivates all previous visits
let createVisit = (userId, draftId, resourceLinkId, launchId) => {
	return deactivateOldVisitsAndCreateNewVisit(userId, draftId, resourceLinkId, launchId, false)
}

// create a preview visit
// deactivates all previous visits
let createPreviewVisit = (userId, draftId) => {
	return deactivateOldVisitsAndCreateNewVisit(userId, draftId, null, null, true)
}

module.exports = { createVisit, createPreviewVisit }
