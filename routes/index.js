var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
	res.render('index.pug', { title: 'Obojobo 3', paths: req.app.locals.paths, modules: req.app.locals.modules });
	next()
});

//
router.get('/profile', (req, res, next) => {
;	req.getCurrentUser()
	.then(currentuser => {
		let msg = `Hello ${currentuser.username}!`
		res.send(msg);
		next()
	})
})

module.exports = router;
