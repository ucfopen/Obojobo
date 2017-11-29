var express = require('express')
var router = express.Router()

router.get('/', (req, res, next) => {
	return req.getCurrentUser().then(currentuser => {
		let msg = `Hello ${currentuser.username}!`
		res.send(msg)
	})
})

router.get('/logout', (req, res, next) => {
	req.resetCurrentUser()
	res.send('Logged out')
})

module.exports = router
