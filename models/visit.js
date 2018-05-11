let db = require('../db')
let logger = require('../logger.js')

// use to initiate a new visit for a draft
// this will deactivate old visits, preventing
// them from being used again
let deactivateOldVisitsAndCreateNewVisit = (
	userId,
	draftId,
	resourceLinkId,
	launchId,
	isPreview
) => {
	let deactivatedVisitIds
	return db
		.manyOrNone(
			// deactivate all my visits for this draft
			`UPDATE visits
			SET is_active = false
			WHERE user_id = $[userId]
			AND draft_id = $[draftId]
			AND is_active = true
			RETURNING id`,
			{
				draftId,
				userId
			}
		)
		.then(deactivatedVisits => {
			// get the visits and squash them into an array of ids
			deactivatedVisitIds = null
			if (deactivatedVisits && deactivatedVisits.length) {
				deactivatedVisitIds = deactivatedVisits.map(visit => visit.id)
			}

			return db.one(
				// get id of the newest version of the draft
				`SELECT id
						FROM drafts_content
						WHERE draft_id = $[draftId]
						ORDER BY created_at DESC
						LIMIT 1`,
				{
					draftId
				}
			)
		})
		.then(draftsContent =>
			db.one(
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
			)
		)
		.then(visit => ({ visitId: visit.id, deactivatedVisitIds }))
}

class Visit {
	constructor(visitProps) {
		// expand all the visitProps onto this object
		for (let prop in visitProps) {
			this[prop] = visitProps[prop]
		}
	}

	static fetchById(visitId) {
		return db
			.one(
				`
			SELECT is_active, is_preview, draft_content_id
			FROM visits
			WHERE id = $[visitId]
			AND is_active = true
			ORDER BY created_at DESC
			LIMIT 1
		`,
				{ visitId }
			)
			.then(result => new Visit(result))
			.catch(error => {
				logger.error('Visit fetchById Error', error.message)
				return Promise.reject(error)
			})
	}

	// create a student visit
	// deactivates all previous visits
	static createVisit(userId, draftId, resourceLinkId, launchId) {
		return deactivateOldVisitsAndCreateNewVisit(userId, draftId, resourceLinkId, launchId, false)
	}

	// create a preview visit
	// deactivates all previous visits
	static createPreviewVisit(userId, draftId) {
		return deactivateOldVisitsAndCreateNewVisit(userId, draftId, null, null, true)
	}
}

module.exports = Visit
