const express = require('express')
const router = express.Router()
const assetForEnv = require('obojobo-express/asset_resolver').assetForEnv

router.get('/library', (req, res) => {
	res.render(`library.html.njk`, {
		assetForEnv
	})
})

module.exports = router
