var express = require('express');
var router = express.Router();


router.all('/editor', (req, res, next) => {
	let oboGlobals = new OboGlobals();

	req.getCurrentUser(true)
	.then(user => {
		if(user.isGuest()) return Promise.reject(new Error('Login Required'))
		res.render('editor.pug', {
			title: 'Obojobo 3'
		})

		next()
	})
	.catch(error => {
		next(error)
	})
});

module.exports = router;
