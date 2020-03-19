const express = require('express')
const router = express.Router()
const CollectionSummary = require('../models/collection_summary')
const DraftSummary = require('../models/draft_summary')
const { webpackAssetPath } = require('obojobo-express/server/asset_resolver')
const {
	requireCurrentUser,
	requireCanPreviewDrafts
} = require('obojobo-express/server/express_validators')
const {
	MODE_DASHBOARD,
	MODE_MODULES,
	MODE_COLLECTION
} = require('../../shared/repository-constants')
const { getUserModuleCount } = require('../services/count')

const short = require('short-uuid')

const defaultOptions = {
	collection: {
		id: null,
		title: null
	},
	mode: MODE_DASHBOARD
}

const renderDashboard = (req, res, options) => {
	let moduleSortOrder = 'alphabetical'
	const cookies = req.headers.cookie.split(';')
	const cookieSort = cookies.find(cookie => cookie.includes('moduleSortOrder'))

	if (cookieSort) {
		moduleSortOrder = cookieSort.split('=')[1]
	}

	let myCollections = []
	let moduleCount = 0

	return getUserModuleCount(req.currentUser.id)
		.then(count => {
			moduleCount = count
			return CollectionSummary.fetchByUserId(req.currentUser.id)
		})
		.then(collections => {
			myCollections = collections

			switch (options.mode) {
				case MODE_COLLECTION:
					return DraftSummary.fetchInCollectionForUser(options.collection.id, req.currentUser.id)
				case MODE_MODULES:
					return DraftSummary.fetchByUserId(req.currentUser.id)
				case MODE_DASHBOARD:
				default:
					return DraftSummary.fetchRecentByUserId(req.currentUser.id)
			}
		})
		.then(myModules => {
			const props = {
				title: 'Dashboard',
				myCollections,
				myModules,
				moduleCount,
				moduleSortOrder,
				currentUser: req.currentUser,
				appCSSUrl: webpackAssetPath('dashboard.css'),
				appJsUrl: webpackAssetPath('dashboard.js'),
				collection: options.collection,
				mode: options.mode
			}
			res.render('pages/page-dashboard-server.jsx', props)
		})
}

// Dashboard page
// mounted as /dashboard
// NOTE: is an isomorphic react page
router
	.route('/dashboard')
	.get([requireCurrentUser, requireCanPreviewDrafts])
	.get((req, res) => {
		renderDashboard(req, res, { ...defaultOptions })
	})

// Dashboard page - all modules
// mounted as /dashboard/modules
router
	.route('/dashboard/modules')
	.get([requireCurrentUser, requireCanPreviewDrafts])
	.get((req, res) => {
		renderDashboard(req, res, { ...defaultOptions, mode: MODE_MODULES })
	})

// Dashboard page - modules in collection
// mounted as /dashboard/collection/:nameOrId
router
	.route('/dashboard/collections/:nameOrId')
	.get([requireCurrentUser, requireCanPreviewDrafts])
	.get((req, res) => {
		const urlParts = req.params.nameOrId.split('-')
		const translator = short()
		const collectionId = translator.toUUID(urlParts[urlParts.length - 1])

		CollectionSummary.fetchById(collectionId).then(collection => {
			const options = {
				...defaultOptions,
				collection,
				mode: MODE_COLLECTION
			}

			renderDashboard(req, res, options)
		})
	})

module.exports = router
