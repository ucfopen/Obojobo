const express = require('express')
const router = express.Router()
const Visit = oboRequire('server/models/visit')
const insertEvent = oboRequire('server/insert_event')
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
					eventVersion: '1.1.0'
				})
			})
			.then(req.saveSessionPromise)
			.then(() => {
				res.redirect(`/view/${req.currentDocument.draftId}/visit/${visitId}`)
			})
			.catch(res.unexpected)
	})

module.exports = router
