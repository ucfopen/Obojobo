const express = require('express')
const router = express.Router()
const Visit = oboRequire('models/visit')
const logger = oboRequire('logger')
const insertEvent = oboRequire('insert_event')
const createCaliperEvent = oboRequire('routes/api/events/create_caliper_event')
const { ACTOR_USER } = oboRequire('routes/api/events/caliper_constants')
const { getSessionIds } = oboRequire('routes/api/events/caliper_utils')
let ltiLaunch = oboRequire('express_lti_launch')
const db = oboRequire('db')

// launch lti view of draft - redirects to visit route
// mounted as /visit/:draftId/:page
router.post('/:draftId/:page?', [ltiLaunch.assignment], (req, res, next) => {
	let currentUser
	let currentDocument
	let createdVisitId

	return req
		.requireCurrentUser()
		.then(user => {
			currentUser = user
			return req.requireCurrentDocument()
		})
		.then(draftDocument => {
			currentDocument = draftDocument
			return Visit.createVisit(
				currentUser.id,
				currentDocument.draftId,
				req.lti.body.resource_link_id,
				req.oboLti.launchId
			)
		})
		.then(({ visitId, deactivatedVisitId }) => {
			createdVisitId = visitId
			let { createVisitCreateEvent } = createCaliperEvent(null, req.hostname)
			return insertEvent({
				action: 'visit:create',
				actorTime: new Date().toISOString(),
				userId: currentUser.id,
				ip: req.connection.remoteAddress,
				metadata: {},
				draftId: currentDocument.draftId,
				contentId: currentDocument.contentId,
				payload: {
					visitId,
					deactivatedVisitId
				},
				eventVersion: '1.0.0',
				caliperPayload: createVisitCreateEvent({
					actor: { type: ACTOR_USER, id: currentUser.id },
					isPreviewMode: currentUser.canViewEditor,
					sessionIds: getSessionIds(req.session),
					visitId,
					extensions: { deactivatedVisitId }
				})
			})
		})
		.then(() => {
			// save session before redirect
			return new Promise((resolve, reject) => {
				req.session.save(err => {
					if (err) return reject(err)
					resolve()
				})
			})
		})
		.then(() => {
			res.redirect(`/view/${req.params.draftId}/visit/${createdVisitId}`)
		})
		.catch(error => {
			logger.error(error)
			next(error)
		})
})

// MAIN VISIT ROUTE
// mounted as /visit/:draftId/visit/:visitId
router.get('/:draftId/visit/:visitId*', (req, res, next) => {
	let currentUser
	let currentDocument

	return req
		.requireCurrentUser()
		.then(user => {
			currentUser = user
			if (currentUser.isGuest()) throw new Error('Login Required')
			return req.requireCurrentDocument()
		})
		.then(draftDocument => {
			currentDocument = draftDocument
			return currentDocument.yell('internal:sendToClient', req, res)
		})
		.then(draftDocument => {
			currentDocument = draftDocument
			let { createViewerOpenEvent } = createCaliperEvent(null, req.hostname)
			return insertEvent({
				action: 'viewer:open',
				actorTime: new Date().toISOString(),
				userId: currentUser.id,
				ip: req.connection.remoteAddress,
				metadata: {},
				draftId: currentDocument.draftId,
				contentId: currentDocument.contentId,
				payload: { visitId: req.params.visitId },
				eventVersion: '1.1.0',
				caliperPayload: createViewerOpenEvent({
					actor: { type: ACTOR_USER, id: currentUser.id },
					isPreviewMode: currentUser.canViewEditor,
					sessionIds: getSessionIds(req.session),
					visitId: req.params.visitId
				})
			})
		})
		.then(() => {
			res.render('viewer', {
				draftTitle:
					currentDocument &&
					currentDocument.root &&
					currentDocument.root.node &&
					currentDocument.root.node.content &&
					currentDocument.root.node.content.title
						? currentDocument.root.node.content.title
						: ''
			})
		})
		.catch(error => {
			logger.error(error)
			next(error)
		})
})

module.exports = router
