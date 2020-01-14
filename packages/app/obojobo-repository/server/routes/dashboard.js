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
		return DraftSummary.fetchByUserId(req.currentUser.id).then(myModules => {
			const props = {
				title: 'Dashboard',
				myModules,
				currentUser: req.currentUser,
				appCSSUrl: webpackAssetPath('dashboard.css'),
				appJsUrl: webpackAssetPath('dashboard.js')
			}
			res.render('pages/page-dashboard-server.jsx', props)
		})
	})

module.exports = router
