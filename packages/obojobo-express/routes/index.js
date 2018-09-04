var express = require('express')
var router = express.Router()

// Home page
// mounted as /
router.get('/', (req, res, next) => {
	res.render('index', {
		title: 'Obojobo Next',
		modules: req.app.locals.modules
	})
})

module.exports = router
