var express = require('express');
var router = express.Router();
var OboGlobals = oboRequire('obo_globals')
let DraftModel = oboRequire('models/draft')
let ltiLaunch = oboRequire('lti_launch')


router.all('/view/:draftId*', (req, res, next) => {
	console.log('DO A THING')
	let oboGlobals = new OboGlobals();

	req.getCurrentUser(true)
	.then(user => {
		if(user.isGuest()) return Promise.reject(new Error('Login Required'))
		return DraftModel.fetchById(req.params.draftId)
	})
	.then(draft => {
		return draft.yell('internal:sendToClient', req, res)
	})
	.then((draft) => {
		oboGlobals.set('draft', draft.document)
		oboGlobals.set('draftId', req.params.draftId)
		return draft.yell('internal:renderViewer', req, res, oboGlobals)
	})
	.then((draft) => {
		res.render('viewer.pug', {
			title: 'Obojobo 3',
			paths: req.app.locals.paths,
			modules: req.app.locals.modules,
			oboGlobals: oboGlobals
		});

		next()
	})
	.catch(error => {
		next(error)
	})
});

module.exports = router;
