var express = require('express')
var router = express.Router()
let logger = oboRequire('logger')

router.get('/student/:userId', (req, res, next) => {
	logger.warn('data api has received request')

	return res.success({ butts: true })
})

module.exports = router
