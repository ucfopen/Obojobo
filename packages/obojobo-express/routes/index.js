var express = require('express')
var router = express.Router()

/* GET home page. */
router.get('/', (req, res, next) => {
	res.render('index', {
		title: 'Obojobo Next',
		modules: req.app.locals.modules
	})
})

module.exports = router
