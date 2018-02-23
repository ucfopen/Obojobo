var express = require('express')
var router = express.Router()
var OboGlobals = oboRequire('obo_globals')
let DraftModel = oboRequire('models/draft')
let logger = oboRequire('logger')
let insertEvent = oboRequire('insert_event')
let createCaliperEvent = oboRequire('routes/api/events/create_caliper_event')
let { ACTOR_USER } = require('./api/events/caliper_constants')
let { getSessionIds } = require('./api/events/caliper_utils')

router.all('/example', (req, res, next) => {
	res.redirect('/view/00000000-0000-0000-0000-000000000000')
})

router.all('/:draftId*', (req, res, next) => {
	let oboGlobals = new OboGlobals()
	let user = null
	let draft = null

	return req
		.getCurrentUser(true)
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
			oboGlobals.set('draft', draft.document)
			oboGlobals.set('draftId', req.params.draftId)
			oboGlobals.set('previewing', user.canViewEditor)
			return draft.yell('internal:renderViewer', req, res, oboGlobals)
		})
		.then(draft => {
			res.render('viewer', {
				oboGlobals: oboGlobals
			})
			let { createViewerSessionLoggedInEvent } = createCaliperEvent(null, req.hostname)

			insertEvent({
				action: 'viewer:open',
				actorTime: new Date().toISOString(),
				actor: ACTOR_USER,
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
