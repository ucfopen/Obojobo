const db = require('../db')
const logger = require('../logger')
const oboEvents = require('../obo_events')

// use to initiate a new visit for a draft
// this will deactivate old visits, preventing
// them from being used again
const deactivateOldVisitsAndCreateNewVisit = (
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
			AND resource_link_id = $[resourceLinkId]
			AND is_active = true
			RETURNING id`,
			{
				draftId,
				userId,
				resourceLinkId
			}
		)
		.then(deactivatedVisits => {
			deactivatedVisitIds = deactivatedVisits ? deactivatedVisits.map(visit => visit.id) : null

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
		.then(visit => {
			oboEvents.emit(Visit.EVENT_NEW_VISIT, {
				visitId: visit.id,
				userId,
				draftId,
				resourceLinkId,
				launchId,
				isPreview,
				deactivatedVisitIds
			})

			return {
				visitId: visit.id,
				deactivatedVisitIds
			}
		})
}

class Visit {
	constructor(visitProps) {
		// expand all the visitProps onto this object
		for (const prop in visitProps) {
			this[prop] = visitProps[prop]
		}
	}

	static fetchById(visitId, requireIsActive = true) {
		return db
			.one(
				`
			SELECT id, is_active, is_preview, draft_content_id, resource_link_id
			FROM visits
			WHERE id = $[visitId]
			${requireIsActive ? 'AND is_active = true' : ''}
			ORDER BY created_at DESC
			LIMIT 1
		`,
				{ visitId }
			)
			.then(result => new Visit(result))
			.catch(error => {
				logger.error('Visit fetchById Error', visitId, error.message)
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
		return deactivateOldVisitsAndCreateNewVisit(userId, draftId, 'preview', null, true)
	}
}

Visit.EVENT_NEW_VISIT = 'EVENT_NEW_VISIT'

module.exports = Visit
