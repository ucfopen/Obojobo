const express = require('express')
const router = express.Router()
const Visit = oboRequire('server/models/visit')
const insertEvent = oboRequire('server/insert_event')
const createCaliperEvent = oboRequire('server/routes/api/events/create_caliper_event')
const { ACTOR_USER } = require('./api/events/caliper_constants')
const { getSessionIds } = require('./api/events/caliper_utils')
const {
	checkValidationRules,
	requireCurrentDocument,
	requireDraftId,
	requireCanPreviewDrafts
} = oboRequire('server/express_validators')

// Start a preview - redirects to visit route
// mounts at /preview/:draftId
router
	.route('/:draftId')
	.get([requireCanPreviewDrafts, requireCurrentDocument, requireDraftId, checkValidationRules])
	.get((req, res) => {
		let visitId
		return Visit.createPreviewVisit(req.currentUser.id, req.currentDocument.draftId)
			.then(({ visitId: newVisitId, deactivatedVisitId }) => {
				const { createVisitCreateEvent } = createCaliperEvent(null, req.hostname)
				visitId = newVisitId

				insertEvent({
					action: 'visit:create',
					actorTime: new Date().toISOString(),
					userId: req.currentUser.id,
					ip: req.connection.remoteAddress,
					metadata: {},
					draftId: req.currentDocument.draftId,
					contentId: req.currentDocument.contentId,
					isPreview: true,
					visitId,
					payload: {
						visitId,
						deactivatedVisitId
					},
					eventVersion: '1.0.0',
					caliperPayload: createVisitCreateEvent({
						actor: { type: ACTOR_USER, id: req.currentUser.id },
						sessionIds: getSessionIds(req.session),
						visitId,
						extensions: { deactivatedVisitId }
					})
				})
			})
			.then(req.saveSessionPromise)
			.then(() => {
				res.redirect(`/view/${req.currentDocument.draftId}/visit/${visitId}`)
			})
			.catch(res.unexpected)
	})

module.exports = router
