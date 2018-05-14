var express = require('express')
var router = express.Router()
let DraftDocument = oboRequire('models/draft')
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
	let currentUser = null
	let currentDocument = null

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
		.then(visit => {
			return new Promise((resolve, reject) => {
				req.session.save(function(err) {
					if (err) return reject(err)

					resolve(visit)
				})
			})
		})
		.then(visit => {
			res.redirect(`/view/${currentDocument.draftId}/visit/${visit.id}`)
		})
		.catch(error => {
			logger.error(error)
			next(error)
		})
})

// MAIN VISIT ROUTE
// mounted as /visit/:draftId/visit/:visitId
router.get('/:draftId/visit/:visitId*', (req, res, next) => {
	let currentUser = null
	let currentDocument = null
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
			let { createViewerSessionLoggedInEvent } = createCaliperEvent(null, req.hostname)

			insertEvent({
				action: 'viewer:open',
				actorTime: new Date().toISOString(),
				userId: currentUser.id,
				ip: req.connection.remoteAddress,
				metadata: {},
				draftId: currentDocument.draftId,
				contentId: currentDocument.contentId,
				payload: {},
				eventVersion: '1.0.0',
				caliperPayload: createViewerSessionLoggedInEvent({
					draftId: currentDocument.draftId,
					contentId: currentDocument.contentId,
					actor: { type: ACTOR_USER, id: currentUser.id },
					isPreviewMode: currentUser.canViewEditor,
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
