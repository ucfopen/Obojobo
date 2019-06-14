const express = require('express')
const router = express.Router()
const assetForEnv = require('obojobo-express/asset_resolver').assetForEnv

// Home page
// mounted as /
router.get('/dashboard', (req, res) => {
	res.render(`dashboard.html.njk`, {
		title: 'Dashboard',
		assetForEnv
	})
})

module.exports = router
