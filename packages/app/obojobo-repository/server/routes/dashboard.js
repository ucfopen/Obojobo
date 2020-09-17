const express = require('express')
const router = express.Router()
const DraftSummary = require('../models/draft_summary')
const { webpackAssetPath } = require('obojobo-express/server/asset_resolver')
const {
	requireCurrentUser,
	requireCanPreviewDrafts
} = require('obojobo-express/server/express_validators')

// Dashboard page
// mounted as /dashboard
// NOTE: is an isomorphic react page
router
	.route('/dashboard')
	.get([requireCurrentUser, requireCanPreviewDrafts])
	.get((req, res) => {
		let sortOrder = 'newest'
		const cookies = req.headers.cookie.split(';')
		const cookieSort = cookies.find(cookie => cookie.includes('sortOrder'))

		if (cookieSort) {
			sortOrder = cookieSort.split('=')[1]
		}

		return DraftSummary.fetchByUserId(req.currentUser.id).then(myModules => {
			const props = {
				title: 'Dashboard',
				myModules,
				sortOrder,
				currentUser: req.currentUser,
				// must use webpackAssetPath for all webpack assets to work in dev and production!
				appCSSUrl: webpackAssetPath('dashboard.css'),
				appJsUrl: webpackAssetPath('dashboard.js')
			}
			res.render('pages/page-dashboard-server.jsx', props)
		})
	})

module.exports = router
