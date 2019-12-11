const router = require('express').Router() //eslint-disable-line new-cap
const RepositoryCollection = require('../models/collection')
const DraftSummary = require('../models/draft_summary')
const UserModel = require('obojobo-express/models/user')
const GeoPattern = require('geopattern')
const {
	checkValidationRules,
	requireDraftId,
	getCurrentUser
} = require('obojobo-express/express_validators')

router
	.route('/')
	.get(getCurrentUser)
	.get((req, res) => {
		res.render('pages/page-homepage.jsx', { currentUser: req.currentUser })
	})

// Module Images
router
	.route('/library/module-icon/:moduleId')
	.get((req, res) => {
		// @TODO: when user's can change these images,
		// we'll need to use a smarter etag

		// use etag to avoid doing work, if the browser
		// sends an if-none-match of this object's etag
		// it already has it cached, just return 304 now
		if(req.headers['if-none-match'] === req.params.moduleId){
			res.status(304)
			res.send()
			return
		}

		const pattern = GeoPattern.generate(req.params.moduleId)
		res.setHeader('ETag', req.params.moduleId)
		res.setHeader('Content-Type', 'image/svg+xml')
		res.send(pattern.toString())
	})

router
	.route('/login')
	.get(getCurrentUser)
	.get((req, res) => {
		res.render('pages/page-login.jsx', { currentUser: req.currentUser })
	})

router
	.route('/library')
	.get(getCurrentUser)
	.get((req, res) => {
		const publicLibCollectionId = '00000000-0000-0000-0000-000000000000'

		return RepositoryCollection.fetchById(publicLibCollectionId)
			.then(collection => {
				return collection.loadRelatedDrafts()
			})
			.then(collection => {
				const props = {
					collections: [collection],
					page: 1,
					pageCount: 1,
					currentUser: req.currentUser
				}
				res.render('pages/page-library.jsx', props)
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

			const props = {
				module,
				owner,
				currentUser: req.currentUser
			}
			res.render('pages/page-module.jsx', props)
		} catch (e) {
			res.unexpected(e)
		}
	})

module.exports = router
