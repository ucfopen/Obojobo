var express = require('express')
var router = express.Router()
var OboGlobals = oboRequire('obo_globals')
let DraftModel = oboRequire('models/draft')
let logger = oboRequire('logger')
let insertEvent = oboRequire('insert_event')
let createCaliperEvent = oboRequire('routes/api/events/create_caliper_event')

router.all('/example', (req, res, next) => {
	if (req.app.get('env') === 'development') {
		res.redirect('/view/00000000-0000-0000-0000-000000000000')
	} else {
		next()
	}
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

			insertEvent({
				action: 'viewer:open',
				actorTime: new Date().toISOString(),
				userId: user.id,
				ip: req.connection.remoteAddress,
				metadata: {},
				draftId: req.params.draftId,
				payload: {},
				caliperPayload: createCaliperEvent.createViewerSessionLoggedInEvent(
					req,
					user,
					req.params.draftId
				)
			})
		})
		.catch(error => {
			logger.error(error)
			next(error)
		})
})

module.exports = router
