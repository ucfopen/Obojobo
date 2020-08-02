const db = require('../db')
const logger = require('../logger')
const oboEvents = require('../obo_events')
const DraftDocument = require('./draft')

// use to initiate a new visit for a draft
// this will deactivate old visits, preventing
// them from being used again
const deactivateOldVisitsAndCreateNewVisit = async (
	userId,
	draftId,
	resourceLinkId,
	launchId,
	isPreview
) => {
	return db.taskIf(async t => {
		// deactivate all my visits for this draft
		const deactivatedVisits = await t.manyOrNone(
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

		const deactivatedVisitIds = deactivatedVisits ? deactivatedVisits.map(visit => visit.id) : null

		// get id of the newest version of the draft
		const draftsContent = await t.one(
			`SELECT id
			FROM drafts_content
			WHERE draft_id = $[draftId]
			ORDER BY created_at DESC
			LIMIT 1`,
			{
				draftId
			}
		)

		// Create a new visit
		const visit = await t.one(
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

	get draftDocument(){
		if(this._memoizedDraftDocument) return Promise.resolve(this.memoizedDraftDocument)
		return DraftDocument.fetchDraftByVersion(this.draft_id, this.draft_content_id).then(draftDocument => {
			this._memoizedDraftDocument = draftDocument
			return draftDocument
		})
	}

	static fetchById(visitId, requireIsActive = true) {
		return db
			.one(
				`
			SELECT id, is_active, is_preview, draft_id, draft_content_id, resource_link_id
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
