var express = require('express')
var router = express.Router()

router.get('/', (req, res, next) => {
	return req.getCurrentUser().then(currentuser => {
		let msg = `Hello ${currentuser.username}!`
		res.send(msg)
	})
})

module.exports = router
