const router = require('express').Router() //eslint-disable-line new-cap
const RepositoryCollection = require('../models/collection')
const DraftSummary = require('../models/draft_summary')
const UserModel = require('obojobo-express/models/user')
const GeoPattern = require('geopattern');
const {
	checkValidationRules,
	requireDraftId,
	getCurrentUser
} = require('obojobo-express/express_validators')

router
	.route('/')
	.get(getCurrentUser)
	.get((req, res) => {
		res.render('page-homepage.jsx', {currentUser: req.currentUser})
	})

// returns images for a module
router
	.route('/library/module-icon/:moduleId')
	.get((req, res) => {
		const pattern = GeoPattern.generate(req.params.moduleId)
		res.set('Cache-Control', 'public, max-age=31557600'); // one year
		res.setHeader('Content-Type', 'image/svg+xml');
		res.send(pattern.toString())
	})


router
	.route('/login')
	.get(getCurrentUser)
	.get((req, res) => {
		res.render('page-login.jsx', {currentUser: req.currentUser})
	})

router
	.route('/library')
	.get(getCurrentUser)
	.get((req, res) => {
		const publicLibCollectionId = '00000000-0000-0000-0000-000000000000'

		return RepositoryCollection
			.fetchById(publicLibCollectionId)
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
				res.render('page-library.jsx', props)
			})
			.catch(res.unexpected)
})

router
	.route('/library/:draftId')
	.get([requireDraftId, getCurrentUser, checkValidationRules])
	.get(async (req, res) => {

		let module
		try{
			module = await DraftSummary.fetchById(req.params.draftId)
		} catch(e){
			res.missing()
			return
		}

		try{
			let owner = {firstName: 'Obojobo', lastName: 'Next'}
			if(module.userId !== '0'){
				owner = await UserModel.fetchById(module.userId)
			}

			const props = {
				module,
				owner,
				currentUser: req.currentUser
			}
			res.render('page-module.jsx', props)
		} catch (e){
			res.unexpected(e)
		}
	})

module.exports = router
