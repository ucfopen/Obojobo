const express = require('express')
const router = express.Router()
const DraftSummary = require('../models/draft_summary')
const { webpackAssetPath } = require('obojobo-express/server/asset_resolver')
const {
	requireCurrentUser,
	requireCanViewStatsPage
} = require('obojobo-express/server/express_validators')

// Stats page
// mounted as /stats
// NOTE: is an isomorphic react page
router
	.route('/stats')
	.get([requireCurrentUser, requireCanViewStatsPage])
	.get((req, res) => {
		const processDrafts = allModules => {
			const props = {
				title: 'Stats',
				allModules: allModules.map(m => JSON.parse(JSON.stringify(m))),
				currentUser: req.currentUser,
				// must use webpackAssetPath for all webpack assets to work in dev and production!
				appCSSUrl: webpackAssetPath('stats.css'),
				appJsUrl: webpackAssetPath('stats.js')
			}
			res.render('pages/page-stats-server.jsx', props)
		}

		const canSeeAllModuleStats = req.currentUser.hasPermission('canViewSystemStats')

		if (canSeeAllModuleStats) {
			return DraftSummary.fetchAll().then(processDrafts)
		} else {
			return DraftSummary.fetchByUserId(req.currentUser.id).then(processDrafts)
		}
	})

module.exports = router
