var express = require('express');
var router = express.Router();
var OboGlobals = oboRequire('obo_globals')
let DraftModel = oboRequire('models/draft')

router.all('/example', (req, res, next) => {
	if(req.app.get('env') === 'development'){
		res.redirect('/view/00000000-0000-0000-0000-000000000000')
	}
	else{
		next()
	}
})

router.all('/:draftId*', (req, res, next) => {
	let oboGlobals = new OboGlobals();
	let user = null;
	let draft = null;

	return req.getCurrentUser(true)
	.then(currentUser => {
		user = currentUser
		if(user.isGuest()) throw new Error('Login Required')
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
		let isProd = req.app.get('env') === 'production'
		res.render('viewer.pug', {
			title: 'Obojobo 3',
			paths: req.app.locals.paths,
			modules: req.app.locals.modules,
			oboGlobals: oboGlobals,
			headerScripts:[
				`//fb.me/react-with-addons-15.0.2${isProd ? '.min' : ''}.js`,
				`//fb.me/react-dom-15.0.2${isProd ? '.min' : ''}.js`,
				`//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.5.1/underscore${isProd ? '-min' : ''}.js`,
				`//cdnjs.cloudflare.com/ajax/libs/backbone.js/1.3.3/backbone${isProd ? '-min' : ''}.js`,
			],
		});

		next()
	})
	.catch(error => {
		console.log(error)
		next(error)
		return Promise.reject(error)
	})
});

module.exports = router;
