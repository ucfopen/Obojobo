const express = require('express')
const router = express.Router()
const CollectionSummary = require('../models/collection_summary')
const DraftSummary = require('../models/draft_summary')
const { webpackAssetPath } = require('obojobo-express/server/asset_resolver')
const {
	requireCurrentUser,
	requireCanPreviewDrafts
} = require('obojobo-express/server/express_validators')
// const {
// 	userHasPermissionToCollection
// } = require('obojobo-repository/server/services/permissions')
const { MODE_RECENT, MODE_ALL } = require('../../shared/repository-constants')
const { getUserModuleCount } = require('../services/count')

const short = require('short-uuid')

const defaultOptions = {
	collection: {
		id: null,
		title: null
	},
	mode: MODE_RECENT
}

const renderDashboard = (req, res, options) => {
	let moduleSortOrder = 'alphabetical'
	let collectionSortOrder = 'alphabetical'
	const cookies = req.headers.cookie.split(';')
	const cookieModuleSort = cookies.find(cookie => cookie.includes('moduleSortOrder'))
	const cookieCollectionSort = cookies.find(cookie => cookie.includes('collectionSortOrder'))

	if (cookieModuleSort) {
		moduleSortOrder = cookieModuleSort.split('=')[1]
	}
	if (cookieCollectionSort) {
		collectionSortOrder = cookieCollectionSort.split('=')[1]
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
				// case MODE_COLLECTION:
				// 	return DraftSummary.fetchInCollection(options.collection.id, req.currentUser.id)
				case MODE_ALL:
					return DraftSummary.fetchByUserId(req.currentUser.id)
				case MODE_RECENT:
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
				collectionSortOrder,
				currentUser: req.currentUser,
				// must use webpackAssetPath for all webpack assets to work in dev and production!
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
// mounted as /dashboard/all
router
	.route('/dashboard/all')
	.get([requireCurrentUser, requireCanPreviewDrafts])
	.get((req, res) => {
		renderDashboard(req, res, { ...defaultOptions, mode: MODE_ALL })
	})

// Dashboard page - modules in collection
// mounted as /dashboard/collection/:nameOrId
// router
// 	.route('/dashboard/collections/:nameOrId')
// 	.get([requireCurrentUser, requireCanPreviewDrafts])
// 	.get(async (req, res) => {
// 		const urlParts = req.params.nameOrId.split('-')
// 		const translator = short()
// 		const collectionId = translator.toUUID(urlParts[urlParts.length - 1])

// 		const hasPerms = await userHasPermissionToCollection(req.currentUser.id, collectionId)

// 		if (!hasPerms) {
// 			return res.notAuthorized(
// 				'You must be the author of this collection to view this page'
// 			)
// 		}

// 		CollectionSummary.fetchById(collectionId).then(collection => {
// 			const options = {
// 				...defaultOptions,
// 				collection,
// 				mode: MODE_COLLECTION
// 			}

// 			renderDashboard(req, res, options)
// 		})
// 	})

module.exports = router
