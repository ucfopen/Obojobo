const express = require('express')
const router = express.Router()
const DraftModel = oboRequire('models/draft')
const Visit = oboRequire('models/visit')
const logger = oboRequire('logger')
const insertEvent = oboRequire('insert_event')
const createCaliperEvent = oboRequire('routes/api/events/create_caliper_event')
const { ACTOR_USER } = oboRequire('routes/api/events/caliper_constants')
const { getSessionIds } = oboRequire('routes/api/events/caliper_utils')
const db = oboRequire('db')

// launch lti view of draft - redirects to visit route
// mounted as /visit/:draftId/:page
router.post('/:draftId/:page?', (req, res, next) => {
	let user
	let createdVisitId

	return req
		.requireCurrentUser()
		.then(currentUser => {
			user = currentUser
			return Visit.createVisit(
				currentUser.id,
				req.params.draftId,
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
				userId: user.id,
				ip: req.connection.remoteAddress,
				metadata: {},
				draftId: req.params.draftId,
				payload: {
					visitId,
					deactivatedVisitId
				},
				eventVersion: '1.0.0',
				caliperPayload: createVisitCreateEvent({
					actor: { type: ACTOR_USER, id: user.id },
					isPreviewMode: user.canViewEditor,
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
	let user
	let draft

	return req
		.requireCurrentUser()
		.then(currentUser => {
			user = currentUser
			if (user.isGuest()) throw new Error('Login Required')
			return DraftModel.fetchById(req.params.draftId)
		})
		.then(draftModel => {
			draft = draftModel
			return draft.yell('internal:sendToClient', req, res)
		})
		.then(draftReturn => {
			draft = draftReturn
			let { createViewerOpenEvent } = createCaliperEvent(null, req.hostname)
			return insertEvent({
				action: 'viewer:open',
				actorTime: new Date().toISOString(),
				userId: user.id,
				ip: req.connection.remoteAddress,
				metadata: {},
				draftId: req.params.draftId,
				payload: { visitId: req.params.visitId },
				eventVersion: '1.1.0',
				caliperPayload: createViewerOpenEvent({
					actor: { type: ACTOR_USER, id: user.id },
					isPreviewMode: user.canViewEditor,
					sessionIds: getSessionIds(req.session),
					visitId: req.params.visitId
				})
			})
		})
		.then(() => {
			res.render('viewer', {
				draftTitle:
					draft &&
					draft.root &&
					draft.root.node &&
					draft.root.node.content &&
					draft.root.node.content.title
						? draft.root.node.content.title
						: ''
			})
		})
		.catch(error => {
			logger.error(error)
			next(error)
		})
})

module.exports = router
