const express = require('express')
const router = express.Router()
const CollectionSummary = require('../models/collection_summary')
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
		let sortOrder = 'alphabetical'
		const cookies = req.headers.cookie.split(';')
		const cookieSort = cookies.find(cookie => cookie.includes('sortOrder'))

		if (cookieSort) {
			sortOrder = cookieSort.split('=')[1]
		}

		let myCollections = []

		return CollectionSummary.fetchByUserId(req.currentUser.id)
			.then(collections => {
				myCollections = collections

				return DraftSummary.fetchByUserId(req.currentUser.id)
			})
			.then(myModules => {
				const props = {
					title: 'Dashboard',
					myCollections,
					myModules,
					sortOrder,
					currentUser: req.currentUser,
					appCSSUrl: webpackAssetPath('dashboard.css'),
					appJsUrl: webpackAssetPath('dashboard.js')
				}
				res.render('pages/page-dashboard-server.jsx', props)
			})
	})

module.exports = router
