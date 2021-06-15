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
		let sortOrder = 'newest'
		const cookies = req.headers.cookie.split(';')
		const cookieSort = cookies.find(cookie => cookie.includes('sortOrder'))

		if (cookieSort) {
			sortOrder = cookieSort.split('=')[1]
		}

		return DraftSummary.fetchAll().then(allModules => {
			const props = {
				title: 'Stats',
				allModules: allModules.map(m => JSON.parse(JSON.stringify(m))),
				sortOrder,
				currentUser: req.currentUser,
				// must use webpackAssetPath for all webpack assets to work in dev and production!
				appCSSUrl: webpackAssetPath('stats.css'),
				appJsUrl: webpackAssetPath('stats.js')
			}
			res.render('pages/page-stats-server.jsx', props)
		})
	})

module.exports = router
