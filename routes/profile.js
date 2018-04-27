var express = require('express')
var router = express.Router()

// Current User's Profile
// mounted as /profile
router.get('/', (req, res, next) => {
	return req.getCurrentUser().then(currentuser => {
		let msg = `Hello ${currentuser.username}!`
		res.send(msg)
	})
})

// Log current user out
// mounted as /profile/logout
router.get('/logout', (req, res, next) => {
	req.resetCurrentUser()
	res.send('Logged out')
})

module.exports = router
