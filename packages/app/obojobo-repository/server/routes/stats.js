const express = require('express')
const router = express.Router()
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
		const props = {
			title: 'Stats',
			currentUser: req.currentUser,
			// must use webpackAssetPath for all webpack assets to work in dev and production!
			appCSSUrl: webpackAssetPath('stats.css'),
			appJsUrl: webpackAssetPath('stats.js'),
			globals: {
				staticAssetUrl: process.env.CDN_ASSET_HOST || ''
			}
		}
		res.render('pages/page-stats-server.jsx', props)
	})

module.exports = router
