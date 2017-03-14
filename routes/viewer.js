var express = require('express');
var router = express.Router();
var OboGlobals = require('../obo_globals')
let DraftModel = oboRequire('models/draft')

/* GET home page. */
router.get('/view/:draftId*', (req, res, next) => {
	let oboGlobals = new OboGlobals();

	DraftModel.fetchById(req.params.draftId)
	.then(draftTree => {
		draftTree.yell('internal:sendToClient', req, res)
	 .then( () => {
			oboGlobals.set('draft', draftTree.document)
			oboGlobals.set('draftId', req.params.draftId)

			draftTree.yell('internal:renderViewer', req, res, oboGlobals)
			.then( () => {
				res.render('viewer.pug', {
					title: 'Obojobo 3',
					paths: req.app.locals.paths,
					modules: req.app.locals.modules,
					oboGlobals: oboGlobals
				});

				next()
			})
		})
	})
	.catch(error => {
		// res.missing(error.toString());
		res.status(404)
		console.log(error)
		next()
	})



	// req.app.emit('render:viewer', oboGlobals);



	// next()
});

module.exports = router;
