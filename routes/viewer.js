var express = require('express')
var router = express.Router()
var OboGlobals = oboRequire('obo_globals')
let DraftModel = oboRequire('models/draft')
let logger = oboRequire('logger')
let db = oboRequire('db')

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
			redAlertStatus = db
				.oneOrNone(
					`
				SELECT * FROM red_alert_status
				WHERE red_alert_status.user_id = $[userId]
					AND red_alert_status.draft_id = $[draftId]`,
					{ userId: user.id, draftId: req.params.draftId }
				)
				.then(status => {
					if (status == null) oboGlobals.set('red_alert_status', false)
					else oboGlobals.set('red_alert_status', status.alert_enabled)
				})
			return draft.yell('internal:renderViewer', req, res, oboGlobals)
		})
		.then(draft => {
			res.render('viewer', {
				oboGlobals: oboGlobals
			})
		})
		.catch(error => {
			logger.error(error)
			next(error)
		})
})

module.exports = router
