const express = require('express')
const router = express.Router()
const DraftSummary = require('../models/draft_summary')
const { webpackAssetPath } = require('obojobo-express/server/asset_resolver')
const {
	requireCurrentUser,
	requireCanViewSystemStats
} = require('obojobo-express/server/express_validators')

// Stats page
// mounted as /stats
// NOTE: is an isomorphic react page
router
	.route('/stats')
	.get([requireCurrentUser, requireCanViewSystemStats])
	.get((req, res) => {
		return DraftSummary.fetchAll().then(allModules => {
			const props = {
				title: 'Stats',
				allModules: allModules.map(m => JSON.parse(JSON.stringify(m))),
				currentUser: req.currentUser,
				doggo: true,
				// must use webpackAssetPath for all webpack assets to work in dev and production!
				appCSSUrl: webpackAssetPath('stats.css'),
				appJsUrl: webpackAssetPath('stats.js')
			}
			res.render('pages/page-stats-server.jsx', props)
		})
	})

module.exports = router
