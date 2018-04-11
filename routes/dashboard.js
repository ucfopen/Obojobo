var express = require('express')
var router = express.Router()

/* GET home page. */
router.get('/:type?', (req, res, next) => {
	// type doesn't do anything yet, it's handled by react-router
	res.render('data_dashboard', {
		title: 'Obojobo Next',
		modules: req.app.locals.modules
	})
})

module.exports = router
