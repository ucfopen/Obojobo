const express = require('express')
const router = express.Router()
const logger = oboRequire('logger')
const Visit = oboRequire('models/visit')
const insertEvent = oboRequire('insert_event')
const createCaliperEvent = oboRequire('routes/api/events/create_caliper_event')
const { ACTOR_USER } = require('./api/events/caliper_constants')
const { getSessionIds } = require('./api/events/caliper_utils')

// Start a preview - redirects to visit route
// mounts at /preview/:draftId
router.get('/:draftId', (req, res, next) => {
	let currentUser
	let currentDocument

	return req
		.requireCurrentUser()
		.then(user => {
			if (!user.canPreview) throw new Error('Not authorized to preview')
			currentUser = user
			return req.requireCurrentDocument(req.params.draftId)
		})
		.then(draftDocument => {
			currentDocument = draftDocument
			return Visit.createPreviewVisit(currentUser.id, currentDocument.draftId)
		})
		.then(({ visitId, deactivatedVisitId }) => {
			const { createVisitCreateEvent } = createCaliperEvent(null, req.hostname)
			insertEvent({
				action: 'visit:create',
				actorTime: new Date().toISOString(),
				userId: currentUser.id,
				ip: req.connection.remoteAddress,
				metadata: {},
				draftId: currentDocument.draftId,
				contentId: currentDocument.contentId,
				isPreview: true,
				payload: {
					visitId,
					deactivatedVisitId
				},
				eventVersion: '1.0.0',
				caliperPayload: createVisitCreateEvent({
					actor: { type: ACTOR_USER, id: currentUser.id },
					sessionIds: getSessionIds(req.session),
					visitId,
					extensions: { deactivatedVisitId }
				})
			})
			return new Promise((resolve, reject) => {
				// Saving session here solves #128
				req.session.save(err => {
					if (err) return reject(err)
					resolve(visitId)
				})
			})
		})
		.then(visitId => {
			res.redirect(`/view/${currentDocument.draftId}/visit/${visitId}`)
		})
		.catch(error => {
			logger.error(error)
			next(error)
		})
})

module.exports = router
