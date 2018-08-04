const express = require('express')
const router = express.Router()
const logger = oboRequire('logger')
const Visit = oboRequire('models/visit')
const insertEvent = oboRequire('insert_event')
const createCaliperEvent = oboRequire('routes/api/events/create_caliper_event')
const { ACTOR_USER } = require('./api/events/caliper_constants')
const { getSessionIds } = require('./api/events/caliper_utils')
const {
	checkValidationRules,
	requireCurrentDocument,
	requireDraftId,
	requireCanViewDrafts
} = oboRequire('express_validators')

// Start a preview - redirects to visit route
// mounts at /preview/:draftId
router
	.route('/:draftId')
	.get([requireCanViewDrafts, requireCurrentDocument, requireDraftId, checkValidationRules])
	.get((req, res, next) => {
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
					payload: {
						visitId,
						deactivatedVisitId
					},
					eventVersion: '1.0.0',
					caliperPayload: createVisitCreateEvent({
						actor: { type: ACTOR_USER, id: req.currentUser.id },
						isPreviewMode: req.currentUser.canViewEditor,
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
			.catch(error => {
				logger.error(error)
				next(error)
			})
	})

module.exports = router
