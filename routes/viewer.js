var express = require('express')
var router = express.Router()
let DraftModel = oboRequire('models/draft')
const Visit = oboRequire('models/visit')
let logger = oboRequire('logger')
let insertEvent = oboRequire('insert_event')
let createCaliperEvent = oboRequire('routes/api/events/create_caliper_event')
let { ACTOR_USER } = require('./api/events/caliper_constants')
let { getSessionIds } = require('./api/events/caliper_utils')
let db = oboRequire('db')

// launch lti view of draft - redirects to visit route
// mounted as /visit/:draftId/:page
router.post('/:draftId/:page?', (req, res, next) => {
	return req
		.requireCurrentUser()
		.then(currentUser => {
			return Visit.createVisit(
				currentUser.id,
				req.params.draftId,
				req.lti.body.resource_link_id,
				req.oboLti.launchId
			)
		})
		.then(visit => {
			return new Promise((resolve, reject) => {
				req.session.save(function(err) {
					if (err) return reject(err)

					resolve(visit)
				})
			})
		})
		.then(visit => {
			res.redirect(`/view/${req.params.draftId}/visit/${visit.id}`)
		})
		.catch(error => {
			logger.error(error)
			next(error)
		})
})

// MAIN VISIT ROUTE
// mounted as /visit/:draftId/visit/:visitId
router.get('/:draftId/visit/:visitId*', (req, res, next) => {
	let user = null
	let draft = null
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
		.then(draft => {
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
			let { createViewerSessionLoggedInEvent } = createCaliperEvent(null, req.hostname)

			insertEvent({
				action: 'viewer:open',
				actorTime: new Date().toISOString(),
				userId: user.id,
				ip: req.connection.remoteAddress,
				metadata: {},
				draftId: req.params.draftId,
				payload: {},
				eventVersion: '1.0.0',
				caliperPayload: createViewerSessionLoggedInEvent({
					draftId: req.params.draftId,
					actor: { type: ACTOR_USER, id: user.id },
					isPreviewMode: user.canViewEditor,
					sessionIds: getSessionIds(req.session)
				})
			})
		})
		.catch(error => {
			logger.error(error)
			next(error)
		})
})

module.exports = router
