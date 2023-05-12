const router = require('express').Router() //eslint-disable-line new-cap
const Collection = require('../models/collection')
const DraftSummary = require('../models/draft_summary')
const UserModel = require('obojobo-express/server/models/user')
const { webpackAssetPath } = require('obojobo-express/server/asset_resolver')
const DraftPermissions = require('../models/draft_permissions')
const trianglify = require('trianglify')
const seedrandom = require('seedrandom')
const {
	checkValidationRules,
	requireDraftId,
	getCurrentUser
} = require('obojobo-express/server/express_validators')

const publicLibCollectionId = require('../../shared/publicLibCollectionId')

router
	.route('/')
	.get(getCurrentUser)
	.get((req, res) => {
		const props = {
			currentUser: req.currentUser,
			// must use webpackAssetPath for all webpack assets to work in dev and production!
			appCSSUrl: webpackAssetPath('homepage.css')
		}
		res.render('pages/page-homepage.jsx', props)
	})

// Module Images
router.route('/library/module-icon/:moduleId').get((req, res) => {
	res.set('Cache-control', 'public, max-age=31536000')
	// @TODO: when user's can change these images,
	// we'll need to use a smarter etag

	// use etag to avoid doing work, if the browser
	// sends an if-none-match of this object's etag
	// it already has it cached, just return 304 now
	if (req.headers['if-none-match'] === req.params.moduleId) {
		res.status(304)
		res.send()
		return
	}

	// array of ColorBrewer sequences
	const colors = [
		'Blues',
		'Greens',
		'Oranges',
		'Purples',
		'Reds',
		'BuGn',
		'BuPu',
		'GnBu',
		'OrRd',
		'PuBuGn',
		'PuBu',
		'PuRd',
		'RdPu',
		'YlGnBu',
		'YlGn',
		'YlOrBr',
		'YlOrRd'
	]
	// deterministically choose a 'random' number to select a color scheme
	const deterministicRandom = seedrandom(req.params.moduleId)()
	const color = colors[Math.floor(deterministicRandom * colors.length)]

	const pattern = trianglify({
		width: 200,
		height: 200,
		cellSize: 65,
		variance: 0.8,
		xColors: color,
		strokeWidth: 0.5,
		seed: req.params.moduleId
	})

	res.setHeader('ETag', req.params.moduleId)
	res.setHeader('Content-Type', 'image/svg+xml')

	// build the svg
	const svg = `<svg viewBox="0 0 130 150" xmlns="http://www.w3.org/2000/svg">
		<mask id="hexagon-mask">
			<path
				fill="white"
				d="M56.29165124598851 4.999999999999999Q64.9519052838329 0 73.61215932167728 4.999999999999999L121.24355652982142 32.5Q129.9038105676658 37.5 129.9038105676658 47.5L129.9038105676658 102.5Q129.9038105676658 112.5 121.24355652982142 117.5L73.61215932167728 145Q64.9519052838329 150 56.29165124598851 145L8.660254037844387 117.5Q0 112.5 0 102.5L0 47.5Q0 37.5 8.660254037844387 32.5Z"
			/>
		</mask>

		<g mask="url(#hexagon-mask)">
			${pattern.toSVG()}
		</g>
	</svg>`

	res.send(svg)
})

router
	.route('/login')
	.get(getCurrentUser)
	.get((req, res) => {
		const props = {
			currentUser: req.currentUser,
			// must use webpackAssetPath for all webpack assets to work in dev and production!
			appCSSUrl: webpackAssetPath('repository.css')
		}
		res.render('pages/page-login.jsx', props)
	})

router
	.route('/library')
	.get(getCurrentUser)
	.get((req, res) => {
		// when allowing for multiple public collections, replace this
		//  with a call to 'Collection.fetchAllPublic' followed by
		//  Promise.all() using collections.map(c => (c.loadRelatedDrafts()))
		return Collection.fetchById(publicLibCollectionId)
			.then(collection => {
				return collection.loadRelatedDrafts()
			})
			.then(collection => {
				const props = {
					collections: [collection],
					page: 1,
					pageCount: 1,
					currentUser: req.currentUser,
					// must use webpackAssetPath for all webpack assets to work in dev and production!
					appCSSUrl: webpackAssetPath('repository.css'),
					appJsUrl: webpackAssetPath('page-library.js')
				}
				res.render('pages/page-library-server.jsx', props)
			})
			.catch(res.unexpected)
	})

router
	.route('/library/:draftId')
	.get([requireDraftId, getCurrentUser, checkValidationRules])
	.get(async (req, res) => {
		let module
		try {
			module = await DraftSummary.fetchById(req.params.draftId)
		} catch (e) {
			res.missing()
			return
		}

		try {
			let owner = { firstName: 'Obojobo', lastName: 'Next' }
			if (module.userId !== '0') {
				owner = await UserModel.fetchById(module.userId)
			}

			const canCopy = await DraftPermissions.userHasPermissionToCopy(
				req.currentUser.id,
				module.draftId
			)

			const props = {
				module,
				owner,
				currentUser: req.currentUser,
				// must use webpackAssetPath for all webpack assets to work in dev and production!
				appCSSUrl: webpackAssetPath('repository.css'),
				appJsUrl: webpackAssetPath('page-module.js'),
				canCopy
			}
			res.render('pages/page-module-server.jsx', props)
		} catch (e) {
			res.unexpected(e)
		}
	})

module.exports = router
