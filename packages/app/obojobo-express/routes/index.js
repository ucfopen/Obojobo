const express = require('express')
const router = express.Router()

// Home page
// mounted as /
// redirects to the library for now
router.get('/', (req, res) => {
	res.redirect('/library');
})

module.exports = router
