const express = require('express')
const router = express.Router()

// Home page
// mounted as /
router.get('/', (req, res) => {
	res.render('index', {
		title: 'Obojobo Next',
		modules: req.app.locals.modules
	})
})

module.exports = router
