var express = require('express');
var router = express.Router();

router.get('/', (req, res, next) => {
	req.getCurrentUser()
	.then(currentuser => {
		let msg = `Hello ${currentuser.username}!`
		res.send(msg);
		next()
	})
})

module.exports = router;
