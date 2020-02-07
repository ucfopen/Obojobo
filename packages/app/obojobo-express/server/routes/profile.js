const express = require('express')
const router = express.Router()

// Current User's Profile
// mounted as /profile
router.route('/').get((req, res) => {
	return req.getCurrentUser().then(() => {
		const msg = `Hello ${req.currentUser.username}!`
		res.send(msg)
	})
})

// Log current user out
// mounted as /profile/logout
router.get('/logout', (req, res) => {
	req.resetCurrentUser()
	res.redirect('back')
})

module.exports = router
